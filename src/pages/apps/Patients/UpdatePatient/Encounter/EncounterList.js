import { useEffect, useState } from 'react'
import { Col, Row, Table, Image, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getEncounterAction, getEncounterByIdAction } from '../../../../../redux/actions'
import { useSearchParams } from 'react-router-dom'
import dummyProfile from '../../../../../assets/images/dummyProfile.png'
import Spinner from '../../../../../constants/Spinner'
import { FiFileText } from 'react-icons/fi'
import Paginations from '../../../../../helpers/Paginations'
import { handlePrintEncounters } from './handlePrintEncounter'
import { IoPrintSharp } from 'react-icons/io5'
const EncounterList = ({ encounterTabs, setEncounterTabs, setActiveTab, setCreateEncounter, setExpanded }) => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const [skip, setSkip] = useState(1);
    const id = searchParams.get('id')
    const store = useSelector((state) => state)
    const encounters = store?.getEncounterReducer?.data?.encounters;
    const patientDetails = store?.getPatientByIdReducer?.data?.data;

    useEffect(() => {
        dispatch(getEncounterAction({ patientId: id, skip: skip }))
    }, [skip, dispatch, id])

    const statusColorMap = {
        planned: 'text-secondary',
        arrived: 'text-primary',
        triaged: 'text-info',
        'in-progress': 'text-warning',
        onleave: 'text-muted',
        finished: 'text-success',
        cancelled: 'text-danger',
    };

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };

    // const encounterData = store?.getEncounterByIdReducer?.data?.encounter;

    return (
        <Row className='my-1'>
            <Col sm={12}>
                <Table
                    responsive
                    className="table-centered table-nowrap mb-0  rounded">
                    <thead className="text-white">
                        <tr>
                            {['S.no', 'Provider', 'Encounter Type', 'Status', 'Start Date', 'End Date', 'Action']?.map((data, index) => (
                                <th key={index}>{data}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {store?.getEncounterReducer?.loading ?
                            <tr key=''>
                                <td colSpan={7} className='text-center py-5'>
                                    <Spinner />
                                </td>
                            </tr>
                            :
                            encounters?.length > 0 ?
                                encounters?.map((item, index) => (
                                    <tr
                                        key={item?._id}>
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
                                            <IoPrintSharp className="fs-4 mb-1 me-1" onClick={() => handlePrintEncounters(item, patientDetails)} />
                                            <i
                                                className=" mdi mdi-square-edit-outline fs-4 cursor-pointer"
                                                onClick={() => {
                                                    setExpanded(true);
                                                    const newTab = {
                                                        id: item?._id,
                                                        title: item?.period?.start ? new Date(item?.period?.start)?.toISOString().split('T')?.[0] : '',
                                                        type: 'updateEncounter',
                                                    };
                                                    dispatch(getEncounterByIdAction({ encounterId: item?._id }));
                                                    const existingTab = encounterTabs.find((data) => data?.id === newTab?.id);
                                                    if (existingTab) {
                                                        setActiveTab(existingTab?.id);
                                                    } else {
                                                        setEncounterTabs([...encounterTabs, newTab]);
                                                        setActiveTab(newTab.id);
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
                                            <Button className='custom-buttons' onClick={() => {
                                                setCreateEncounter(true);
                                                setExpanded(true);
                                            }}>
                                                Create New Encounter
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </Table>
            </Col>
            <div className="col-12">
                <div className="mt-2 d-flex justify-content-end">
                    <Paginations
                        currentPage={skip}
                        totalPages={store?.getEncounterReducer?.data?.pages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </Row>
    )
}

export default EncounterList
