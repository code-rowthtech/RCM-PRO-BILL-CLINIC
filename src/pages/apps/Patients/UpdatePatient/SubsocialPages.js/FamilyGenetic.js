import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../../../../../constants/Spinner';
import DeletionModal from '../../../../../helpers/deletionModal';
import 'react-quill/dist/quill.snow.css';

// Actions
import { getAllCodeAction } from '../../../../../redux/ProblemList/action';
import {
    createFamilyGeneticAction,
    deleteFamilyGeneticAction,
    getFamilyGeneticAction,
    updateFamilyGeneticction,
} from '../../../../../redux/actions';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';

// Utils & Data
import { sexAssignedAtBirthOptions } from '../../../../../utils/DataSets/sex';
import { dataList } from '../../../../../utils/DataSets/relations.data';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';
import { encryptMessage } from '../../../../../cryptoUtils';
import SuggestionOffcanvas from '../SuggestionOffcanvas';

const FamilyHistory = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);

    // Form handling
    const { register, handleSubmit, reset, getValues, control, setValue, watch } = useForm({
        defaultValues: {
            name: '',
            dob: '',
            sex: '',
            problem: null,
            deceased: 'no',
            dateOfDeath: '',
            note: '<ul><li></li></ul>',
        },
    });

    // State declarations
    const [rela, setRela] = useState(null);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [toDelete, setToDelete] = useState(null);
    const [toEdit, setToEdit] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Selectors
    const allCodeICDs = store?.getALLCodesReducer?.data?.codes || [];
    const isDeceased = watch('deceased') === 'yes';
    const createResponse = store?.createFamilyGeneticReducer?.data?.status;
    const familyGeneticHistory = store?.getFamilyGeneticReducer?.data?.familyMedicalHistory || [];
    const updateSuccess = store?.updateFamilyGeneticReducer?.data?.status;
    const deleteSuccess = store?.deleteFamilyGenticReducer?.data?.status;
    const isLoading = store?.getFamilyGeneticReducer?.loading;

    // Effects
    useEffect(() => {
        dispatch(getFamilyGeneticAction({ patientId: patientId }));
    }, [dispatch, patientId]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(getAllCodeAction({ search: searchQuery }));
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [dispatch, searchQuery]);

    useEffect(() => {
        if (createResponse === 201 || updateSuccess === 200) {
            handleReset();
            dispatch(getFamilyGeneticAction({ patientId: patientId }));
        }
    }, [createResponse, dispatch, patientId, updateSuccess]);

    useEffect(() => {
        if (deleteSuccess === 200) {
            setToDelete(null);
            setDeleteModal(false);
            dispatch(getFamilyGeneticAction({ patientId: patientId }));
        }
    }, [deleteSuccess, dispatch, patientId]);

    useEffect(() => {
        if (toEdit) {
            // Set form values for editing
            setRela(toEdit?.relationship?.coding?.[0] || null);
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

            setValue('deceased', toEdit?.deceasedBoolean ? 'yes' : 'no');
            setValue(
                'dateOfDeath',
                toEdit?.deceasedDate ? new Date(toEdit.deceasedDate).toISOString().split('T')[0] : ''
            );
            setValue('note', toEdit?.note?.[0]?.text || '<ul><li></li></ul>');
        }
    }, [toEdit, setValue]);

    // Helper functions
    const handleReset = () => {
        reset();
        setRela(null);
        setSelectedProblem(null);
        setToEdit(null);
        setSearchQuery('');
    };

    const closeDeleteModal = () => {
        setToDelete(null);
        setDeleteModal(false);
    };

    const deleteHistory = () => {
        dispatch(deleteFamilyGeneticAction({ id: toDelete }));
    };

    // Data transformations
    const relationshipOption = dataList?.map((relation) => ({
        value: relation,
        label: relation.display,
    }));

    const formattedOptions = allCodeICDs.map((code) => ({
        value: code.value,
        label: `${code.title} - ${code.codeType}`,
        system: 'http://hl7.org/fhir/condition-code',
        display: code.title,
    }));

    // Event handlers
    const handleRelationChange = (selectedOption) => {
        setRela(selectedOption ? selectedOption.value : null);
    };

    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'family' }));
        setShowSuggestions(true);
    };

    const handleSuggestionSelect = (suggestionText) => {
        const current = getValues('note');
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };

    const onSubmit = (data) => {
        const selected = data.problem;
        const selectedSexOption = sexAssignedAtBirthOptions.find((option) => option.value === data.sex);

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
                coding: [rela],
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
            dispatch(
                updateFamilyGeneticction({
                    key: encryptMessage(payload),
                    id: toEdit?._id,
                })
            );
        } else {
            dispatch(createFamilyGeneticAction({ key: encryptMessage(payload) }));
        }
    };

    return (
        <Row
            className="mt-0 g-0 pt-0 px-1 h-100 scroll-container"
            style={{ height: 'calc(100vh - 100px)', overflowY: 'scroll' }}>
            {/* Left Side - Form */}
            <Col md={6} className="d-flex flex-column border-end pt-0 mt-0 pe-1">
                <div className="border-danger h-100">
                    <Card.Body className="d-flex flex-column pt-0 px-2 pb-2 mt-0">
                        <Card.Title className="border-bottom pb-2 pt-0 mb-1">
                            <h5 className="fw-semibold mb-0">Add Family Medical History</h5>
                        </Card.Title>

                        <Form
                            className="scroll-container d-flex flex-column justify-content-between"
                            style={{ overflowY: 'auto', height: '50vh' }}
                            onSubmit={handleSubmit(onSubmit)}>
                            <div
                                className="scroll-container mb-3 px-2"
                                style={{ maxHeight: '57vh', overflowY: 'auto' }}>
                                <Row className="g-2">
                                    <Col md={6}>
                                        <Form.Group controlId="relationship">
                                            <Form.Label className="fw-medium mb-0">Relationship</Form.Label>
                                            <Select
                                                options={relationshipOption}
                                                isSearchable
                                                className="basic-single"
                                                classNamePrefix="select"
                                                placeholder="Select relationship"
                                                value={
                                                    rela
                                                        ? relationshipOption.find((opt) => opt.value.code === rela.code)
                                                        : null
                                                }
                                                onChange={handleRelationChange}
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        minHeight: '30px',
                                                        border: '0px',
                                                    }),
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="name">
                                            <Form.Label className="fw-medium mb-0">Name</Form.Label>
                                            <Form.Control
                                                {...register('name', { required: 'Name is required' })}
                                                className="form-control-sm"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="dob">
                                            <Form.Label className="fw-medium mb-0">Date of Birth</Form.Label>
                                            <Form.Control
                                                type="date"
                                                {...register('dob', { required: 'Date of birth is required' })}
                                                className="form-control-sm"
                                                max={new Date().toISOString().slice(0, 10)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="sex">
                                            <Form.Label className="fw-medium mb-0">Sex</Form.Label>
                                            <Form.Select
                                                {...register('sex', { required: 'Sex is required' })}
                                                className="form-select-sm">
                                                <option value="" disabled>
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

                                    <Col md={6}>
                                        <Form.Group controlId="problem">
                                            <Form.Label className="fw-medium mb-0">Condition</Form.Label>
                                            <Controller
                                                name="problem"
                                                control={control}
                                                rules={{ required: 'Condition is required' }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        classNamePrefix="select"
                                                        options={formattedOptions}
                                                        value={selectedProblem}
                                                        onChange={(selected) => {
                                                            field.onChange(selected);
                                                            setSelectedProblem(selected);
                                                        }}
                                                        onInputChange={(value) => setSearchQuery(value)}
                                                        placeholder="Search condition"
                                                        isClearable
                                                        isSearchable
                                                        styles={{
                                                            control: (provided) => ({
                                                                ...provided,
                                                                minHeight: '30px',
                                                                border: '0px',
                                                            }),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="deceased">
                                            <Form.Label className="fw-medium mb-0">Deceased</Form.Label>
                                            <div>
                                                <Form.Check
                                                    inline
                                                    label="Yes"
                                                    type="radio"
                                                    value="yes"
                                                    {...register('deceased')}
                                                    className="form-check-inline"
                                                />
                                                <Form.Check
                                                    inline
                                                    label="No"
                                                    type="radio"
                                                    value="no"
                                                    {...register('deceased')}
                                                    className="form-check-inline"
                                                    defaultChecked
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>

                                    {isDeceased && (
                                        <Col md={6}>
                                            <Form.Group controlId="dateOfDeath">
                                                <Form.Label className="fw-medium mb-0">Date of Death</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    {...register('dateOfDeath')}
                                                    className="form-control-sm"
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </Form.Group>
                                        </Col>
                                    )}

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
                                                render={({ field: { onChange, value } }) => (
                                                    <ReactQuill
                                                        value={value}
                                                        onChange={onChange}
                                                        theme="snow"
                                                        placeholder="Enter detailed notes here..."
                                                        style={{ height: '20vh', backgroundColor: 'white' }}
                                                        modules={{
                                                            toolbar: [
                                                                [{ header: [1, 2, false] }],
                                                                ['bold', 'italic', 'underline', 'strike'],
                                                                [{ list: 'ordered' }, { list: 'bullet' }],
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
                            </div>
                            <div className="d-flex justify-content-end align-items-end pe-1 py-2">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isLoading}
                                    className="px-4 py-1 custom-buttons">
                                    {toEdit ? 'Update' : 'Add Record'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </div>
            </Col>

            {/* Right Side - Display */}
            <Col md={6} className="d-flex flex-column pt-0 mt-0 ps-1">
                <div className="border-danger h-100">
                    <Card.Body className="d-flex flex-column pt-0 px-2 pb-2 mt-0">
                        <Card.Title className="border-bottom pt-0 pb-2 mb-0">
                            <h5 className="fw-semibold mb-0">Family History</h5>
                        </Card.Title>

                        {isLoading && !familyGeneticHistory?.length ? (
                            <div className="text-center py-4">
                                <Spinner />
                            </div>
                        ) : familyGeneticHistory?.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-journal-x fs-1"></i>
                                <p className="mt-2 mb-0">No family records found</p>
                            </div>
                        ) : (
                            <div className="scroll-container" style={{ overflowY: 'auto', height: '50vh' }}>
                                <ListGroup variant="flush" className="striped-data">
                                    {familyGeneticHistory?.map((item, index) => (
                                        <ListGroup.Item
                                            key={index}
                                            className="striped-data-item py-0 px-0 border-bottom">
                                            <div className='px-2'>
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
                                                                ? new Date(item?.bornDate)?.toLocaleDateString('en-GB')
                                                                : ''}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <span className="fs-6 fw-bold">Name:</span>
                                                        <span className="text-capitalize ms-1 fs-6">{item?.name}</span>
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
                                                <span className="ms-1 fs-6">{item.deceasedBoolean ? 'Yes' : 'No'}</span>
                                                <br />
                                                {item.deceasedBoolean && item.deceasedDate && (
                                                    <>
                                                        <span className="fs-6 fw-bold">Date of Death:</span>
                                                        <span className="fs-6 ms-1">
                                                            {new Date(item?.deceasedDate).toLocaleDateString('en-GB')}
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
                                                            onClick={() => handleReset()}
                                                            className="bi bi-x-circle-fill cursor-pointer text-danger"></i>
                                                    ) : (
                                                        <i
                                                            onClick={() => setToEdit(item)}
                                                            className="bi bi-pencil text-info cursor-pointer"></i>
                                                    )}
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        )}
                    </Card.Body>
                </div>
            </Col>

            <DeletionModal
                show={deleteModal}
                onHide={closeDeleteModal}
                onConfirm={deleteHistory}
                item="family history"
                isLoading={store?.deleteFamilyGenticReducer?.loading}
            />
        </Row>
    );
};

export default FamilyHistory;
