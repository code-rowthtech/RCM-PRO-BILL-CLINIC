// @flow
import React from 'react';
import { Card, Dropdown, Table } from 'react-bootstrap';

// component
import CardTitle from '../../../components/CardTitle';

// images
import avatar2 from '../../../assets/images/users/avatar-2.jpg';
import avatar3 from '../../../assets/images/users/avatar-3.jpg';
import avatar4 from '../../../assets/images/users/avatar-4.jpg';
import avatar5 from '../../../assets/images/users/avatar-5.jpg';
import avatar6 from '../../../assets/images/users/avatar-6.jpg';

const Activity = (): React$Element<any> => {
    return (
        <Card className='mt-2'>
            <Card.Body className='py-2'>
                <CardTitle
                    containerClass="d-flex align-items-center justify-content-between mb-2"
                    title="Providers List"
                    menuItems={[
                        { label: 'Weekly Report' },
                        { label: 'Monthly Report' },
                        { label: 'Action' },
                        { label: 'Settings' },
                    ]}
                />

                <Table hover responsive className="table-centered table-nowrap mb-0">
                    <tbody>
                        <tr>
                            <td>
                                <div className="d-flex align-items-start">
                                    <img className="me-2 rounded-circle" src={avatar2} width="40" alt="" />
                                    <div>
                                        <h5 className="mt-0 mb-1 text-primary fw-semibold">
                                            Dr.Soren Drouin
                                        <span className="font-13 text-secondary fw-normal"> - (MBBS,MD)</span>
                                        </h5>
                                        <span className="font-13 text-success">Available</span>
                                    </div>
                                </div>
                            </td>
                            {/* <td>
                                <span className="text-muted font-13">Issue</span> <br />
                                <p className="mb-0">Details</p>
                            </td> */}
                            {/* <td className="table-action" style={{ width: '50px' }}>
                                <Dropdown className="float-end" align="end">
                                    <Dropdown.Toggle variant="link" className="arrow-none card-drop p-0 shadow-none">
                                        <i className="mdi mdi-dots-horizontal"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Settings</Dropdown.Item>
                                        <Dropdown.Item>Action</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td> */}
                        </tr>

                        <tr>
                            <td>
                                <div className="d-flex align-items-start">
                                    <img className="me-2 rounded-circle" src={avatar6} width="40" alt="" />
                                    <div>
                                        <h5 className="mt-0 mb-1 text-primary fw-semibold">
                                            Anne Simard
                                        <span className="font-13 text-secondary fw-normal"> - (MBBS,MD)</span>
                                        </h5>
                                        <span className="font-13 text-danger">Not available</span>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className="d-flex align-items-start">
                                    <img className="me-2 rounded-circle" src={avatar3} width="40" alt="" />
                                    <div>
                                        <h5 className="mt-0 mb-1 text-primary fw-semibold">
                                            Nicolas Chartier
                                        <span className="font-13 text-secondary fw-normal"> - (BDS,MDS)</span>
                                        </h5>
                                        <span className="font-13 text-success">Available</span>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className="d-flex align-items-start">
                                    <img className="me-2 rounded-circle" src={avatar4} width="40" alt="" />
                                    <div>
                                        <h5 className="mt-0 mb-1 text-primary fw-semibold">
                                            Gano Cloutier
                                        <span className="font-13 text-secondary fw-normal"> - (BHMS)</span>
                                        </h5>
                                        <span className="font-13 text-danger">Not available</span>
                                    </div>
                                </div>
                            </td>
                          
                        </tr>

                        <tr>
                            <td>
                                <div className="d-flex align-items-start">
                                    <img className="me-2 rounded-circle" src={avatar5} width="40" alt="" />
                                    <div>
                                        <h5 className="mt-0 mb-1 text-primary fw-semibold">
                                            Francis Achin
                                        <span className="font-13 text-secondary fw-normal"> - (MBBS,MS)</span>
                                        </h5>
                                        <span className="font-13 text-success"> Available</span>
                                    </div>
                                </div>
                            </td>
                           
                        </tr>
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default Activity;
