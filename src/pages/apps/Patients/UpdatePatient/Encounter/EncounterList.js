import { useEffect } from 'react'
import { Badge, Col, Row, Table, Image, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getEncounterAction } from '../../../../../redux/actions'
import { useSearchParams } from 'react-router-dom'
import dummyProfile from '../../../../../assets/images/dummyProfile.png'
import Spinner from '../../../../../constants/Spinner'
import ToastHandle from '../../../../../helpers/ToastMessage'
import { FiFileText } from 'react-icons/fi'
const EncounterList = ({ encounterTabs, setEncounterTabs, setActiveTab, setCreateEncounter, isAccordionOpen }) => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const id = searchParams.get('id')
    const store = useSelector((state) => state)
    const encounters = store?.getEncounterReducer?.data?.encounters;
    useEffect(() => {
        dispatch(getEncounterAction({ patientId: id }))
    }, [dispatch, id])

    const statusColorMap = {
        planned: 'text-secondary',
        arrived: 'text-primary',
        triaged: 'text-info',
        'in-progress': 'text-warning',
        onleave: 'text-muted',
        finished: 'text-success',
        cancelled: 'text-danger',
    };

    return (
        <Row className='my-1'>
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
                            <th className='text-white'>End Date</th>
                            <th className="text-white">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store?.getEncounterReducer?.loading ?
                            <tr>
                                <td colSpan={7} className='text-center py-5'>
                                    <Spinner />
                                </td>
                            </tr>
                            :
                            encounters?.length > 0 ?
                                encounters?.map((item, index) => (
                                    <tr onClick={() => {
                                        const newTab = {
                                            id: item?._id,
                                            title: item?.period?.start ? new Date(item?.period?.start)?.toISOString().split('T')?.[0] : '',
                                            type: 'updateEncounter',
                                        };
                                        if (encounterTabs?.some((data) => data?.id === newTab?.id)) {
                                            ToastHandle('Encounter is already open in a tab.', 'danger')
                                        } else {
                                            setEncounterTabs([...encounterTabs, newTab]);
                                            setActiveTab(newTab?.id)
                                        }
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
                                        <td className={`text-capitalize fw-bold ${statusColorMap[item?.status] || ''}`}>
                                            {item?.status}
                                        </td>
                                        <td className='text-capitalize'>{item?.period?.start ? new Date(item?.period?.start)?.toISOString().split('T')?.[0] : '-'}</td>
                                        <td className='text-capitalize'>{item?.period?.end ? new Date(item?.period?.end)?.toISOString().split('T')?.[0] : '-'}</td>
                                        <td>
                                            <i
                                                className=" mdi mdi-square-edit-outline fs-4 cursor-pointer"
                                                onClick={() => {
                                                    const newTab = {
                                                        id: item?._id,
                                                        title: item?.period?.start ? new Date(item?.period?.start)?.toISOString().split('T')?.[0] : '',
                                                        type: 'updateEncounter',
                                                    };
                                                    if (encounterTabs?.some((data) => data?.id === newTab?.id)) {
                                                        ToastHandle('Encounter is already open in a tab.', 'danger')
                                                    } else {
                                                        setEncounterTabs([...encounterTabs, newTab]);
                                                        setActiveTab(newTab?.id)
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                                :
                                <tr>
                                    <td colSpan={7} className='text-center'>
                                        <div className="d-flex flex-column align-items-center py-5">
                                            <FiFileText size={48} className="text-muted mb-1" />
                                            <h5>No Encounters found</h5>
                                            <p className="text-muted">
                                                Create your first encounter to get started
                                            </p>
                                            <Button className='custom-buttons' onClick={() => setCreateEncounter(true)}>
                                                Create New Encounter
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                        }

                    </tbody>

                </Table>
            </Col>
        </Row>
    )
}

export default EncounterList
