import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getEncounterByIdAction, getPastEncounterAction } from '../../../../../redux/actions';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Card } from 'react-bootstrap';
import Spinner from '../../../../../constants/Spinner';

const PastEncounters = ({ encounterTabs, setEncounterTabs, setActiveTab, setExpanded }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const store = useSelector((state) => state);
    const encountersData = store?.getPastEncounterReducer?.data?.encounters;
    useEffect(() => {
        dispatch(getPastEncounterAction({ patientId: id }));
    }, [dispatch, id]);

    return (
        <div className="container py-1">
            {store?.getPastEncounterReducer?.loading ?
                <div className="row">
                    <div className="col-12 py-3 d-flex align-items-center justify-content-center">
                        <Spinner />
                    </div>
                </div>
                :
                encountersData?.length > 0 ? (
                    <div className="mb-1 ">
                        {encountersData.map((encounter, index) => (
                            <Card
                                onClick={() => {
                                    setExpanded(true);
                                    const newTab = {
                                        id: encounter?._id,
                                        title: encounter?.period?.start ? new Date(encounter?.period?.start)?.toISOString().split('T')?.[0] : '',
                                        type: 'updateEncounter',
                                    };
                                    dispatch(getEncounterByIdAction({ encounterId: encounter?._id }));
                                    const existingTab = encounterTabs.find((data) => data?.id === newTab?.id);
                                    if (existingTab) {
                                        setActiveTab(existingTab?.id);
                                    } else {
                                        setEncounterTabs([...encounterTabs, newTab]);
                                        setActiveTab(newTab.id);
                                    }
                                }}
                                key={encounter?._id} className="mb-2 border cursor-pointer">
                                <div className='row d-flex align-items-center justify-content-between px-2 py-1'>
                                    <div className="col-6">
                                        <h6 className='my-0 fw-bold'>{encounter.type[0]?.text || 'N/A'}</h6>
                                        <small className='fw-semibold fs-6'>{format(new Date(encounter?.period?.start), 'MMM dd, yyyy')}</small>
                                    </div>
                                    <div className="col-6 text-end">
                                        <h6 className='my-0 fw-bold'>{encounter?.providerId?.name[0]?.text || 'Unknown Provider'}</h6>
                                        <small className='fw-semibold fs-6'>{encounter?.class?.text || 'N/A'}</small>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5 text-muted">
                        <p>No past encounters found for this patient.</p>
                    </div>
                )}
        </div>
    );
};

export default PastEncounters;