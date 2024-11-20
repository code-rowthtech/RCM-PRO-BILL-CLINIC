import React, { useEffect, useState } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import { FormInput } from '../../../components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Paginations from '../../../helpers/Paginations'
import Spinner from '../../../constants/Spinner'
import { getSubscriptionsAction } from '../../../redux/subscriptions/actions'
import AddSubscriptions from './Addsubscriptions'
const Subscriptions = () => {
    const [skip, setSkip] = useState(1);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [showModal, setShowModal] = useState(false);
    const subscriptionsResponse = store?.getSubscriptionsReducer?.data;
    useEffect(() => {
        dispatch(getSubscriptionsAction());
    }, [dispatch])
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    }
    return (
        <div>
            {/* <PageTitle
                breadCrumbItems={[
                    { label: 'Subscriptions', path: '/apps/subscriptions/list', active: true },
                ]}
                title={'Subscriptions'}
            /> */}
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                {/* <Col xs="auto">
                                    <FormInput
                                        type="text"
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search..." />
                                </Col> */}
                                <Col className='text-end'>
                                    <Button onClick={() => setShowModal(true)} className="custom-buttons">
                                        Add Subscriptions
                                    </Button>
                                    <AddSubscriptions show={showModal} closeModal={handleCloseModal} />

                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="">
                                            <tr key={''}>
                                                <th>Plan name</th>
                                                <th>Description</th>
                                                <th>Price</th>
                                                <th>Billing</th>
                                                <th>Doctor Limit</th>
                                                <th>Patient Limit</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getSubscriptionsReducer?.loading ?
                                                <tr>
                                                    <td colSpan={7} className='text-center'>
                                                        <Spinner />
                                                    </td>
                                                </tr>
                                                :
                                                subscriptionsResponse?.totalPages === 0 ?
                                                    <tr>
                                                        <td colSpan={7} className='text-center'>
                                                            <h3 className='my-5'>No Data Found</h3>
                                                        </td>
                                                    </tr>
                                                    :

                                                    subscriptionsResponse?.plans?.map((data, index) => (
                                                        <tr key={index}>
                                                            <td className='text-capitalize'>
                                                                <Link to="#" className="text-body fw-bold">
                                                                    {data?.name}
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                {data?.description}

                                                            </td>
                                                            <td className='text-capitalize'>{data?.price}</td>
                                                            <td className='text-capitalize'>
                                                                {data?.billingFrequency}

                                                            </td>

                                                            <td>
                                                                {data?.doctorLimit}
                                                            </td>
                                                            <td>
                                                                {data?.patientLimit}
                                                            </td>
                                                            <td>
                                                                <Link to="#" className="action-icon">
                                                                    <i
                                                                        onClick={() => {
                                                                            // setDetailsModal(true);
                                                                            // setSelectedDetails(data);
                                                                        }}
                                                                        className="mdi mdi-eye cursor-pointer"></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                            }

                                        </tbody>
                                    </Table>
                                </Col>

                            </Row>
                            <Row>
                                <Col className='mt-2 d-flex justify-content-end'>
                                    <Paginations
                                        currentPage={skip}
                                        totalPages={store?.getSubscriptionsReducer?.data?.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}

export default Subscriptions