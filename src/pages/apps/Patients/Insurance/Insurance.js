import React, { useState } from 'react';
import PrimaryInsurance from './PrimaryInsurance';
import SecondaryInsurance from './SecondaryInsurance';
import AutoAccident from './AutoAccident';
import WorkersCamp from './WorkersCamp';

const Insurance = ({ patientId }) => {
    const [activeTab, setActiveTab] = useState("primaryInsurance");

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
                    {activeTab === 'primaryInsurance' ?
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
