import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormInput } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import {  createDoctorDetailAction, getDoctorsAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import Spinner from '../../../constants/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";
import { Info } from 'lucide-react';


const Doctors = () => {
    const [statusModal, setStatusModal] = useState(false);  // Modal to confirm status change
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [status, setStatus] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate('');

    const dispatch = useDispatch();

    useEffect(() => {
        const payload = { status: status, search: search }
        dispatch(
            getDoctorsAction(payload)

        );
    }, [dispatch, status, search]);
    const store = useSelector((state) => state);
    const doctorDetails = useSelector((state) => state?.getDoctorsReducer?.data?.result) || [];
    const updateStatus = useSelector((state) => state?.createtDoctorsDetailReducer?.data?.status) || [];
    const closeStatusModal = () => setStatusModal(false);  // Close status change modal
    const filteredDoctors = doctorDetails.filter((doctor) =>
        doctor.userDetails?.status === status &&
        (doctor.userDetails?.firstName?.toLowerCase() || "").includes(search?.toLowerCase() || "")
    );


    const handleStatusChange = () => {
        const payload = {
            doctorId: selectedDoctor?._id,
            status: !selectedDoctor?.userDetails?.status,
        }
        dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
        closeStatusModal();
    };

    useEffect(() => {
        if (updateStatus === 200) {
            // dispatch(stateEmptydAction())
            const payload = { status: status, search: search }
            dispatch(
                getDoctorsAction(payload)
    
            );
        }
    }, [updateStatus]);
    const handleNewDoctor = () => {
        navigate("/apps/doctors/new-doctor")
    }

    return (
        <>
            <Row className=''>
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
                                        className={`me-md-2 ms-sm-1 active_inactive_buttons text-nowrap ${!status ? ' text-white py-' : 'bg-white border-primary text-dark py-'}`}
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
                                                    borderRadius: "4px",
                                                    backgroundColor: "#e8f0fe",
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
                                        style={{ height: filteredDoctors?.length === 0 ? '75vh' : 'auto' }}>
                                        <thead className="text-white">
                                            <tr>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>S.No.</th>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>Doctor Name</th>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>Specialist</th>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>Email</th>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>Contact No.</th>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>Status</th>
                                                <th className='text-white py-2' style={{ fontSize: '13px' }}>Action</th>
                                            </tr>
                                        </thead>
                                        {store?.getDoctorsReducer?.loading ? (
                                            <tbody>
                                                <tr>
                                                    <td className='text-center' colSpan={7}>
                                                        <Spinner className=" my-3 " />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ) : (
                                            <tbody>
                                                {filteredDoctors.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={7} className='text-center'>
                                                            <h3 className='my-3'>No Data Found  for {status === true ? 'Active' : 'Inactive'}</h3>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredDoctors.map((data, index) => (
                                                        <tr key={index}>
                                                            <td className='py1' style={{ fontSize: '13px', fontWeight: '400' }}>{index + 1}</td>
                                                            <td className='text-capitalize py-1' style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                {(data?.name?.[0]?.given || []).join(" ")} {data?.name?.[0]?.family || ""}
                                                            </td>
                                                            <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                {data?.specialities?.[0] || 'N/A'}

                                                                {data?.specialities?.length > 1 && (
                                                                    <OverlayTrigger
                                                                        placement="top"
                                                                        overlay={
                                                                            <Tooltip id={`tooltip-${data?._id}`}>
                                                                                <ul className="m-0 p-0">
                                                                                    {data?.specialities?.slice(0).map((specialty, index) => (
                                                                                        <li key={index} style={{ listStyleType: "disc", marginLeft: "10px" }}>
                                                                                            {specialty}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </Tooltip>


                                                                        }
                                                                    >
                                                                        <span className="ms-2 cursor-pointer">
                                                                            <Info size={18} className="text-primary" />
                                                                        </span>
                                                                    </OverlayTrigger>
                                                                )}
                                                            </td>
                                                            <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                {data?.userDetails?.email || 'N/A'}
                                                            </td>
                                                            <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                {data?.telecom?.[0]?.value || 'N/A'}
                                                            </td>
                                                            <td className='py-1 ' style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                <Form.Switch
                                                                    className={data?.userDetails?.status ? "custom-active" : ""}
                                                                    checked={data?.userDetails?.status}
                                                                    onChange={() => {
                                                                        setSelectedDoctor(data);
                                                                        setStatusModal(true);
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className='py-1 ' style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                <div className='d-flex gap-2'>
                                                                    <Link to={`/apps/doctors/new-doctor?id=${data?._id}`} className='text-black cursor-pointer ps-2'>
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
