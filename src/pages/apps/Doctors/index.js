import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FormInput } from '../../../components';
import { FiEdit, FiFileText, FiTrash } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorsAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';

const Doctors = () => {
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
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

    console.log(doctorDetails);

    const closeDetailsModal = () => {
        setDetailsModal(false);
        setSelectedDetails(null);
    };

    const filteredDoctors = doctorDetails.filter((doctor) =>
        doctor.userDetails?.status === status &&
        doctor.userDetails?.firstName.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col sm={6}>
                                    <Button
                                        onClick={() => setStatus(true)} // Active filter
                                        className={`me-2 ${status ? 'custom-buttons text-white' : 'bg-white border-primary text-dark'}`}
                                    >
                                        Active
                                    </Button>

                                    <Button
                                        onClick={() => setStatus(false)} // Inactive filter
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
                                            {/* <Button className="custom-buttons ">
                                                <FiFilter className='fs-4' />
                                            </Button>
                                            <Button className="custom-buttons ">
                                                <FiFileText className='fs-4' />
                                            </Button> */}
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
                                            <tr className=''>
                                                <th className='text-white'>S.No.</th>
                                                <th className='text-white'>Doctor Name</th>
                                                <th className='text-white'>Specialist</th>
                                                <th className='text-white'>Department Name</th>
                                                <th className='text-white'>Status</th>
                                                <th className='text-white'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDoctors.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className='text-center'>
                                                        <h3 className='my-5'>No Data Found</h3>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredDoctors.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td className='text-capitalise'>
                                                            {data?.userDetails?.firstName} {data?.userDetails?.lastName}
                                                        </td>
                                                        <td>{data?.departmentDetails?.specialist || 'N/A'}</td>
                                                        <td>
                                                            <span className='text-truncate text-capitalise cursor-pointer'>
                                                                {data?.departmentDetails?.name}
                                                            </span>
                                                        </td>
                                                        <td><Form.Switch checked /></td>
                                                        <td>
                                                            <div className='d-flex gap-2'>
                                                                <div onClick={() => { setDetailsModal(true); setSelectedDetails(data?.userDetails); }}>
                                                                    <FiEdit className="fs-4 cursor-pointer" />
                                                                </div>
                                                                <div>
                                                                    <FiTrash className="fs-4" />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={detailsModal} onHide={closeDetailsModal}>
                <Modal.Header
                    onHide={closeDetailsModal}
                    closeButton
                    className={'modal-colored-header pb-0 border-0 text-center'}>
                </Modal.Header>
                <Modal.Body>
                    <h4 className="mt-0 text-center">Doctor Details</h4>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}><h5>Name</h5></Col>
                            <Col sm={6}><p className='mb-0 text-start'>{selectedDetails?.firstName + ' ' + selectedDetails?.lastName}</p></Col>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Doctors;
