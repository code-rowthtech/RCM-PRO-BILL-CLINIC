import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getEncounterAction, getEncounterByIdAction, getPastEncounterAction } from '../../../../../redux/actions';
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
    }, [dispatch]);

    return (
        <div className="container py-1">
            {store?.getEncounterReducer?.loading ?
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
                                    setEncounterTabs([...encounterTabs, newTab]);
                                    setActiveTab(newTab.id);
                                }}
                                key={encounter?._id} className="mb-2 border cursor-pointer">
                                <Card.Body className='px-2 py-1' style={{ height: 'fit-content' }}>
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                                        <div className='mb-0 pb-0'>
                                            <h3 className="h5 mb-1 text-black">
                                                {encounter.type[0]?.text || 'Medical Visit'}
                                            </h3>
                                            <small className="text-muted mb-0">
                                                {format(new Date(encounter?.period?.start), 'MMM dd, yyyy')}
                                            </small>
                                        </div>

                                        <div className="d-flex align-items-center mb-0 mt-md-0">
                                            <div>
                                                <p className="mb-0 fw-bold text-black">
                                                    {encounter?.providerId?.name[0]?.text || 'Unknown Provider'}
                                                </p>
                                                <small className="text-muted mb-0">
                                                    {encounter?.class?.text || 'General Practice'}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
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