// @flow
import React from 'react';
import { Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PageTitle from '../../../components/PageTitle';
import { FormInput } from '../../../components';
import { patientsData } from '../Appointments/data';
import { GrDocumentText } from 'react-icons/gr';
import Dropdown from 'react-bootstrap/Dropdown';
import { FiFileText, FiFilter } from 'react-icons/fi';

// Define the types for each order item
type OrderListItems = {
  orderId: string,
  avatar: string,
  name: string,
  projectName: string,
  country: string,
  city: string,
  date: string,
  orderStatus: string,
};

type OrderListProps = {
  patientsData: Array<OrderListItems>,
};

// Order details component
const TransactionList = ({ patientsData }: OrderListProps): React$Element<React$FragmentType> => {
  return (
    <Table responsive className="table-centered table-nowrap mb-0">
      <thead className='text-white'>
        <tr key={''}>
          {/* <th style={{ width: '20px' }}>
                        <Form>
                            <Form.Check type="checkbox" id="all" />
                        </Form>
                    </th> */}
          <th className='text-white'>Sr.No.</th>
          <th className='text-white'>Patients Name</th>
          <th className='text-white'>Doctor</th>
          <th className='text-white'> Appointment Date</th>
          <th className='text-white'>  Payment Status</th>
          <th className='text-white'> Payment Mode</th>
          <th className='text-white'> Amount</th>
          <th className='text-white'>Created on</th>
        </tr>
      </thead>
      <tbody>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <tr key={index}>
            <td>
              {index + 1}
            </td>
            <td>
              <Link to="#" className="text-body fw-bold">
                Appointment description
              </Link>
            </td>
            <td>Client Name</td>
            <td>Attendant name</td>
            <td>14:00</td>
            <td>DD/MM/YYYY</td>
            <td>Status</td>
            <td>DD/MM/YYYY</td>

            {/* <td>
                            <Link to="#" className="action-icon">
                                <i className="mdi mdi-square-edit-outline"></i>
                            </Link>
                            <Link to="#" className="action-icon">
                                <i className="mdi mdi-delete"></i>
                            </Link>
                        </td> */}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Main component that renders the page and order details
const Transaction = ({ patientsData }: { patientsData: Array<OrderListItems> }): React$Element<React$FragmentType> => {
  return (
    <>
      {/* <PageTitle
                breadCrumbItems={[
                    { label: 'Appointments', path: '/apps/appointments/list', active: true },
                ]}
                title={'Appointment List'}
            /> */}

      <Row className="mt-2">
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row className="mb-2">
                <Row className="mb-2">
                  <Col sm={8}>
                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between">
                      <Col xs="auto">
                        <FormInput
                          type="text"
                          // onChange={(e) => setName(e.target.value)}
                          placeholder="Search..." />
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={4} className='text-end'>
                    {/* <Button as={Link} to="/apps/crm/addclinic" className="custom-buttons">
                                        Add Clinics
                                    </Button> */}
                  </Col>
                </Row>
              </Row>
              <TransactionList patientsData={patientsData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Transaction;
