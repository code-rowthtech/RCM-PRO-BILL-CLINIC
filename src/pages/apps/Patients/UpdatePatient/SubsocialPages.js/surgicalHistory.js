import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { createSurgicalHistoryAction, createTobaccooAction, deleteSurgicalHistoryAction, getICDProcedureAction, getSurgicalHistoryAction, getTobaccooAction, updateSurgicalHistoryAction } from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import Spinner from '../../../../../constants/Spinner';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import SuggestionOffcanvas from '../SuggestionOffcanvas';
import Select from 'react-select';
import { bodySite } from '../../../../../utils/DataSets/surgicalHistoryDataset';

const SurgicalHistory = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const createSuccess = store?.createSurgicalHistoryReducer?.data?.status;
    const deleteSuccess = store?.deleteSurgicalHistoryReducer?.data?.status;
    const updateSuccess = store?.updateSurgicalHistoryReducer?.data?.status;
    const surgicalHistory = store?.getSurgicalHistoryReducer?.data?.result;
    const icdProcedureCodes = store?.getIcdProcedureReducer?.data?.pcsCodes;
    const [selectedIcdProcedure, setSelectedIcdProcedure] = useState(null);
    const [bodySiteSelected, setBodySiteSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { register, handleSubmit, reset, getValues, control, setValue, formState: { errors } } = useForm();
    const [toEdit, setToEdit] = useState(null);
    useEffect(() => {
        if (toEdit) {
            setValue('effectiveDateTime', toEdit?.performedDateTime ? new Date(toEdit?.performedDateTime)?.toISOString().split("T")[0] : '');
            setValue('bodySite', toEdit?.bodySite?.[0]?.coding?.[0]?.code);
            setValue('note', toEdit?.note?.[0]?.text || "<ul><li></li></ul>"); // fallback to default if empty
            setSelectedIcdProcedure({ label: toEdit?.code?.coding?.[0]?.display, value: toEdit?.code?.coding?.[0]?.code });
            setBodySiteSelected(toEdit?.bodySite?.[0]?.coding?.[0]);
        }
    }, [toEdit])


    useEffect(() => {
        dispatch(getICDProcedureAction({ search: search }))
    }, [dispatch, search]);


    useEffect(() => {
        if (createSuccess === 201) {
            dispatch(getSurgicalHistoryAction({ patientId: patientId }));
            setSelectedIcdProcedure(null);
            reset();
        }
    }, [createSuccess, dispatch, patientId, reset]);

    useEffect(() => {
        if (deleteSuccess === 200) {
            dispatch(getSurgicalHistoryAction({ patientId: patientId }));
            setSelectedIcdProcedure(null);
            reset();
        }
    }, [deleteSuccess, patientId]);
    useEffect(() => {
        if (updateSuccess === 200) {
            dispatch(getSurgicalHistoryAction({ patientId: patientId }));
            setSelectedIcdProcedure(null);
            setToEdit(null);
            setBodySiteSelected(null);
            reset();
        }
    }, [updateSuccess, patientId]);


    const onSubmit = (data) => {

        const payload = {
            code: {
                coding: [
                    {
                        system: '',
                        code: selectedIcdProcedure?.value,
                        display: selectedIcdProcedure?.label,
                    },
                ],
                text: selectedIcdProcedure?.label,
            },
            bodySite: {
                coding: [
                    {
                        system: bodySiteSelected?.system,
                        code: bodySiteSelected?.code,
                        display: bodySiteSelected?.display,
                    },
                ],
                text: bodySiteSelected?.display,
            },
            note: [
                {
                    text: data.note,
                    time: new Date().toISOString(),
                },
            ],
            subject: patientId,
            performedDateTime: data?.effectiveDateTime
        }
        if (toEdit) {
            payload.id = toEdit?._id;
            dispatch(updateSurgicalHistoryAction({ key: encryptMessage(payload) }))
        } else {
            dispatch(createSurgicalHistoryAction({ key: encryptMessage(payload) }))
        }

    };

    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'surgical' }));
        setShowSuggestions(true);
    };
    const handleSuggestionSelect = (suggestionText) => {
        const current = getValues('note');
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };

    const procedureOptions = icdProcedureCodes?.map((data) => ({
        label: data?.title, value: data?.value,
    }))

    const handleIcdProcedure = (selectedOne) => {
        setSelectedIcdProcedure(selectedOne);
    }
    return (
        <Row className="mt-0 g-0 pt-0 px-1 h-100 scroll-container" style={{ height: 'calc(100vh - 100px)', overflowY: "scroll" }}>
            <Col md={6} className="d-flex  flex-column border-end  pt-0 mt-0 pe-1 ">
                <div className=" border-danger  h-100">
                    <Card.Body className="d-flex flex-column pt-0 px-2 pb-2 mt-0">
                        <Card.Title className="border-bottom pb-2 pt-0 mb-1">
                            <h5 className="fw-semibold mb-0">Add Surgical History</h5>
                        </Card.Title>

                        <Form className='d-flex flex-column align-items-between' onSubmit={handleSubmit(onSubmit)}>
                            <div className="scroll-container mb-1 px-2" style={{ maxHeight: 'calc(100vh - 56vh)', overflowY: 'auto' }}>
                                <Row className="g-3">
                                    <Col sm={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-medium mb-0">Diagnosis</Form.Label>
                                            <Select
                                                options={procedureOptions} // Use the formatted array
                                                isSearchable
                                                className="basic-single"
                                                classNamePrefix="select"
                                                placeholder="&nbsp; Select "
                                                value={
                                                    selectedIcdProcedure || null
                                                } // Show selected value
                                                onChange={handleIcdProcedure}
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
                                    <Col md={6}>
                                        <Form.Group controlId="effectiveDateTime">
                                            <Form.Label className="fw-medium mb-0">Date & Time</Form.Label>
                                            <Form.Control
                                                type="date"
                                                {...register('effectiveDateTime', {
                                                    required: true
                                                })}
                                                className="form-control-sm"
                                            />
                                            {errors.effectiveDateTime && (
                                                <span className="text-danger">{errors.effectiveDateTime.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-medium mb-0">Body Site</Form.Label>
                                            <Form.Select
                                                {...register('bodySite', {
                                                    required: true
                                                })}
                                                onChange={(e) => {
                                                    const selectedCode = e.target.value;
                                                    const selectedBodySite = bodySite?.find(site => site?.code === selectedCode);
                                                    setBodySiteSelected(selectedBodySite)
                                                }}>
                                                <option key='' value='' hidden>Select...</option>
                                                {bodySite?.map((data) => (
                                                    <option key={data?.code} value={data?.code}>
                                                        {data?.display}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.bodySite && (
                                                <span className="text-danger">{errors.bodySite.message}</span>
                                            )}

                                        </Form.Group>
                                    </Col>


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
                                                        style={{ height: '200px', backgroundColor: 'white' }}
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
                            </div>
                            <div className="d-flex justify-content-end pe mt-2">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={store?.createSurgicalHistoryReducer?.loading || store?.createSurgicalHistoryReducer?.loading}
                                    className="px-4 py-1 custom-buttons">
                                    Add Record
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </div>
            </Col>

            {/* History Side */}
            {/* History Side */}
            <Col md={6} className="d-flex  flex-column pt-0 mt-0  ps-1 ">
                <div className=" border-danger  h-100">
                    <Card.Body className="d-flex flex-column pt-0 px-2 pb-2 mt-0">
                        <Card.Title className="border-bottom pt-0 pb-2 mb-0">
                            <h5 className="fw-semibold mb-0">Surgical History</h5>
                        </Card.Title>

                        {store?.getSurgicalHistoryReducer?.loading && !surgicalHistory?.length ? (
                            <div className="text-center py-4">
                                <Spinner />
                            </div>
                        ) : surgicalHistory?.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-journal-x fs-1"></i>
                                <p className="mt-2 mb-0">No surgical records found</p>
                            </div>
                        ) : (
                            <div className="scroll-container" style={{ overflowY: 'auto', height: '50vh' }}>
                                <ListGroup variant="flush" className='striped-data'>
                                    {surgicalHistory?.map((item, index) => (
                                        <ListGroup.Item key={index} className="pb-3 striped-data-item px-0 border-bottom">
                                            <div className="d-flex justify-content-between align-items-start px-1">
                                                <strong className="mb-0 text-right fw-semibold cursor-pointer" title={item.code?.coding?.[0]?.display}>{item.code?.coding?.[0]?.display?.length > 35 ?
                                                    item.code?.coding?.[0]?.display?.slice(0, 34) + '...' :
                                                    item.code?.coding?.[0]?.display || ''} </strong>
                                                <small className="text-muted text-right d-flex flex-column">
                                                    {item?.performedDateTime
                                                        ? new Date(item?.performedDateTime).toLocaleDateString()
                                                        : 'No date'}
                                                    <span className='text-right cursor-pointer fw-semibold' title={item.bodySite?.[0]?.coding?.[0]?.display}>
                                                        ({item.bodySite?.[0]?.coding?.[0]?.display?.length > 35 ? item.bodySite?.[0]?.coding?.[0]?.display?.slice(0, 34) + '...' : item.bodySite?.[0]?.coding?.[0]?.display})
                                                    </span>
                                                </small>
                                            </div>
                                            {item.note?.[0]?.text && (
                                                <div className="mt-0">
                                                    <div
                                                        className="ql-editor p-0"
                                                        dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                        style={{ fontSize: '0.875rem' }}
                                                    />
                                                </div>
                                            )}
                                            <div className="mt-0 d-flex justify-content-end pe-2 gap-1">
                                                <i className="bi bi-trash-fill text-danger cursor-pointer"
                                                    onClick={() => {
                                                        dispatch(deleteSurgicalHistoryAction({ id: item?._id }))
                                                    }}></i>
                                                {toEdit && toEdit._id === item._id ? (
                                                    <i
                                                        onClick={() => setToEdit(null)}
                                                        className="bi bi-x-circle-fill cursor-pointer text-danger"></i>
                                                ) : (
                                                    <i
                                                        onClick={() => setToEdit(item)}
                                                        className="bi bi-pencil text-info cursor-pointer"
                                                    ></i>
                                                )}

                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        )}
                    </Card.Body>
                </div>
            </Col>
        </Row >
    );
};

export default SurgicalHistory;
