import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Accordion, Button, Card, Col, Form, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import profileDummy from '../../../../assets/images/profileDummy.png';
import { IoClose, IoPrintSharp } from 'react-icons/io5';
import { TbCapture } from 'react-icons/tb';
import { LiaReceiptSolid } from 'react-icons/lia';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAlcoholHistoryAction,
    getFamilyGeneticAction,
    getMedicationAction,
    getPatientByIdAction,
    getStatesByCountryAction,
    getSurgicalHistoryAction,
    getTobaccooAction,
    getVitalsByPatientIdAction,
    resetUpdateAction,
    updatePatientsAction,
} from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import ResponsibleParty from './ResponsibleParty';
import VitalStatus from './VitalStatus';
import { BiEdit, BiSolidLocationPlus } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { handleUpload } from '../../../../helpers/HandleUpload';
import Insurances from './Insurance/Insurance';
import ProblemList from '../Task Tabs/ProblemList';
import AssignTask from '../Task Tabs/AssignTask';
import AllergyList from '../Task Tabs/AllergyList';
import AddAssignTask from '../Task Tabs/AddAssignTask';
import FilterModal from './FilterModal';
import FilterDropdown from './FilterModal';
import Responsiblle from './ResponsibleParty';
import ReferringDoctor from './ReferringDoctor';
import { patientMenuItems } from './patientsMenuItems';
import Subtabs from './Subtabsindex';
import PatientSummary from './PatientSummary';
import Medication from './Medication';
import Subsocialtabindex from './Subsocialtabindex';
import SubAllergytabs from './SubAllergytabs';
import { getProblemListAction } from '../../../../redux/ProblemList/action';

