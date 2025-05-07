import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { getAllCodeAction } from '../../../../../redux/ProblemList/action';
import { sexAssignedAtBirthOptions } from '../../../../../utils/DataSets/sex';
import { useDispatch, useSelector } from 'react-redux';
import { dataList } from '../../../../../utils/DataSets/relations.data';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';
import { useSearchParams } from 'react-router-dom';
import { createFamilyGeneticAction, getFamilyGeneticAction } from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import SuggestionOffcanvas from '../SuggestionOffcanvas';

const FamilyHistory = () => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        getValues,
        setValue,
        watch,
        reset,
    } = useForm();
    const [rela, setRela] = useState(null); // Store selected relationship
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const [familyList, setFamilyList] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const allCodeICDs = store?.getALLCodesReducer?.data?.codes || [];
    const selectedCondition = watch('condition');
    const isDeceased = watch('deceased') === 'yes';
    const createResponse = store?.createFamilyGeneticReducer?.data?.status;
    const familyGeneticHistory = store?.getFamilyGeneticReducer?.data?.familyMedicalHistory || [];
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(getAllCodeAction({ search: searchQuery }));
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounce);
    }, [dispatch, searchQuery]);
    const onSubmit = (data) => {
        const selected = data.problem;
        const selectedSexOption = sexAssignedAtBirthOptions.find((option) => option.value === data.sex);

        setFamilyList((prev) => [...prev, data]);
        const payload = {
            name: data?.name,
            clinicId: loggedInUser?._id,
            subject: patientId,
            condition: [
                {
                    code: {
                        coding: [
                            {
                                system: selected?.system,
                                code: selected?.value,
                                display: selected?.display,
                            },
                        ],
                        text: selected?.display,
                    },
                },
            ],

            relationship: {
                coding: [rela], //code:'I" , system:url, display:'Ins Company
                text: data?.display,
            },

            gender: selectedSexOption?.label,
            bornDate: data?.dob,
            deceasedBoolean: data?.deceased,
            deceasedDate: data?.dateOfDeath,
            note: [
                {
                    text: data?.note,
                },
            ],
        };
        dispatch(createFamilyGeneticAction({ key: encryptMessage(payload) }));
    };
    // useEffect(() => {
    //     dispatch(getFamilyGeneticAction({ patientId: patientId }));
    // }, [dispatch, patientId]);

    useEffect(() => {
        if (createResponse === 201) {
            dispatch(getFamilyGeneticAction({ patientId: patientId }));
            reset();
            setRela(null);
            setSelectedProblem(null);
            // setSearchQuery('');

        }
    }, [createResponse, dispatch, patientId, reset]);

    const relationshipOption = dataList?.map((relation) => ({
        value: relation, // Code as the value
        label: relation.display, // Display text as the label
    }));
    const selectedRelationOption =
        relationshipOption.find((option) => option?.value?.code === rela?.[0]?.code) ||
        relationshipOption.find((option) => option?.value?.display === rela?.[0]?.coding?.[0]?.display);
    const handleRelationChange = (selectedOption) => {
        setRela(selectedOption ? selectedOption.value : selectedRelationOption);
    };

    const formattedOptions = allCodeICDs.map((code) => ({
        value: code.value,
        label: `${code.title} - ${code.codeType}`,
        system: 'http://hl7.org/fhir/condition-code',
        display: code.title,
    }));

    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'family' }));
        setShowSuggestions(true);
    };
    const handleSuggestionSelect = (suggestionText) => {
        // Append suggestion to existing note
        const current = getValues('note'); // from useFormContext or pass as prop
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };
    return (
        <Row className="">
            <Col md={6} className="pe-0 border-end tobaccooCardContainer">
                <Card className="shadow-sm tobaccooCard">
                    <Card.Body className="px-1 py-1">
                        <Card.Title className="border-bottom">
                            <h5 className="">Add Family Medical History</h5>
                        </Card.Title>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className="mb-0">Relationship</Form.Label>
                                        <Select
                                            options={relationshipOption}
                                            isSearchable
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder="Select"
                                            value={rela} // important to allow clearing
                                            onChange={handleRelationChange}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    height: '30px',
                                                    minHeight: '30px',
                                                    border: '0px',
                                                }),
                                                placeholder: (provided) => ({
                                                    ...provided,
                                                    fontWeight: 'bold',
                                                    fontSize: '12px',
                                                    paddingBottom: '5px',
                                                }),
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className="mb-0">Name</Form.Label>
                                        <Form.Control {...register('name')} required />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className="mb-0">Date of Birth</Form.Label>
                                        <Form.Control type="date" {...register('dob')} required />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className="mb-0">Sex</Form.Label>
                                        <Form.Select {...register('sex')}>
                                            <option value="" hidden>
                                                Select Sex
                                            </option>
                                            {sexAssignedAtBirthOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Condition</Form.Label>
                                        <Controller
                                            name="problem"
                                            control={control}
                                            rules={{ required: 'Problem is required' }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    classNamePrefix="select"
                                                    options={formattedOptions}
                                                    value={selectedProblem || null} // this reflects external state
                                                        onChange={(selected) => {
                                                        field.onChange(selected);
                                                        setSelectedProblem(selected);
                                                    }}
                                                    onInputChange={(value, { action }) => {
                                                        if (action === 'input-change') {
                                                            setSearchQuery(value);
                                                        }
                                                    }}
                                                    placeholder="Search Problem"
                                                    isClearable
                                                    isSearchable
                                                    styles={{
                                                        control: (provided) => ({
                                                            ...provided,
                                                            height: '30px',
                                                            minHeight: '30px',
                                                            border: '0px',
                                                        }),
                                                        placeholder: (provided) => ({
                                                            ...provided,
                                                            fontWeight: 'bold',
                                                            fontSize: '12px',
                                                            paddingBottom: '5px',
                                                        }),
                                                        valueContainer: (provided) => ({
                                                            ...provided,
                                                            padding: '0px 6px',
                                                        }),
                                                    }}
                                                />
                                            )}
                                        />
                                        {errors.problem && (
                                            <Form.Text className="text-danger">{errors.problem.message}</Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className="mb-0">Deceased</Form.Label>
                                        <div>
                                            <Form.Check
                                                inline
                                                label="Yes"
                                                type="radio"
                                                value="yes"
                                                {...register('deceased')}
                                            />
                                            <Form.Check
                                                inline
                                                label="No"
                                                type="radio"
                                                value="no"
                                                {...register('deceased')}
                                            />
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {isDeceased && (
                                <Row>
                                    <Col xs={6}>
                                        <Form.Group>
                                            <Form.Label className="mb-0">Date of Death</Form.Label>
                                            <Form.Control
                                                type="date"
                                                {...register('dateOfDeath')}
                                                max={new Date().toISOString().split('T')[0]} // today's date in YYYY-MM-DD format
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}

                            {!selectedCondition && (
                                <Row>
                                    <Col xs={12}>
                                        <Form.Group controlId="notes">
                                            <Form.Label className="fw-medium mb-0">
                                                Notes{' '}
                                                <span style={{ cursor: 'pointer' }} title='Notes Suggestions' onClick={handleEditorFocus}>
                                                    ✨
                                                </span>
                                            </Form.Label>

                                            <Controller
                                                name="note"
                                                control={control}
                                                defaultValue="<ul><li></li></ul>"
                                                render={({ field: { onChange, value } }) => (
                                                    <ReactQuill
                                                        value={value}
                                                        onChange={(content, delta, source) => {
                                                            if (source === 'user') {
                                                                onChange(content);
                                                            }
                                                        }}
                                                        theme="snow"
                                                        placeholder="Enter detailed notes here..."
                                                        style={{ backgroundColor: 'white' }}
                                                        modules={{
                                                            toolbar: [
                                                                [{ header: [1, 2, false] }],
                                                                ['bold', 'italic', 'underline', 'strike'],
                                                                [{ list: 'ordered' }, { list: 'bullet' }],
                                                                ['link', 'image'],
                                                                ['clean'],
                                                            ],
                                                        }}
                                                    />
                                                )}
                                            />

                                            <SuggestionOffcanvas
                                                show={showSuggestions}
                                                onClose={() => setShowSuggestions(false)}
                                                onSelect={handleSuggestionSelect}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}

                            <div className="d-flex justify-content-end mt-2">
                                <Button type="submit" className="custom-buttons">
                                    Add
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>

            {/* Right side - Display */}
            <Col md={6} className="ps-0 tobaccooCardContainer">
                <Card className="shadow-sm tobaccooCard">
                    <Card.Body className="px-1 py-1">
                        <Card.Title className="border-bottom">
                            <h5>Family History</h5>
                        </Card.Title>
                        <Row>
                            <Col xs={12} className="scroll-container" style={{ height: '49vh', overflowY: 'auto' }}>
                                {familyGeneticHistory?.length === 0 ? (
                                    <div className="text-center py-4 text-muted">
                                        <i className="bi bi-journal-x fs-1"></i>
                                        <p className="mt-2 mb-0">No family records added yet</p>
                                    </div>
                                ) : (
                                    <ListGroup>
                                        {familyGeneticHistory?.map((item, index) => (
                                            <ListGroup.Item
                                                key={index}
                                                className="p-2"
                                                style={{
                                                    backgroundColor:
                                                        index % 2 === 0 ? 'white' : 'rgba(128, 128, 128, 0.281)',
                                                }}>
                                                <div>
                                                    <div className="d-flex justify-content-between align-items-end">
                                                        <div>
                                                            <strong>Relationship:</strong>
                                                            {item?.relationship?.coding?.[0]?.display || 'N/A'} <br />
                                                            <strong>Date of Birth:</strong>
                                                            {item?.bornDate
                                                                ? new Date(item?.bornDate)?.toLocaleDateString('en-GB')
                                                                : ''}
                                                        </div>

                                                        <div>
                                                            <strong>Name:</strong>
                                                            <span className="text-capitalize">{item?.name}</span> <br />
                                                            <strong>Sex:</strong> {item?.gender || 'N/A'} <br />
                                                        </div>
                                                    </div>
                                                    <p
                                                        className="mb-1 text-truncate"
                                                        style={{ maxWidth: '100%' }}
                                                        title={item?.condition?.[0]?.code?.coding?.[0]?.display}>
                                                        <strong>Condition:</strong>{' '}
                                                        {item?.condition?.[0]?.code?.coding?.[0]?.display || 'None'}
                                                    </p>
                                                    {item.note?.[0]?.text && (
                                                        <div className="mt-2">
                                                            <div
                                                                className="ql-editor p-0"
                                                                dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                                style={{
                                                                    fontSize: '0.875rem',
                                                                    maxHeight: '150px', // Limit the height of notes
                                                                    overflowY: 'auto', // Scrollable if content is too long
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                    <strong>Deceased:</strong> {item.deceased === 'yes' ? 'Yes' : 'No'}{' '}
                                                    <br />
                                                    {item.deceased === 'yes' && (
                                                        <>
                                                            <strong>Date of Death:</strong>
                                                            {item?.dateOfDeath
                                                                ? new Date(item?.dateOfDeath)?.toLocaleDateString(
                                                                    'en-GB'
                                                                )
                                                                : ''}
                                                        </>
                                                    )}
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default FamilyHistory;
