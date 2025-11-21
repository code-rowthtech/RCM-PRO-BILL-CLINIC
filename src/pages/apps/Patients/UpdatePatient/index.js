import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Accordion, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import profileDummy from '../../../../assets/images/profileDummy.png';
import { IoClose, IoPrintSharp } from 'react-icons/io5';
import { TbCapture } from 'react-icons/tb';
import { LiaReceiptSolid } from 'react-icons/lia';
import { useDispatch, useSelector } from 'react-redux';
import {
    getPatientByIdAction,
    updatePatientsAction,
} from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import ResponsibleParty from './ResponsibleParty';
import { BiEdit } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { handleUpload } from '../../../../helpers/HandleUpload';
import Insurances from './Insurance/Insurance';
import ReferringDoctor from './ReferringDoctor';
import { patientMenuItems } from './patientsMenuItems';
import Subtabs from './Subtabsindex';
import PatientSummary from './PatientSummary';
import Subsocialtabindex from './Subsocialtabindex';
import SubAllergytabs from './SubAllergytabs';
// import Encounter from './Encounter/Encounter';
import EncountersV2 from './EncountersV2/EncountersV2';
import PatientDocs from './Patientdocs';
import PatientAccess from './PatientAccess';
import DrugInteraction from './DrugInteractions/DrugInteraction';
import ModalPrint from './ModalOfPrintPdf/ModalPrint';
import TaskListing from './TaskList/TaskListing';
import { formatDateByUserTimeZone } from '../../../../components/timeZonePipe';
import { FaFileSignature } from 'react-icons/fa6';
import ConsentOffCanvas from './ConsentOffCanvas';
import LabRequest from './LabRequest/LabRequest';

