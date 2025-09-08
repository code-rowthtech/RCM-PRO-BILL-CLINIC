import React, { useState } from 'react';
import PrimaryInsurance from './PrimaryInsurance';
import SecondaryInsurance from './SecondaryInsurance';
import AutoAccident from './AutoAccident';
import WorkersCamp from './WorkersCamp';
import { useSearchParams } from 'react-router-dom';

const Insurance = () => {
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('updateid');
    const [activeTab, setActiveTab] = useState("primaryInsurance");

    const tabs = [
        { key: "primaryInsurance", label: "Primary Insurance" },
        { key: "secondaryInsurance", label: "Secondary Insurance" },
        { key: "autoAccident", label: "Auto Accident" },
        { key: "workersCamp", label: "Worker's Comp" }
    ];

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <div className='row'>
                <div className="col-12">
                    <ul className="nav nav-underline">
                        {tabs.map(tab => (
                            <li key={tab.key} className="nav-item">
                                <button
                                    className={`text-black nav-link fw-medium ${activeTab === tab.key ? "active fw-bold" : ""}`}
                                    onClick={() => handleTabChange(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
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
