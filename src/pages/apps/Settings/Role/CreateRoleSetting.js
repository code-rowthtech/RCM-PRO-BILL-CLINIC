import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../../cryptoUtils';
import Multiselect from "multiselect-react-dropdown";
import { IoMdClose } from 'react-icons/io';
import Spinner from '../../../../constants/Spinner';
import { handleFirstSpace } from '../../../../helpers/noSpace';
import { getPermissionAction } from '../../../../redux/actions';
import { createRoleDataAction, getRoleDataAction } from '../../../../redux/settings/rolesetting/action';


const CreateRoleSetting = ({ show, closeModal }) => {
    const dispatch = useDispatch();
    const idFromStorage = JSON.parse(sessionStorage.getItem('hyper_user'));
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
    const [permissionError, setPermissionError] = useState(false)
    const store = useSelector((state) => state);
    const createSuccess = store?.createRoleDataReducer?.data?.status;
    const decryptedPermissionsData = store?.getPermissionsDataReducer?.data?.data?.map((item) => ({
        ...item,
        name: `${item?.permission}`,
    }));
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    useEffect(() => {
        if (show) {
            const permissions = {
                interface: 'Clinic',
                module: '',
                skip: '',
                limit: 50,
                search: '',
                status: true,
            }
            dispatch(getPermissionAction(permissions))
        }
    }, [show])

    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    const onSubmit = (data) => {
        if (selectedPermissionIds?.length === 0) {
            setPermissionError(true);
        } else {
            const payload = {
                name: data.name,
                description: data.description,
                permissions: selectedPermissionIds,
                // clinicId: clinicId,
                // createdById: idFromStorage?._id,
                // showto: 'clinic'
            }
            if (createSuccess === 200) {
                reset();
                closeModal();
            }
            dispatch(createRoleDataAction({ key: `${encryptMessage(payload)}` }));
            dispatch(getRoleDataAction({ clinicId: clinicId, limit: 10, search: '', createdById: '', page: 1, status: true }));
        }
    };

    const handleSelect = (selectedList) => {
        const selectedIds = selectedList.map((item) => item._id);
        setSelectedPermissionIds(selectedIds);
    };

    const handleRemove = (selectedList) => {
        const selectedIds = selectedList.map((item) => item._id);
        setSelectedPermissionIds(selectedIds);
    };
    useEffect(() => {
        if (createSuccess === 200) {
            reset();
            closeModal();
        }
    }, [createSuccess])
    return (
        <Modal centered show={show} >
            {/* <Modal.Header
                onHide={closeModal}
                closeButton
                className={'modal-colored-header pb-0 border-0 text-center'}>
            </Modal.Header> */}
            <Modal.Body>
                <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                    <Col sm={1}></Col>
                    <Col sm={10}>
                        <h4 className="mb-0 text-center">Add Role</h4>
                    </Col>
                    {/* <Col sm={1}>
                        <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                    </Col> */}
                </Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Name <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter role name"
                                    onKeyPress={(event) => handleFirstSpace(event, 12)}
                                    {...register('name', { required: 'Name is required' })}
                                />
                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Description <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter role description"
                                    onKeyPress={(event) => handleFirstSpace(event, 300)}
                                    {...register('description', { required: 'Description is required' })}
                                />
                                {errors.description && <span className="text-danger">{errors.description.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Permissions <span className='text-danger'>*</span></Form.Label>

                                <Multiselect
                                    options={decryptedPermissionsData}
                                    displayValue="name"
                                    className="form-control p-0 custom-multiselect"
                                    placeholder="Select Permissions"
                                    onSelect={handleSelect}
                                    onRemove={handleRemove}
                                />

                                {permissionError ?
                                    <span className='text-danger'>
                                        Atleast one permission has to be selected
                                    </span> :
                                    ''
                                }
                            </Form.Group>
                        </Col>

                    </Row>
                    <Modal.Footer>
                        <Button onClick={closeModal} className="custom-buttons">Close</Button>
                        <Button type='submit' disabled={store?.createRoleDataReducer?.loading} className='custom-buttons'>
                            {store?.createRoleDataReducer?.loading ?
                                <Spinner color='white' className="spinner-border-sm" />
                                :
                                'Create role'
                            }
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateRoleSetting;
