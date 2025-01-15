import React, { useState } from 'react';

const Insurance = () => {
    const [activeTab, setActiveTab] = useState("primaryInsurance");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <div className='ps-0'>
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
                            className={`text-black nav-link fw-medium ${activeTab === "secondary" ? "active fw-bold" : ""}`}
                            onClick={() => handleTabChange("secondary")}
                        >
                            Secondary Insurance
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`text-black nav-link fw-medium ${activeTab === "auto" ? "active fw-bold" : ""}`}
                            onClick={() => handleTabChange("auto")}
                        >
                            Auto Accident
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`text-black nav-link fw-medium ${activeTab === "worker" ? "active fw-bold" : ""}`}
                            onClick={() => handleTabChange("worker")}
                        >
                            Worker's Comp
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Insurance;
