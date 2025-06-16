import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getEncounterAction } from '../../../../../redux/actions';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Card } from 'react-bootstrap';

const PastEncounters = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const store = useSelector((state) => state);
    const encountersData = store?.getEncounterReducer?.data?.encounters;

    useEffect(() => {
        dispatch(getEncounterAction({ patientId: id, status: 'finished' }));
    }, [dispatch, id]);

    return (
        <div className="container py-1">
            {encountersData?.length > 0 ? (
                <div className="mb-1 ">
                    {encountersData.map((encounter, index) => (
                        <Card key={encounter._id} style={{ height: '9vh' }} className="mb-2 border cursor-pointer">
                            <Card.Body className='px-2 py-1' style={{ height: 'fit-content' }}>
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                                    <div className='mb-0 pb-0'>
                                        <h3 className="h5 mb-1 text-primary">
                                            {encounter.type[0]?.text || 'Medical Visit'}
                                        </h3>
                                        <small className="text-muted mb-0">
                                            {format(new Date(encounter.period.start), 'MMM dd, yyyy')}
                                        </small>
                                    </div>

                                    <div className="d-flex align-items-center mb-0 mt-md-0">
                                        {encounter.providerId?.photo[0]?.url && (
                                            <img
                                                src={encounter.providerId.photo[0].url}
                                                alt="Provider"
                                                className="rounded-circle me-2"
                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                            />
                                        )}
                                        <div>
                                            <p className="mb-0 fw-bold" style={{ color: '#2c3e50' }}>
                                                {encounter.providerId?.name[0]?.text || 'Unknown Provider'}
                                            </p>
                                            <small className="text-muted mb-0">
                                                {encounter.class?.text || 'General Practice'}
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