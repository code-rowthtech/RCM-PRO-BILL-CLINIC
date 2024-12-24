// import React, { useEffect, useState } from 'react';
// import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { FormInput } from '../../../components';
// import { FiEdit, FiFileText, FiTrash } from "react-icons/fi";
// import { FiFilter } from "react-icons/fi";
// import { useDispatch, useSelector } from 'react-redux';
// import { getDoctorsAction } from '../../../redux/actions';

// const Practice = () => {
//     const [detailsModal, setDetailsModal] = useState(false);
//     const [selectedDetails, setSelectedDetails] = useState(null);
//     const [status, setStatus] = useState(true);
//     const [search, setSearch] = useState('');

//     const handleStatusChange = (isActive) => {
//         setStatus(isActive);
//     };

//     const dispatch = useDispatch();

//     useEffect(() => {
//         dispatch(
//             getDoctorsAction({ status: status, search: search })
//         );
//     }, [dispatch, status, search]);

//     const store = useSelector((state) => state);
//     const response = store?.getDoctorsReducer

//     console.log(response);


//     // Static patient data
//     const patientsData = [
//         {
//             id: 1,
//             firstName: 'John',
//             clinicType: 'Doe',
//             location: 'HealthCare Inc.',
//             endDate: '32-4-2030',
//             countDown: 'Cardiology',
//             status: 'Active',
//             contract: 'Bones',
//             phone: '123-456-7890',
//             address: {
//                 street: '123 Main St',
//                 city: 'Springfield',
//                 state: 'IL',
//                 zipCode: '62701'
//             },
//             gender: 'Male',
//             insurancePlan: 'Premium',
//             insurancePolicyNumber: '123456789',
//             allergies: 'Pollen',
//             emergencyContacts: [{ phone: '987-654-3210' }]
//         },
//         {
//             id: 2,
//             firstName: 'John',
//             clinicType: 'Doe',
//             location: 'HealthCare Inc.',
//             endDate: '21-2-2002',
//             countDown: 'Cardiology',
//             status: 'Inactive',
//             contract: 'Bones',
//             phone: '123-456-7890',
//             address: {
//                 street: '123 Main St',
//                 city: 'Springfield',
//                 state: 'IL',
//                 zipCode: '62701'
//             },
//             gender: 'Male',
//             insurancePlan: 'Premium',
//             insurancePolicyNumber: '123456789',
//             allergies: 'Pollen',
//             emergencyContacts: [{ phone: '987-654-3210' }]
//         },
       
//     ];

 
//     // Filter patients based on selected status
//     const filteredPatients = patientsData.filter((patient) => {
//         const matchesStatus = status ? patient.status === 'Active' : patient.status === 'Inactive';
//         const matchesSearch = search
//             ? patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
//               patient.location.toLowerCase().includes(search.toLowerCase())
//             : true;
//         return matchesStatus && matchesSearch;
//     });
//     const openDetailsModal = (patient) => {
//         setSelectedDetails(patient);
//         setDetailsModal(true);
//     };

//     const closeDetailsModal = () => {
//         setDetailsModal(false);
//         setSelectedDetails(null);
//     };


//     return (
//         <>
//             <Row className='mt-2'>
//                 <Col xs={12}>
//                     <Card>
//                         <Card.Body>
//                             <Row className="mb-2">
//                                 <Col sm={6}>
//                                 <Button
//                                         onClick={() => setStatus(true)}
//                                         className={`me-2 ${status ? 'custom-buttons text-white' : 'bg-white border-primary text-dark'}`}
//                                     >
//                                         Active
//                                     </Button>
//                                     <Button
//                                         onClick={() => setStatus(false)}
//                                         className={`me-2 ${!status ? 'custom-buttons text-white' : 'bg-white border-primary text-dark'}`}
//                                     >
//                                         Inactive
//                                     </Button>
//                                 </Col>

//                                 <Col sm={6} className='text-end'>
//                                     <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between ">
//                                         <Col xs="auto" className='d-flex gap-2'>
//                                             <FormInput
//                                                 type="text"
//                                                 value={search}
//                                                 onChange={(e) => setSearch(e.target.value)}
//                                                 // onChange={(e) => setName(e.target.value)}
//                                                 placeholder="Search..." />
//                                             {/* <Button className="custom-buttons ">
//                                                 <FiFilter className='fs-4' />
//                                             </Button>
//                                             <Button className="custom-buttons ">
//                                                 <FiFileText className='fs-4' />
//                                             </Button> */}
//                                             <Button as={Link} to='/apps/Practice/new-practice' className="custom-buttons">
//                                                 New Sub Practice
//                                             </Button>
//                                         </Col>
//                                     </Row>

//                                 </Col>
//                             </Row>


//                             <Row>

//                                 <Col>
//                                     <Table responsive className="table-centered table-nowrap mb-0">
//                                         <thead className="text-white">
//                                             <tr className=''>
//                                                 <th className='text-white'>S.No.</th>
//                                                 <th className='text-white'>PRACTICE NAME</th>
//                                                 <th className='text-white'>LOCATION</th>
//                                                 <th className='text-white'>PRACTICE TYPE</th>
//                                                 <th className='text-white'>END DATE</th>
//                                                 <th className='text-white'>COUNTDOWN</th>
//                                                 <th className='text-white'>CONTRACT</th>
//                                                 <th className='text-white'>STATUS</th>
//                                                 <th className='text-white'>ACTION</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {filteredPatients.length === 0 ? (
//                                                 <tr>
//                                                     <td colSpan={9} className="text-center">
//                                                         <h5 className="my-3">No Data Found</h5>
//                                                     </td>
//                                                 </tr>
//                                             ) : (
//                                                 filteredPatients.map((patient, index) => (
//                                                     <tr key={patient.id}>
//                                                         <td>{index + 1}</td>
//                                                         <td>{patient.firstName}</td>
//                                                         <td>{patient.location}</td>
//                                                         <td>{patient.clinicType}</td>
//                                                         <td>{patient.endDate}</td>
//                                                         <td>{patient.countDown}</td>
//                                                         <td>{patient.contract}</td>
//                                                         <td>
//                                                             <Form.Switch
//                                                                 checked={patient.status === 'Active'}
//                                                             />
//                                                         </td>
//                                                         <td>
//                                                             <div className="d-flex gap-2">
//                                                                 <FiEdit
//                                                                     className="fs-5 cursor-pointer"
//                                                                     onClick={() => openDetailsModal(patient)}
//                                                                 />
//                                                                 <FiTrash className="fs-5 cursor-pointer" />
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 ))
//                                             )}
//                                         </tbody>
//                                     </Table>
//                                 </Col>
//                             </Row>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             <Modal show={detailsModal} onHide={closeDetailsModal}>
//                 <Modal.Header
//                     onHide={closeDetailsModal}
//                     closeButton
//                     className={'modal-colored-header pb-0 border-0 text-center'}>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <h4 className="mt-0 text-center">Patient Details</h4>
//                     <Row>
//                         <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
//                             <Col sm={6}><h5>Name</h5></Col>
//                             <Col sm={6}><p className='mb-0 text-start'>{selectedDetails?.firstName + ' ' + selectedDetails?.lastName}</p></Col>
//                         </Col>
//                     </Row>
//                 </Modal.Body>
//             </Modal>
//         </>
//     );
// }

// export default Practice;
