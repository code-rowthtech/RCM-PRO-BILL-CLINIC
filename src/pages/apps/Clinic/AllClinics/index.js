// @flow
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';

// component
import PageTitle from '../../../../components/PageTitle';
import { FormInput } from '../../../../components';
// dummy data
import { orderData } from './data';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { getClinicAction, stateEmptydAction, updateClinicAction } from '../../../../redux/clinics/actions'
import Spinner from '../../../../constants/Spinner';
import Paginations from '../../../../helpers/Paginations';
import { encryptMessage } from '../../../../cryptoUtils';

const OrderList = (): React$Element<React$FragmentType> => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [skip, setSkip] = useState(1);
    const store = useSelector((state) => state);
    const clinicsData = store?.getClinicsReducer?.data?.data;
    const updateSuccess = store?.updateClinicsReducer?.data?.status;
    useEffect(() => {
        const payload = {
            name: name,
            skip: skip,
            limit: 10,
        }
        dispatch(getClinicAction({ payload }))
        if (updateSuccess === 200) {
            dispatch(getClinicAction({ payload }))
        }
    }, [dispatch, name, updateSuccess, skip])

    const handleStatusUpdate = (data) => {
        const payload = {
            id: data?._id,
            status: !data?.status
        }

        dispatch(updateClinicAction({ key: encryptMessage(payload) }));
        dispatch(stateEmptydAction());
    }
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    return (
        <>
            {/* <PageTitle
                breadCrumbItems={[
                    { label: 'Clinics', path: '/apps/crm/orders', active: true },
                    { label: 'All clinics', path: '/apps/crm/orders', active: true },
                ]}
                title={'All Clinics'}
            /> */}

            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col sm={8}>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between">
                                        <Col xs="auto">
                                            <FormInput
                                                type="text"
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Search..." />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={4} className='text-end'>
                                    <Button as={Link} to="/apps/crm/addclinic" className="custom-buttons">
                                        Add Clinics
                                    </Button>
                                </Col>
                            </Row>
                            {/* <OrderDetails orderData={orderData} /> */}
                            <Table responsive className="table-centered border border-muted table-nowrap mb-0">
                                <thead>
                                    <tr>
                                        <th>Clinic Name</th>
                                        <th>Email</th>
                                        <th>Phone number</th>
                                        <th>Address</th>
                                        <th>Status</th>
                                        <th style={{ width: '125px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store?.getClinicsReducer?.loading ? (
                                        <tr>
                                            <td className='text-center' colSpan={7}>
                                                <Spinner className="spinner-border-lg m-2" />
                                            </td>
                                        </tr>
                                    ) : (
                                        store?.getClinicsReducer?.data?.totalClinics === 0 ? (
                                            <tr>
                                                <td className='text-center' colSpan={7}>
                                                    <h3 className='my-5'>No Data Found</h3>
                                                </td>
                                            </tr>
                                        ) : (
                                            clinicsData?.map((data, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td className='text-capitalize'>{data?.name}</td>
                                                        <td className='text-lowercase cursor-pointer'>
                                                            {data?.email && data?.email.length > 10 ? (
                                                                <span
                                                                    data-bs-toggle="tooltip"
                                                                    title={data?.email}
                                                                    className="d-inline-block text-truncate"
                                                                >
                                                                    {data?.email.substring(0, 10) + '...'}
                                                                </span>
                                                            ) : (
                                                                data?.email
                                                            )}
                                                        </td>
                                                        <td>{data?.phone}</td>
                                                        <td className='text-capitalize cursor-pointer'>
                                                            {data?.address && data?.address.length > 15 ? (
                                                                <span
                                                                    data-bs-toggle="tooltip"
                                                                    title={data?.address}
                                                                    className="d-inline-block text-truncate"
                                                                >
                                                                    {data?.address.substring(0, 15) + '...'}
                                                                </span>
                                                            ) : (
                                                                data?.address
                                                            )}
                                                        </td>
                                                        <td>
                                                            <Form.Switch onClick={() => handleStatusUpdate(data)} checked={data?.status === true} />
                                                        </td>
                                                        <td>
                                                            <Link to={`/apps/crm/updateclinic?id=${data?._id}`} className="action-icon">
                                                                <i className="mdi mdi-square-edit-outline"></i>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )
                                    )}
                                </tbody>
                            </Table>
                            <Row>
                                <Col className='mt-2 d-flex justify-content-end'>
                                    <Paginations
                                        currentPage={skip}
                                        totalPages={store?.getClinicsReducer?.data?.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderList;
