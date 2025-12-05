import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import Spinner from '../../../constants/Spinner';
import { FormInput } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { decryptMessage, encryptMessage } from '../../../cryptoUtils';
import AddRole from './AddRole';
import { getRoleDataAction, getRolesAction, updateRolesAction } from '../../../redux/actions';
import Paginations from '../../../helpers/Paginations';
import { getMastersDataAction } from '../../../redux/settings/action';
import { IoSearchSharp } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { formatDateByUserTimeZone } from '../../../components/timeZonePipe';

const RoleManagement = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const roleData = store?.getRolesDataReducer?.data;
    const roleDataLoading = store?.getRolesDataReducer?.loading;
    const createSuccess = store?.createRolesReducer?.data?.status;
    const updateSuccess = store?.updateRolesReducer?.data?.status;
    const [addDepartmentModal, setAddDepartmentModal] = useState(false);
    const [status, setStatus] = useState(true);
    const [skip, setSkip] = useState(1);
    const clinicId = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';
    const [searchQuery, setSearchQuery] = useState('');
    const [dataToEdit, setDataToEdit] = useState(null);

    useEffect(() => {
        dispatch(
            getRolesAction({
                clinicId: clinicId,
                limit: 10,
                search: searchQuery,
                page: skip,
                status: status,
            })
        );
    }, [dispatch, status, searchQuery, skip]);

    useEffect(() => {
        dispatch(getMastersDataAction({ status: true, category: 'Desigination', limit: 10, skip: skip, search: '' }));
        dispatch(getRoleDataAction({
            clinicId: clinicId,
            limit: 10,
            search: '',
            createdById: '',
            page: '',
            status: true,
        }));
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setSkip(1);
    };

    useEffect(() => {
        if (createSuccess === 200 || updateSuccess === 200) {
            dispatch(
                getRolesAction({
                    clinicId: clinicId,
                    limit: 10,
                    search: searchQuery,
                    page: skip,
                    status: status,
                })
            );
        }
    }, [createSuccess, updateSuccess]);

    const handleStatusChange = (isActive) => {
        setStatus(isActive);
        setSearchQuery('');
    };

    const handleUpdateDoctorStatus = (data) => {
        const payload = {
            id: data?._id,
            status: !data?.status,
        };
        dispatch(updateRolesAction({ key: encryptMessage(payload) }));
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= roleData?.pagination?.totalPages) {
            setSkip(pageNumber);
        }
    };

    return (
        <Row className="mt-2">
            <Col xs={12} className="px-0">
                <Card className="scroll-container page-height">
                    <Card.Body className="">
                        <Row className="mb-2">
                            <Col md={6} sm={6} xs={6}>
                                <Button
                                    variant={status === false ? 'outlined' : ''}
                                    onClick={() => handleStatusChange(true)}
                                    className={`active_inactive_buttons ${status ? 'text-white' : 'bg-white border-primary text-dark'
                                        } me-2 py-1`}>
                                    Active
                                </Button>
                                <Button
                                    variant={status === true ? 'outlined' : ''}
                                    onClick={() => handleStatusChange(false)}
                                    className={`active_inactive_buttons ${!status ? 'text-white' : 'bg-white border-primary text-dark'
                                        } me-2 py-1`}>
                                    Inactive
                                </Button>
                            </Col>
                            <Col md={6} sm={6} xs={6} className="text-end">
                                <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-end">
                                    <Col xs="auto" className="d-flex gap-2">
                                        <div
                                            className="input_search_box position-relative"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                borderRadius: '4px',
                                                backgroundColor: '#e8f0fe',
                                                padding: '0px 5px',
                                                minWidth: 180,
                                            }}>
                                            <FormInput
                                                type="text"
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                                placeholder="Search..."
                                                className="pe-4"
                                                style={{
                                                    border: 'none',
                                                    outline: 'none',
                                                    flex: 1,
                                                    backgroundColor: '#ccc',
                                                    paddingRight: 30,
                                                }}
                                            />
                                            {searchQuery ? (
                                                <IoMdClose
                                                    style={{
                                                        fontSize: '1.2rem',
                                                        color: 'lightgray',
                                                        position: 'absolute',
                                                        right: 10,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                    }}
                                                />
                                            ) : (
                                                <IoSearchSharp
                                                    style={{
                                                        fontSize: '1.2rem',
                                                        color: 'lightgray',
                                                        position: 'absolute',
                                                        right: 10,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <Button
                                            onClick={() => setAddDepartmentModal(true)}
                                            className="custom-buttons d-none d-md-block py-1">
                                            Add User
                                        </Button>
                                        <Button
                                            onClick={() => setAddDepartmentModal(true)}
                                            className="custom-buttons d-md-none py-1">
                                            +
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table
                                    responsive
                                    className="table-centered table-nowrap mb-0  rounded"
                                    style={{ height: roleData?.length === 0 ? '40vh' : 'auto' }}>
                                    <thead className="text-white">
                                        <tr>
                                            {['Sr. No.', 'Name', 'Phone', 'Username', 'Joining Date', 'Status', 'Action']?.map((header, idx) => (
                                                <th key={idx} className="text-white" style={{ fontSize: '13px' }}>
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roleDataLoading ? (
                                            <tr>
                                                <td colSpan={8} className="text-center">
                                                    <Spinner />
                                                </td>
                                            </tr>
                                        ) : Array.isArray(roleData?.users) && roleData?.users.length > 0 ? (
                                            roleData?.users.map((data, index) => (
                                                <tr key={index} className="border-bottom">
                                                    <td style={{ fontSize: '13px', fontWeight: '400' }}>{index + 1}</td>
                                                    <td
                                                        className="text-capitalize"
                                                        style={{ fontSize: '13px', fontWeight: '400' }}>
                                                        {data?.name?.text || 'N/A'}
                                                    </td>
                                                    <td className="" style={{ fontSize: '13px', fontWeight: '400' }}>
                                                        {(() => {
                                                            const workPhone = data?.telecom?.find(
                                                                (item) =>
                                                                    item?.system === 'phone' && item?.use === 'work'
                                                            )?.value;
                                                            return workPhone ? `+1${workPhone}` : 'N/A';
                                                        })()}
                                                    </td>
                                                    <td className=" " style={{ fontSize: '13px', fontWeight: '400' }}>
                                                        {data?.email}
                                                    </td>
                                                    <td className=" " style={{ fontSize: '13px', fontWeight: '400' }}>
                                                        {data?.joiningDate
                                                            ? formatDateByUserTimeZone(data.joiningDate, {}, 'date')
                                                            : '-'}
                                                    </td>
                                                    <td className=" " style={{ fontSize: '13px', fontWeight: '400' }}>
                                                        <Form.Switch
                                                            className={data?.status === true ? 'custom-active' : ''}
                                                            onClick={() => handleUpdateDoctorStatus(data)}
                                                            checked={data?.status === true}
                                                        />
                                                    </td>
                                                    <td className=" " style={{ fontSize: '13px', fontWeight: '400' }}>
                                                        <div className="d-flex gap-2">
                                                            <i
                                                                className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-secondary"
                                                                onClick={() => {
                                                                    setDataToEdit(data);
                                                                    setAddDepartmentModal(true);
                                                                }}></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="text-center">
                                                    <h3 className="my-5">No Data Found</h3>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mt-2 d-flex justify-content-end">
                                <Paginations
                                    currentPage={skip}
                                    totalPages={roleData?.pagination?.totalPages || 1}
                                    onPageChange={handlePageChange}
                                />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            <AddRole
                dataToEdit={dataToEdit}
                setDataToEdit={setDataToEdit}
                show={addDepartmentModal}
                setAddDepartmentModal={setAddDepartmentModal}
            />
        </Row>
    );
};

export default RoleManagement;
