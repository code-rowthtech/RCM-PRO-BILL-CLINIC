import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FiUploadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
    createTaskAction,
    getClinicEmployeesAction,
    getPatientsAction,
    getPatientsByIdAction,
    getTaskDetailsAction,
    updateTaskAction,
} from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useForm } from 'react-hook-form';
import { handleUpload } from '../../../../../helpers/HandleUpload';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../../../../../constants/Spinner';

const UpdateAsignTask = ({ taskId }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        clearErrors,
        watch,
        getValues,
    } = useForm();
    // const patientsData = store?.getPatientsByIdReducer?.data?.patient || [];
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [profileUploading, setProfileUploading] = useState(false);
    const logoFileInputRef = useRef(null);
    // const taskDataById = store?.updateTaskReducer || [];

    const taskDetails = store?.getTaskDetailsReducer?.data?.task;
    const employees = store?.getClinicEmployeesReducer?.data?.result;

    useEffect(() => {
        dispatch(getClinicEmployeesAction({ clinicId: clinicId }));
    }, [dispatch]);

    useEffect(() => {
        const data = {
            doctorId: doctorId,
        };
        dispatch(getPatientsAction({ key: encryptMessage(data) }));
    }, [dispatch]);

    // useEffect(() => {
    //     const data = {
    //         id: taskId,
    //     };
    //     if (taskId) {
    //         dispatch(getPatientsByIdAction({ key: encryptMessage(data) }));
    //     }
    // }, [dispatch]);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setProfileUploading);
            setLogo(url);
            setLogoName(selectedFile?.name);
            clearErrors('profileImage');
        } catch (error) {
            console.error('File upload failed', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`; // Format for input type="date"
    };

    useEffect(() => {
        //   setSelectedDoctor(doctor);
        setValue('taskTitle', taskDetails?.taskTitle);
        // setValue('assignedToId', `${taskDetails?.assignedToId?.firstName} ${taskDetails?.assignedToId?.lastName}`);
        setValue('assignedToId', taskDetails?.assignedToId?._id);

        setValue('category', taskDetails?.category);
        setValue('taskStatus', taskDetails?.taskStatus);
        setValue('dueDate', formatDate(taskDetails?.dueDate));
        setValue('note', taskDetails?.note);
        // setValue('note', taskDetails?.note);
        setValue('priority', taskDetails?.priority);
        setValue('associatedPatientId', taskDetails?.associatedPatientId?.firstName);
        setValue('templateId', taskDetails?.templateId);
        setLogo(taskDetails?.associatedItemUrl?.url);
        setLogoName(taskDetails?.associatedItemUrl?.fileName);
    }, [taskDetails]);

    const onSubmit = (data) => {
        const updatedData = { ...data };

        // Convert dueDate to end of the day in UTC format
        const formattedDueDate = updatedData.dueDate
            ? new Date(`${updatedData.dueDate}T23:59:59.999Z`).toISOString()
            : null;

        const payload = {
            id: taskDetails?._id,
            ...(updatedData?.taskTitle ? { taskTitle: updatedData?.taskTitle } : {}),
            ...(updatedData?.assignedToId ? { assignedToId: updatedData?.assignedToId } : {}),
            // ...(updatedData?.templateId ? { templateId: updatedData?.templateId } : {}),
            ...(updatedData?.category ? { category: updatedData?.category } : {}),
            ...(updatedData?.taskStatus ? { taskStatus: updatedData?.taskStatus } : {}),
            ...(formattedDueDate ? { dueDate: formattedDueDate } : {}), // Use formatted date
            ...(updatedData?.priority ? { priority: updatedData?.priority } : {}),
            ...(updatedData?.note ? { note: updatedData?.note } : {}),
            ...(updatedData?.associatedPatientId ? { associatedPatientId: taskDetails?.associatedPatientId?._id } : {}),
            ...(logo?.url === null
                ? {}
                : {
                      associatedItemUrl: logo?.url?.split('?')[0],
                      associatedItemName: logoName,
                  }),
        };

        dispatch(updateTaskAction({ key: encryptMessage(payload) }));
        // reset();
    };

    return (
        <div>
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                {store?.getTaskDetailsReducer?.loading ? (
                    <div className='text-center my-5 py-5'>
                        <Spinner className=" " />
                    </div>
                ) : (
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="taskTitle" className="mb-0">
                                    Task Title 
                                </Form.Label>
                                <Form.Control
                                    data-has-value={!!watch('taskTitle')}
                                    id="taskTitle"
                                    type="text"
                                    placeholder="Task Title"
                                    {...register('taskTitle', { required: 'Task title is required' })}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="template" className="mb-0">
                                    Select Template
                                </Form.Label>
                                <Form.Select
                                    as="select" // Use 'select' to make it a dropdown
                                    data-has-value={!!watch('templateId')}
                                    id="templateId"
                                    {...register('templateId')}>
                                    <option value="">Select Template</option>
                                    <option value="0001">Template 1</option>
                                    <option value="0002">Template 2</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="template" className="mb-0">
                                    Assign To
                                </Form.Label>
                                <Form.Select
                                    id="assignedToId"
                                    data-has-value={!!watch('assignedToId')}
                                    {...register('assignedToId')}>
                                    <option value="">Select Assign To</option>
                                    {employees &&
                                        employees.map((data, index) => (
                                            <option key={index} value={data?._id}>
                                                {data?.firstName} {data?.lastName}
                                            </option>
                                        ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="category" className="mb-0">
                                    Category
                                </Form.Label>
                                <Form.Select
                                    as="select" // Use 'select' to make it a dropdown
                                    data-has-value={!!watch('category')}
                                    id="category"
                                    {...register('category')}>
                                    <option value="">Select Category</option>
                                    <option value="Lab Results">Lab Results</option>
                                    <option value="Blood Testing">Blood Testing</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="taskStatus" className="mb-0">
                                    Status
                                </Form.Label>
                                <Form.Select
                                    as="select" // Use 'select' to make it a dropdown
                                    data-has-value={!!watch('taskStatus')}
                                    id="taskStatus"
                                    {...register('taskStatus')}>
                                    <option value="">Select Status</option>
                                    <option value="Complete">Complete</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Open">Open</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="dueDate" className="mb-0">
                                    Due Date{' '}
                                </Form.Label>
                                <Form.Control
                                    data-has-value={!!watch('dueDate')}
                                    id="dueDate"
                                    type="date"
                                    {...register('dueDate', { required: 'Due date is required' })}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="priority" className="mb-0">
                                    Priority
                                </Form.Label>
                                <Form.Select
                                    as="select" // Use 'select' to make it a dropdown
                                    data-has-value={!!watch('priority')}
                                    id="priority"
                                    {...register('priority')}>
                                    <option value="">Select Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                    <option value="Urgent">Urgent</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="taskTitle" className="mb-0">
                                    Select Patient{' '}
                                </Form.Label>
                                {/* <Form.Select
                                id="associatedPatientId"
                                data-has-value={!!watch('associatedPatientId')}
                                {...register('associatedPatientId')}>
                                <option value="">Select Patient</option>
                                {patientsData?.map((data, index) => (
                                    <option key={index} value={data?._id}>
                                        {data?.firstName} {data?.lastName}
                                    </option>
                                ))}
                            </Form.Select> */}
                                <Form.Control
                                    className="text-capitalize"
                                    readOnly
                                    value={
                                        taskDetails?.associatedPatientId?.firstName +
                                        ' ' +
                                        taskDetails?.associatedPatientId?.lastName
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="note" className="mb-0">
                                    Note
                                </Form.Label>
                                <Form.Control
                                    id="note"
                                    as="textarea"
                                    placeholder="Note"
                                    rows={4}
                                    data-has-value={!!watch('note')}
                                    {...register('note')}
                                />
                            </Form.Group>
                        </Col>

                        <Col sm={12}>
                            <div className="mb-1 d-flex flex-column position-relative">
                                <Form.Label className="mb-0">Add Associated Item</Form.Label>
                                <div
                                    onClick={() => logoFileInputRef.current.click()}
                                    className={`custom-file-upload justify-content-between cursor-pointer ${
                                        logoName || profileUploading ? '' : 'custom-form-fields'
                                    }`}
                                    // className="custom-file-upload d-flex justify-content-between cursor-pointer"
                                    style={{ backgroundColor: '#e8f0fe', fontSize: '12px', fontWeight: 600 }}>
                                    {logoName ? logoName : profileUploading ? 'Uploading...' : 'Upload Patient Photo'}
                                    <FiUploadCloud className="ms-auto" />
                                </div>
                                <Form.Control
                                    type="file"
                                    data-has-value={!!watch('associatedItem')}
                                    className="d-none  border-0 fs-6"
                                    {...register('associatedItem', {})}
                                    // accept=".png, .jpg, .jpeg, .svg"
                                    ref={logoFileInputRef}
                                    onChange={handleFileChange}
                                />
                                {errors.associatedItem && (
                                    <span className="text-danger">{errors.associatedItem.message}</span>
                                )}
                            </div>
                        </Col>

                        <Col sm={12} className="d-flex justify-content-end gap-1 mt-2">
                            <Button type="submit" className="custom-buttons">
                                Update Task
                            </Button>
                        </Col>
                    </Row>
                )}
            </Form>
        </div>
    );
};

export default UpdateAsignTask;
