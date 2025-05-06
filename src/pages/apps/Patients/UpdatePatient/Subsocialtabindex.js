import React, { useState } from 'react';
import Tobacco from './SubsocialPages.js/Tobacco';
import Alcohol from './SubsocialPages.js/Alcohol';
import FamilyHistory from './SubsocialPages.js/FamilyGenetic';

const Subsocialtabindex = ({ patientId, isAccordionOpen }) => {
    const [activeSocialTabs, setActiveSocialTabs] = useState('Tobacco');

    const handleSocialTabChange = (tab) => {
        setActiveSocialTabs(tab);
    };

    const tabs = ['Tobacco', 'Medical', 'Surgical', 'Family /Genetic', 'Alcohol', 'Vaccination'];

    return (
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', width: '100%', scrollbarWidth: 'none' }}>
            <ul className="border-bottom border-secondary nav nav-underline" style={{ minWidth: 'max-content' }}>
                {tabs.map((tab) => (
                    <li className="nav-item" key={tab}>
                        <a
                            className={`nav-link me-3 fs-6 pb-0 tab-font-family ${
                                activeSocialTabs === tab ? 'active text-primary' : 'text-black'
                            }`}
                            onClick={() => handleSocialTabChange(tab)}
                            style={{ cursor: 'pointer', fontWeight: 600 }}>
                            {tab}
                        </a>
                    </li>
                ))}
            </ul>

            <div className="mt-2">
                {activeSocialTabs === 'Tobacco' && <Tobacco patientId={patientId} isAccordionOpen={isAccordionOpen} />}
                {activeSocialTabs === 'Medical' && <p>Medical Section - In Progress</p>}
                {activeSocialTabs === 'Surgical' && <p>Surgical Section - In Progress</p>}
                {activeSocialTabs === 'Family /Genetic' && (
                    <FamilyHistory patientId={patientId} isAccordionOpen={isAccordionOpen} />
                )}
                {activeSocialTabs === 'Alcohol' && <Alcohol patientId={patientId} isAccordionOpen={isAccordionOpen} />}
                {activeSocialTabs === 'Vaccination' && <p>Vaccination Section - In Progress</p>}
            </div>
        </div>
    );
};

export default Subsocialtabindex;
