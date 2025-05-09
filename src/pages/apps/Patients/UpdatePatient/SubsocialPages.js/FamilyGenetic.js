import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { getAllCodeAction } from '../../../../../redux/ProblemList/action';
import { sexAssignedAtBirthOptions } from '../../../../../utils/DataSets/sex';
import { useDispatch, useSelector } from 'react-redux';
import { dataList } from '../../../../../utils/DataSets/relations.data';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';
import { useSearchParams } from 'react-router-dom';
import {
    createFamilyGeneticAction,
    deleteFamilyGeneticAction,
    getFamilyGeneticAction,
    updateFamilyGeneticction,
} from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import SuggestionOffcanvas from '../SuggestionOffcanvas';
import DeletionModal from '../../../../../helpers/deletionModal';

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
    const [toDelete, setToDelete] = useState(null);
    const [toEdit, setToEdit] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const allCodeICDs = store?.getALLCodesReducer?.data?.codes || [];
    const selectedCondition = watch('condition');
    const isDeceased = watch('deceased') === 'yes';
    const createResponse = store?.createFamilyGeneticReducer?.data?.status;
    const familyGeneticHistory = store?.getFamilyGeneticReducer?.data?.familyMedicalHistory || [];
    const updateSuccess = store?.updateFamilyGeneticReducer?.data?.status;
    const deleteSuccess = store?.deleteFamilyGenticReducer?.data?.status;

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(getAllCodeAction({ search: searchQuery }));
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounce);
    }, [dispatch, searchQuery]);
    useEffect(() => {
        if (toEdit) {
            // const match = relationshipOption.find(
            //     (opt) =>
            //         opt.value.code === toEdit?.relationship?.coding?.[0]?.code &&
            //         opt.value.system === toEdit?.relationship?.coding?.[0]?.system
            // );
            // if (match) {
            //     setRela(match.value);
            //     setValue('relationship', {
            //         coding: [match.value],
            //         text: match.value.display
            //     });
            // } else {
            //     setRela(null);
            //     setValue('relationship', null);
            // }
            // setRela(match?.value || null);
            setRela(toEdit?.relationship?.coding?.[0]);
            setValue('name', toEdit?.name || '');
            setValue('dob', toEdit?.bornDate ? new Date(toEdit.bornDate).toISOString().split('T')[0] : '');
            const genderOption = sexAssignedAtBirthOptions.find((option) => option.label === toEdit?.gender);
            setValue('sex', genderOption?.value || '');
            const conditionCode = toEdit?.condition?.[0]?.code?.coding?.[0];
            const matchedProblem = formattedOptions.find(
                (opt) => opt.value === conditionCode?.code && opt.display === conditionCode?.display
            );
            setSelectedProblem(matchedProblem || null);
            setValue('problem', matchedProblem || null);
            setValue(
                'dateOfDeath',
                toEdit?.deceasedDate ? new Date(toEdit.deceasedDate).toISOString().split('T')[0] : ''
            );
            setValue('deceased', toEdit?.deceasedBoolean ? 'yes' : 'no');

            setValue(
                'dateOfDeath',
                toEdit?.deceasedDate ? new Date(toEdit.deceasedDate).toISOString().split('T')[0] : ''
            );
            setValue('note', toEdit?.note?.[0]?.text || '<ul><li></li></ul>');
        }
    }, [toEdit, setValue]);
    const closeDeleteModal = () => {
        setToDelete(null);
        setDeleteModal(false);
    };
    const deleteHistory = () => {
        dispatch(deleteFamilyGeneticAction({ id: toDelete }));
    };

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
                text: rela?.display,
            },

            gender: selectedSexOption?.label,
            bornDate: data?.dob,
            deceasedBoolean: data.deceased === 'yes',
            deceasedDate: data?.dateOfDeath,
            note: [
                {
                    text: data?.note,
                },
            ],
        };
        if (toEdit) {
            dispatch(updateFamilyGeneticction({ key: encryptMessage(payload), id: toEdit?._id }));
        } else {
            dispatch(createFamilyGeneticAction({ key: encryptMessage(payload) }));
        }
    };
    useEffect(() => {
        if (createResponse === 201 || updateSuccess === 200) {
            dispatch(getFamilyGeneticAction({ patientId: patientId }));
            reset();
            setToEdit(null);
            setRela(null);
            setSelectedProblem(null);
        }
    }, [createResponse, dispatch, patientId, reset, updateSuccess]);
    useEffect(() => {
        if (deleteSuccess === 200) {
            dispatch(getFamilyGeneticAction({ patientId: patientId }));
            setToDelete(null);
            setDeleteModal(false);
        }
    }, [deleteSuccess]);
    const relationshipOption = dataList?.map((relation) => ({
        value: relation, // Code as the value
        label: relation.display, // Display text as the label
    }));
    const selectedRelationOption =
        relationshipOption.find((option) => option?.value?.code === rela?.[0]?.code) ||
        // relationshipOption.find((option) => option?.value?.code === rela?.code) ||
        relationshipOption.find((option) => option?.value?.display === rela?.[0]?.coding?.[0]?.display);

    const handleRelationChange = (selectedOption) => {
        setRela(selectedOption ? selectedOption.value : '');
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
                                            value={relationshipOption?.find((data) => data?.value?.code === rela?.code)}
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
                                        <Form.Control
                                            type="date"
                                            {...register('dob')}
                                            required
                                            max={new Date().toISOString().slice(0, 10)}
                                        />
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
                                                <span
                                                    style={{ cursor: 'pointer' }}
                                                    title="Notes Suggestions"
                                                    onClick={handleEditorFocus}>
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
                                                                // ['link', 'image'],
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
                                <Button
                                    type="submit"
                                    className="custom-buttons"
                                    style={{ width: '75px' }}
                                    disabled={
                                        store?.createFamilyGeneticReducer?.loading ||
                                        store?.updateFamilyGeneticReducer?.loading
                                    }>
                                    {store?.createFamilyGeneticReducer?.loading ||
                                    store?.updateFamilyGeneticReducer?.loading ? (
                                        <Spinner animation="border" size="sm" className="text-white" />
                                    ) : toEdit ? (
                                        'Update'
                                    ) : (
                                        'Add'
                                    )}
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
                                {store?.getFamilyGeneticReducer?.loading ? (
                                    <div className="text-center" colSpan={10}>
                                        <Spinner className="my-5" />
                                    </div>
                                ) : familyGeneticHistory?.length === 0 ? (
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
                                                            <span className="fs-6 fw-bold">Relationship:</span>
                                                            <span className="ms-1 fs-6">
                                                                {item?.relationship?.coding?.[0]?.display || 'N/A'}
                                                            </span>
                                                            <br />
                                                            <span className="fs-6 fw-bold">Date of Birth:</span>
                                                            <span className="ms-1 fs-6">
                                                                {item?.bornDate
                                                                    ? new Date(item?.bornDate)?.toLocaleDateString(
                                                                          'en-GB'
                                                                      )
                                                                    : ''}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <span className="fs-6 fw-bold">Name:</span>
                                                            <span className="text-capitalize ms-1 fs-6">
                                                                {item?.name}
                                                            </span>
                                                            <br />
                                                            <span className="fs-6 fw-bold">Sex:</span>
                                                            <span className="ms-1 fs-6">{item?.gender || 'N/A'}</span>
                                                            <br />
                                                        </div>
                                                    </div>
                                                    <p
                                                        className="mb-0 text-truncate fs-6"
                                                        style={{ maxWidth: '100%' }}
                                                        title={item?.condition?.[0]?.code?.coding?.[0]?.display}>
                                                        <span className="fw-bold">Condition:</span>
                                                        <span className="ms-1">
                                                            {item?.condition?.[0]?.code?.coding?.[0]?.display || 'None'}
                                                        </span>
                                                    </p>
                                                    <div className="d-flex">
                                                        <span className="fs-6 fw-bold">Notes:</span>
                                                        <span>
                                                            {item.note?.[0]?.text && (
                                                                <div className="ms-1">
                                                                    <div
                                                                        className="ql-editor scroll-container p-0 fs-6"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: item?.note[0]?.text,
                                                                        }}
                                                                        style={{
                                                                            fontSize: '0.875rem',
                                                                            maxHeight: '150px',
                                                                            overflowY: 'auto',
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <span className="fs-6 fw-bold">Deceased:</span>
                                                    <span className="ms-1 fs-6">
                                                        {item.deceasedBoolean ? 'Yes' : 'No'}
                                                    </span>
                                                    <br />
                                                    {item.deceasedBoolean && item.deceasedDate && (
                                                        <>
                                                            <span className="fs-6 fw-bold">Date of Death:</span>
                                                            <span className="fs-6 ms-1">
                                                                {new Date(item?.deceasedDate).toLocaleDateString(
                                                                    'en-GB'
                                                                )}
                                                            </span>
                                                        </>
                                                    )}
                                                    <div className="mt-0 d-flex justify-content-end pe-2 gap-1">
                                                        <i
                                                            className="bi bi-trash-fill text-danger cursor-pointer"
                                                            onClick={() => {
                                                                setToDelete(item?._id);
                                                                setDeleteModal(true);
                                                            }}></i>
                                                        {toEdit && toEdit._id === item._id ? (
                                                            <i
                                                                onClick={() => {
                                                                    setToEdit(null);
                                                                    setToEdit(item);
                                                                }}
                                                                className="bi bi-x-circle-fill cursor-pointer text-danger"></i>
                                                        ) : (
                                                            <i
                                                                onClick={() => setToEdit(item)}
                                                                className="bi bi-pencil text-info cursor-pointer"></i>
                                                        )}
                                                    </div>
                                                </div>
                                                <DeletionModal
                                                    show={deleteModal}
                                                    onHide={closeDeleteModal}
                                                    onConfirm={deleteHistory}
                                                    item="family history"
                                                    isLoading={store?.deleteTobaccooReducer?.loading}
                                                />
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
