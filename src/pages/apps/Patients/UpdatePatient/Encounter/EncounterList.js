import React from 'react'
import { Badge, Button, Col, Row, Table, Image } from 'react-bootstrap'
import { FaUserMd } from 'react-icons/fa'

const EncounterList = ({ tab, encounterTabs, setEncounterTabs, setActiveTab }) => {
    const encounterData = [
        {
            id: 1,
            date: '12/04/2025',
            provider: {
                name: 'Emily Johnson',
                profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
                contact: '555-1234',
                email: 'emily.j@example.com',
            },
            appointment: 'Annual Checkup',
            superbill: 'SB123456',
        },
        {
            id: 2,
            date: '18/04/2025',
            provider: {
                name: 'Dr. Mark Lee',
                profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
                contact: '555-5678',
                email: 'mark.lee@example.com',
            },
            appointment: 'Dermatology Follow-up',
            superbill: 'SB987654',
        },
        {
            id: 3,
            date: '25/04/2025',
            provider: {
                name: 'Dr. Sarah Connor',
                profilePic: 'https://randomuser.me/api/portraits/women/68.jpg',
                contact: '555-9012',
                email: 'sarah.connor@example.com',
            },
            appointment: 'Cardiology Consultation',
            superbill: '',
        },
    ]

    return (
        <div className="px-2 pt-0 mt-1 row">
            <Row className="mb-1">
                <Col sm={6}>
                </Col>
                <Col sm={6} className="text-end">
                    <Badge bg={tab.status === 'Completed' ? 'success' : 'warning'}>
                        {tab.status}
                    </Badge>
                </Col>
            </Row>

            {/* <Table
                responsive
                className="table-centered table-nowrap mb-0  rounded">
                <thead className="text-white">
                    <tr>
                        <th className='text-white'>S.no</th>
                        <th className='text-white'>Date</th>
                        <th className='text-white'>Provider</th>
                        <th className='text-white'>Related Appointment</th>
                        <th className='text-white'>Superbill</th>
                        <th className='text-white'>Action</th>
                    </tr>
                </thead> */}
            <Row>
                <Col sm={12}>
                    <Table
                        responsive
                        className="table-centered table-nowrap mb-0  rounded">
                        <thead className="text-white">
                            <tr>
                                <th className="text-white">S.no</th>
                                <th className="text-white">Date</th>
                                <th className="text-white">Provider</th>
                                <th className="text-white">Related Appointment</th>
                                <th className='text-white'>Superbill</th>
                                <th className="text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {encounterData?.map((item, index) => (
                                <tr onClick={() => {
                                    const newTab = {
                                        id: encounterTabs?.length + 1,
                                        title: item?.date,
                                        type: 'date',
                                    };
                                    setEncounterTabs([...encounterTabs, newTab]);
                                    setActiveTab(newTab?.id)
                                }} key={item?.id}>
                                    <td>{index + 1}</td>
                                    <td>{item?.date}</td>
                                    <td className="d-flex align-items-center gap-2">
                                        <Image
                                            src={item?.provider?.profilePic}
                                            roundedCircle
                                            width={35}
                                            height={35}
                                            alt={item?.provider?.name}
                                        />
                                        <div>
                                            <div>{item?.provider?.name}</div>
                                            <small className="text-muted">{item?.provider?.email}</small>
                                        </div>
                                    </td>
                                    <td>{item?.appointment}</td>
                                    <td>{item?.superbill || 'N/A'}</td>
                                    <td>

                                        <i
                                            className=" bi bi-pencil text-info cursor-pointer"
                                            onClick={() => {
                                                const newTab = {
                                                    id: encounterTabs?.length + 1,
                                                    title: item?.date,
                                                    type: 'date',
                                                };
                                                setEncounterTabs([...encounterTabs, newTab]);
                                                setActiveTab(newTab?.id)
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>


        </div >
    )
}

export default EncounterList
