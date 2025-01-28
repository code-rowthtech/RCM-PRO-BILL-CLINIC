import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { FormInput } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit, FiTrash } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { createDoctorAction, createDoctorDetailAction, getDoctorsAction, stateEmptydAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import Spinner from '../../../constants/Spinner';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";


const Doctors = () => {
    const [detailsModal, setDetailsModal] = useState(false);
    const [statusModal, setStatusModal] = useState(false);  // Modal to confirm status change
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [status, setStatus] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate('');

    const dispatch = useDispatch();

    useEffect(() => {
        const payload = { status: status, search: search }
        dispatch(
            getDoctorsAction({ key: encryptMessage(payload) })

        );
    }, [dispatch, status, search]);
    const store = useSelector((state) => state);
    const doctorDetails = useSelector((state) => state?.getDoctorsReducer?.data?.response) || [];
    const updateStatus = useSelector((state) => state?.createtDoctorsDetailReducer?.data?.status) || [];
    const closeStatusModal = () => setStatusModal(false);  // Close status change modal
    const filteredDoctors = doctorDetails.filter((doctor) =>
        doctor.userDetails?.status === status &&
        doctor.userDetails?.firstName.toLowerCase().includes(search.toLowerCase())
    );
    console.log({ filteredDoctors })

    const handleStatusChange = () => {
        const payload = {
            id: selectedDoctor?._id,
            status: !selectedDoctor?.userDetails?.status,
        }
        dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
        closeStatusModal();
        dispatch(stateEmptydAction());
    };

    useEffect(() => {
        const payload = {
            id: selectedDoctor?.userId,
            status: status,
        }
        if (updateStatus === 200) {
            dispatch(
                getDoctorsAction({ key: encryptMessage(payload) })
            );
        }
    }, [updateStatus]);
    const handleNewDoctor =()=>{
        navigate("/apps/doctors/new-doctor")
    }

    return (
        <>
            <Row className='mt-2'>
                <Col xs={12} className='px-0'>
                    <Card className=" scroll-container" style={{ height: '82vh', overflow: 'scroll' }}>
                        <Card.Body >
                            <Row className="mb-2">
                                <Col sm={6} xs={6}>
                                    <Button
                                        onClick={() => setStatus(true)}
                                        className={`me-md-2 active_inactive_buttons ${status ? ' text-white py-' : 'bg-white border-primary text-dark py-'}`}
                                    >
                                        Active
                                    </Button>
                                    <Button
                                        onClick={() => setStatus(false)}
                                        className={`me-md-2 ms-sm-1 active_inactive_buttons ${!status ? ' text-white py-' : 'bg-white border-primary text-dark py-'}`}
                                    >
                                        Inactive
                                    </Button>
                                </Col>

                                <Col sm={6} xs={6} className='text-end'>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-end ">
                                        <Col xs="auto" className='d-flex gap-2'>

                                            <div
                                                className="input_search_box"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "4px",
                                                    backgroundColor: "#d9ddd6 ",
                                                    padding: "0px 5px",
                                                }}
                                            >
                                                <IoSearchSharp
                                                    style={{
                                                        fontSize: "1.2rem",
                                                        color: "black",
                                                        marginRight: "10px",
                                                    }}
                                                />
                                                <FormInput
                                                    type="text"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    className="input_search_box"
                                                    style={{
                                                        border: "none",
                                                        outline: "none",
                                                        flex: 1,
                                                        backgroundColor: "#ccc",

                                                    }}
                                                />
                                            </div>
                                            <Button onClick={handleNewDoctor} className="custom-buttons py- d-none d-md-block" >
                                                New Doctor
                                            </Button>
                                            <Button onClick={handleNewDoctor} className="custom-buttons py d-block d-md-none">
                                                +
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0  rounded"
                                        style={{ height: filteredDoctors?.length === 0 ? '100vh' : 'auto' }}>
                                        <thead className="text-white">
                                            <tr>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>S.No.</th>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>Doctor Name</th>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>Specialist</th>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>Department Name</th>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>Status</th>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>Action</th>
                                            </tr>
                                        </thead>
                                        {store?.getDoctorsReducer?.loading ? (
                                            <tr>
                                                <td className='text-center' colSpan={6}>
                                                    <Spinner className=" my-5 " />
                                                </td>
                                            </tr>
                                        ) : (
                                            <tbody>
                                                {filteredDoctors.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className='text-center'>
                                                            <h3 className='my-5'>No Data Found  for {status === true ? 'Active' : 'Inactive'}</h3>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredDoctors.map((data, index) => (
                                                        <tr key={index}>
                                                            <td className='py1' style={{ fontSize: '13px', fontWeight: '400' }}>{index + 1}</td>
                                                            <td className='text-capitalize py-1' style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                {data?.userDetails?.firstName} {data?.userDetails?.lastName}
                                                            </td>
                                                            <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>{data?.departmentDetails?.specialist || 'N/A'}</td>
                                                            <td className='text-uppercase py-1' style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                {data?.departmentDetails?.name || 'N/A'}
                                                            </td>
                                                            <td className='py-1 ' style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                <Form.Switch
                                                                    checked={data?.userDetails?.status}
                                                                    onChange={() => {
                                                                        setSelectedDoctor(data);
                                                                        setStatusModal(true);
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className='py-1 ' style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                <div className='d-flex gap-2'>
                                                                    <Link to={`/apps/doctors/new-doctor?id=${data?.userId}`} className='text-black cursor-pointer ps-2'>
                                                                        <FiEdit className="fs-4 cursor-pointer" />
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
                                    <span className={`${selectedDoctor?.userDetails?.status ? 'text-danger' : 'text-success'}`}>{selectedDoctor?.userDetails?.status ? 'Deactivate' : 'Activate'} Doctor</span>
                                </h4>
                            </Col>
                            <Col sm={1}>
                                <RxCross2 className="fs-4 cursor-pointer" onClick={closeStatusModal} />
                            </Col>
                        </Row>
                        <Row className="">
                            {selectedDoctor?.status ? (
                                <Col sm={12}>
                                    <p className=' my-3'>
                                        Once deactivated, the doctor will lose access to their account and services.
                                    </p>
                                </Col>
                            ) : (
                                <Col>
                                    <p className=' my-3'>
                                        After activation, the doctor will regain full access to their account and services.
                                    </p>
                                </Col>
                            )}
                        </Row>
                        <Modal.Footer className="d-flex justify-content-end gap-2">
                            <Button className="custom-buttons" onClick={closeStatusModal}>Cancel</Button>
                            <Button className="custom-buttons" onClick={handleStatusChange}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Doctors;
