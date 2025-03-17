import React, { useEffect, useState } from 'react';
import PrimaryInsurance from '../../Insurance/PrimaryInsurance';
import AutoAccident from '../../Insurance/AutoAccident';
import WorkersCamp from '../../Insurance/WorkersCamp';
import SecondaryInsurance from '../../Insurance/SecondaryInsurance';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getInsuranceByPatientAction, resetUpdateAction } from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import Spinner from '../../../../../constants/Spinner';


const Insurance = ({ patientId }) => {
    const [activeTab, setActiveTab] = useState("primaryInsurance");
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const store = useSelector((state) => state);
    const updateInsuranceSuccess = store?.updateInsuranceReducer?.data?.status;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getInsuranceByPatientAction({ key: encryptMessage({ patientId: id }) }));
    }, [])
    useEffect(() => {
        if (updateInsuranceSuccess === 200) {
            dispatch(getInsuranceByPatientAction({ key: encryptMessage({ patientId: id }) }));
            dispatch(resetUpdateAction())
        }
    }, [updateInsuranceSuccess])
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <div className='row'>
                <div className="col-12">
                    <ul className="nav nav-underline">
                        <li className="nav-item">
                            <button
                                className={`text-black nav-link fw-medium ${activeTab === "primaryInsurance" ? "active fw-bold" : ""}`}
                                onClick={() => handleTabChange("primaryInsurance")}
                            >
                                Primary Insurance
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`text-black nav-link fw-medium ${activeTab === "secondaryInsurance" ? "active fw-bold" : ""}`}
                                onClick={() => handleTabChange("secondaryInsurance")}
                            >
                                Secondary Insurance
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`text-black nav-link fw-medium ${activeTab === "autoAccident" ? "active fw-bold" : ""}`}
                                onClick={() => handleTabChange("autoAccident")}
                            >
                                Auto Accident
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`text-black nav-link fw-medium ${activeTab === "workersCamp" ? "active fw-bold" : ""}`}
                                onClick={() => handleTabChange("workersCamp")}
                            >
                                Worker's Comp
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="col-12 mt-2">
                    {
                        store?.getInsuranceByIdReducer?.loading ?
                            <div className='d-flex justify-content-center'>
                                <Spinner />
                            </div>
                            :
                            activeTab === 'primaryInsurance' ?
                                <PrimaryInsurance patientId={patientId} />
                                :
                                activeTab === 'secondaryInsurance' ?
                                    <SecondaryInsurance patientId={patientId} />
                                    :
                                    activeTab === 'autoAccident' ?
                                        <AutoAccident patientId={patientId} />
                                        : activeTab === 'workersCamp' ?
                                            <WorkersCamp patientId={patientId} /> : ''

                    }


                </div>
            </div>
        </div>
    );
};

export default Insurance;
