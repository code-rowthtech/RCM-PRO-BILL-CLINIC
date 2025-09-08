import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, InputGroup, Table, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiUploadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    getStatesByCountryAction,
    getCitiesAction,
    getCities2Action,
    getCities3Action,
    updatePatientsAction,
} from '../../../../redux/actions';
import us from '../../../../assets/images/flags/us.jpg';
import { encryptMessage } from '../../../../cryptoUtils';
import { genderIdentityOptions } from '../../../../utils/DataSets/genderIdentities';
import { sexParameterOptions } from '../../../../utils/DataSets/SexParameterforClinicalUse';
import { personalPronounsOptions } from '../../../../utils/DataSets/personalPronouns';
import { raceOptions } from '../../../../utils/DataSets/race.data';
import { dataList } from '../../../../utils/DataSets/relations.data';
import { ethnicityOptions } from '../../../../utils/DataSets/enthnicity.data';
import { tribalEntitiesOptions } from '../../../../utils/DataSets/tribalEntities';
import IdentifierForm from '../../Common Pages/IdentifierForm';
import { sexAssignedAtBirthOptions } from '../../../../utils/DataSets/sex';
import { maritalStatusOptions } from '../../../../utils/DataSets/maritalStatus';
import AddressForm from '../../Common Pages/AddressForm';
import Select from 'react-select';
import { error } from 'jquery';
import { use } from 'react';
import PatientDetails from './PatientDetails';
import Demographicdetails from './Demographics';
import ResponsiblleParty from './ResponsibleParty';
import ReferringDoctor from './ReferringDoctor';
import Insurance from './Insurance/Insurance';

const Subtabs = ({ patientId, isAccordionOpen }) => {

    const [activeTab, setActiveTab] = useState('Patient Details');
    const handleMainTabChange = (tab) => {
        setActiveTab(tab); // Show Patient Section, Hide Task Section
    };
    return (
        <>
            <div className='h-100' style={{ overflowX: 'hidden', whiteSpace: 'nowrap', width: '100%', scrollbarWidth: 'none' }}>
                <ul className="border-bottom ps-1 border-secondary  nav nav-underline" style={{ minWidth: 'max-content', height: 'fit-content' }}>
                    {[
                        'Patient Details',
                        'Demographics',
                        'Responsible Party',
                        'Reffering Source',
                        // 'Insurances',
                        // 'Eligibility',
                        // 'Authorizations',
                        // 'Vital Status',
                        // 'Balance',
                        // 'Payment',
                    ].map((tab) => (
                        <li className="nav-item" key={tab}>
                            <a
                                className={`nav-link me-3 fs-6 pb-0 tab-font-family ${activeTab === tab
                                    ? 'active text-primary'
                                    : 'text-black'
                                    }`}
                                onClick={() => handleMainTabChange(tab)}
                                style={{ cursor: 'pointer', fontWeight: 600 }}>
                                {tab}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className=''>
                    {activeTab === 'Patient Details' && <PatientDetails isAccordionOpen={isAccordionOpen} />}
                    {activeTab === 'Demographics' && <Demographicdetails isAccordionOpen={isAccordionOpen} />}
                    {activeTab === 'Responsible Party' && <ResponsiblleParty isAccordionOpen={isAccordionOpen} />}
                    {activeTab === 'Reffering Source' && <ReferringDoctor isAccordionOpen={isAccordionOpen} />}
                    {activeTab === 'Insurances' && <Insurance isAccordionOpen={isAccordionOpen} />}
                    {activeTab === 'Eligibility' && <>In-progress...</>}
                    {activeTab === 'Authorizations' && <>In-progress...</>}
                    {/* {activeTab === 'Vital Status' && <>In-progress...</>} */}
                    {/* {activeTab === 'Balance' && <>In-progress...</>} */}
                    {/* {activeTab === 'Payment' && <>In-progress...</>} */}
                </div>
            </div>

        </>
    );
};

export default Subtabs;
