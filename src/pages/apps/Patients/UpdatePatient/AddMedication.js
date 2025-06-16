import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import {
    createMedicationAction,
    getDrugsAction,
    getMedicationAction,
    updateMedicationAction,
} from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { medicationStatus } from '../../../../utils/DataSets/commonData2';
import { additionalInformation } from '../../../../utils/DataSets/Medication/medicationData';
import Select from 'react-select';
import { encryptMessage } from '../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';
import SuggestionOffcanvas from './SuggestionOffcanvas';
import ReactQuill from 'react-quill';
import { createSuggestionAction } from '../../../../redux/suggestions/action';
import AddProblem from '../Task Tabs/AddProblem';
import Spinner from '../../../../constants/Spinner';
import ToastHandle from '../../../../helpers/ToastMessage';
import useQuillWordLimit from '../../../../helpers/quillWordLimit';

const MAX_WORDS = 10;
const MAX_WORD_LENGTH = 45;
export default function AddMedication({ show, onCancel, selectedMedication }) {
    const { register, handleSubmit, setValue, watch, control, getValues, reset, formState: { errors } } = useForm();
    const [searchParams] = useSearchParams();
    const dropdownRef = useRef(null);
    const patientId = searchParams.get('id');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const quillRef = useRef();

    // STATE VARIABLES
    const [selectedDrug, setSelectedDrug] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [additionalInstruction, setAdditionalInstruction] = useState();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showAddProblemModal, setShowAddProblemModal] = useState(false);

    // VARIABLE DECLARATIONS
    const drugsData = store?.getDrugsReducer?.data?.ndcProducts || [];
    const problemList = store?.getProblemListReducer?.data?.problems;
    const createSuccess = store?.createMedicationReducer?.data?.status;
    const updateSuccess = store?.updateMedicationReducer?.data?.status;
    const additionalInstructionOptions = additionalInformation?.map((item) => ({
        value: item,
        label: item.display,
    }));

    const selectedInstruction = useMemo(() => {
        if (!additionalInstruction) return null;
        return additionalInstructionOptions.find(
            (option) => option?.value?.code === additionalInstruction?.code
        );
    }, [additionalInstruction, additionalInstructionOptions]);
    // USEEFFECTS
    useEffect(() => {
        if (createSuccess === 201 || updateSuccess === 200) {
            onCancel();
            reset();
            dispatch(getMedicationAction({ patientId: patientId }));
        }
    }, [createSuccess, updateSuccess]);

    useEffect(() => {
        if (selectedMedication) {
            setValue(
                'drugInfo',
                selectedMedication?.drugId?.proprietaryName +
                ' (' +
                selectedMedication?.drugId?.nonProprietaryName +
                ')'
            );
            setValue('frequency', selectedMedication?.dosageInstruction?.[0]?.timing?.repeat?.frequency);
            setValue('period', selectedMedication?.dosageInstruction?.[0]?.timing?.repeat?.period);
            setValue('periodUnit', selectedMedication?.dosageInstruction?.[0]?.timing?.repeat?.periodUnit);
            setValue('sequence', selectedMedication?.dosageInstruction?.[0]?.sequence);
            setValue('relatedProblem', selectedMedication?.problemId);
            setValue('status', selectedMedication?.status);
            setValue('note', selectedMedication?.note?.[0]?.text);
            const updatedAdditionalInstruction =
                selectedMedication?.dosageInstruction?.[0]?.additionalInstruction?.[0]?.coding?.[0];
            if (updatedAdditionalInstruction) {
                setAdditionalInstruction(updatedAdditionalInstruction);
            }
            setAdditionalInstruction(updatedAdditionalInstruction);
            setValue(
                'medicationStart',
                selectedMedication?.startDate ? new Date(selectedMedication.startDate).toISOString().split('T')[0] : ''
            );
            setValue(
                'medicationEnd',
                selectedMedication?.endDate ? new Date(selectedMedication.endDate).toISOString().split('T')[0] : ''
            );
        }
    }, [selectedMedication]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // FUNCTIONS 
    const handleAddProblemClose = () => setShowAddProblemModal(false);

    const debouncedSearch = useMemo(
        () =>
            debounce((searchValue) => {
                dispatch(getDrugsAction({ skip: 1, search: searchValue }));
            }, 100),
        [dispatch]
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setShowDropdown(true);
        setSelectedDrug(null);
        setValue('drugInfo', value);
        debouncedSearch(value);
    };

    const handleSelectDrug = (item) => {
        setSelectedDrug(item);
        setValue('drugInfo', item?.proprietaryName + ' (' + item?.nonProprietaryName + ')');
        setShowDropdown(false);
    };

    const onSubmit = (data) => {
        const medicationData = {
            ...(data.note && {
                note: [
                    {
                        text: data.note,
                        time: new Date().toISOString(),
                    },
                ]
            }),
            dosageInstruction: {
                sequence: parseInt(data?.sequence),
                text: additionalInstruction?.display,
                additionalInstruction: [
                    {
                        coding: [additionalInstruction],
                        text: additionalInstruction?.display,
                    },
                ],
                patientInstruction: additionalInstruction?.display,
                timing: {
                    repeat: {
                        frequency: Number(data.frequency),
                        period: Number(data.period),
                        periodUnit: data.periodUnit,
                    },
                    code: {
                        text: `${data.frequency} times every ${data.period} ${data.periodUnit}`,
                    },
                },
            },
            ...(data?.status && { status: data?.status }),
            ...(selectedDrug?._id && !selectedMedication && { drugId: selectedDrug?._id }),
            ...(data?.medicationStart && !selectedMedication && { startDate: data?.medicationStart }),
            ...(data?.relatedProblem && !selectedMedication && { problemId: data?.relatedProblem }),
            endDate: data?.medicationEnd,
            subject: patientId,
        };

        if (selectedMedication) {
            dispatch(
                updateMedicationAction({ key: encryptMessage(medicationData), medicationId: selectedMedication?._id })
            );
        } else {
            dispatch(createMedicationAction({ key: encryptMessage(medicationData) }));
        }
    };


    const additionalInstructionChange = (selectedOptions) => {
        setAdditionalInstruction(selectedOptions?.value);
    };


    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'medical' }));
        setShowSuggestions(true);
    };

    const handleSuggestionSelect = (suggestionText) => {
        const current = getValues('note'); // from useFormContext or pass as prop
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };

    // react quill word limit

    const handleLimitExceed = ({ type, message }) => {
        ToastHandle(message, 'danger');
    };

    useQuillWordLimit({
        quillRef,
        maxWords: MAX_WORDS,
        maxWordLength: MAX_WORD_LENGTH,
        onLimitExceed: handleLimitExceed,
        setValue,
        fieldName: 'note',
    });
    return (
        <Modal
            show={show}
            onHide={() => {
                onCancel();
                reset();
                setAdditionalInstruction();
            }}
            size="lg"
            className={`${showAddProblemModal ? 'd-none' : ''}`}
            centered>
            <Modal.Header closeButton className="px-2 py-0">
                <Modal.Title className="mb-0">{selectedMedication ? 'Update' : 'Add'} Medication</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={12}>
                            <Form.Group className="position-relative" ref={dropdownRef}>
                                <Form.Label className="mb-0">Drug <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('drugInfo', { required: 'This field is required.' })}
                                    onChange={handleInputChange}
                                    onFocus={() => drugsData.length > 0 && setShowDropdown(true)}
                                    placeholder="Enter drug name"
                                    autoComplete="off"
                                    disabled={selectedMedication}
                                />
                                {errors.drugInfo && (
                                    <span className="text-danger  fs-6">{errors.drugInfo.message}</span>
                                )}
                                {drugsData.length > 0 && showDropdown && (
                                    <div
                                        className="bg-white border position-absolute w-100 shadow-sm list-group"
                                        style={{
                                            maxHeight: '20vh',
                                            overflowY: 'auto',
                                            zIndex: 1050,
                                        }}>
                                        {drugsData.map((item) => (
                                            <div
                                                key={item._id}
                                                onClick={() => handleSelectDrug(item)}
                                                className="list-group-item list-group-item-action py-1 px-2"
                                                style={{ cursor: 'pointer' }}>
                                                <strong>{item.proprietaryName}</strong> ({item.nonProprietaryName})
                                                <br />
                                                <small className="text-muted">
                                                    {item.activeNumeratorStrength} {item.activeIngredientUnit} —{' '}
                                                    {item.dosageFormName}
                                                </small>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label className="mb-0">Period Unit <span className='text-danger'>*</span></Form.Label>
                                <Form.Select {...register('periodUnit', { required: 'This field is required.' })}>
                                    <option value="">Select unit</option>
                                    <option value="hours">Hour(s)</option>
                                    <option value="days">Day(s)</option>
                                    <option value="weeks">Week(s)</option>
                                    <option value="months">Month(s)</option>
                                </Form.Select>
                                {errors.periodUnit && (
                                    <span className="text-danger fs-6">{errors.periodUnit.message}</span>
                                )}
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label className="mb-0">Period <span className='text-danger'>*</span></Form.Label>
                                <Form.Control type="number" placeholder="e.g. 1" {...register('period', { required: 'This field is required.' })} />
                                {errors.period && (
                                    <span className="text-danger fs-6">{errors.period.message}</span>
                                )}
                            </Form.Group>
                        </Col>

                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label className="mb-0">Frequency <span className='text-danger'>*</span></Form.Label>
                                <Form.Control type="number" placeholder="e.g. 2" {...register('frequency', { required: 'This field is required.' })} />
                                {errors.frequency && (
                                    <span className="text-danger fs-6">{errors.frequency.message}</span>
                                )}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">Dosage Sequence</Form.Label>
                                <Form.Control
                                    type="number"
                                    {...register('sequence')}
                                    placeholder="Enter dosage sequence"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">Additional Instructions</Form.Label>
                                <Select
                                    options={additionalInstructionOptions} // Use the formatted array
                                    isSearchable
                                    className="basic-single"
                                    classNamePrefix="select"
                                    placeholder="&nbsp; Select"
                                    value={selectedInstruction}
                                    onChange={additionalInstructionChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">Related Problem  <i onClick={() => setShowAddProblemModal(true)} className="bi bi-plus-circle text-black cursor-pointer"></i></Form.Label>
                                <Form.Select {...register('relatedProblem')} disabled={selectedMedication}>
                                    <option value="">Select Related Problem</option>
                                    {problemList?.map((option) => (
                                        <option key={option?._id} value={option?._id}>
                                            {option?.code?.text}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Modal show={showAddProblemModal} onHide={handleAddProblemClose} size="lg" centered>
                                <Modal.Header closeButton className="px-2 py-0">
                                    <Modal.Title className="">Add Problem</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <AddProblem onCancel={handleAddProblemClose} />
                                </Modal.Body>
                            </Modal>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">Status <span className='text-danger'>*</span></Form.Label>
                                <Form.Select {...register('status', { required: 'This field is required.' })} >
                                    <option value="">Select status</option>
                                    {medicationStatus.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors.status && (
                                    <span className="text-danger fs-6">{errors.status.message}</span>
                                )}
                            </Form.Group>
                        </Col>

                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">Start Date <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('medicationStart', { required: 'This field is required.' })}
                                    disabled={selectedMedication}
                                />
                                {errors.medicationStart && (
                                    <span className="text-danger fs-6">{errors.medicationStart.message}</span>
                                )}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">End Date <span className='text-danger'>*</span></Form.Label>
                                <Form.Control type="date" {...register('medicationEnd', { required: 'This field is required' })} />
                                {errors.medicationEnd && (
                                    <span className="text-danger fs-6">{errors.medicationEnd.message}</span>
                                )}
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Group controlId="note">
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
                                                    <div>{`${wordCount || 0} / ${MAX_WORDS} words`}</div>
                                                </div>
                                            );
                                        })()}
                                    </small>
                                </Form.Label>
                                <Controller
                                    name="note"
                                    control={control}
                                    defaultValue="<ul><li></li></ul>"
                                    render={({ field: { onChange, value } }) => (
                                        <ReactQuill
                                            ref={quillRef}
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
                                    className="custom-suggestion-offcanvas"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-3">
                        <Button
                            onClick={() => {
                                onCancel();
                                reset();
                                setAdditionalInstruction();
                            }}
                            className="me-2 custom-buttons">
                            Cancel
                        </Button>
                        <Button
                            disabled={
                                store?.createMedicationReducer?.loading || store?.updateMedicationReducer?.loading
                            }
                            type="submit"
                            className="custom-buttons">
                            {store?.createMedicationReducer?.loading || store?.updateMedicationReducer?.loading ?
                                <Spinner className='spinner-border-sm' color='white' />
                                :
                                selectedMedication ? 'Update' : 'Save'
                            }
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
