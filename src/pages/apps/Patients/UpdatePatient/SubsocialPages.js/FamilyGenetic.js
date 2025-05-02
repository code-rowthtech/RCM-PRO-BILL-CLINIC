import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { getAllCodeAction } from '../../../../../redux/ProblemList/action';
import { sexAssignedAtBirthOptions } from '../../../../../utils/DataSets/sex';
import { useDispatch, useSelector } from 'react-redux';
import { dataList } from '../../../../../utils/DataSets/relations.data';

const FamilyHistory = () => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        reset,
    } = useForm();
    const [rela, setRela] = useState(null); // Store selected relationship
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const store = useSelector((state) => state);
    const [familyList, setFamilyList] = useState([]);
    const allCodeICDs = store?.getALLCodesReducer?.data?.codes || [];
    const selectedCondition = watch('condition');
    const isDeceased = watch('deceased') === 'yes';
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
            relationship: [
                {
                    coding: [rela], //code:'I" , system:url, display:'Ins Company
                    text: data?.emergencyContactName,
                },
            ],
            birthSex: [
                {
                    ...selectedSexOption,
                    code: selectedSexOption?.value,
                    display: selectedSexOption?.label,
                    system: selectedSexOption?.system,
                },
            ],
        };

        reset();
    };
    const relationshipOption = dataList?.map((relation) => ({
        value: relation, // Code as the value
        label: relation.display, // Display text as the label
    }));
    const selectedRelationOption =
        relationshipOption.find((option) => option?.value?.code === rela?.[0]?.code) ||
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
    return (
        <Row className="mt-3 scroll-container"
            // style={{ overflowY: 'scroll', overflowX: 'hidden', height: '55vh' }}
        >
            {/* Left side - Form */}
            <Col md={6} className='px-2' style={{borderRight:'1px solid black'}}>
                <h5 className="mb-3">Add Family Medical History</h5>
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
                                    value={selectedRelationOption}
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
                                    <Form.Check inline label="Yes" type="radio" value="yes" {...register('deceased')} />
                                    <Form.Check inline label="No" type="radio" value="no" {...register('deceased')} />
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    {isDeceased && (
                        <Row>
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label className='mb-0'>Date of Death</Form.Label>
                                    <Form.Control type="date" {...register('dateOfDeath')} />
                                </Form.Group>
                            </Col>
                        </Row>
                    )}

                    {!selectedCondition && (
                        <Row>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Notes</Form.Label>
                                    <Controller
                                        name="notes"
                                        control={control}
                                        defaultValue=""
                                        render={({ field: { onChange, value } }) => (
                                            <ReactQuill
                                                value={value}
                                                onChange={onChange}
                                                theme="snow"
                                                placeholder="Enter detailed notes..."
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    )}

                    <div className="d-flex justify-content-end mt-3">
                        <Button type="submit" className="custom-buttons">
                            Add
                        </Button>
                    </div>
                </Form>
            </Col>

            {/* Right side - Display */}
            <Col md={6} className='px-2'>
                <Row>
                    <Col xs={12}>
                        <h5>Family History</h5>
                        {familyList.length === 0 ? (
                            <p>No family records added yet.</p>
                        ) : (
                            <ListGroup>
                                {familyList.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <strong>Relationship:</strong>{' '}
                                        {item?.relationship?.[0]?.coding?.[0]?.display || 'N/A'} <br />
                                        <strong>Name:</strong> {item.name} <br />
                                        <strong>Date of Birth:</strong> {item.dob} <br />
                                        <strong>Sex:</strong>{' '}
                                        {sexAssignedAtBirthOptions.find((opt) => opt.value === item.sex)?.label ||
                                            'N/A'}{' '}
                                        <br />
                                        <strong>Condition:</strong> {item.problem?.display || 'None'} <br />
                                        {!item.problem?.display && item.notes && (
                                            <>
                                                <strong>Notes:</strong>
                                                <div dangerouslySetInnerHTML={{ __html: item.notes }} />
                                            </>
                                        )}
                                        <strong>Deceased:</strong> {item.deceased === 'yes' ? 'Yes' : 'No'} <br />
                                        {item.deceased === 'yes' && (
                                            <>
                                                <strong>Date of Death:</strong> {item.dateOfDeath}
                                            </>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default FamilyHistory;
