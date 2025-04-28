import { MdMedicalInformation } from 'react-icons/md';
import { MdOutlinePreview } from 'react-icons/md';
import { AiOutlineInteraction } from 'react-icons/ai';
import { FaPersonBooth, FaPersonHarassing, FaUserDoctor } from 'react-icons/fa6';
import { TbHeartRateMonitor, TbReportSearch } from 'react-icons/tb';
import { SiPrivateinternetaccess } from 'react-icons/si';
import { GrContact } from 'react-icons/gr';
import { TbHistory } from 'react-icons/tb';
import { RiImageEditFill } from 'react-icons/ri';
import { GiGrowth } from 'react-icons/gi';
import { MdCorporateFare } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';
import { IoDocumentsOutline } from 'react-icons/io5';

export const patientMenuItems = [
    { label: 'Patient Summary', tab: "Patient Details", icon: <MdMedicalInformation /> },
    { label: 'Demographics', tab: "Demographics", icon: <TbHeartRateMonitor /> },
    { label: 'Documents', tab: "Documents", icon: <IoDocumentsOutline /> },
    { label: 'Encounters', tab: "Encounter", icon: <FaPersonHarassing /> },
    {
        label: 'Clinical Review',
        icon: <MdOutlinePreview />,
        subItems: [
            { label: 'Allergy List', tab: "Allergy List", icon: <FiPlus /> },
            { label: 'Problem List', tab: "Problem List", icon: <FiPlus /> },
            { label: 'Medication List', tab: "Medication List", icon: <FiPlus /> },
            { label: 'Vitals List', tab: "Vitals List", icon: <FiPlus /> },
        ],
    },
    {
        label: 'Social History',
        icon: <MdOutlinePreview />,
        subItems: [
            { label: 'Tabacco', tab: "Tabacco", icon: <FiPlus /> },
            { label: 'Medical', tab: "Medical", icon: <FiPlus /> },
            { label: 'Surgical', tab: "Surgical", icon: <FiPlus /> },
            { label: 'Family / Genetic', tab: "Family / Genetic", icon: <FiPlus /> },
            { label: 'Alcohol', tab: "Alcohol", icon: <FiPlus /> },
            { label: 'Vaccination', tab: "Vaccination", icon: <FiPlus /> },
        ],
    },
    { label: 'Drug Interactions', tab: "Drug Interactions", icon: <AiOutlineInteraction /> },
    { label: 'Lab Request', tab: "Lab Request", icon: <TbReportSearch /> },
    { label: 'Patient Access', tab: "Patient Access", icon: <SiPrivateinternetaccess /> },
    { label: 'Imaging Requests', tab: "Imaging Requests", icon: <RiImageEditFill /> },
    // { label: 'CQIs', tab: "CQIs", icon: <FaUserDoctor /> },
    // { label: 'Genetic History', tab: "Genetic History", icon: <TbHistory /> },
    // { label: 'Growth Tracker', tab: "Growth Tracker", icon: <GiGrowth /> },
    // { label: 'Estimates', tab: "Estimates", icon: <MdCorporateFare /> },
    { label: 'Communication', tab: "Communication", icon: <GrContact /> },
    { label: 'Task', tab: "Task", icon: <FaUserDoctor /> },
];

export const patientChartTabs = [
    'Patient Details',
    'Demographics',
    'Responsible Party',
    'Reffering Doctor',
    'Insurances',
    'Eligibility',
    'Authorizations',
    'Vital Status',
    'Balance',
    'Payment',
]