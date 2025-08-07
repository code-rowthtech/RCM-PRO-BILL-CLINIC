import { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { getMastersDataAction } from '../../../redux/settings/action';
import { useDispatch } from 'react-redux';
import { getDoctorsAction, getEncounterAction, getPatientsAction, getRolesAction } from '../../../redux/actions';
import { loggedInUser } from '../../../helpers/api/loggedInUser';
import { encryptMessage } from '../../../cryptoUtils';
import { createUserTasksAction, getTaskByIdAction, updateUserTasksAction } from '../../../redux/Tasks/action';
import useQuillWordLimit from '../../../helpers/quillWordLimit';
import ToastHandle from '../../../helpers/ToastMessage';

const ModalTask = ({ show, handleClose, taskId }) => {
    const store = useSelector((state) => state);
    const [skip, setSkip] = useState(1);
    const dispatch = useDispatch();
    const MAX_WORDS = 1000;
    const WAX_WORD_LENGTH = 45;
    const {
        register,
        handleSubmit,
        control,
        reset,
        watch, setValue,
        formState: { errors },
    } = useForm();
    const CategoryData = store?.getMastersDataReducer?.data1?.data?.result;
    const roleData = store?.getRolesDataReducer?.data;
    const clinicId = loggedInUser?.clinicId || store?.Auth?.user?.clinicId;
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const patientsData = store?.getPatientsReducer?.data?.data;
    const createTaskResponse = store?.createUserTasksReducer?.data?.status;
    const encounters = store?.getEncounterReducer?.data?.encounters;
    const taskData = store?.getTaskByIdReducer?.data?.task;
    const quillRef = useRef(null);

    useEffect(() => {
        if (taskData && taskId) {
            setValue('description', taskData?.description);
            setValue('category', taskData?.category);
            setValue('status', taskData?.status);
            setValue('dueDate', taskData?.dueDate ? new Date(taskData?.dueDate)?.toISOString()?.split('T')?.[0] : '');
            setValue('associatedPatientId', taskData?.associatedPatientId?._id);
            setValue('assignedToId', taskData?.assignedToId?._id);
            setValue('note', taskData?.note?.[0]?.text);
            if (taskData?.associatedPatientId?._id && encounters) {
                setValue('encounter', taskData?.encounter)
            }
        }
    }, [taskData, taskId, encounters, CategoryData])

    useEffect(() => {
        if (taskId) {
            dispatch(getTaskByIdAction({ taskId: taskId }));
        }
    }, [taskId])
    useEffect(() => {
        if (createTaskResponse === 201) {
            reset();
            handleClose();
        }
    }, [createTaskResponse])

    useEffect(() => {
        if (show) {
            const data = {
                clinicId: clinicId,
                page: 1,
                limit: 10,
                search: '',
            };
            const doctorPayload = { status: '', search: '' };
            dispatch(getDoctorsAction(doctorPayload));
            dispatch(getPatientsAction(data));
            dispatch(getMastersDataAction({ status: '', category: 'task-category', limit: 10, skip: skip, search: '' }));
            dispatch(getRolesAction({
                clinicId: clinicId,
                limit: 10,
                search: '',
                page: 1,
                status: true,
            })
            );
        }
    }, [show]);


    // Reset form when modal closes
    useEffect(() => {
        if (!show) reset();
    }, [show, reset]);

    const onSubmit = (data) => {
        // Clean the data by removing empty string, undefined, or null values
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(
                ([_, value]) => value !== '' && value !== undefined && value !== null
            )
        );


        // Overwrite note with formatted object if note exists
        if (cleanedData.note) {
            cleanedData.note = [
                {
                    text: cleanedData.note,
                    time: new Date().toISOString(),
                },
            ];
        }

        // Add assignedById
        cleanedData.clinicId = loggedInUser?.clinicId;
        cleanedData.assignedById = loggedInUser?._id;
        if (taskId) {
            dispatch(updateUserTasksAction({ data: `${encryptMessage(cleanedData)}`, taskId: taskId }));
        } else {
            dispatch(createUserTasksAction({ key: `${encryptMessage(cleanedData)}` }));
        }
    };


    const handleReset = () => {
        reset();
        handleClose();
    };

    const selectedPatientId = watch('associatedPatientId'); // from react-hook-form

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
        <>
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header className="px-2 py-0" closeButton>
                    <Modal.Title>{taskId ? 'Update' : 'Add'} Task</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {store?.getTaskByIdReducer?.loading ?
                        <Row>
                            <Col className='p-5 d-flex align-items-center justify-content-center'>
                                <Spinner />
                            </Col>
                        </Row>
                        :
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label>
                                            Task Title<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Task Title"
                                            {...register('description', { required: 'Task title is required.' })}
                                        />
                                        {errors.description && (
                                            <Form.Text className="text-danger">{errors.description.message}</Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label>
                                            Assign To<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Controller
                                            name="assignedToId"
                                            control={control}
                                            rules={{ required: 'Assign to is required.' }}
                                            render={({ field }) => (
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    name="assignedToId"
                                                    options={[
                                                        ...(doctorDetails?.map((t) => ({
                                                            value: t?.userId?._id,
                                                            label: (
                                                                <span>
                                                                    {t?.name?.[0]?.text || t?.name?.text || 'Unnamed'}
                                                                    <span
                                                                        style={{
                                                                            fontSize: 10,
                                                                            marginLeft: 4,
                                                                            color: '#888',
                                                                        }}>
                                                                        (Doctor)
                                                                    </span>
                                                                </span>
                                                            ),
                                                        })) || []),
                                                        ...(roleData?.users?.map((t) => ({
                                                            value: t._id,
                                                            label: (
                                                                <span>
                                                                    {t?.name?.text || 'Unnamed'}
                                                                    <span
                                                                        style={{
                                                                            fontSize: 10,
                                                                            marginLeft: 4,
                                                                            color: '#888',
                                                                        }}>
                                                                        (User)
                                                                    </span>
                                                                </span>
                                                            ),
                                                        })) || []),
                                                    ]}
                                                    placeholder=" Select"
                                                    value={
                                                        [
                                                            ...(doctorDetails?.map((t) => ({
                                                                value: t?.userId?._id,
                                                                label: (
                                                                    <span>
                                                                        {t?.name?.[0]?.text || t?.name?.text || 'Unnamed'}
                                                                        <span
                                                                            style={{
                                                                                fontSize: 10,
                                                                                marginLeft: 4,
                                                                                color: '#888',
                                                                            }}>
                                                                            (Doctor)
                                                                        </span>
                                                                    </span>
                                                                ),
                                                            })) || []),
                                                            ...(roleData?.users?.map((t) => ({
                                                                value: t._id,
                                                                label: (
                                                                    <span>
                                                                        {t?.name?.text || 'Unnamed'}
                                                                        <span
                                                                            style={{
                                                                                fontSize: 10,
                                                                                marginLeft: 4,
                                                                                color: '#888',
                                                                            }}>
                                                                            (User)
                                                                        </span>
                                                                    </span>
                                                                ),
                                                            })) || []),
                                                        ].find((option) => option.value === field.value) || null
                                                    }
                                                    onChange={(option) => field.onChange(option ? option.value : '')}
                                                    onInputChange={(data) => {
                                                        dispatch(getDoctorsAction({ status: '', search: data, page: 1, limit: 10 }));
                                                        dispatch(getRolesAction({
                                                            clinicId: clinicId,
                                                            limit: 10,
                                                            search: data,
                                                            page: 1,
                                                            status: true,
                                                        })
                                                        );
                                                    }}
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
                                            )}
                                        />
                                        {errors.assignedToId && (
                                            <Form.Text className="text-danger">{errors.assignedToId.message}</Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-1">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select {...register('category')}>
                                            <option value="">Select</option>
                                            {CategoryData?.map((category) => (
                                                <option key={category?._id} value={category?.name}>
                                                    {category?.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            Status<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select className='text-capitalize' {...register('status', { required: 'Status is required.' })}>
                                            <option value="">Select Status</option>
                                            {(taskId
                                                ? [
                                                    'draft', 'requested', 'received', 'accepted', 'rejected',
                                                    'ready', 'cancelled', 'in-progress', 'on-hold',
                                                    'failed', 'completed', 'entered-in-error'
                                                ]
                                                : ['draft', 'requested']
                                            ).map((status, index) => (
                                                <option
                                                    selected={status === 'requested'}
                                                    className="text-capitalize"
                                                    value={status}
                                                    key={index}
                                                >
                                                    {status}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {errors.status && (
                                            <Form.Text className="text-danger">{errors.status.message}</Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Due Date</Form.Label>
                                        <div className="d-flex align-items-center">
                                            <Form.Control min={new Date()?.toISOString()?.split('T')?.[0]} defaultValue={new Date()?.toISOString()?.split('T')?.[0]} type="date" {...register('dueDate')} />
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            Associated Patient <span className="text-secondary">(If any)</span>
                                        </Form.Label>
                                        <Controller
                                            name="associatedPatientId"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={
                                                        patientsData?.map((patient) => ({
                                                            value: patient._id,
                                                            label:
                                                                patient?.name?.[0]?.text ||
                                                                patient?.name?.text ||
                                                                'Unnamed',
                                                        })) || []
                                                    }
                                                    placeholder="Select"
                                                    className="basic-single w-100"
                                                    classNamePrefix="select"
                                                    isClearable
                                                    value={
                                                        patientsData
                                                            ?.map((patient) => ({
                                                                value: patient._id,
                                                                label:
                                                                    patient?.name?.[0]?.text ||
                                                                    patient?.name?.text ||
                                                                    'Unnamed',
                                                            }))
                                                            .find((option) => option.value === field.value) || null
                                                    }
                                                    onChange={(val) => {
                                                        field.onChange(val ? val.value : '');
                                                        dispatch(getEncounterAction({ patientId: val?.value }))
                                                    }}
                                                    onInputChange={(searchValue) => {
                                                        const data = {
                                                            clinicId: clinicId,
                                                            page: 1,
                                                            limit: 10,
                                                            search: searchValue,
                                                        };
                                                        dispatch(getPatientsAction(data));
                                                    }}
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
                                            )}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-1">
                                {selectedPatientId && encounters?.length > 0 && (
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Associated Encounter</Form.Label>
                                            <div className="d-flex align-items-center">
                                                <Form.Select {...register('encounter')} >
                                                    <option value="">Select Encounter</option>
                                                    {encounters?.map((encounter) => (
                                                        <option key={encounter?._id} value={encounter?._id}>
                                                            {encounter?.type?.[0]?.coding?.[0]?.display || ''} ({encounter?.period?.start ? new Date(encounter?.period?.start)?.toISOString()?.split('T')?.[0] : ''})
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                )}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            Priority<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select className='text-capitalize' {...register('priority', { required: 'Priority is required.' })}>
                                            <option value="">Select Priority</option>
                                            {['routine', 'urgent', 'asap', 'stat']?.map((priority, index) => (
                                                <option selected={priority === 'routine'} className='text-capitalize' value={priority} key={index}>{priority === 'stat' ? 'Stat (Immediate action required)' : priority}</option>
                                            ))}
                                        </Form.Select>
                                        {errors.priority && (
                                            <Form.Text className="text-danger">{errors.priority.message}</Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Col xs={12} className="mt-0 mb-5">
                                <Form.Group controlId="notes">
                                    <Form.Label className="fw-medium mb-1 d-flex justify-content-between align-items-center">
                                        <div>
                                            Notes{' '}
                                        </div>
                                        <small className="text-muted">
                                            {(() => {
                                                const content = watch('note') || '';
                                                const plainText = content.replace(/<[^>]*>/g, '').trim();
                                                const words = plainText.split(/\s+/).filter(Boolean);
                                                const wordCount = words.length > MAX_WORDS ? MAX_WORDS : words.length;
                                                const longestWord = words.reduce((max, word) =>
                                                    word.length > max.length ? word : max,
                                                    '');
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
                                            <div style={{ width: '100%', maxHeight: '25vh' }}>
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
                                            </div>
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                            <div className="d-flex justify-content-between">
                                <span className="text-danger">{errors.title ? errors.title.message : ''}</span>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant=""
                                        className="cancel-button text-white"
                                        type="button"
                                        onClick={handleReset}>
                                        Reset
                                    </Button>{' '}
                                    <Button variant="primary" disabled={store?.createUserTasksReducer?.loading || store?.updateUserTasksReducer?.loading} className="custom-buttons" type="submit">
                                        {taskId ? "Update" : 'Create'} task
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    }
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ModalTask;
