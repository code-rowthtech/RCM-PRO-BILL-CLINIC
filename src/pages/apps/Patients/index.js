import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import Spinner from '../../../constants/Spinner'
import { Link, useNavigate } from 'react-router-dom';
import { FormInput } from '../../../components';
import { FiEdit, FiFileText, FiTrash } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
import { FaEye, FaEyeSlash, FaStarOfLife } from 'react-icons/fa';
import ToastHandle from '../../../helpers/ToastMessage';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientsAction, updatePatientsAction } from '../../../redux/patients/actions';
import { encryptMessage } from '../../../cryptoUtils';
import Paginations from '../../../helpers/Paginations';
import { IoSearchSharp } from 'react-icons/io5';

const Patients = () => {
    const navigate = useNavigate('');
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [status, setStatus] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [smShow, setSmShow] = useState(false);
    const [password, setPassword] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1)
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const dispatch = useDispatch();
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const store = useSelector((state) => state);

    useEffect(() => {
        const data = {
            clinicId: clinicId,
            page: skip,
            limit: 10,
            search: search,
        }
        dispatch(getPatientsAction(data));
    }, [dispatch, skip, search]);
    const handleShowDetails = () => {
        setSmShow(true);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === '1234') {
            setIsPasswordCorrect(true);
            setSmShow(false);
            setIsVisible(true);
            ToastHandle("password success", "success");

            const id = setTimeout(() => {
                setIsPasswordCorrect(false);
                setIsVisible(false);
            }, 300000);

            setTimeoutId(id);
        } else {
            ToastHandle("password incorrect", "danger");
        }
    };



    const toggleVisibility = () => {
        if (isPasswordCorrect) {
            setIsVisible(!isVisible);
        } else {
            handleShowDetails();
        }
    };

    const patientsData = store?.getPatientsReducer?.data?.data;
    console.log( store?.getPatientsReducer,'patientsData')
    const closeDetailsModal = () => {
        setDetailsModal(false);
        setSelectedDetails(null);
    };

    const handleNewPatients = () => {
        navigate('/apps/patients/new-patient')
    }
 
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    return (
        <>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body style={{ height: '88vh' }}>
                            <Row className="mb-2">
                                <Col sm={6}>
                                </Col>


                                <Col sm={6} className='text-end'>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
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
                                            <Button onClick={handleNewPatients} className="custom-buttons py-1" >
                                                New Patient
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <Table responsive className="table-centered table-nowrap mb-0  rounded" style={{ height: patientsData?.length === 0 ? '100vh' : 'auto' }}>
                                        <thead className="text-white">
                                            <tr>
                                                <th className='text-white'>Sr.No.</th>
                                                <th className='text-white'>Patient Chart</th>
                                                <th className='text-white'>Patient Name</th>
                                                <th className='text-white'>Gender</th>
                                                <th className='text-white'>Phone</th>
                                                <th className='text-white'>Address</th>
                                                <th className='text-white'>Last Visit</th>
                                                <th className='text-white'>Next Visit</th>
                                                <th className='text-white'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getPatientsReducer?.loading ?
                                                <tr>
                                                    <td colSpan={9} className='text-center'>
                                                        <Spinner />
                                                    </td>
                                                </tr>
                                                :
                                                patientsData && patientsData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={9} className='text-center'>
                                                            <h3 className='my-5'>No Data Found</h3>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    patientsData && patientsData?.map((data, index) => (
                                                        <tr key={data?._id}>
                                                            <td>{index + 1}</td>
                                                            <td>CH-{data?.chartNumber}</td>
                                                            <td className='text-capitalize'>{data?.name?.[0]?.text || 'N/A'}</td>
                                                            <td className='text-capitalize'>{data?.gender || 'N/A'}</td>
                                                            <td>{data?.telecom?.[1]?.value || 'N/A'}</td>
                                                            <td>{data?.address?.[0]?.city || data?.address?.[0]?.state || 'N/A'}</td>
                                                            <td>{data?.lastVisit || 'N/A'}</td>
                                                            <td>{data?.nextVisit || 'N/A'}</td>
                                                            <td>
                                                                <Link to={`/apps/patients/update-patient?id=${data?._id}`} className="action-icon">
                                                                    <i className="mdi mdi-square-edit-outline cursor-pointer"></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                            }

                                        </tbody>
                                    </Table>
                                </Col>
                                <Col className='mt-2 d-flex justify-content-end'>
                                    <Paginations
                                        currentPage={skip}
                                        totalPages={store?.getPatientsReducer?.data?.pagination?.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal
                size="sm"
                show={smShow}
                centered
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Body className="rounded-4 p-3">
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group controlId="password" className="text-center my-2">
                            <Form.Label className='mb-2'>View Phone Number</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Row className="mt-2">
                            <Col sm={12} className="text-center mt-2">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                                <p className='fw-bold mt-2'>Show the number for 5 min only</p>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={detailsModal} onHide={closeDetailsModal}>
                <Modal.Header
                    onHide={closeDetailsModal}
                    closeButton
                    className={'modal-colored-header pb-0 border-0 text-center'}>
                </Modal.Header>
                <Modal.Body>
                    <h4 className="mt-0 text-center">Patient Details</h4>
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

export default Patients;


