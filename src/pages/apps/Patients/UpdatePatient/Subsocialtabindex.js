import React, { useState } from 'react'

const Subsocialtabindex = ({patientId,isAccordionOpen}) => {
    const [activeSocialTabs , setActiveSocialTabs] = useState('Tabacco')
    const handleSocialTabChange = (tab) => {
        setActiveSocialTabs(tab); // Show Patient Section, Hide Task Section
    };
  return (
    <>
         <div className='' style={{ overflowX: 'auto', whiteSpace: 'nowrap', width: '100%', scrollbarWidth: 'none' }}>
                      <ul className="border-bottom border-secondary  nav nav-underline" style={{ minWidth: 'max-content' }}>
                          {[
                              'Tabacco',
                              'Medical',
                              'Surgical',
                              'Family /Genetic',
                              'Alcohol',
                              'Vaccination',
                          ].map((tab) => (
                              <li className="nav-item" key={tab}>
                                  <a
                                      className={`nav-link me-3 fs-6 pb-0 tab-font-family ${activeSocialTabs === tab
                                          ? 'active text-primary'
                                          : 'text-black'
                                          }`}
                                      onClick={() => handleSocialTabChange(tab)}
                                      style={{ cursor: 'pointer', fontWeight: 600 }}>
                                      {tab}
                                  </a>
                              </li>
                          ))}
                      </ul>
                      <div>
                          {activeSocialTabs === 'Tabacco' && <p>Tabcoo</p>}
                          {activeSocialTabs === 'Medical' &&<p>Tabcoo</p> }
                          {activeSocialTabs === 'Surgical' &&<p>Tabcoo</p> }
                          {activeSocialTabs === 'Family /Genetic' &&<p>Tabcoo</p> }
                          {activeSocialTabs === 'Alcohol' &&<p>Tabcoo</p> }
                          {activeSocialTabs === 'Vaccination' && <>In-progress...</>}
                      </div>
                  </div>
    </>
  )
}

export default Subsocialtabindex
