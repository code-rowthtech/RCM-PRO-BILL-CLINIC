import React, { useState } from 'react';
import AllergyList from '../Task Tabs/AllergyList';
import ProblemList from '../Task Tabs/ProblemList';
import Medication from './Medication';
import VitalStatus from './VitalStatus';

const SubAllergytabs = ({ isAccordionOpen }) => {
    const [activeSocialTabs, setActiveSocialTabs] = useState('Allergy List');

    const handleTabsChange = (tab) => {
        setActiveSocialTabs(tab);
    };

    return (
        <>
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', width: '100%', scrollbarWidth: 'none' }}>
                <ul className="border-bottom border-secondary nav nav-underline" style={{ minWidth: 'max-content' }}>
                    {[
                        'Allergy List',
                        'Problem List',
                        'Medication List',
                        'Vitals',
                    ].map((tab) => (
                        <li className="nav-item" key={tab}>
                            <a
                                className={`nav-link me-3 fs-6 pb-0 tab-font-family ${
                                    activeSocialTabs === tab ? 'active text-primary' : 'text-black'
                                }`}
                                onClick={() => handleTabsChange(tab)}
                                style={{ cursor: 'pointer', fontWeight: 600 }}
                            >
                                {tab}
                            </a>
                        </li>
                    ))}
                </ul>
                <div>
                    {activeSocialTabs === 'Allergy List' && <AllergyList />}
                    {activeSocialTabs === 'Problem List' && <ProblemList />}
                    {activeSocialTabs === 'Medication List' && <Medication isAccordionOpen={isAccordionOpen} />}
                    {activeSocialTabs === 'Vitals' && <VitalStatus isAccordionOpen={isAccordionOpen} />}
                </div>
            </div>
        </>
    );
};

export default SubAllergytabs;
