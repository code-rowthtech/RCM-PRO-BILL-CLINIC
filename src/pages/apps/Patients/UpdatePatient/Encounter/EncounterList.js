import React, { useEffect } from 'react'
import { Badge, Button, Col, Row, Table, Image } from 'react-bootstrap'
import { FaUserMd } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getEncounterAction } from '../../../../../redux/actions'
import { useSearchParams } from 'react-router-dom'
import dummyProfile from '../../../../../assets/images/dummyProfile.png'
import Spinner from '../../../../../constants/Spinner'
const EncounterList = ({ tab, encounterTabs, setEncounterTabs, setActiveTab }) => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const id = searchParams.get('id')
    const store = useSelector((state) => state)
    const encounters = store?.getEncounterReducer?.data?.encounters;
    console.log(encounters, 'encounters')
    useEffect(() => {
        dispatch(getEncounterAction({ patientId: id }))
    }, [dispatch])

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
            <Row>
                <Col sm={12}>
                    <Table
                        responsive
                        className="table-centered table-nowrap mb-0  rounded">
                        <thead className="text-white">
                            <tr>
                                <th className="text-white">S.no</th>
                                <th className="text-white">Provider</th>
                                <th className="text-white">Encounter Type</th>
                                <th className="text-white">Status</th>
                                <th className='text-white'>Start Date</th>
                                <th className="text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store?.getEncounterReducer?.loading ?
                                <tr>
                                    <td colSpan={6} className='text-center py-5'>
                                        <Spinner />
                                    </td>
                                </tr>
                                :
                                encounters?.map((item, index) => (
                                    <tr onClick={() => {
                                        const newTab = {
                                            id: item?._id,
                                            title: item?.period?.start ? new Date(item?.period?.start)?.toISOString().split('T')?.[0] : '',
                                            type: 'date',
                                        };
                                        setEncounterTabs([...encounterTabs, newTab]);
                                        setActiveTab(newTab?.id)
                                    }} key={item?.id}>
                                        <td>{index + 1}</td>
                                        <td className="d-flex align-items-center gap-2">
                                            <Image
                                                src={item?.providerId?.photo?.[0]?.url || dummyProfile}
                                                roundedCircle
                                                width={35}
                                                height={35}
                                                alt={item?.providerId?.name?.[0]?.text}
                                            />
                                            <div>
                                                <div>{item?.providerId?.name?.[0]?.text}</div>
                                                <small className="text-muted">{item?.providerId?.telecom?.find((data) => data?.system === 'email')?.value}</small>
                                            </div>
                                        </td>
                                        <td>{item?.type?.[0]?.coding?.[0]?.display}</td>
                                        <td className='text-capitalize'>{item?.status}</td>
                                        <td className='text-capitalize'>{item?.period?.start ? new Date(item?.period?.start)?.toISOString().split('T')?.[0] : ''}</td>
                                        <td>

                                            <i
                                                className=" mdi mdi-square-edit-outline fs-4 cursor-pointer"
                                                onClick={() => {
                                                    const newTab = {
                                                        id: item?._id,
                                                        title: item?.period?.start ? new Date(item?.period?.start)?.toISOString().split('T')?.[0] : '',
                                                        type: 'date',
                                                    };
                                                    setEncounterTabs([...encounterTabs, newTab]);
                                                    setActiveTab(newTab?.id)
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </Table>
                </Col>
            </Row>


        </div >
    )
}

export default EncounterList
