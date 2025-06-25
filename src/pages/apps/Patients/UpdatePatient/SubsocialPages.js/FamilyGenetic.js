import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup, Accordion } from 'react-bootstrap';
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
import { dataList, familyGenticList } from '../../../../../utils/DataSets/relations.data';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';
import { encryptMessage } from '../../../../../cryptoUtils';
import SuggestionOffcanvas from '../SuggestionOffcanvas';
import useQuillWordLimit from '../../../../../helpers/quillWordLimit';
import ToastHandle from '../../../../../helpers/ToastMessage';

const MAX_WORDS = 1000;
const WAX_WORD_LENGTH = 45;

const FamilyHistory = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const quillRef = useRef();

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

    // Effects & Hooks
    useEffect(() => {
        dispatch(getFamilyGeneticAction({ patientId: patientId }));
    }, [dispatch, patientId]);

    const handleLimitExceed = ({ type, message }) => {
        ToastHandle(message, 'danger');
    };

    useQuillWordLimit({
        quillRef,
        maxWords: MAX_WORDS,
        maxWordLength: WAX_WORD_LENGTH,
        onLimitExceed: handleLimitExceed,
        setValue,
        fieldName: 'note',
    });

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
    const relationshipOption = familyGenticList?.map((relation) => ({
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
        <Row className="py-0 m-auto">
            {/* Left Side - Form */}
            <Col md={6} className="d-flex flex-column border-end px-0 pe-2 scroll-container">
                <Card.Body className="p-0 pt-2">
                    {/* <Card.Title className="border-bottom pb-2 pt-0 mb-1">
                            <h5 className="fw-semibold mb-0">Add Family Medical History</h5>
                        </Card.Title> */}

                    <Form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{
                            minHeight: 'calc(100vh - 340px)',
                            height: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'end',
                            // justifyContent: 'space-between',
                        }}>
                        <Row className="g-3">
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
                                            rela ? relationshipOption.find((opt) => opt.value.code === rela.code) : null
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

                            <Col md={6} className="mt-0">
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
                            <Col md={6} className="mt-0">
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

                            <Col md={6} className="mt-0">
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
                            <Col md={6} className="mt-0">
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

                            <Col xs={12} className="mt-0">
                                <Form.Group controlId="notes">
                                    <Form.Label className="fw-medium mb-1 d-flex justify-content-between align-items-center">
                                        <div>
                                            Notes{' '}
                                            <span
                                                style={{ cursor: 'pointer' }}
                                                title="Notes Suggestions"
                                                onClick={handleEditorFocus}>
                                                ✨
                                            </span>
                                        </div>
                                        <small className="text-muted">
                                            {(() => {
                                                const content = watch('note') || '';
                                                const plainText = quillRef?.current?.getEditor()?.getText()?.trim();
                                                const words = plainText?.split(/\s+/)?.filter(Boolean);
                                                const wordCount = words?.length;
                                                return (
                                                    <div>
                                                        <div>{`${wordCount} / ${MAX_WORDS} words`}</div>
                                                    </div>
                                                );
                                            })()}
                                        </small>
                                    </Form.Label>
                                    <Controller
                                        name="note"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <ReactQuill
                                                ref={quillRef}
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
                        <div className="d-flex justify-content-end align-items-end pe-1 py-2">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading}
                                className="px-2 py-1 mt-4 custom-buttons">
                                {toEdit ? 'Update' : 'Add Record'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Col>

            {/* Right Side - Display */}
            <Col md={6} className="d-flex flex-column px-0 scroll-container">
                <Card.Body className="ps-2 py-1 p-0">
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
                        <Accordion alwaysOpen flush>
                            {familyGeneticHistory.map((item, index) => (
                                <Accordion.Item eventKey={index.toString()} key={index} className="rounded-1">
                                    <Accordion.Header>
                                        <div
                                            className="d-flex justify-content-between align-items-center w-100"
                                            style={{ marginRight: '-19px' }}>
                                            <div className="d-flex align-items-center gap-1 p-2 pe-0">
                                                <span className="text-black fs-6 tab-font-family fw-semibold">
                                                    {index + 1}.
                                                </span>
                                                <span className="fw-normal fs-6 tab-font-family text-black">
                                                    {item.name || 'Unnamed'} (
                                                    {item.relationship?.coding?.[0]?.display || 'Unknown'})
                                                </span>
                                                <span className="fw-normal fs-6 tab-font-family text-black">
                                                    had {item?.condition?.[0]?.code?.coding?.[0]?.display || 'None'}
                                                </span>
                                            </div>

                                            <div className="d-flex gap-2 px-2" onClick={(e) => e.stopPropagation()}>
                                                <i
                                                    className="bi bi-trash text-danger cursor-pointer"
                                                    onClick={() => {
                                                        setToDelete(item?._id);
                                                        setDeleteModal(true);
                                                    }}
                                                    title="Delete"
                                                />
                                                {toEdit && toEdit._id === item._id ? (
                                                    <i
                                                        className="bi bi-x-lg text-danger cursor-pointer"
                                                        onClick={() => handleReset()}
                                                        title="Cancel"
                                                    />
                                                ) : (
                                                    <i
                                                        className="bi bi-pencil text-info cursor-pointer"
                                                        onClick={() => setToEdit(item)}
                                                        title="Edit"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Accordion.Header>

                                    <Accordion.Body className="pt-0 p-2">
                                        <div className="mb-2">
                                            {item.note?.[0]?.text ? (
                                                <div
                                                    className="ql-editor p-1 rounded scroll-container"
                                                    dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                    style={{
                                                        fontSize: '0.875rem',
                                                        maxHeight: '150px',
                                                        overflowY: 'auto',
                                                    }}
                                                />
                                            ) : (
                                                <span className="ms-2 text-muted fst-italic"> No notes available</span>
                                            )}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    )}
                </Card.Body>
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
