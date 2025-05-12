import React, { useEffect, useState } from 'react';
import Tobacco from './SubsocialPages.js/Tobacco';
import Alcohol from './SubsocialPages.js/Alcohol';
import FamilyHistory from './SubsocialPages.js/FamilyGenetic';
import MedicalHistory from './SubsocialPages.js/MedicalHistory';
import SurgicalHistory from './SubsocialPages.js/surgicalHistory';

const Subsocialtabindex = ({ patientId, isAccordionOpen, defaultTab }) => {
  const tabMapping = {
    'Tobacco': 'Tobacco History',
    'Medical': 'Medical History',
    'Surgical': 'Surgical History',
    'Family / Genetic': 'Family/Genetic History',
    'Alcohol': 'Alcohol History',
    'Vaccination': 'Vaccination History',
  };

  const tabs = [
    'Tobacco History',
    'Medical History',
    'Surgical History',
    'Family/Genetic History',
    'Alcohol History',
    // 'Vaccination History',
  ];

  const [activeSocialTabs, setActiveSocialTabs] = useState(tabMapping[defaultTab]);

  useEffect(() => {
    if (defaultTab && tabMapping[defaultTab]) {
      setActiveSocialTabs(tabMapping[defaultTab]);
    }
  }, [defaultTab]);

  const handleSocialTabChange = (tab) => {
    setActiveSocialTabs(tab);
  };

  return (
    <div>
      <ul className="border-bottom border-secondary nav nav-underline" style={{ minWidth: 'max-content' }}>
        {tabs.map((tab) => (
          <li className="nav-item" key={tab}>
            <a
              className={`nav-link me-3 fs-6 pb-0 tab-font-family ${activeSocialTabs === tab ? 'active text-primary' : 'text-black'}`}
              onClick={() => handleSocialTabChange(tab)}
              style={{ cursor: 'pointer', fontWeight: 600 }}
            >
              {tab}
            </a>
          </li>
        ))}
      </ul>

      <div className="">
        {activeSocialTabs === 'Tobacco History' && <Tobacco patientId={patientId} isAccordionOpen={isAccordionOpen} />}
        {activeSocialTabs === 'Medical History' && <MedicalHistory patientId={patientId} isAccordionOpen={isAccordionOpen} />}
        {activeSocialTabs === 'Surgical History' && <SurgicalHistory />}
        {activeSocialTabs === 'Family/Genetic History' && <FamilyHistory patientId={patientId} isAccordionOpen={isAccordionOpen} />}
        {activeSocialTabs === 'Alcohol History' && <Alcohol patientId={patientId} isAccordionOpen={isAccordionOpen} />}
        {activeSocialTabs === 'Vaccination History' && <p>Vaccination Section - In Progress</p>}
      </div>
    </div>
  );
};

export default Subsocialtabindex;