const UpdatePatientIndex = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        clearErrors,
        watch,
        getValues,
    } = useForm();
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    const updateSuccess = store?.updatePatientsReducer?.data?.status;
    const updateResponsibleParty = store?.updateResponsiblePartyReducer?.data?.status;
    const [profilePhoto, setProfilePhoto] = useState(profileDummy);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [selectedMainTab, setSelectedMainTab] = useState('Patient Details');
    const [selectedSubTab, setSelectedSubTab] = useState('Allergy List');
    const [visibleSection, setVisibleSection] = useState('patient'); // Default section
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const toggleSubmenu = (label) => {
        setActiveSubmenu((prev) => (prev === label ? null : label));
    };

    useEffect(() => {
        const tab = sessionStorage?.getItem('selectedMainTab');
        if (tab) {
            setSelectedMainTab(tab);
        }
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveSubmenu(null);
                setShowMoreMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // useEffect(() => {
    //     const payload = {
    //         id: id,
    //     };
    //     // check this api it create 19 api hit 
    //     if (id) {
    //     }
    // }, [id])
    // useEffect(() => {
    //     const payload = {
    //         id: id,
    //     };
    //     // check this api it create 19 api hit 
    //     if (id) {
    //         dispatch(getMedicationAction({ patientId: id }));
    //         dispatch(getSurgicalHistoryAction({ patientId: id }));
    //     }
    //     if (
    //         updateSuccess === 200 ||
    //         updateResponsibleParty === 200 ||
    //         store?.createResponsiblePartyReducer?.data?.status === 201
    //     ) {
    //         dispatch(getPatientByIdAction(payload));
    //         dispatch(resetUpdateAction());
    //         setLogo(null);
    //         setLogoName('');
    //         setProfilePhoto(null);
    //     }
    // }, [id, updateSuccess, updateResponsibleParty, store?.createResponsiblePartyReducer?.data?.status]);
    useEffect(() => {
        dispatch(getStatesByCountryAction());
        dispatch(getPatientByIdAction({ id: id }));
        dispatch(getSurgicalHistoryAction({ patientId: id }));
        dispatch(getTobaccooAction({ patientId: id }));
        dispatch(getFamilyGeneticAction({ patientId: id }));
        dispatch(getProblemListAction({ patientId: id }));
        dispatch(getAlcoholHistoryAction({ patientId: id }))
        dispatch(getMedicationAction({ patientId: id }));

    }, [dispatch, id]);
    // useEffect(() => {

    // }, [dispatch]);

    const openCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }, // Open front camera
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };
    const [uploading, setUploading] = useState(false);
    const capturePhoto = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas image to Blob
            canvas.toBlob(async (blob) => {
                if (blob) {
                    const file = new File([blob], `profile-photo-${Date.now()}.png`, { type: 'image/png' });

                    try {
                        const url = await handleUpload(file, setUploading);
                        setLogo(url);
                        setLogoName(file?.name);
                    } catch (error) {
                        console.error('Error uploading photo:', error);
                    }
                }
            }, 'image/png');

            stopCamera();
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        setIsCameraOpen(false);
    };
    const onSubmit = (data) => {
        const payload = {
            id: id,
            ...(logo?.url === null
                ? []
                : {
                    photo: [
                        {
                            url: logo?.url?.split('?')[0] || patientDetails?.photo?.url,
                            title: logoName,
                        },
                    ],
                }),
        };
        dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    };

    const [activeKey, setActiveKey] = useState('0');
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const isAccordionOpen = activeKey === '0'; // true or false

    return (
        <div className="mt-1 g-0  px-0 mx-0">
            <div className="page-height g-0 px-0 mx-0">
                <div className="row mb-2">
                    {store?.getPatientByIdReducer?.loading ? (
                        <div
                            style={{ height: '80vh' }}
                            className="col-12 d-flex align-items-center justify-content-center">
                            <Spinner />
                        </div>
                    ) : (
                        <Row className=" align-items-stretch pe-0">
                            <Col xs={12} className="mb-0 pe-0 ps-0">
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (item.subItems) {
                                                    toggleSubmenu(item.label);
                                                    // setActiveSubmenu(null);
                                                } else {
                                                    setSelectedMainTab(item.tab);
                                                    sessionStorage.setItem('selectedMainTab', item.tab);
                                                    setActiveSubmenu(null);
                                                }
                                            }}>
                                            <div>
                                                <span className="px-1 d-flex gap-2 align-items-center justify-content-center">
                                                    {item.label}
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
                                                            onClick={() => {
                                                                setSelectedMainTab(subItem.tab);
                                                                sessionStorage.setItem('selectedMainTab', subItem.tab);

                                                                // setActiveSubmenu(null);
                                                                // setShowMoreMenu(false);
                                                            }}
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
                                        onClick={() => setShowMoreMenu((prev) => !prev)}>
                                        <i className="bi bi-three-dots" />
                                        {showMoreMenu && (
                                            <ul className="list-group position-absolute end-50 top-100 mt-1  shadow rounded w-auto z-3">
                                                {patientMenuItems?.slice(9)?.map((data, index) => (
                                                    <li
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedMainTab(data.tab);
                                                            sessionStorage.setItem('selectedMainTab', data.tab);
                                                            setShowMoreMenu(false);
                                                            // setShowMoreMenu(false);
                                                            // setShowMoreMenu(false);
                                                            // setShowMoreMenu(false);
                                                        }}
                                                        className="list-group-item submenuItem py-1 text-start fs-6">
                                                        {data.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                </ul>
                            </Col>
                            <Col xs={12} className=" pe-0 ps-0">
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
                                                        {patientDetails?.name?.[0]?.prefix + ' ' || ''}
                                                        {patientDetails?.name?.[0]?.given?.join(' ') + ' ' || 'N/A'}
                                                        {patientDetails?.name?.[0]?.family || ''}
                                                    </span>{' '}
                                                    <span
                                                        style={{ borderRight: '1px solid gray' }}
                                                        className="fs-6 fw-bold text-capitalize px-1">
                                                        {patientDetails?.gender || ' '}
                                                    </span>
                                                    <span
                                                        style={{ borderRight: '1px solid gray' }}
                                                        className="fs-6 fw-bold text-capitalize px-1">
                                                        {patientDetails?.birthDate
                                                            ? new Date(patientDetails.birthDate).toLocaleDateString(
                                                                'en-GB'
                                                            )
                                                            : 'N/A'}{' '}
                                                        {patientDetails?.approxAge &&
                                                            (() => {
                                                                const years = Math.floor(patientDetails.approxAge);
                                                                const months = Math.round(
                                                                    (patientDetails.approxAge - years) * 12
                                                                );
                                                                return `(${years} year${years !== 1 ? 's old)' : ''} `;
                                                            })()}
                                                    </span>
                                                    <span className="fs-6 fw-bold text-capitalize px-1">
                                                        Chart ID: {patientDetails?.chartNumber || ''}
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
                                                            <div className="position-relative w-75 d-flex align-items-center flex-column justify-content-center">
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
                                                                        src={
                                                                            logo?.url
                                                                                ? logo.url.split('?')[0]
                                                                                : patientDetails?.photo[0]?.url
                                                                                    ? patientDetails.photo[0]?.url
                                                                                    : profilePhoto
                                                                        }
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

                                                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                                                            </div>

                                                            {/* Submit button that sends the form after upload */}
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
                                                                            className={`fs-6  text-nowrap  ${patientDetails?.telecom?.find(
                                                                                (data) => data?.system === 'phone'
                                                                            )?.value
                                                                                ? 'text-black'
                                                                                : 'text-danger'
                                                                                }`}>
                                                                            {'+1-' +
                                                                                patientDetails?.telecom?.find(
                                                                                    (data) => data?.system === 'phone'
                                                                                )?.value || 'Missing'}
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="">
                                                                        <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                                            Email:
                                                                        </th>
                                                                        <td
                                                                            className={`fs-6  text-nowrap text-black ${patientDetails?.telecom?.find(
                                                                                (item) => item?.system === 'email'
                                                                            )?.value
                                                                                ? 'text-black'
                                                                                : 'text-danger'
                                                                                }`}>
                                                                            {patientDetails?.telecom?.find(
                                                                                (item) => item?.system === 'email'
                                                                            )?.value || 'Missing'}
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="">
                                                                        <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                                            Address:
                                                                        </th>
                                                                        <td
                                                                            className={`fs-6  text-nowrap ${patientDetails?.address?.[0]?.city &&
                                                                                patientDetails?.address?.[0]?.state
                                                                                ? 'text-black'
                                                                                : 'text-danger'
                                                                                }`}>
                                                                            {patientDetails?.address?.[0]?.city &&
                                                                                patientDetails?.address?.[0]?.state
                                                                                ? `${patientDetails.address[0].city}, ${patientDetails.address[0].state}`
                                                                                : 'Missing'}
                                                                        </td>
                                                                    </tr>
                                                                </Table>
                                                            </Col>

                                                            <Col className="" sm={6} md={4}>
                                                                <Table className="h-100 box-shadow-none">
                                                                    <tr className="">
                                                                        <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                                            Primary Provider:
                                                                        </th>
                                                                        <td
                                                                            className={`fs-6 text-nowrap ${patientDetails?.doctorId?.name?.[0]
                                                                                ?.text
                                                                                ? 'text-black'
                                                                                : 'text-danger'
                                                                                }`}>
                                                                            {patientDetails?.doctorId?.name?.[0]
                                                                                ?.text || 'Missing'}
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="">
                                                                        <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                                            Date Added:
                                                                        </th>
                                                                        <td className="fs-6 text-nowrap text-black">
                                                                            {' '}
                                                                            {new Date(
                                                                                patientDetails?.createdAt
                                                                            )?.toLocaleDateString('en-GB')}
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
                                                                        <td className="fs-6 pe-2 text-nowrap text-black">
                                                                            16/04/2025
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="">
                                                                        <th className="fs-6 px-2 text-nowrap text-muted fw-bold">
                                                                            Next Appointment:
                                                                        </th>
                                                                        <td className="fs-6 pe-2 text-nowrap text-black">
                                                                            26/05/2025
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="">
                                                                        <th className="fs-6 px-2 text-nowrap text-muted fw-bold">
                                                                            Follow Up Reason:
                                                                        </th>
                                                                        <td
                                                                            className={`fs-6 pe-2 text-nowrap ${patientDetails?.followupReason
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
                                                        <div className="text-center d-flex flex-column">
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
                                                                as={Link}
                                                                to="#"
                                                                className="mt-1 shadow-none"
                                                                style={{
                                                                    fontSize: '10px',
                                                                    borderRadius: '8px',
                                                                    padding: '3px 7px 3px 7px',
                                                                    width: '100px',
                                                                    backgroundColor: ' #6169d0',
                                                                }}>
                                                                New Encounter
                                                            </Button>

                                                            <div className="mt-2 d-flex justify-content-center gap-2 ps-2 ">
                                                                <IoPrintSharp className="fs-4 text-black" />
                                                                <LiaReceiptSolid className="fs-4 text-black" />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                {visibleSection === 'patient' && (
                                    <div className="mt-2">
                                        <Card className="px-2 " style={{ height: isAccordionOpen ? '66vh' : '85vh' }}>
                                            <div className="mt-1 px-0">
                                                {selectedMainTab === 'Patient Details' && (
                                                    <PatientSummary
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
                                                {selectedMainTab === 'Documents' && <p>In progress...</p>}
                                                {selectedMainTab === 'Encounter' && <p>In progress...</p>}
                                                {/* {selectedMainTab === 'Medication List' && <Medication isAccordionOpen={isAccordionOpen} />} */}
                                                {/* {selectedMainTab === 'Vitals List' && <VitalStatus isAccordionOpen={isAccordionOpen} />} */}
                                                {[
                                                    'Tabacco',
                                                    'Medical History',
                                                    'Surgical',
                                                    'Family / Genetic',
                                                    'Alcohol',
                                                    'Vaccination',
                                                ].includes(selectedMainTab) && (
                                                        <Subsocialtabindex isAccordionOpen={isAccordionOpen} />
                                                    )}
                                                {/* {selectedMainTab === 'Medical' && <p>In progress...</p>} */}
                                                {/* {selectedMainTab === 'Family / Genetic' && <p>In progress...</p>} */}
                                                {/* {selectedMainTab === 'Alcohol' && <p>In progress...</p>} */}
                                                {/* {selectedMainTab === 'Vaccination' && <p>In progress...</p>} */}
                                                {selectedMainTab === 'Communication' && <p>In progress...</p>}
                                                {selectedMainTab === 'Task' && <p>In progress...</p>}
                                                {/* {selectedMainTab === 'Surgical' && <p>In progress...</p>} */}
                                                {selectedMainTab === 'Imaging Requests' && <p>In progress...</p>}
                                                {selectedMainTab === 'Patient Access' && <p>In progress...</p>}
                                                {selectedMainTab === 'Lab Request' && <p>In progress...</p>}
                                                {selectedMainTab === 'Drug Interactions' && <p>In progress...</p>}
                                                {selectedMainTab === 'Balance' && <p>In Progress...</p>}
                                                {selectedMainTab === 'Payment' && <p>In Progress...</p>}
                                                {/* {selectedMainTab === 'Allergy List' && <AllergyList />} */}
                                                {/* {selectedMainTab === 'Problem List' && (
                                                    <ProblemList isAccordionOpen={isAccordionOpen} />
                                                )} */}
                                                {[
                                                    'Allergy List',
                                                    'Problem List',
                                                    'Medication List',
                                                    'Vitals List',
                                                ].includes(selectedMainTab) && (
                                                        <SubAllergytabs isAccordionOpen={isAccordionOpen} />
                                                    )}
                                            </div>
                                        </Card>
                                    </div>
                                )}
                            </Col>
                        </Row>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdatePatientIndex;