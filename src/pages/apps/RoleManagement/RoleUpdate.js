import React, { useEffect, useState } from 'react';
import { Button, Modal, InputGroup, Form, Row, Col, Spinner } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { getRoleDataAction, getRolesAction, stateEmptydAction, updateRolesAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartmentDataAction, getMastersDataAction } from '../../../redux/settings/action';
import us from '../../../assets/images/flags/us.jpg'
import { useSearchParams } from 'react-router-dom';

const RoleUpdate = ({ show, currentUser, setCurrentUser, setAddDepartmentModal, setUpdateDepartmentModal }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const decryptedRolesData = store?.getRoleDataReducer?.data?.roles;
    const createLoading = store?.updateRolesReducer?.loading;
    const createSuccess = store?.updateRolesReducer?.data?.status;
    const tableGetData = store?.getMastersDataReducer?.data?.result;
    const departmentGetData = store?.getDepartmentDataReducer?.data?.result;
    const tableGetDataLoading = store?.getMastersDataReducer?.data?.loading;
    const departmentGetDataLoading = store?.getDepartmentDataReducer?.data?.loading;

    const roleData = store?.getRoleDataReducer?.data?.roles;
    const reportingTo = store?.getRolesDataReducer?.data

    const roleDataLoading = store?.getRolesDataReducer?.loading;
    const [showPassword, setShowPassword] = useState(false);
    const { register, reset, setValue, watch, handleSubmit, formState: { errors }, getValues } = useForm();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const close = () => {
        setAddDepartmentModal(false);
        setCurrentUser(null);
        setUpdateDepartmentModal(false);
    };

    // useEffect(() => {
    //     dispatch(getMastersDataAction({ status: true, category: 'Desigination', limit: 10, skip: 1, search: '' }));
    // }, [dispatch]);

    useEffect(() => {
        if (show && currentUser) {
            // dispatch(getRoleDataAction({ clinicId: clinicId, limit: 10, createdById: '', search: '', page: 1, status: true }));
            // dispatch(getRolesAction({ clinicId: clinicId, limit: 10, search: '', page: 1, status: true }));

            reset({
                name: currentUser.firstName,
                email: currentUser.email,
                password: currentUser.password,
                contact: currentUser.phone,
                phNumberSecondary: currentUser.phNumberSecondary,
                joiningDate: currentUser.joiningDate,
                leavingDate: currentUser.leavingDate,
                designation: currentUser.designation,
                department: currentUser.department,
            });
        }
        // dispatch(getDepartmentDataAction({ status: true, category: 'Department', search: '', skip: '', limit: '' }));
    }, [getRolesAction, show, currentUser, reset]);

    useEffect(() => {
        if (createSuccess === 200) {
            // dispatch(stateEmptydAction());
            // dispatch(getRolesAction({ clinicId: clinicId, limit: 10, search: '', page: 1, status: true }));
            close();
            reset();
            getValues('');
            setLeavingDate('')
            setCurrentUser('');
        }
    }, [createSuccess]);
    const [leavingDate, setLeavingDate] = useState("");
    const [leavingSelectedDate, setLeavingSelectedDate] = useState("");


    const onSubmit = (data) => {
        const formattedJoiningDate = new Date(data.joiningDate).toISOString();
        const payload = {
            id: currentUser?._id,
            firstName: data.name,
            password: data.password,
            phone: data?.contact,
            clinicId: clinicId,
            reportingTo: data?.reportingTo,
            joiningDate: formattedJoiningDate,
            leavingDate: leavingSelectedDate,
            role: data.role,
            phNumberSecondary: data.contact,
            designation: data?.designation,
            department: data.department,
        };

        dispatch(updateRolesAction({ key: encryptMessage(payload) }));
        getValues('');
        reset();
    };
    useEffect(() => {
        if (currentUser) {
            setValue('designation', currentUser?.designation);
            setValue('department', currentUser?.department);
            setValue('role', currentUser?.role);
            const formattedDate = new Date(currentUser.joiningDate).toISOString().split('T')[0];
            setValue('joiningDate', formattedDate);


        }
    }, [currentUser?.designation, setValue]); // `setValue` comes from `useForm`
    const leaving = watch('leavingDate')

    const joiningDate = watch('joiningDate')
    const desigination = watch('designation')
    const department = watch('department')
    const role = watch('role')
    const reporting = watch('reportingTo')


    const handleDateChange = (e) => {
        const selectedDate = e.target.value; // Get selected date
        if (selectedDate) {
            const leavingDateWithTime = new Date(selectedDate);
            leavingDateWithTime.setUTCHours(23, 59, 59, 0); // Set time to 23:59:59 UTC

            const formattedDate = leavingDateWithTime.toISOString(); // Convert to ISO string
            setLeavingDate(selectedDate);
            setLeavingSelectedDate(formattedDate);
            setValue("leavingDate", formattedDate); // Update React Hook Form
        }
    };
    return (
        <>
            <Modal centered show={show} size="lg" onHide={close}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={11}>
                            <h4 className="mb-0 ms-lg-5 text-center">
                                Edit User Details
                            </h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={close} />
                        </Col>
                    </Row>
                    {/* Form with handleSubmit to trigger onSubmit */}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        {...register('name', {
                                            required: 'Name is required',
                                            pattern: {
                                                value: /^(?! )[A-Za-z0-9 ]*$/,
                                                message: 'Special characters and leading spaces are not allowed',
                                            },
                                        })}
                                    />
                                    {errors.name && <span className="text-danger fs-6">{errors.name.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">Email ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Invalid email format',
                                            },
                                        })}
                                    />
                                    {errors.email && <span className="text-danger fs-6">{errors.email.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-0 position-relative">
                                    <Form.Label className="mb-0">Contact No.</Form.Label>
                                    <InputGroup>
                                        {/* Country Code Prefix */}
                                        <InputGroup.Text className="ps-4   pe-1 fw-bold text-black">
                                            +1
                                        </InputGroup.Text>

                                        {/* Contact Input */}
                                        <Form.Control
                                            type="tel"
                                            {...register("contact", !id ? {
                                                required: "Contact number is required",
                                                pattern: {
                                                    value: /^[0-9]*$/,
                                                    message: "Contact must be numeric only",
                                                },
                                                maxLength: {
                                                    value: 10,
                                                    message: "Contact must not exceed 10 digits",
                                                },
                                                minLength: {
                                                    value: 10,
                                                    message: "Contact must not be less than 10 digits",
                                                },
                                                validate: {
                                                    noEmpty: (value) => value.trim() !== "" || "Contact cannot be empty or only spaces",
                                                    noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                                                },
                                            } : {})}
                                            placeholder="1234567890"
                                            maxLength={10}
                                            onInput={(e) => {
                                                const value = e.target.value;
                                                e.target.value = value.replace(/\s/g, ""); // Remove spaces
                                            }}
                                        />
                                    </InputGroup>

                                    {/* Validation Error Message */}
                                    {errors.contact && (
                                        <span className="text-danger fs-6">{errors.contact.message}</span>
                                    )}

                                    {/* Country Code Flag */}
                                    <div
                                        className="position-absolute "
                                        style={{
                                            top: "50%",
                                            left: "2%",
                                        }}
                                    >
                                        <img src={us} alt="country code flag" width={20} />
                                    </div>
                                </Form.Group>
                            </Col>


                            <Col sm={6}>
                                <Form.Group className="mb-0 position-relative">
                                    <Form.Label className="mb-0">Contact Number Secondary</Form.Label>
                                    <Form.Group>
                                        <InputGroup>
                                            <InputGroup.Text className="ps-3 pe-1 fw-bold text-black">
                                                &nbsp;&nbsp;+1
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="tel"
                                                {...register('phNumberSecondary', !id
                                                    ? {
                                                        required: ' Contact secondary is required',
                                                        pattern: {
                                                            value: /^[0-9]*$/,
                                                            message: 'Contact Number Secondary must be a number',
                                                        },
                                                        maxLength: {
                                                            value: 10,
                                                            message: 'Contact Number Secondary must not exceed 10 digits',
                                                        },
                                                        minLength: {
                                                            value: 10,
                                                            message: 'Contact Number Secondary must not be less than 10 digits',
                                                        },
                                                        validate: {
                                                            noEmpty: (value) => value.trim() !== '' || 'Phone number cannot be empty or only spaces',
                                                            noSpacesBeforeText: (value) =>
                                                                !/^\s/.test(value) || 'First character cannot be a space',
                                                        },
                                                    }
                                                    : {}
                                                )}
                                                placeholder="1234-234-234"
                                                maxLength={10}
                                                onInput={(e) => {
                                                    const value = e.target.value;
                                                    e.target.value = value.replace(/\s/g, ''); // Remove all spaces
                                                }}
                                            />
                                        </InputGroup>
                                        <div className="position-relative" style={{ height: '20px' }}>
                                            {errors.phNumberSecondary && (
                                                <span className="text-danger fs-6">{errors.phNumberSecondary.message}</span>
                                            )}
                                        </div>
                                    </Form.Group>
                                    <div
                                        className="position-absolute"
                                        style={{ top: '36%', left: '1%' }}
                                    >
                                        <img src={us} alt="country code flag" width={20} />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">Date of Joining</Form.Label>
                                    <Form.Control
                                        type="date"
                                        defaultValue={currentUser?.joiningDate ? new Date(currentUser.joiningDate).toISOString().split('T')[0] : ''}
                                        {...register('joiningDate', { required: 'Joining date is required' })}
                                        className={joiningDate ? 'text-dark border border-secondary' : 'custom-date-input border border-secondary'}

                                    />
                                    {errors.joiningDate && <span className="text-danger fs-6">{errors.joiningDate.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">Date of Leaving</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={leavingDate} // Bind state to display selected date
                                        {...register("leavingDate", { required: "Leaving date is required" })}
                                        className={`text-dark border border-secondary ${leavingDate ? 'custom-date-input-select' : 'custom-date-input'}`}
                                        onChange={handleDateChange} // Handle date change
                                    />
                                    {errors.leavingDate && <span className="text-danger fs-6">{errors.leavingDate.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">Designation</Form.Label>
                                    <Form.Select
                                        {...register('designation', { required: 'Designation is required' })}
                                        className={`text-dark border border-secondary ${desigination ? ' custom-date-input-select' : 'custom-date-input'}`}

                                    >
                                        {tableGetDataLoading ? (
                                            <option>Loading...</option>
                                        ) : tableGetData && tableGetData.length > 0 ? (
                                            tableGetData.map((data) => (
                                                <option key={data._id} value={data.name} className='text-dark'>
                                                    {data.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option>No Designation Available</option>
                                        )}
                                    </Form.Select>
                                    {errors.designation && <span className="text-danger fs-6">{errors.designation.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">Department</Form.Label>
                                    <Form.Select
                                        {...register('department', { required: 'Department is required' })}
                                        className={`text-dark border border-secondary ${department ? ' custom-date-input-select' : 'custom-date-input'}`}

                                    >
                                        {departmentGetDataLoading ? (
                                            <button class="btn" type="button" disabled>
                                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Loading...
                                            </button>
                                        ) : departmentGetData && departmentGetData.length > 0 ? (
                                            departmentGetData?.map((data) => (
                                                <option key={data._id} className={department ? 'text-dark border border-secondary' : 'custom-date-input border border-secondary'}
                                                    value={data.name}>
                                                    {data?.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option>No Department Available</option>
                                        )}
                                    </Form.Select>
                                    {errors.department && <span className="text-danger fs-6">{errors.department.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">Role</Form.Label>
                                    <Form.Select
                                        {...register('role', { required: 'Role is required' })}
                                        className={`text-dark border border-secondary ${role ? ' custom-date-input-select' : 'custom-date-input'}`}

                                    >
                                        {roleDataLoading ? (
                                            <option>Loading...</option>
                                        ) : roleData && roleData.length > 0 ? (
                                            roleData?.map((role) => (
                                                <option key={role._id} value={role?._id}>
                                                    {role.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option>No Role Available</option>
                                        )}
                                    </Form.Select>
                                    {errors.role && <span className="text-danger fs-6">{errors.role.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">Reporting</Form.Label>
                                    <Form.Select
                                        {...register('reportingTo')}
                                        className={`text-dark border border-secondary ${reporting ? ' custom-date-input-select' : 'custom-date-input'}`}

                                        defaultValue={currentUser?.reportingTo}
                                    >
                                        <option value="">Select Reporting</option>
                                        {roleDataLoading ? (
                                            <option disabled>Loading...</option>
                                        ) : Array.isArray(reportingTo?.users) && reportingTo?.users.length > 0 ? (
                                            reportingTo?.users.map((data) => (
                                                <option key={data?._id} value={data?._id}>
                                                    {data?.firstName}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No Reporting</option>
                                        )}
                                    </Form.Select>

                                </Form.Group>
                            </Col>


                        </Row>
                        <Modal.Footer className="border-0 py-0">
                            <Button type="button" className="custom-buttons" onClick={close}>
                                Cancel
                            </Button>


                            <Button type="submit" variant="primary" className="ms-2" disabled={createLoading}>
                                {createLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />

                                    </>
                                ) : (
                                    'Update'
                                )}
                            </Button>

                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default RoleUpdate;