const UpdatePatientIndex = () => {
    // Imports initialization
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const { handleSubmit } = useForm();
    const [searchParams] = useSearchParams();

    // Refs and other variable declaration
    const menuRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const id = useMemo(() => searchParams.get('id'), [searchParams]);

    // STORE AND STATE VARIABLES DECLARATIONS
    const updateResponse = store?.updatePatientsReducer?.data?.status;
    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    const loading = store?.getPatientByIdReducer?.loading;
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [selectedMainTab, setSelectedMainTab] = useState('Patient Details');
    const [visibleSection, setVisibleSection] = useState('patient'); // Default section
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [activeKey, setActiveKey] = useState('0');
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showConsent, setShowConsent] = useState(false);

    const [encounterTabs, setEncounterTabs] = useState([
        {
            id: 1,
            title: 'Encounter list',
            type: 'default',
        },
    ]);
    const [expanded, setExpanded] = useState(false);
    const [createEncounter, setCreateEncounter] = useState(false);
    const [updateEncounter, setUpdateEncounter] = useState(null);
    const [scrollToAccordion, setScrollToAccordion] = useState(null);
    const isAccordionOpen = useMemo(() => activeKey === '0', [activeKey]);

    // Memoized patient data computations
    const patientPhone = useMemo(() =>
        patientDetails?.telecom?.find(data => data?.system === 'phone')?.value,
        [patientDetails?.telecom]
    );

    const patientEmail = useMemo(() =>
        patientDetails?.telecom?.find(item => item?.system === 'email')?.value,
        [patientDetails?.telecom]
    );

    const patientAddress = useMemo(() => {
        const address = patientDetails?.address?.[0];
        return address?.city && address?.state
            ? `${address.city}, ${address.state}`
            : null;
    }, [patientDetails?.address]);

    const patientName = useMemo(() => {
        const name = patientDetails?.name?.[0];
        if (!name) return 'N/A';

        const prefix = name.prefix?.[0] ? name.prefix[0] + ' ' : '';
        const family = name.family || '';
        const given = name.given?.length > 0 ? ' ' + name.given.join(' ') : '';

        return prefix + family + given;
    }, [patientDetails?.name]);

    const patientAge = useMemo(() => {
        if (!patientDetails?.approxAge) return '';

        const years = Math.floor(patientDetails.approxAge);
        return `(${years} year${years !== 1 ? 's old)' : ''} `;
    }, [patientDetails?.approxAge]);

    const patientBirthDate = useMemo(() =>
        patientDetails?.birthDate
            ? formatDateByUserTimeZone(patientDetails.birthDate, {}, 'date')
            : '',
        [patientDetails?.birthDate]
    );

    const patientCreatedDate = useMemo(() =>
        patientDetails?.createdAt
            ? formatDateByUserTimeZone(patientDetails.createdAt, {}, 'date') : '',
        [patientDetails?.createdAt]
    );

    const profileImageSrc = useMemo(() => {
        if (logo?.url) return logo.url.split('?')[0];
        if (patientDetails?.photo?.[0]?.url) return patientDetails.photo[0].url;
        return profileDummy;
    }, [logo?.url, patientDetails?.photo]);

    const toggleSubmenu = useCallback((label) => {
        setActiveSubmenu((prev) => (prev === label ? null : label));
    }, []);


    // Memoized handlers
    const handleMenuItemClick = useCallback((item, e) => {
        e?.stopPropagation();
        if (item.subItems) {
            toggleSubmenu(item.label);
        } else {
            setActiveKey('0');
            setSelectedMainTab(item.tab);
            sessionStorage.setItem('selectedMainTab', item.tab);
            setActiveSubmenu(null);
        }
    }, [toggleSubmenu]);

    const handleSubMenuClick = useCallback((subItem) => {
        setSelectedMainTab(subItem.tab);
        sessionStorage.setItem('selectedMainTab', subItem.tab);
    }, []);

    const handleMoreMenuClick = useCallback(() => {
        setShowMoreMenu(prev => !prev);
    }, []);

    const handleMoreMenuItemClick = useCallback((data) => {
        setSelectedMainTab(data.tab);
        sessionStorage.setItem('selectedMainTab', data.tab);
        setShowMoreMenu(false);
    }, []);

    const handleNewEncounter = useCallback(() => {
        setSelectedMainTab('Encounter');
        setCreateEncounter(true);
        setExpanded(true);
    }, []);

    const handlePrintModal = useCallback(() => {
        setShowPrintModal(true);
    }, []);

    const handleClosePrintModal = useCallback(() => {
        setShowPrintModal(false);
    }, []);

    // Memoized card height calculation
    const cardHeight = useMemo(() => {
        if (selectedMainTab !== 'Encounter' && expanded && !isAccordionOpen) {
            return '100vh'; // When expanded AND accordion closed
        }
        if (expanded) {
            return '90vh'; // When expanded (accordion state doesn't matter)
        }
        if (isAccordionOpen) {
            return '66.5vh'; // When accordion open (not expanded)
        }
        return '81.5vh'; // Default case (neither expanded nor accordion open)
    }, [selectedMainTab, expanded, isAccordionOpen]);

    // USEEFFECTS TILL LINE 125
    useEffect(() => {
        const tab = sessionStorage?.getItem('selectedMainTab');
        if (tab) {
            setSelectedMainTab(tab);
        }
    }, []);

    const handleClickOutside = useCallback((event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setActiveSubmenu(null);
            setShowMoreMenu(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        dispatch(getPatientByIdAction({ id }));
    }, [dispatch, id]);

    useEffect(() => {
        if (updateResponse === 200) {
            dispatch(getPatientByIdAction({ id }));
        }
    }, [updateResponse, dispatch, id]);

    useEffect(() => {
        const elements = document.getElementsByClassName('content-page');
        for (let el of elements) {
            if (expanded) {
                el.style.setProperty('padding-top', '33px', 'important');
            } else {
                el.style.setProperty('padding-top', '50px', 'important');
            }
        }
    }, [expanded]);

    // Camera functionality to capture profile photos
    const openCamera = useCallback(async () => {
        try {
            setIsCameraOpen(true);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    }, []);

    const stopCamera = useCallback(() => {
        const stream = videoRef.current?.srcObject;
        stream?.getTracks().forEach((track) => track.stop());
        setIsCameraOpen(false);
    }, []);

    const capturePhoto = useCallback(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const file = new File([blob], `profile-photo-${Date.now()}.png`, {
                type: 'image/png',
            });
            try {
                const url = await handleUpload(file, setUploading);
                setLogo(url);
                setLogoName(file.name);
            } catch (error) {
                console.error('Error uploading photo:', error);
            }
        }, 'image/png');
        stopCamera();
    }, [stopCamera]);

    const onSubmit = useCallback(() => {
        const photoUrl = logo?.url?.split('?')[0] || patientDetails?.photo?.url;
        const payload = {
            id,
            ...(logo?.url
                ? {
                    photo: [{ url: photoUrl, title: logoName }],
                }
                : {}),
        };
        dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    }, [logo, patientDetails, id, logoName, dispatch]);

    return (
        <div className="g-0 px-0 mx-0">
            <div className="page-height g-0 px-0 mx-0">
                <div className="row mb-2">
                    {loading && id !== patientDetails?._id ? (
                        <div
                            style={{ height: '80vh' }}
                            className="col-12 d-flex align-items-center justify-content-center">
                            <Spinner />
                        </div>
                    ) : (
                        <Row className="align-items-stretch  pe-0">
                            <Col xs={12} className={`mb-0 ${expanded ? 'd-none' : ''} pe-0 ps-0`}>
                                <>
                                    <ul
                                        ref={menuRef}
                                        className="list-group border border-muted d-flex flex-row patientChartscroll position-relative">
                                        {patientMenuItems?.slice(0, 9)?.map((item, index) => (
                                            <li
                                                key={index}
                                                className={`cursor-pointer px-0 p-1 fs-6 text-nowrap list-group-item  
                                                       py-1 flex-fill text-center position-relative fw-bold
                                                       ${item?.subItems ? 'hasSubmenuItems' : ''}
                                                      ${selectedMainTab === item?.tab ||
                                                        item?.subItems?.some((sub) => sub.tab === selectedMainTab)
                                                        ? 'active-patient-chart-tab fw-medium'
                                                        : ''
                                                    }`}
                                                onClick={(e) => handleMenuItemClick(item, e)}>
                                                <div>
                                                    <span className="px-1 d-flex gap-2 align-items-center justify-content-center">
                                                        {item?.label}
                                                        {item?.subItems && (
                                                            <span>
                                                                {activeSubmenu === item.label ? (
                                                                    <i className="bi bi-chevron-up" />
                                                                ) : (
                                                                    <i className="bi bi-chevron-down" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>

                                                {activeSubmenu === item.label && item.subItems && (
                                                    <ul className="list-group position-absolute start-0 top-100 mt-1 bg-white shadow rounded w-100 z-3">
                                                        {item.subItems.map((subItem, subIndex) => (
                                                            <li
                                                                key={subIndex}
                                                                onClick={() => handleSubMenuClick(subItem)}
                                                                className="list-group-item submenuItem py-1 text-start fs-6">
                                                                {subItem.label}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}

                                        <li
                                            className="list-group-item py-1 text-center fs-6 position-relative cursor-pointer"
                                            onClick={handleMoreMenuClick}>
                                            <i className="bi bi-three-dots" />
                                            {showMoreMenu && (
                                                <ul className="list-group position-absolute end-50 top-100 mt-1  shadow rounded w-auto z-3">
                                                    {patientMenuItems?.slice(9)?.map((data, index) => (
                                                        <li
                                                            key={index}
                                                            onClick={() => handleMoreMenuItemClick(data)}
                                                            className="list-group-item  py-1 text-start fs-6">
                                                            {data.label}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    </ul>
                                    <Accordion
                                        className=""
                                        activeKey={activeKey}
                                        onSelect={(eventKey) => setActiveKey(eventKey)}>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header className="p-0  m-0">
                                                <div className="ps-2 py-1">
                                                    <p className="text-nowrap fs-6 mb-0">
                                                        <span
                                                            className="fw-bold text-capitalize pe-1 ps-0"
                                                            style={{
                                                                color: 'rgb(249, 139, 55)',
                                                                borderRight: '1px solid gray',
                                                            }}>
                                                            {patientName}
                                                        </span>{' '}
                                                        <span
                                                            style={{ borderRight: patientDetails?.birthDate ? '1px solid gray' : '' }}
                                                            className="fs-6 fw-bold text-capitalize px-1">
                                                            {patientDetails?.gender || ' '}
                                                        </span>
                                                        {patientDetails?.birthDate ?
                                                            <span
                                                                style={{ borderRight: '1px solid gray' }}
                                                                className="fs-6 fw-bold text-capitalize px-1">
                                                                {patientBirthDate}{' '}
                                                                {patientDetails?.birthDate ? patientAge : ''}
                                                            </span>
                                                            :
                                                            <></>}
                                                        <span className="fs-6 fw-bold text-capitalize px-1">
                                                            MRN: {patientDetails?.chartNumber || ''}
                                                        </span>
                                                    </p>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body className="p-0">
                                                <Card.Body className="py-2 px-0">
                                                    <Row className="p-0 mx-0">
                                                        <Col sm={1} className="px-0 pt-1">
                                                            <Form
                                                                onSubmit={handleSubmit(onSubmit)}
                                                                className="d-flex flex-column align-items-center">
                                                                <div className="position-relative w-100 d-flex align-items-center flex-column justify-content-center ms-3">
                                                                    {isCameraOpen ? (
                                                                        <video
                                                                            ref={videoRef}
                                                                            autoPlay
                                                                            playsInline
                                                                            className="rounded"
                                                                            style={{
                                                                                width: '120px',
                                                                                height: '90px',
                                                                                objectFit: 'cover',
                                                                            }}
                                                                        />
                                                                    ) : uploading ? (
                                                                        <Spinner />
                                                                    ) : (
                                                                        <img
                                                                            src={profileImageSrc}
                                                                            alt="Patient Profile"
                                                                            className="img-fluid rounded object-fit-cover"
                                                                            style={{
                                                                                width: '120px',
                                                                                height: '90px',
                                                                            }}
                                                                        />
                                                                    )}

                                                                    {!isCameraOpen && (
                                                                        <BiEdit
                                                                            className={`position-absolute fs-4 text-primary ${uploading ? 'd-none' : ''
                                                                                }`}
                                                                            style={{
                                                                                top: '-9%',
                                                                                right: '-10%',
                                                                                cursor: 'pointer',
                                                                            }}
                                                                            onClick={openCamera}
                                                                        />
                                                                    )}

                                                                    {isCameraOpen && (
                                                                        <div className="camera-controls d-flex justify-content-center gap-1">
                                                                            <Button
                                                                                onClick={capturePhoto}
                                                                                type="button"
                                                                                className="custom-buttons">
                                                                                <TbCapture className="text-white fs-5" />{' '}
                                                                            </Button>
                                                                            <Button
                                                                                onClick={stopCamera}
                                                                                className="custom-buttons">
                                                                                <IoClose className="text-white fs-5" />
                                                                            </Button>
                                                                        </div>
                                                                    )}

                                                                    <canvas
                                                                        ref={canvasRef}
                                                                        style={{ display: 'none' }}
                                                                    />
                                                                </div>

                                                                <Button
                                                                    // onClick={onSubmit}
                                                                    type="submit"
                                                                    className={`${!logo ? 'd-none' : 'mt-1 custom-buttons'
                                                                        }`}
                                                                    disabled={!logo}>
                                                                    Submit
                                                                </Button>
                                                            </Form>
                                                        </Col>
                                                        <Col sm={9}>
                                                            <Row className="pt-1 px-2">
                                                                <Col className="" sm={6} md={4}>
                                                                    <Table className="h-100 box-shadow-none">
                                                                        <tr className="">
                                                                            <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                                                Phone:
                                                                            </th>
                                                                            <td
                                                                                className={`fs-6 text-nowrap ${patientPhone ? 'text-black' : 'text-danger'}`}>
                                                                                {patientPhone ? `+1-${patientPhone}` : 'Missing'}
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="">
                                                                            <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                                                Email:
                                                                            </th>
                                                                            <td
                                                                                className={`fs-6 text-nowrap ${patientEmail ? 'text-black' : 'text-danger'}`}>
                                                                                {patientEmail || 'Missing'}
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="">
                                                                            <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                                                Address:
                                                                            </th>
                                                                            <td
                                                                                className={`fs-6 text-nowrap ${patientAddress ? 'text-black' : 'text-danger'}`}>
                                                                                {patientAddress || 'Missing'}
                                                                            </td>
                                                                        </tr>
                                                                    </Table>
                                                                </Col>

                                                                <Col className="" sm={6} md={4}>
                                                                    <Table className="h-100 box-shadow-none">
                                                                        <tr>
                                                                            <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                                                Primary Provider:
                                                                            </th>
                                                                            <td
                                                                                className={`fs-6 text-nowrap ${patientDetails?.doctorId?.name?.[0]
                                                                                    ?.text
                                                                                    ? 'text-black'
                                                                                    : 'text-danger'
                                                                                    }`}
                                                                                title={
                                                                                    patientDetails?.doctorId?.name?.[0]
                                                                                        ?.text
                                                                                } // optional: full name on hover
                                                                            >
                                                                                {patientDetails?.doctorId?.name?.[0]
                                                                                    ?.text
                                                                                    ? patientDetails?.doctorId?.name?.[0]?.text.slice(
                                                                                        0,
                                                                                        30
                                                                                    )
                                                                                    : 'Missing'}
                                                                            </td>
                                                                        </tr>

                                                                        <tr className="">
                                                                            <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                                                Date Added:
                                                                            </th>
                                                                            <td className="fs-6 text-nowrap text-black">
                                                                                {patientCreatedDate}
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="">
                                                                            <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                                                Insurance:
                                                                            </th>
                                                                            <td className="fs-6  text-nowrap text-danger">
                                                                                Missing
                                                                            </td>
                                                                        </tr>
                                                                    </Table>
                                                                </Col>
                                                                <Col sm={4}>
                                                                    <Table className="h-100 box-shadow-none">
                                                                        <tr className="">
                                                                            <th className="fs-6 px-2 text-nowrap text-muted fw-bold">
                                                                                Last Appointment:
                                                                            </th>
                                                                            <td className="fs-6 pe-2 text-nowrap text-danger">
                                                                                Missing
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="">
                                                                            <th className="fs-6 px-2 text-nowrap text-muted fw-bold">
                                                                                Next Appointment:
                                                                            </th>
                                                                            <td className="fs-6 pe-2 text-nowrap text-danger">
                                                                                Missing
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="">
                                                                            <th className="fs-6 px-2 text-nowrap text-muted fw-bold">
                                                                                Follow Up Reason:
                                                                            </th>
                                                                            <td
                                                                                className={`fs-6 pe-2 text-capitalize text-nowrap ${patientDetails?.followupReason
                                                                                    ? 'text-black'
                                                                                    : 'text-danger'
                                                                                    }`}>
                                                                                {patientDetails?.followupReason ||
                                                                                    'Missing'}
                                                                            </td>
                                                                        </tr>
                                                                    </Table>
                                                                </Col>
                                                            </Row>
                                                        </Col>

                                                        <Col sm={2} className="d-flex justify-content-end pe-3">
                                                            <div className="text-center d-flex flex-column gap-1">
                                                                <Button
                                                                    as={Link}
                                                                    to="/apps/appointments/newAppointment"
                                                                    className="shadow-none"
                                                                    style={{
                                                                        fontSize: '10px',
                                                                        borderRadius: '8px',
                                                                        padding: '3px 7px 3px 7px',
                                                                        width: '100px',
                                                                        backgroundColor: ' #6169d0',
                                                                    }}>
                                                                    New Appointment
                                                                </Button>
                                                                <Button
                                                                    onClick={handleNewEncounter}
                                                                    className="shadow-none"
                                                                    style={{
                                                                        fontSize: '10px',
                                                                        borderRadius: '8px',
                                                                        padding: '3px 7px 3px 7px',
                                                                        width: '100px',
                                                                        backgroundColor: ' #6169d0',
                                                                    }}>
                                                                    New Encounter
                                                                </Button>

                                                                <div className="mt-1 d-flex justify-content-center align-items-center gap-2 ps-2">
                                                                    <FaFileSignature className='cursor-pointer text-primary' onClick={() => setShowConsent(true)} />
                                                                    <IoPrintSharp
                                                                        className="fs-4 text-primary cursor-pointer "
                                                                        title="Print"
                                                                        onClick={handlePrintModal}
                                                                    />
                                                                    <LiaReceiptSolid className="fs-4  text-primary" />
                                                                </div>
                                                                <ConsentOffCanvas show={showConsent} handleClose={() => setShowConsent(false)} />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </>
                            </Col>
                            <Col xs={12} className=" pe-0 ps-0">
                                {visibleSection === 'patient' && (
                                    <div className="mt-2">
                                        <Card
                                            className="p-2 border-0"
                                            style={{
                                                height: cardHeight,
                                                maxHeight: '100%',
                                                overflow: 'hidden',
                                            }}>
                                            {selectedMainTab === 'Patient Details' && (
                                                <PatientSummary
                                                    selectedMainTab={selectedMainTab}
                                                    isAccordionOpen={isAccordionOpen}
                                                    setSelectedMainTab={setSelectedMainTab}
                                                />
                                            )}
                                            {selectedMainTab === 'Demographics' && (
                                                <Subtabs isAccordionOpen={isAccordionOpen} />
                                            )}
                                            {selectedMainTab === 'Responsible Party' && (
                                                <ResponsibleParty isAccordionOpen={isAccordionOpen} />
                                            )}
                                            {selectedMainTab === 'Reffering Doctor' && (
                                                <ReferringDoctor isAccordionOpen={isAccordionOpen} />
                                            )}
                                            {selectedMainTab === 'Insurances' && (
                                                <Insurances isAccordionOpen={isAccordionOpen} />
                                            )}
                                            {selectedMainTab === 'Eligibility' && <p>In Progress...</p>}
                                            {selectedMainTab === 'Authorizations' && <p>In Progress...</p>}
                                            {selectedMainTab === 'Documents' && (
                                                <PatientDocs isAccordionOpen={isAccordionOpen} />
                                            )}
                                            {/* {selectedMainTab === 'Encounter' && (
                                                <Encounter
                                                    expanded={expanded}
                                                    setExpanded={setExpanded}
                                                    isAccordionOpen={isAccordionOpen}
                                                    encounterTabs={encounterTabs}
                                                    createEncounter={createEncounter}
                                                    setCreateEncounter={setCreateEncounter}
                                                    setEncounterTabs={setEncounterTabs}
                                                    setSelectedMainTab={setSelectedMainTab}
                                                />
                                            )} */}
                                            {selectedMainTab === 'Encounter' && (
                                                <EncountersV2
                                                    expanded={expanded}
                                                    setExpanded={setExpanded}
                                                    isAccordionOpen={isAccordionOpen}
                                                    encounterTabs={encounterTabs}
                                                    createEncounter={createEncounter}
                                                    setCreateEncounter={setCreateEncounter}
                                                    setEncounterTabs={setEncounterTabs}
                                                    updateEncounter={updateEncounter}
                                                    setUpdateEncounter={setUpdateEncounter}
                                                    scrollToAccordion={scrollToAccordion}
                                                    setScrollToAccordion={setScrollToAccordion}
                                                />
                                            )}
                                            {[
                                                'Tobacco',
                                                'Medical',
                                                'Surgical',
                                                'Family / Genetic',
                                                'Alcohol',
                                                'Vaccination',
                                            ].includes(selectedMainTab) && (
                                                    <Subsocialtabindex
                                                        isAccordionOpen={isAccordionOpen}
                                                        defaultTab={selectedMainTab}
                                                    />
                                                )}
                                            {selectedMainTab === 'Communication' && <p>In progress...</p>}
                                            {selectedMainTab === 'Task' && <TaskListing />}
                                            {selectedMainTab === 'Imaging Requests' && <p>In progress...</p>}
                                            {selectedMainTab === 'Patient Access' && <PatientAccess />}
                                            {selectedMainTab === 'Lab Request' && <LabRequest />}
                                            {selectedMainTab === 'Drug Interactions' && <DrugInteraction />}
                                            {selectedMainTab === 'Balance' && <p>In Progress...</p>}
                                            {selectedMainTab === 'Payment' && <p>In Progress...</p>}
                                            {[
                                                'Allergy List',
                                                'Problem List',
                                                'Medication List',
                                                'Vitals List',
                                            ].includes(selectedMainTab) && (
                                                    <SubAllergytabs
                                                        isAccordionOpen={isAccordionOpen}
                                                        defaultTab={selectedMainTab}
                                                    />
                                                )}
                                        </Card>
                                    </div>
                                )}
                            </Col>
                        </Row>
                    )}
                </div>
            </div>
            <ModalPrint
                show={showPrintModal}
                onHide={handleClosePrintModal}
                patientDetails={patientDetails}
                store={store}
                id={id}
            />
        </div>
    );
};

export default UpdatePatientIndex;
