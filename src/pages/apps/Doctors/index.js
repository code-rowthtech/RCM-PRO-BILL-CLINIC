import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormInput } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { createDoctorDetailAction, getDoctorsAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import Spinner from '../../../constants/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { IoSearchSharp } from 'react-icons/io5';
import { Info } from 'lucide-react';
import profileDummy from '../../../assets/images/profileDummy.png';
import Paginations from '../../../helpers/Paginations';
import { IoMdClose } from 'react-icons/io';

const Doctors = () => {
    const [statusModal, setStatusModal] = useState(false); // Modal to confirm status change
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const store = useSelector((state) => state);
    const [status, setStatus] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate('');
    const [skip, setSkip] = useState(1);
    const dispatch = useDispatch();
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const updateStatus = store?.createtDoctorsDetailReducer?.data?.status || [];
    useEffect(() => {
        dispatch(getDoctorsAction({ status: status, search: search, page: skip, limit: 10 }));
    }, [dispatch, skip, status, search]);

    const closeStatusModal = () => setStatusModal(false); // Close status change modal
    const filteredDoctors = doctorDetails;
    const handleStatusChange = () => {
        const payload = {
            doctorId: selectedDoctor?._id,
            status: !selectedDoctor?.status,
        };
        dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
        closeStatusModal();
    };
    useEffect(() => {
        if (updateStatus === 200) {
            const payload = { status: status, search: search, page: skip, limit: 10 };
            dispatch(getDoctorsAction(payload));
        }
    }, [updateStatus]);

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    const handleActiveTab = (isActive) => {
        setStatus(isActive);
        dispatch(getDoctorsAction({ status: isActive, search: search, page: skip, limit: 10 }));
    };

    return (
        <>
            <Row className="mt-2">
                <Col xs={12} className="px-0">
                    <Card className="scroll-container" style={{ height: '90vh', overflow: 'scroll' }}>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col sm={6} xs={6}>
                                    <Button
                                        onClick={() => handleActiveTab(true)}
                                        className={`me-md-2 position-relative active_inactive_buttons ${status ? ' text-white py-' : 'bg-white border-primary text-dark py-'
                                            }`}>
                                        Active
                                        <span className={`fw-semibold p-1 fs-6 position-absolute fs-5 text-white  rounded-circle bg-primary`} style={{ right: '-14%', top: '-34%' }}>{store?.getDoctorsReducer?.data?.activeDoctors}</span>
                                    </Button>
                                    <Button
                                        onClick={() => handleActiveTab(false)}
                                        className={`me-md-2 position-relative ms-sm-1 active_inactive_buttons text-nowrap ${!status ? ' text-white py-' : 'bg-white border-primary text-dark py-'
                                            }`}>
                                        Inactive
                                        <span className={`fw-semibold p-1 fs-6 position-absolute fs-5 text-white  rounded-circle bg-primary `} style={{ right: '-14%', top: '-34%' }}>{store?.getDoctorsReducer?.data?.inactiveDoctors}</span>
                                    </Button>
                                </Col>

                                <Col sm={6} xs={6} className="text-end">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-end ">
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
                                                    value={search}
                                                    placeholder="Search..."
                                                    onChange={(e) => {
                                                        const currentValue = e.target.value;
                                                        setSearch(currentValue);
                                                        dispatch(
                                                            getDoctorsAction({
                                                                search: currentValue,
                                                                page: 1,
                                                                limit: 10,
                                                                status: true,
                                                            })
                                                        );
                                                    }}
                                                    className="pe-4"
                                                    style={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        flex: 1,
                                                        backgroundColor: '#ccc',
                                                        paddingRight: 30,
                                                    }}
                                                />
                                                {search ? (
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
                                                            setSearch('');
                                                            dispatch(
                                                                getDoctorsAction({
                                                                    search: '',
                                                                    page: 1,
                                                                    limit: 10,
                                                                    status: true,
                                                                })
                                                            );
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
                                                onClick={() => navigate(`/apps/providers/new-doctor`)}
                                                className="custom-buttons py- d-none d-md-block">
                                                Add Provider
                                            </Button>

                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12}>
                                    <Table
                                        responsive
                                        className="table-centered table-nowrap mb-0  rounded"
                                        style={{ height: filteredDoctors?.length === 0 ? '75vh' : 'auto' }}>
                                        <thead className="text-white">
                                            <tr>
                                                {/* <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                                    S.No.
                                                </th> */}
                                                <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                                    Provider
                                                </th>
                                                <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                                    Primary Address
                                                </th>
                                                <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                                    Primary Email
                                                </th>

                                                <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                                    Speciality
                                                </th>
                                                {/* <th className='text-white py-2' style={{ fontSize: '13px' }}>Contact No.</th> */}
                                                <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                                    Status
                                                </th>
                                                <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        {store?.getDoctorsReducer?.loading ? (
                                            <tbody>
                                                <tr>
                                                    <td className="text-center" colSpan={7}>
                                                        <Spinner className=" my-3 " />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ) : (
                                            <tbody>
                                                {filteredDoctors?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={7} className="text-center">
                                                            <h5 className="my-3 fw-bolder">
                                                                No Data Found for{' '}
                                                                {status === true ? 'Active' : 'Inactive'}
                                                            </h5>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredDoctors?.map((data, index) => (
                                                        <tr key={index}>
                                                            {/* <td
                                                                className="py1"
                                                                style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                {index + 1}
                                                            </td> */}
                                                            <td
                                                                className="text-capitalize py-1"
                                                                style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                <div
                                                                    onClick={() => {
                                                                        navigate(
                                                                            `/apps/providers/new-doctor?id=${data?._id}`
                                                                        );
                                                                    }}>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <img
                                                                            src={data?.photo?.[0]?.url || profileDummy}
                                                                            alt="User Dummy"
                                                                            className="rounded-circle"
                                                                            style={{
                                                                                width: '40px',
                                                                                height: '40px',
                                                                                objectFit: 'cover',
                                                                            }}
                                                                        />
                                                                        <span>
                                                                            <div className="fw-semibold">
                                                                                {(data?.name?.[0]?.prefix?.[0]
                                                                                    ? data?.name?.[0]?.prefix?.[0] + ' '
                                                                                    : '') +
                                                                                    (data?.name?.[0]?.family || '') +
                                                                                    (data?.name?.[0]?.given?.length > 0
                                                                                        ? ' ' + data?.name?.[0]?.given?.join(' ')
                                                                                        : '') || 'N/A'}
                                                                            </div>
                                                                            <div className="fs-6 fw-semibold">
                                                                                {data?.telecom?.[0]?.value
                                                                                    ? '+1-' + data?.telecom?.[0]?.value
                                                                                    : 'N/A'}
                                                                            </div>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td
                                                                className="py-1"
                                                                style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                <div
                                                                    onClick={() => {
                                                                        navigate(
                                                                            `/apps/providers/new-doctor?id=${data?._id}`
                                                                        );
                                                                    }}>
                                                                    <div className="d-flex flex-column justify-content-center">
                                                                        <p className="mb-0">
                                                                            {data?.address?.[0]?.line &&
                                                                                data?.address?.[0]?.line.length > 0 &&
                                                                                data?.address?.[0]?.line[0] !== '' ? (
                                                                                <span
                                                                                    title={data?.address?.[0]?.line.join(
                                                                                        ''
                                                                                    )} // Full address in the tooltip
                                                                                >
                                                                                    {data?.address?.[0]?.line
                                                                                        .join('')
                                                                                        .slice(0, 46)}
                                                                                    ...
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-danger">
                                                                                    Missing
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                        <p className="mb-0 fw-semibold fs-6">
                                                                            <span>
                                                                                {data?.address?.[0]?.state ? (
                                                                                    data?.address?.[0]?.state
                                                                                ) : (
                                                                                    <span className="text-danger">
                                                                                        Missing
                                                                                    </span>
                                                                                )}{' '}
                                                                                |{' '}
                                                                                {data?.address?.[0]?.city ? (
                                                                                    data?.address?.[0]?.city
                                                                                ) : (
                                                                                    <span className="text-danger">
                                                                                        Missing
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td
                                                                className="py-1"
                                                                onClick={() => {
                                                                    navigate(
                                                                        `/apps/providers/new-doctor?id=${data?._id}`
                                                                    );
                                                                }}
                                                                style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                {data?.userId?.email || 'N/A'}
                                                            </td>

                                                            <td
                                                                className="py-1"
                                                                onClick={() => {
                                                                    navigate(
                                                                        `/apps/providers/new-doctor?id=${data?._id}`
                                                                    );
                                                                }}
                                                                style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                {data?.specialties?.[0] || 'N/A'}

                                                                {data?.specialities?.length > 1 && (
                                                                    <OverlayTrigger
                                                                        placement="top"
                                                                        overlay={
                                                                            <Tooltip id={`tooltip-${data?._id}`}>
                                                                                <ul className="m-0 p-0">
                                                                                    {/* {data?.specialities?.slice(0).map((specialty, index) => (
                                                                                        <li key={index} style={{ listStyleType: "disc", marginLeft: "10px" }}>
                                                                                            {specialty}
                                                                                        </li>
                                                                                    ))} */}
                                                                                    <li>{data?.specialties[0]}</li>
                                                                                </ul>
                                                                            </Tooltip>
                                                                        }>
                                                                        <span className="ms-2 cursor-pointer">
                                                                            <Info size={18} className="text-primary" />
                                                                        </span>
                                                                    </OverlayTrigger>
                                                                )}
                                                            </td>

                                                            {/* <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                {data?.telecom?.[0]?.value || 'N/A'}
                                                            </td> */}
                                                            <td
                                                                className="py-1 "
                                                                style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                <Form.Switch
                                                                    className={
                                                                        data?.userId?.status ? 'custom-active' : ''
                                                                    }
                                                                    checked={data?.userId?.status}
                                                                    onChange={() => {
                                                                        setSelectedDoctor(data);
                                                                        setStatusModal(true);
                                                                    }}
                                                                />
                                                            </td>
                                                            <td
                                                                className="py-1 "
                                                                style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                <div className="d-flex gap-2">
                                                                    <Link
                                                                        to={`/apps/providers/new-doctor?id=${data?._id}`}
                                                                        className="text-black cursor-pointer ps-2">
                                                                        <i className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-secondary"></i>
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        )}
                                    </Table>
                                </Col>
                                <Col className="mt-2 d-flex justify-content-end">
                                    <Paginations
                                        currentPage={skip}
                                        totalPages={store?.getDoctorsReducer?.data?.pagination?.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Status Change Modal */}
            <Modal show={statusModal} onHide={closeStatusModal} centered size="md">
                <Modal.Body>
                    <div>
                        <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                            <Col sm={1}></Col>
                            <Col sm={10}>
                                <h4 className="mb-0  d-flex align-items-center justify-content-center">
                                    <span className={`${selectedDoctor?.status ? 'text-danger' : 'text-success'}`}>
                                        {selectedDoctor?.status ? 'Deactivate' : 'Activate'} Doctor
                                    </span>
                                </h4>
                            </Col>
                            <Col sm={1}>
                                <RxCross2 className="fs-4 cursor-pointer" onClick={closeStatusModal} />
                            </Col>
                        </Row>
                        <Row className="">
                            {selectedDoctor?.status ? (
                                <Col sm={12}>
                                    <p className=" my-3">
                                        Once deactivated, the doctor will lose access to their account and services.
                                    </p>
                                </Col>
                            ) : (
                                <Col>
                                    <p className=" my-3">
                                        After activation, the doctor will regain full access to their account and
                                        services.
                                    </p>
                                </Col>
                            )}
                        </Row>
                        <Modal.Footer className="d-flex justify-content-end gap-2">
                            <Button className="custom-buttons" onClick={closeStatusModal}>
                                Cancel
                            </Button>
                            <Button className="custom-buttons" onClick={handleStatusChange}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Doctors;
