import React, { useEffect, useRef, useState } from 'react';
import { Col, Row, Form, Button, Card, ListGroup, Accordion } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import SuggestionOffcanvas from '../SuggestionOffcanvas';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { createAlcoholHistoryAction, deleteAlcoholHistoryAction, getAlcoholHistoryAction, updateAlcoholHistoryAction } from '../../../../../redux/socialHistory/action';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';
import DeletionModal from '../../../../../helpers/deletionModal';
import Spinner from '../../../../../constants/Spinner';
import ToastHandle from '../../../../../helpers/ToastMessage';
import useQuillWordLimit from '../../../../../helpers/quillWordLimit';

const MAX_WORDS = 10;
const WAX_WORD_LENGTH = 45;
const Alcohol = () => {
    const dispatch = useDispatch();
    const quillRef = useRef(null);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const createResponse = store?.createAlcoholHistoryReducer?.data?.status
    const deleteResponse = store?.deleteAlcoholHistoryReducer?.data?.status
    const updateResponse = store?.updateAlcoholHistoryReducer?.data?.status
    const alcoholData = store?.getAlcoholHistoryReducer?.data?.data;
    console.log(alcoholData, 'alcoholData')
    const { register, handleSubmit, reset, control, watch, getValues, setValue } = useForm();
    const [entries, setEntries] = useState([]);
    const watchUseStatus = watch("useStatus");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [toEdit, setToEdit] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        if (!alcoholData) {
            dispatch(getAlcoholHistoryAction({ patientId }))
        }
    }, [alcoholData, dispatch])

    useEffect(() => {
        if (toEdit) {
            setValue('useStatus', toEdit?.useStatus || '')
            setValue('alcoholType', toEdit?.alcoholType || '')
            setValue('frequency', toEdit?.frequency || '')
            setValue('quantityPerOccasion', toEdit?.quantityPerOccasion || '')
            setValue('hasDependenceSymptoms', toEdit?.hasDependenceSymptoms || '')
            setValue('heavyIntakeFrequency', toEdit?.heavyIntakeFrequency || '')
            setValue('note', toEdit?.note?.[0]?.text || "<ul><li></li></ul>");
            setValue('ageOfFirstUse', toEdit?.ageOfFirstUse || '')
            setValue('lastUseDate', toEdit?.lastUseDate ? new Date(toEdit?.lastUseDate)?.toISOString().split("T")[0] : '');
            setValue('reasonForStopping', toEdit?.reasonForStopping || '')
        }
    }, [toEdit])
    const closeDeleteModal = () => {
        setDeleteModal(false);
        setToDelete(null);
        setToEdit(null);
    }

    const deleteHistory = () => {
        dispatch(deleteAlcoholHistoryAction({ id: toDelete }))
    }

    useEffect(() => {
        if (createResponse === 201 || updateResponse === 200) {
            reset();
            setToEdit(null);
            dispatch(getAlcoholHistoryAction({ patientId: patientId }))
        }
    }, [createResponse, updateResponse])
    useEffect(() => {
        if (deleteResponse === 200) {
            reset();
            closeDeleteModal()
            dispatch(getAlcoholHistoryAction({ patientId: patientId }))
        }
    }, [deleteResponse])

    useEffect(() => {
        if (watchUseStatus === 'Current User') {
            // Clear fields that are only for "Former User"
            setValue('ageOfFirstUse', '');
            setValue('lastUseDate', '');
            setValue('reasonForStopping', '');
        } else if (watchUseStatus === 'Former User') {
            // Clear fields that are only for "Current User"
            setValue('frequency', '');
            setValue('quantityPerOccasion', '');
            setValue('heavyIntakeFrequency', '');
            setValue('alcoholType', '');
            setValue('hasDependenceSymptoms', '');
        } else {
            // Clear everything else if "Never Used" or "Unknown"
            setValue('frequency', '');
            setValue('quantityPerOccasion', '');
            setValue('heavyIntakeFrequency', '');
            setValue('alcoholType', '');
            setValue('hasDependenceSymptoms', '');
            setValue('ageOfFirstUse', '');
            setValue('lastUseDate', '');
            setValue('reasonForStopping', '');
        }
    }, [watchUseStatus, setValue]);
    const onSubmit = (data) => {
        // Remove empty string values
        Object.keys(data).forEach((key) => {
            if (data[key] === '') {
                delete data[key];
            }
        });

        data.subject = patientId;
        data.effectiveDateTime = new Date().toISOString();
        data.note = [
            {
                text: data.note,
                time: new Date().toISOString(),
            },
        ];
        if (toEdit) {
            data.id = toEdit?._id;
            dispatch(updateAlcoholHistoryAction({ key: encryptMessage(data) }))
        } else {
            dispatch(createAlcoholHistoryAction({ key: encryptMessage(data) }));
        }
    };


    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'drinking' }));
        setShowSuggestions(true);
    };

    const handleSuggestionSelect = (suggestionText) => {
        const current = getValues('note'); // from useFormContext or pass as prop
        setValue('note', `${current}<p>${suggestionText}</p>`);

    };

    const handleReset = () => {
        reset();
        setToEdit(null);
        setToDelete(null);
        setDeleteModal(false);
        setShowSuggestions(false);
    };
    const heavyFrequency = watch('frequency')

    // react quill word limit

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
    return (
        <Row className="scroll-container" style={{ overflowY: 'scroll', overflowX: 'hidden', height: "100%" }}>
            {/* Left Side - Form */}
            <Col md={6} className="d-flex border-end flex-column pt-0 mt-0 pe-1 ">
                <div className="h-100 mt-1  ">
                    <Card.Body className="d-flex flex-column pt-0 px-2 pb-2 mt-0">
                        {/* <Card.Title className="border-bottom pb-2 pt-0 mb-1">
                            <h5 className="fw-semibold mb-0">Add Alcohol History</h5>
                        </Card.Title> */}

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div style={{ maxHeight: '48vh' }} className='d-flex px-2 scroll-container flex-column justify-content-between'>
                                <Row>
                                    <Col sm={12}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Alcohol Use Status</Form.Label>
                                            <Form.Select
                                                {...register('useStatus', { required: true })}
                                                required
                                            >
                                                <option value="">Select status</option>
                                                <option value="Current User">Current User</option>
                                                <option value="Former User">Former User</option>
                                                <option value="Never Used">Never Used</option>
                                                <option value="Unknown">Unknown</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>



                                {watchUseStatus === 'Current User' && (
                                    <Row>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>Alcohol use frequency</Form.Label>
                                                <Form.Select {...register('frequency')} required>
                                                    <option key='' value=''>Select</option>
                                                    {['Occasionally', 'Weekly', 'Daily', 'Heavy', 'Unknown']?.map((data) => {
                                                        return <option value={data} key={data}>{data}</option>;
                                                    })}

                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>Standard drinks per occasion</Form.Label>
                                                <Form.Select {...register('quantityPerOccasion')} required>
                                                    <option key='' value=''>Select</option>
                                                    {['1 or 2', '3 or 4', '5 or 6', '7 to 9', '10 or more']?.map((data) => {
                                                        return <option value={data} key={data}>{data}</option>;
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        {heavyFrequency === 'Heavy' &&
                                            <Col sm={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className='mb-0'>Heavy intake frequency</Form.Label>
                                                    <Form.Select {...register('heavyIntakeFrequency')} required>
                                                        <option key='' value=''>Select</option>
                                                        {['Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily']?.map((data) => {
                                                            return <option value={data} key={data}>{data}</option>;
                                                        })}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        }

                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>What types of alcohol do you usually consume?</Form.Label>
                                                <Form.Select {...register('alcoholType')} required>
                                                    <option key='' value=''>Select</option>
                                                    {['Beer', 'Wine', 'Spirits', 'Other', 'All']?.map((data) => {
                                                        return <option value={data} key={data}>{data}</option>;
                                                    })}

                                                </Form.Select>
                                                {/* <Form.Control type="text" placeholder="e.g., Beer, Wine, Spirits" /> */}
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>Do you experience dependence symptoms (e.g., craving, withdrawal)?</Form.Label>
                                                <Form.Check type="checkbox" label="Yes" {...register('hasDependenceSymptoms')} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )}

                                {watchUseStatus === 'Former User' && (
                                    <Row>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>Age when you started using alcohol</Form.Label>
                                                <Form.Control type="number" {...register('ageOfFirstUse', { valueAsNumber: true })} />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>

                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>Date of last alcohol use</Form.Label>
                                                <Form.Control type="date" max={new Date().toISOString().slice(0, 10)} {...register('lastUseDate')} />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>

                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>Reason for stopping alcohol use</Form.Label>
                                                <Form.Control as="textarea" rows={2} {...register('reasonForStopping')} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )}

                                {watchUseStatus !== 'Never Used' && (
                                    <Row>
                                        <Col xs={12}>
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
                                                    defaultValue="<ul><li></li></ul>"
                                                    render={({ field: { onChange, value } }) => (
                                                        <ReactQuill
                                                            value={value}
                                                            ref={quillRef}
                                                            onChange={(content, delta, source) => {
                                                                if (source === 'user') {
                                                                    onChange(content);
                                                                }
                                                            }}
                                                            theme="snow"
                                                            placeholder="Enter detailed notes here..."
                                                            style={{ height: '270px', backgroundColor: 'white' }}
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
                            </div>
                            <div className="d-flex justify-content-end mt-3 align-items-center">
                                <Button variant="primary" type="submit" className="custom-buttons px-4 py-1">
                                    {toEdit ?
                                        `Update`
                                        :
                                        `Add`
                                    }
                                </Button>
                            </div>


                        </Form>
                    </Card.Body>
                </div>
            </Col>
            <Col md={6} className="d-flex flex-column px-0 scroll-container">
                <Card.Body className="px-2 py-1 p-0">
                    {/* <Card.Title className="border-bottom">
                        <h5 className="fw-semibold mb-0">Tobacco History</h5>
                    </Card.Title> */}

                    {store?.getAlcoholHistoryReducer?.loading && !alcoholData?.length ? (
                        <div className="text-center py-4">
                            <Spinner />
                        </div>
                    ) : alcoholData?.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <i className="bi bi-journal-x fs-1"></i>
                            <p className="mt-2 mb-0">No alcohol use records found</p>
                        </div>
                    ) : (
                        <Accordion alwaysOpen flush>
                            {alcoholData?.map((item, index) => (
                                <Accordion.Item eventKey={index.toString()} key={index} className="rounded-1">
                                    <Accordion.Header>
                                        <div
                                            className="d-flex justify-content-between align-items-center w-100"
                                            style={{ marginRight: '-19px' }}>
                                            <div className="d-flex align-items-center gap-2 p-2 pe-0">
                                                <span className="text-black fs-6 tab-font-family fw-semibold">
                                                    {index + 1}.
                                                </span>
                                                <span className="fw-normal fs-6 tab-font-family text-black">
                                                    {item?.useStatus?.length > 35 ?
                                                        item?.useStatus?.slice(0, 34) + '...' :
                                                        item?.useStatus || ''} <span className='fs-6 text-muted fw-semibold'>
                                                        {item?.alcoholType && `(${item?.alcoholType})`}
                                                    </span>
                                                </span>
                                                <small className="text-black" style={{ fontSize: '12px' }}>
                                                    {item?.effectiveDateTime
                                                        ? `${new Date(item?.effectiveDateTime).toLocaleDateString()} (${new Date(item?.effectiveDateTime).toLocaleTimeString()})`
                                                        : 'No date'}
                                                </small>
                                            </div>
                                            {/* Action Icons */}
                                            <div
                                                className="d-flex gap-2 px-2"
                                                onClick={(e) => {
                                                    // Prevent accordion from toggling
                                                    e.stopPropagation();
                                                }}>
                                                <i
                                                    className="bi bi-trash text-danger cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setToDelete(item?._id);
                                                        setDeleteModal(true);
                                                    }}
                                                    title="Delete"
                                                />
                                                {toEdit && toEdit._id === item._id ? (
                                                    <i
                                                        className="bi bi-x-lg text-danger cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleReset();
                                                        }}
                                                        title="Cancel"
                                                    />
                                                ) : (
                                                    <i
                                                        className="bi bi-pencil text-info cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setToEdit(item);
                                                        }}
                                                        title="Edit"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Accordion.Header>

                                    <Accordion.Body className="pt-0 p-0 ">
                                        {item?.note?.[0]?.text ? (
                                            <div
                                                className="ql-editor p-1 rounded scroll-container notes-scroll"
                                                dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                style={{ fontSize: '0.875rem', overflowY: 'scroll', height: '150px' }}
                                            />
                                        ) : (
                                            <div className="text-muted fst-italic p-2">No notes available</div>
                                        )}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}

                            <DeletionModal
                                show={deleteModal}
                                onHide={closeDeleteModal}
                                onConfirm={deleteHistory}
                                item="tobacco history"
                                isLoading={store?.deleteTobaccooReducer?.loading}
                            />
                        </Accordion>
                    )}
                </Card.Body>
            </Col>

            {/* Right Side - Display Data */}

        </Row>
    );
};

export default Alcohol;