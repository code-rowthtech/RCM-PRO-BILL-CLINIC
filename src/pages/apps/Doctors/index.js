import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { FormInput } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit, FiTrash } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { createDoctorAction, createDoctorDetailAction, getDoctorsAction, stateEmptydAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import Spinner from '../../../constants/Spinner';
import { Link, useSearchParams } from 'react-router-dom';

const Doctors = () => {
    const [detailsModal, setDetailsModal] = useState(false);
    const [statusModal, setStatusModal] = useState(false);  // Modal to confirm status change
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [status, setStatus] = useState(true);
    const [search, setSearch] = useState('');

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

    return (
        <>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col sm={6}>
                                    <Button
                                        onClick={() => setStatus(true)}
                                        className={`me-2 ${status ? 'custom-buttons text-white' : 'bg-white border-primary text-dark'}`}
                                    >
                                        Active
                                    </Button>
                                    <Button
                                        onClick={() => setStatus(false)}
                                        className={`me-2 ${!status ? 'custom-buttons text-white' : 'bg-white border-primary text-dark'}`}
                                    >
                                        Inactive
                                    </Button>
                                </Col>

                                <Col sm={6} className='text-end'>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between ">
                                        <Col xs="auto" className='d-flex gap-2'>
                                            <FormInput
                                                type="text"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)} // Update search query
                                                placeholder="Search..."
                                            />
                                            <Button as={Link} to='/apps/doctors/new-doctor' className="custom-buttons">
                                                New Doctor
                                            </Button>
                                        </Col>
                                    </Row>

                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="text-white">
                                            <tr>
                                                <th className='text-white'>S.No.</th>
                                                <th className='text-white'>Doctor Name</th>
                                                <th className='text-white'>Specialist</th>
                                                <th className='text-white'>Department Name</th>
                                                <th className='text-white'>Status</th>
                                                <th className='text-white'>Action</th>
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
                                                            <td>{index + 1}</td>
                                                            <td className='text-capitalize'>
                                                                {data?.userDetails?.firstName} {data?.userDetails?.lastName}
                                                            </td>
                                                            <td>{data?.departmentDetails?.specialist || 'N/A'}</td>
                                                            <td className='text-uppercase'>
                                                                {data?.departmentDetails?.name || 'N/A'}
                                                            </td>
                                                            <td>
                                                                <Form.Switch
                                                                    checked={data?.userDetails?.status}
                                                                    onChange={() => {
                                                                        setSelectedDoctor(data);
                                                                        setStatusModal(true);
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
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
