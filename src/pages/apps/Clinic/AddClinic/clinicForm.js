import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Col, Form, Row, Button, Table, Modal, InputGroup, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Spinner from '../../../../constants/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import profileDummy from '../../../../assets/images/profileDummy.png';
import us from '../../../../assets/images/flags/us.jpg';
import {
    createClinicAction, getCities2Action, getCities3Action, getCities4Action, getCities5Action,
    getCities6Action, getCitiesAction, getClinicAction, getClinicById, getClinicByParentAction, getClinicTypeAction,
    getStatesByCountryAction, updateClinicAction,
} from '../../../../redux/clinics/actions';
import { VscLoading } from 'react-icons/vsc';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { FiDownloadCloud, FiEdit, FiEye, FiInfo, FiMinus, FiTrash } from 'react-icons/fi';
import UploadToS3 from '../../../../helpers/uploads3';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { encryptMessage } from '../../../../cryptoUtils';
import ToastHandle from '../../../../helpers/ToastMessage';
import { FiUploadCloud } from 'react-icons/fi';
import ChangePasswordModal from '../../../../components/ChangePasswordModal';
import { handleFirstSpace } from '../../../../helpers/noSpace';
import { getDoctorsAction, getSubClinicAction } from '../../../../redux/actions';
import { FormInput } from '../../../../components';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked, MdVerified } from 'react-icons/md';
import { components } from 'react-select';

const ClinicForm = ({ setActiveTab, setClinicId, clinicId, setBillingId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        getValues,
        setError,
        clearErrors,
    } = useForm();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'));
    const [usePrimaryAsMailing, setUsePrimaryAsMailing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const updateId = searchParams.get('updateid');
    const [updatePage, setUpdatePage] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [focused, setFocused] = useState(false);
    const [focused2, setFocused2] = useState(false);
    const [subClinic, setSubClinic] = useState('');
    const [taxonomyCodes, setTaxonomyCodes] = useState(['']);
    const [medicalLicenses, setMedicalLicenses] = useState(null);
    const [logo, setLogo] = useState(null);
    const [accreditationLogo, setAccreditationLogo] = useState(null);
    const [addType, setAddType] = useState('');
    const [logoName, setLogoName] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalPic, setShowModalPic] = useState(false);
    const [modalFileUrl, setModalFileUrl] = useState('');

    const handleShowModal = (url) => {
        setModalFileUrl(url);
        setShowModalPic(true);
    };

    const handleCloseModal = () => {
        setShowModalPic(false); // Close the modal
        setModalFileUrl(''); // Reset file URL
    };
    // table data
    // const [detailsModal, setDetailsModal] = useState(false);
    // const [selectedDetails, setSelectedDetails] = useState(null);
    // const [status, setStatus] = useState(true);
    // const [search, setSearch] = useState('');

    // const handleStatusChange = (isActive) => {
    //     setStatus(isActive);
    // };

    const closeModal = () => setShowModal(false);
    // const handleMultipleAdd = () => {
    //     navigate('/apps/Practice/new-practice')
    // }
    // const [clinicId, setClinicId] = useState(null);

    // const [medicalDetails, setMedicalDetails] = useState([
    //     { name: '', number: '', url: null, fileName: '' }
    // ]);
    const [posDetails, setPosDetails] = useState([{ name: '', email: '', role: '', contact: '', fileName: '' }]);

    const [stateDetails, setStateDetails] = useState([{ name: '', number: '', url: null, fileName: '' }]);

    const [longitude, setLongitude] = useState(null);
    const [longitude1, setLongitude1] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [latitude1, setLatitude1] = useState(null);
    const [stateToSelect, setStateToSelect] = useState(null);
    const [nextClicked, setNextClicked] = useState(false);
    const clinectypes = store?.getClinicTypeReducer?.data?.result;
    const createResponse = store?.createClinicsReducer?.data?.status;
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const clinicsList = store?.getClinicsByParentReducer?.data?.data;
    const statesData = store?.getStatesReducer?.data;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const cities3 = store?.getCitiesReducer?.cities3?.data?.cities;
    const [identifierDocument, setIdentifierDocumnent] = useState(false);

    const handleAddTaxonomy = () => {
        const lastCode = taxonomyCodes[taxonomyCodes.length - 1];

        if (lastCode) {
            const validCodes = taxonomyCodes.filter((code) => code.trim() !== '');
            setTaxonomyCodes([...validCodes, '']);
        } else {
            ToastHandle('Please complete the current Taxonomy Code field before adding another.', 'danger');
        }
    };
    // const handleTaxonomyChange = (index, value) => {
    //     const updatedCodes = [...taxonomyCodes];
    //     updatedCodes[index] = value;
    //     setTaxonomyCodes(updatedCodes);
    // };
    // const handleRemoveTaxonomy = (index) => {
    //     setTaxonomyCodes((prev) => {
    //         const updatedCodes = prev.filter((_, i) => i !== index);
    //         return updatedCodes.length > 0 ? updatedCodes : [''];
    //     });
    // };
    const handleStateSelection = (e, addressType, index) => {
        const selectedOption = e.target.selectedOptions[0];
        const stateId = selectedOption.getAttribute('data-key');

        // Update the addresses state first
        const updatedAddresses = [...addresses];
        updatedAddresses[index] = {
            ...updatedAddresses[index],
            state: e.target.value,
        };
        setAddresses(updatedAddresses);

        // Then fetch cities based on address type
        if (addressType === 'physical') {
            dispatch(getCitiesAction({ state_code: stateId, name: '', limit: 25, skip: '' }));
        } else if (addressType === 'postal') {
            dispatch(getCities2Action({ state_code: stateId, name: '', limit: 25, skip: '' }));
        } else {
            dispatch(getCities3Action({ state_code: stateId, name: '', limit: 25, skip: '' }));
        }
    };
    const [citiesByType, setCitiesByType] = useState({});
    const cachedCities = citiesByType
    useEffect(() => {
        dispatch(getClinicAction({ key: encryptMessage({ clinicId: clinic_id?.clinicId }) }));
        dispatch(getSubClinicAction());
        dispatch(getStatesByCountryAction());
    }, [dispatch]);
    const clinicsDataGet = store?.getClinicsReducer?.data?.clinic;
    const setField = (key, value) => value && setValue(key, value);
    // useEffect(() => {
    //     setField('clinicType', clinicsDataGet?.orgType);
    //     setLogo(clinicsDataGet?.orgLogo?.url);
    //     // setField('contact', clinicsDataGet?.userId?.phone?.startsWith("+1")
    //     //     ? clinicsDataGet.userId.phone.substring(2)
    //     //     : clinicsDataGet?.userId?.phone);
    //     setValue(
    //         'contact',
    //         clinicsDataGet?.userId?.phone
    //             ? clinicsDataGet?.userId?.phone
    //                   .replace(/\+1/, '') // Remove all non-numeric characters
    //                   .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
    //                       p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}`
    //                   )
    //             : ''
    //     );
    //     setField('clinicname', clinicsDataGet?.name);
    //     setField('practiceSpecialty', clinicsDataGet?.practiceSpecialty);
    //     setField('taxId', clinicsDataGet?.taxIdOrEIN);
    //     setField('npi', clinicsDataGet?.npiNumber);
    //     setField('email', clinicsDataGet?.userId?.email);
    //     setField('medicare', clinicsDataGet?.medicareNumber);
    //     setField('medicaid', clinicsDataGet?.medicaidNumber);
    //     setField('clia', clinicsDataGet?.CLIA_Number);
    //     setField('address', clinicsDataGet?.userId?.primaryAddress?.address);
    //     setField('street', clinicsDataGet?.userId?.primaryAddress?.street);
    //     setField('zip', clinicsDataGet?.userId?.primaryAddress?.zip);
    //     setLatitude(clinicsDataGet?.userId?.primaryAddress?.latitude);
    //     setLongitude(clinicsDataGet?.userId?.primaryAddress?.longitude);
    //     setField('stateName', clinicsDataGet?.userId?.primaryAddress?.state?._id);
    //     if (clinicsDataGet?.userId?.primaryAddress?.city) {
    //         dispatch(
    //             getCitiesAction({
    //                 state_code: clinicsDataGet?.userId?.primaryAddress?.state?.id,
    //                 name: clinicsDataGet?.userId?.primaryAddress?.city?.name,
    //                 limit: '',
    //                 skip: '',
    //             })
    //         );
    //     }
    //     setField('mailingAddress', clinicsDataGet?.userId?.mailingAddress?.address);
    //     setField('mailingStreet', clinicsDataGet?.userId?.mailingAddress?.street);
    //     setField('mailingZip', clinicsDataGet?.userId?.mailingAddress?.zip);
    //     setLatitude1(clinicsDataGet?.userId?.mailingAddress?.latitude);
    //     setLongitude1(clinicsDataGet?.userId?.mailingAddress?.longitude);
    //     setField('mailingStateName', clinicsDataGet?.userId?.mailingAddress?.state?._id);
    //     setUsePrimaryAsMailing(clinicsDataGet?.userId?.isPrimaryAndMailingAddressSame);
    //     if (clinicsDataGet?.userId?.mailingAddress?.city) {
    //         dispatch(
    //             getCities2Action({
    //                 state_code: clinicsDataGet?.userId?.mailingAddress?.state?.id,
    //                 name: clinicsDataGet?.userId?.mailingAddress?.city?.name,
    //                 limit: '',
    //                 skip: '',
    //             })
    //         );
    //     }
    //     // if (clinicsDataGet?.accreditationDetails) {
    //     //     setAccreditationDetails(clinicsDataGet?.accreditationDetails);
    //     // } else {
    //     //     setAccreditationDetails([...accreditationDetails, { name: '', number: '', url: null }]);
    //     // }

    //     // if (clinicsDataGet?.taxonomyCodes) {
    //     //     setTaxonomyCodes(clinicsDataGet?.taxonomyCodes);
    //     //     clinicsDataGet?.taxonomyCodes?.forEach((code, index) => {
    //     //         setValue(`taxonomyCode[${index}]`, code);
    //     //     });
    //     // }
    //     // if (clinicsDataGet?.taxonomyCodes?.length === 0) {
    //     //     setTaxonomyCodes(['']);
    //     // } else {
    //     //     setTaxonomyCodes(clinicsDataGet?.taxonomyCodes);
    //     //     clinicsDataGet?.taxonomyCodes?.forEach((code, index) => {
    //     //         setValue(`taxonomyCode[${index}]`, code);
    //     //     });
    //     // }
    //     if (clinicsDataGet?.pos) {
    //         setPosDetails(clinicsDataGet?.pos);
    //     }
    //     if (clinicsDataGet?.orgLogo) {
    //         setLogoName(clinicsDataGet?.orgLogo?.fileName);
    //     }
    //     if (clinicsDataGet?.stateOfLicensing) {
    //         setStateDetails(clinicsDataGet?.stateOfLicensing);
    //     }
    // }, [dispatch, clinicsDataGet, statesData, setValue]);
    useEffect(() => {
        if (clinicsDataGet) {
            setValue('clinicType', clinicsDataGet?.orgType);
            setField('clinicname', clinicsDataGet?.name);
            setField('email', clinicsDataGet?.userId?.email);
            if (clinicsDataGet?.orgLogo) {
                setLogoName(clinicsDataGet.orgLogo.fileName);
            }

            // ✅ Ensure at least 'NPI', 'CLIA', 'NAIC' are set
            let identifiers =
                clinicsDataGet?.identifier?.map((data) => ({
                    type: data.identifierType || '',
                    number: data?.value || '',
                    // file: data?.file|| '',
                    file: data?.documents?.[0]?.fileName
                        ? {
                            url: data?.documents?.[0]?.url, // Store URL
                            name: data?.documents?.[0]?.fileName, // Extract filename from URL
                        }
                        : '',
                    expiry: data?.expirationDate || '',
                    issuingAuthority: data.issuingAuthority || '',
                    use: data.use || '',
                })) || [];
            // If no identifiers exist, default to 'NPI', 'CLIA', 'NAIC'
            if (identifiers.length === 0) {
                identifiers = defaultIdentifiers?.map((type) => ({
                    type,
                    number: '',
                    file: '',
                    expiry: '',
                    issuingAuthority: '',
                    use: '',
                }));
            }

            setConstantIdentifiers(identifiers);

            // ✅ Ensure at least 'phone' and 'email' are set
            let contacts =
                clinicsDataGet.telecom?.map((contact) => ({
                    system: contact.system || '',
                    value: contact.value || '',
                    use: contact.use || '',
                })) || [];

            if (contacts.length === 0) {
                contacts = contactDetails.map((system) => ({
                    system,
                    value: '',
                    use: '',
                }));
            }

            setConstantContact(contacts);

            // ✅ Set Addresses
            const newAddresses = clinicsDataGet?.address?.map((addr) => ({
                type: addr.type || '',  // Make sure type is included
                use: addr.use || '',
                line: addr.line && Array.isArray(addr.line) ? addr.line : [''],
                city: addr.city || '',
                state: addr.state || '',
                postalCode: addr.postalCode || '',
                country: addr.country || 'US',
            })) || [{ type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }];
            setAddresses(newAddresses);
            if (statesData?.states) {
                newAddresses.forEach((address) => {
                    const state = statesData.states.find(s => s.name === address.state);
                    if (!state) return;

                    if (address.type === 'physical') {
                        dispatch(getCitiesAction({
                            state_code: state.id,
                            name: address.city,
                            limit: 25,
                            skip: ''
                        }));
                    } else if (address.type === 'postal') {
                        dispatch(getCities2Action({
                            state_code: state.id,
                            name: address.city,
                            limit: 25,
                            skip: ''
                        }));
                    } else {
                        dispatch(getCities3Action({
                            state_code: state.id,
                            name: address.city,
                            limit: 25,
                            skip: ''
                        }));
                    }
                });
            }
            // addresses?.map((data) => (
            //     data?.use === 'primary' ?
            //         dispatch(getCitiesAction({ state_code: statesData?.states?.find((item) => item?.name === data?.state)?.id, name: data?.city, limit: 25, skip: '' })) :
            //         data?.use === 'postal' ?
            //             dispatch(getCities2Action({ state_code: statesData?.states?.find((item) => item?.name === data?.state)?.id, name: data?.city, limit: 25, skip: '' })) :
            //             dispatch(getCities3Action({ state_code: statesData?.states?.find((item) => item?.name === data?.state)?.id, name: data?.city, limit: 25, skip: '' }))
            // ))
            // ✅ Set POCs (Point of Contacts)
            setPocs(
                clinicsDataGet?.poc?.map((pocs) => ({
                    name: {
                        use: pocs.name?.use || '',
                        text: pocs.name?.text || '',
                        family: pocs.name?.family || '',
                        given: pocs.name?.given || [''], // Ensure array
                        prefix: pocs.name?.prefix || [''], // Ensure array
                        suffix: pocs.name?.suffix || [], // Ensure array
                    },
                    email: pocs.email || '',
                    role: pocs.role || '',
                    telecom: pocs.telecom?.map((tele) => ({
                        system: tele.system || '',
                        value: tele.value || '',
                        use: tele.use || '',
                    })) || [{ system: '', value: '', use: '' }], // Default telecom
                })) || [
                    {
                        name: {
                            use: '',
                            text: '',
                            family: '',
                            given: [''],
                            prefix: [''],
                            suffix: [],
                        },
                        email: '',
                        role: '',
                        telecom: [{ system: '', value: '', use: '' }],
                    },
                ]
            );
        }
    }, [clinicsDataGet, setValue]);

    const SubmitData = (data) => {
        if (data.Password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            return;
        }
        sessionStorage.setItem('logo', logo?.url?.split('?')[0] || clinicsDataGet?.logo?.url);
        const newPayload = {
            clinicId: clinic_id?.clinicId,
            userId: clinic_id?._id,
            ...(clinicsList && { parentClinic: clinicId }),
            ...(updateId && { id: updateId }),
            name: data?.clinicname,
            // active: true,
            email: data?.email,
            orgType: data?.clinicType,
            // orgSpecialty: [],
            orgLogo: {
                url: logo?.url ? logo?.url?.split('?')[0] : '', // Check if url exists first
                fileName: logoName || '',
            },
            identifier: constantIdentifiers.map((item) => ({
                identifierType: item.type,
                use: item.use,
                value: item.number,
                documents: item.file ? { url: item.file.url, fileName: item.file.name || '' } : null,
                // documents: [item?.file?.url],
                expirationDate: item.expiry,
                status: 'active',
                system: 'urn:oid:2.16.840.1.113883.4.7',
                sliceName: item.type,
                issuingAuthority: item.issuingAuthority,
            })),
            telecom: constantContact,
            address: addresses,
            poc: pocs,

            // ...(clinicsList && { parentClinic: clinicId }),
            // ...(updateId && { id: updateId }),
            // name: data?.clinicname || clinicsDataGet?.name,
            // practiceSpecialty: data?.practiceSpecialty || clinicsDataGet?.practiceSpecialty,
            // email: data?.email || clinicsDataGet?.userId?.email,
            // phone: '+1' + data?.contact?.replace(/\D/g, '') || '+1' + clinicsDataGet?.userId?.phone,
            // clinicType: data?.clinicType || clinicsDataGet?.clinicType,
            // taxIdOrEIN: data?.taxId?.replace(/\D/g, ''),
            // npiNumber: data?.npi,
            // CLIA_Number: data?.clia,
            // medicareNumber: data?.medicare,
            // medicaidNumber: data?.medicaid,
            // taxonomyCodes: taxonomyCodes.filter((code) => code),
            // isPrimaryAndMailingAddressSame: usePrimaryAsMailing,
            // flag: 'Clinic',
            // ...(stateDetails && { stateOfLicensing: stateDetails }),
            // // ...(accreditationDetails && { accreditationDetails: accreditationDetails }),
            // ...(posDetails && { pos: posDetails }),
            // // ...(logo ?
            // //     {
            // logo: {
            //     url: logo,
            //     fileName: logoName,
            // },
            // // }
            // // : ''),
            // primaryAddress: {
            //     address: data?.address,
            //     ...(data?.city ? { city: data?.city } : ''),
            //     ...(data?._id ? { state: data?._id } : ''),
            //     ...(data?.stateName ? { state: data?.stateName } : ''),
            //     street: data?.street,
            //     zip: data?.zip,
            //     ...(latitude ? { latitude: latitude } : ''),
            //     ...(longitude ? { longitude: longitude } : ''),
            // },
            // mailingAddress: usePrimaryAsMailing
            //     ? {
            //           address: data?.address,
            //           ...(data?.city ? { city: data?.city } : ''),
            //           ...(data?.stateName ? { state: data?.stateName } : ''),
            //           street: data?.street,
            //           zip: data?.zip,
            //           ...(latitude ? { latitude: latitude } : ''),
            //           ...(longitude ? { longitude: longitude } : ''),
            //       }
            //     : {
            //           address: data?.mailingAddress,
            //           ...(data?.mailingCity ? { city: data?.mailingCity } : ''),
            //           ...(data?.mailingStateName ? { state: data?.mailingStateName } : ''),
            //           street: data?.mailingStreet,
            //           zip: data?.mailingZip,
            //           ...(latitude1 ? { latitude: latitude1 } : ''),
            //           ...(longitude1 ? { longitude: longitude1 } : ''),
            //       },
        };
        dispatch(createClinicAction({ key: encryptMessage(newPayload) }));
        // console.log(newPayload, '934873890')
    };
    const logoFileInputRef = useRef(null);
    // const accreditationFileInputRef = useRef(null);
    // const medicalFileInputRef = useRef(null);
    // const stateFileInputRef = useRef(null);
    const handleLogoClick = () => {
        logoFileInputRef.current.click();
    };

    const [logoUploading, setLogoUploading] = useState(false);
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setLogoUploading);
            setLogo(url?.url?.split('?')[0]);
            setLogoName(selectedFile?.name);
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    // const [newaccreditationLogo, setNewAccreditationLogo] = useState(false);
    // const handleAccreditationChange = async (e, index) => {
    //     const selectedFile = e.target.files[0];
    //     try {
    //         const url = await handleUpload(selectedFile, setNewAccreditationLogo);
    //         setAccreditationDetails((prevDetails) => {
    //             const updatedDetails = [...prevDetails];
    //             updatedDetails[index] = {
    //                 ...updatedDetails[index],
    //                 url: url?.url?.split('?')[0],
    //                 fileName: selectedFile.name,
    //             };
    //             return updatedDetails;
    //         });
    //     } catch (error) {
    //         console.error('Error during file upload:', error);
    //     }
    // };

    // const handleAccreditationInputChange = (e, field, index) => {
    //     const value = e.target.value;
    //     setAccreditationDetails((prevDetails) => {
    //         const updatedDetails = [...prevDetails];
    //         updatedDetails[index] = {
    //             ...updatedDetails[index],
    //             [field]: value,
    //         };
    //         return updatedDetails;
    //     });
    // };
    const handleAddPOS = () => {
        const isIncomplete = posDetails.some((pos) => !pos.name || !pos.role || !pos.contact || !pos.email);

        if (isIncomplete) {
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setPosDetails([...posDetails, { name: '', email: '', role: '', contact: '' }]);
    };
    const handleRemovePOS = (index) => {
        setPosDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };

    const handlePOSInputChange = (e, field, index) => {
        const value = e.target.value;
        setPosDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value,
            };
            return updatedDetails;
        });
    };

    // const handleAddAccreditation = () => {
    //     const isIncomplete = accreditationDetails.some((data) => !data.name || !data.number || !data.url);
    //     if (isIncomplete) {
    //         ToastHandle('Please fill all the fields before adding a new one', 'danger');
    //         return;
    //     }
    //     setAccreditationDetails([...accreditationDetails, { name: '', number: '', url: null }]);
    // };

    // const handleRemoveAccreditation = (index) => {
    //     setAccreditationDetails((prevDetails) => {
    //         const updatedDetails = prevDetails.filter((_, i) => i !== index);
    //         return updatedDetails;
    //     });
    // };

    const handleAddState = () => {
        const isIncomplete = stateDetails.some((state) => !state.name || !state.number || !state.url);
        if (isIncomplete) {
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setStateDetails([...stateDetails, { name: '', number: '', url: null }]);
    };

    useEffect(() => {
        if (clinicsDataGet?.clinicType) {
            setValue('clinicType', clinicsDataGet.clinicType);
        }
    }, [clinicsDataGet, setValue]);

    const [searchedLocations, setSearchedLocations] = useState(null);
    const [searchedLocations2, setSearchedLocations2] = useState(null);

    const getGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                location
            )}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Failed to fetch geocode data:', error);
                return null;
            }
        }
        fetchGeocodeData(addressToSearch).then((data) => {
            if (data) {
                setSearchedLocations(data?.results);
            }
        });
    };

    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        if (selectedLocation) {
            setLatitude(selectedLocation?.bounds?.southwest?.lat);
            setLongitude(selectedLocation?.bounds?.southwest?.lng);
            setValue('address', selectedLocation?.formatted);
            const stateId =
                statesData?.states &&
                statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?.id;
            const selectedState =
                statesData?.states &&
                statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?._id;
            setValue('stateName', selectedState);
            const countyName = selectedLocation?.components?.county;
            dispatch(getCitiesAction({ state_code: stateId, name: countyName, limit: '', skip: '' }));
        }
    }, [selectedLocation, setValue, statesData, dispatch]);
    useEffect(() => {
        if (cities1) {
            const selectedCounty =
                cities1 &&
                cities1.find(
                    (data) =>
                        data?.name === selectedLocation?.components?.county ||
                        clinicsDataGet?.userId?.primaryAddress?.city?.name
                )?._id;
            setValue('city', selectedCounty);
        }
    }, [cities1]);
    const getTableData = store.getSubClinicsReducer?.data?.clinics;
    // const [selectedStates, setSelectedStates] = useState([]);
    const [statesMenu, setStatesMenu] = useState(false);
    // const handleCheckboxChange = (stateName) => {
    //     setSelectedStates((prev) => {
    //         const updatedStates = prev.includes(stateName)
    //             ? prev.filter((name) => name !== stateName)
    //             : [...prev, stateName];
    //         setStateDetails((prevDetails) => {
    //             const newDetails = updatedStates.map(
    //                 (state) =>
    //                     prevDetails.find((detail) => detail.name === state) || {
    //                         name: state,
    //                         number: '',
    //                         url: null,
    //                         fileName: '',
    //                     }
    //             );
    //             return newDetails;
    //         });

    //         return updatedStates;
    //     });
    // };
    // const handleStateInputChange = (e, field, index) => {
    //     const value = e.target.value;
    //     setStateDetails((prevDetails) => {
    //         const updatedDetails = [...prevDetails];
    //         updatedDetails[index] = {
    //             ...updatedDetails[index],
    //             [field]: value,
    //         };
    //         return updatedDetails;
    //     });
    // };
    // const [stateLogoUpload, setStateLogoUpload] = useState(false);
    // const handleStateChange = async (e, index) => {
    //     const selectedFile = e.target.files[0];
    //     try {
    //         const url = await handleUpload(selectedFile, setStateLogoUpload);
    //         setStateDetails((prevDetails) => {
    //             const updatedDetails = [...prevDetails];
    //             updatedDetails[index] = {
    //                 ...updatedDetails[index],
    //                 url: url?.url?.split('?')[0],
    //                 fileName: selectedFile.name,
    //             };
    //             return updatedDetails;
    //         });
    //     } catch (error) {
    //         console.error('Error during file upload:', error);
    //     }
    // };

    // const handleRemoveState = (index) => {
    //     setStateDetails((prevDetails) => {
    //         const updatedDetails = prevDetails.filter((_, i) => i !== index);
    //         setSelectedStates(updatedDetails.map((detail) => detail.name)); // Update selectedStates as well
    //         return updatedDetails;
    //     });
    // };
    const menuRef = useRef(null); // Reference for the menu
    const containerRef = useRef(null); // Reference for the container
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setStatesMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // new changes
    const defaultIdentifiers = ['NPI', 'CLIA', 'NAIC'];
    const defaultIssuingAuthority = [
        'NPPES',
        'CLIA',
        'State Licensing Authority',
        'IRS',
        'CMS',
        'The Joint Commission',
        'Dun & Bradstreet',
        'Other',
    ];
    const contactDetails = ['phone', 'email'];
    const addressUses = ['work', 'temp', 'old', 'billing'];
    const addressTypes = ['physical', 'postal', 'both'];
    const uses = ['usual', 'old', 'temp', 'secondary', 'official'];
    const identifierOptions = [
        'NPI',
        'TIN',
        'NAIC',
        'Medicare',
        'Medicaid',
        'State License',
        'Accreditation',
        'CLIA',
        'DUNS',
        'Facility ID',
    ];

    const contactOptions = ['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'];
    const [constantIdentifiers, setConstantIdentifiers] = useState([]);
    const [constantContact, setConstantContact] = useState([]);
    const [name, setName] = useState({
        use: '',
        text: '',
        family: '',
        given: [''],
        prefix: [''],
        suffix: [],
        period: { start: new Date().toISOString() },
    });
    const [addresses, setAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }, // Default address
    ]);

    const [activeAddressIndex, setActiveAddressIndex] = useState(null);
    const [addressFocused, setAddressFocused] = useState(false);
    // Load Default Identifiers & Contacts
    useEffect(() => {
        setConstantIdentifiers(
            defaultIdentifiers.map((type) => ({
                type,
                number: '',
                file: '',
                expiry: '',
                issuingAuthority: '',
                use: '',
            }))
        );
        setConstantContact(
            contactDetails.map((system) => ({
                system,
                value: '',
                use: '',
            }))
        );
    }, []);

    // Function to Add New Fields
    const addIdentifier = () => {
        setConstantIdentifiers([
            ...constantIdentifiers,
            { type: '', number: '', file: '', expiry: '', issuingAuthority: '', use: '' },
        ]);
    };
    const addContactDetails = () => {
        setConstantContact([...constantContact, { system: '', value: '', use: '' }]);
    };
    const addAddress = () => {
        if (addresses?.length === 3) {
            ToastHandle('Maximun 3 addresses are allowed.', 'danger');
            return;
        }
        setAddresses([...addresses, { use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }]);
    };

    // Function to Remove Fields
    const removeIdentifier = (index) => {
        if (index < defaultIdentifiers.length) return;
        setConstantIdentifiers(constantIdentifiers.filter((_, i) => i !== index));
    };
    const removeContact = (index) => {
        if (index < contactDetails.length) return;
        setConstantContact(constantContact.filter((_, i) => i !== index));
    };
    const removeAddress = (index) => {
        if (addresses.length > 1) {
            setAddresses(addresses.filter((_, i) => i !== index));
        }
    };

    // Function to Handle Changes
    const handleChange = (index, field, value) => {
        const updatedIdentifiers = [...constantIdentifiers];
        updatedIdentifiers[index][field] = value;
        setConstantIdentifiers(updatedIdentifiers);
    };
    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...constantContact];

        if (field === 'value' && updatedContacts[index].system === 'phone') {
            // Remove non-numeric characters
            let rawValue = value.replace(/\D/g, '');
            if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);

            // Format as (XXX)XXX-XXXX
            const formattedValue = rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
                if (p3) return `(${p1})${p2}-${p3}`;
                if (p2) return `(${p1})${p2}`;
                return `(${p1}`;
            });

            updatedContacts[index][field] = formattedValue; // Store formatted phone number
        } else {
            updatedContacts[index][field] = value; // Store other fields as they are
        }

        setConstantContact(updatedContacts);
    };
    const formatDisplayValue = (value) => {
        if (!value) return '';
        const rawValue = value.replace(/\D/g, '');
        return rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
            if (p3) return `(${p1})${p2}-${p3}`;
            if (p2) return `(${p1})${p2}`;
            return `(${p1}`;
        });
    };

    const handleAddressChange = (index, field, value) => {
        if (field === 'type' && addresses?.some((address, i) => i !== index && address?.type === value)) {
            ToastHandle('This address type is already selected. Please choose a different type.', 'danger');
            return; // Prevent selection
        }

        // if(addresses?.some((address) => address?.use === field)) {}
        const updatedAddresses = [...addresses];
        if (field === 'line') {
            updatedAddresses[index].line[0] = value; // update street address
        } else {
            updatedAddresses[index][field] = value;
        }
        setAddresses(updatedAddresses);
    };
    // Default telecom contact options

    // State for POCs (at least one default POC)
    const [pocs, setPocs] = useState([
        {
            name: {
                use: '',
                text: '',
                family: '',
                given: [''],
                prefix: [''],
                suffix: [],
                // period: { start: '', end: '' },
            },
            email: '',
            role: '',
            telecom: [{ system: '', value: '', use: '' }],
        },
    ]);
    // Function to handle POC field changes
    const handlePocChange = (index, field, value) => {
        setPocs((prevPocs) => {
            const updatedPocs = [...prevPocs];
            const keys = field.split('.');
            let target = updatedPocs[index];
            for (let i = 0; i < keys.length - 1; i++) {
                target = target[keys[i]] = { ...target[keys[i]] };
            }
            target[keys[keys.length - 1]] = value;
            return updatedPocs;
        });
    };

    const handleNameArrayChange = (index, field, value) => {
        const updatedPocs = [...pocs];
        updatedPocs[index].name[field] = [value];
        setPocs(updatedPocs);
    };

    // Function to handle Telecom (Contact) field changes inside POCs
    const handleTelecomChange = (pocIndex, telecomIndex, field, value) => {
        const updatedPoc = [...pocs]; // Assuming pocList is your state
        let rawValue = value.replace(/\D/g, ''); // Remove non-numeric characters

        // Limit to 10 digits
        if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);

        // Format as (XXX)XXXXXXX
        const formattedValue = rawValue.replace(/(\d{1,3})(\d{0,7})/, (match, p1, p2) => {
            if (p2) return `(${p1})${p2}`;
            return `(${p1}`;
        });

        updatedPoc[pocIndex].telecom[telecomIndex][field] = formattedValue; // Store formatted number
        setPocs(updatedPoc);
    };

    // Function to add a new POC
    const addPoc = () => {
        setPocs([
            ...pocs,
            {
                name: {
                    use: 'official',
                    text: '',
                    family: '',
                    given: [''],
                    prefix: [''],
                    suffix: [],
                    // period: { start: '', end: '' },
                },
                email: '',
                role: '',
                telecom: [{ system: '', value: '', use: '' }],
            },
        ]);
    };

    // Function to remove a POC (at least one should remain)
    const removePoc = (index) => {
        if (pocs.length > 1) {
            setPocs(pocs.filter((_, i) => i !== index));
        }
    };

    // Function to add a new telecom contact inside a POC
    const addTelecom = (pocIndex) => {
        const updatedPocs = [...pocs];
        updatedPocs[pocIndex].telecom.push({ system: 'phone', value: '', use: 'work' });
        setPocs(updatedPocs);
    };

    // Function to remove a telecom contact inside a POC
    const removeTelecom = (pocIndex, telecomIndex) => {
        const updatedPocs = [...pocs];
        if (updatedPocs[pocIndex].telecom.length > 1) {
            updatedPocs[pocIndex].telecom = updatedPocs[pocIndex].telecom.filter((_, i) => i !== telecomIndex);
            setPocs(updatedPocs);
        }
    };
    const handleIdentifierFileChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        try {
            const url = await handleUpload(selectedFile, setIdentifierDocumnent); // Upload file
            setConstantIdentifiers((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    file: {
                        url: url?.url?.split('?')[0],
                        name: selectedFile.name,
                    },
                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };
    const formatDateForInput = (dateString) => {
        if (!dateString) return ''; // Return empty if no date
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
    };

    return (
        <>
            {/* <UploadToS3 /> */}
            {store.getClinicsReducer?.loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '82vh' }}>
                    <Spinner />
                </div>
            ) : (
                <>
                    <Form onSubmit={handleSubmit(SubmitData)}>
                        <Row>
                            <Col sm={12} className="mb-2">
                                <b>{subClinic}</b>
                            </Col>
                            <Col sm={3}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">
                                        Practice Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        data-has-value={!!watch('clinicname')}
                                        {...register('clinicname', {
                                            required: 'This field is required',
                                            validate: (value) =>
                                                !value.startsWith(' ') || 'First character cannot be a space',
                                        })}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                        }}
                                        placeholder="Practice name"
                                        onKeyPress={handleFirstSpace}
                                    />
                                    {errors.clinicname && (
                                        <span className="text-danger">{errors.clinicname.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={3}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">
                                        Practice type <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        className="form-control"
                                        data-has-value={!!watch('clinicType')}
                                        // defaultValue={updatePage ? clinicDataToUpdate?.clinicType : ''}
                                        {...register('clinicType', { required: 'This field is required' })}>
                                        <option value="" hidden>
                                            Select Practice type
                                        </option>
                                        {clinectypes?.map((data) => (
                                            <option key={data?._id} value={data?.name}>
                                                {data?.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.clinicType && (
                                        <span className="text-danger">{errors.clinicType.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={3}>
                                <Form.Group className="mb-1 position-relative">
                                    <Form.Label className="mb-0">
                                        Email ID <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        disabled={true}
                                        type="text"
                                        data-has-value={!!watch('email')}
                                        // defaultValue={updatePage ? clinicDataToUpdate?.email : ''}
                                        {...register('email', {
                                            required: 'This field is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Please enter a valid email address',
                                            },
                                        })}
                                        placeholder="Email ID"
                                    />
                                    <span
                                        style={{ right: '2%', top: '43%' }}
                                        className={`${clinicsDataGet?.userId?.verified_email
                                            ? 'text-success position-absolute fs-4'
                                            : 'd-none'
                                            }`}>
                                        <MdVerified />
                                    </span>

                                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={3} className="mb-1 d-flex flex-column position-relative">
                                <Form.Label className="mb-0">Upload Logo</Form.Label>
                                <div
                                    onClick={handleLogoClick}
                                    className={`custom-file-upload justify-content-between cursor-pointer form-control ${logoName ? '' : 'custom-form-fields'
                                        }`}
                                    data-has-value={!!logoName}>
                                    {/* Ensure logoName is a string or fallback to 'Upload Logo' */}
                                    {/* {typeof logoName === 'string' && logoName
                                        ? logoName.split('/').pop()
                                        : 'Upload Logo'} */}
                                    {logoUploading
                                        ? 'Uploading...'
                                        : typeof logoName === 'string' && logoName
                                            ? logoName.split('/').pop().slice(0, 30) + '...'
                                            : 'Upload Logo'}
                                    {/* {logoName} */}

                                    <div className="d-flex align-items-center gap-2">
                                        {logo && (
                                            <FiEye
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShowModal(logo);
                                                }}
                                                className="text-dark cursor-pointer"
                                                style={{ zIndex: 1 }}
                                            />
                                        )}

                                        {/* Download Icon */}
                                        <p className="mb-0">
                                            <FiDownloadCloud />
                                        </p>
                                    </div>
                                </div>
                                <Form.Control
                                    type="file"
                                    className="rounded-circle"
                                    style={{ display: 'none' }}
                                    ref={logoFileInputRef}
                                    accept=".png, .jpg, .jpeg, .svg"
                                    onChange={handleFileChange}
                                />
                            </Col>

                            <hr className="mb-1" />
                            <Row>
                                <Col sm={12}>
                                    <Row>
                                        <Col sm={12}>
                                            <h5>
                                                Identifiers
                                                <span
                                                    className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                                    onClick={addIdentifier}></span>
                                            </h5>
                                        </Col>
                                    </Row>

                                    {/* Table Header */}
                                    <Row className="fw-bold">
                                        <Col>
                                            <Form.Label>Identifier Type</Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label>Identifier Number</Form.Label>
                                        </Col>
                                        <Col className="d-flex align-items-center gap-2">
                                            <Form.Label>Identifier Document</Form.Label>

                                            {/* Tooltip Icon */}
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-identifier">
                                                        File size should be less than 2MB. Supported formats: JPG, PNG,
                                                        JPEG, PDF.
                                                    </Tooltip>
                                                }>
                                                <span className="text-secondary cursor-pointer mb-2">
                                                    <FiInfo size={15} />
                                                </span>
                                            </OverlayTrigger>
                                        </Col>
                                        <Col>
                                            <Form.Label>Issuing Authority</Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label>Identifier Expiry (If Applicable)</Form.Label>
                                        </Col>
                                    </Row>

                                    {/* Dynamic Identifier Fields */}
                                    {constantIdentifiers.map((item, index) => (
                                        <Row key={index} className="mb-2">
                                            {/* Identifier Type */}
                                            <Col>
                                                <Form.Select
                                                    value={item.type}
                                                    data-has-value={!!watch(`identifiers[${index}].type`)}
                                                    {...register(
                                                        `identifiers[${index}].type`
                                                        //  { required: 'Identifier Type is required' }
                                                    )}
                                                    onChange={(e) => handleChange(index, 'type', e.target.value)}
                                                    disabled={defaultIdentifiers.includes(item.type)}>
                                                    <option value="" disabled>
                                                        Select Identifier Type
                                                    </option>
                                                    {identifierOptions.map((option) => (
                                                        <option key={option} className="" value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {errors?.[index]?.type && (
                                                    <span className="text-danger">This field is required</span>
                                                )}
                                            </Col>

                                            {/* Identifier Number */}
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Document Number"
                                                    value={item.number}
                                                    maxLength={
                                                        item.type === 'NPI' || item.type === 'CLIA'
                                                            ? 10
                                                            : item.type === 'NAIC'
                                                                ? 5
                                                                : 10
                                                    }
                                                    {...register(`identifiers[${index}].number`, {
                                                        // required: defaultIdentifiers.includes(item.type)
                                                        //     ? 'Document Number is required'
                                                        //     : false,
                                                        validate: (value) => {
                                                            if (!value) return true; // Skip validation if field is empty (for dynamic fields)

                                                            if (item.type === 'NPI' && !/^[0-9]{10}$/.test(value)) {
                                                                return 'NPI number must be exactly 10 digits long';
                                                            }
                                                            if (
                                                                item.type === 'CLIA' &&
                                                                !/^[A-Z0-9]{2}D[0-9]{7}$/.test(value)
                                                            ) {
                                                                return 'CLIA number must be in the format XXDXXXXXXX, where X is alphanumeric and the rest are digits';
                                                            }
                                                            if (item.type === 'NAIC' && !/^[0-9]{5}$/.test(value)) {
                                                                return 'NAIC number must be exactly 5 digits long';
                                                            }
                                                            return true; // No validation for other types (like DUNS, etc.)
                                                        },
                                                    })}
                                                    onChange={(e) => {
                                                        let value = e.target.value;

                                                        // Enforce length limit only for NPI, CLIA, and NAIC
                                                        if (item.type === 'NPI' || item.type === 'CLIA') {
                                                            value = value.slice(0, 10);
                                                        } else if (item.type === 'NAIC') {
                                                            value = value.slice(0, 5);
                                                        }

                                                        handleChange(index, 'number', value);
                                                    }}
                                                />
                                                {errors.identifiers?.[index]?.number && (
                                                    <span className="text-danger">
                                                        {errors.identifiers[index].number.message}
                                                    </span>
                                                )}
                                            </Col>

                                            {/* File Upload */}
                                            <Col className="mb-2 position-relative">
                                                <div
                                                    onClick={() =>
                                                        document.getElementById(`fileInput-identifier-${index}`).click()
                                                    }
                                                    className={`custom-file-upload justify-content-between cursor-pointer ${item.file ? 'form-control' : 'custom-form-fields'
                                                        }`}>
                                                    {item.file?.name
                                                        ? item.file.name.length > 30
                                                            ? item.file.name.slice(0, 25) + '...'
                                                            : item.file.name
                                                        : 'Upload Document'}

                                                    <p className="mb-0">
                                                        <FiDownloadCloud />
                                                    </p>
                                                </div>
                                                <Form.Control
                                                    type="file"
                                                    id={`fileInput-identifier-${index}`}
                                                    style={{ display: 'none' }}
                                                    accept=".png, .jpg, .jpeg, .pdf"
                                                    onChange={(e) => handleIdentifierFileChange(e, index)}
                                                />
                                                {errors?.[index]?.file && (
                                                    <span className="text-danger">Please upload a document</span>
                                                )}
                                            </Col>

                                            {/* Issuing Authority */}
                                            <Col>
                                                <Form.Select
                                                    value={item.issuingAuthority}
                                                    data-has-value={!!watch(`identifiers[${index}].issuingAuthority`)}
                                                    {...register(`identifiers[${index}].issuingAuthority`)}
                                                    onChange={(e) =>
                                                        handleChange(index, 'issuingAuthority', e.target.value)
                                                    }>
                                                    <option value="" disabled>
                                                        Select Issuing Authority
                                                    </option>
                                                    {defaultIssuingAuthority.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {errors?.[index]?.issuingAuthority && (
                                                    <span className="text-danger">This field is required</span>
                                                )}
                                            </Col>
                                            {/* Expiry Date */}
                                            <Col className="position-relative">
                                                <Form.Control
                                                    type="date"
                                                    value={item?.expiry ? formatDateForInput(item.expiry) : ''}
                                                    min={new Date().toISOString().split("T")[0]} // Sets min date to today
                                                    onChange={(e) => handleChange(index, 'expiry', e.target.value)}
                                                />
                                                {index >= defaultIdentifiers?.length && (
                                                    <span
                                                        className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                                                        style={{ right: '-2%', top: '12%' }}
                                                        onClick={() => removeIdentifier(index)}>
                                                        <CiCircleMinus />
                                                    </span>
                                                )}
                                            </Col>
                                        </Row>
                                    ))}
                                </Col>
                            </Row>
                            <hr className="mb-1" />
                            <Row>
                                <Col sm={12}>
                                    <Row className="">
                                        <Col sm={12}>
                                            <h5>
                                                Contact Details
                                                <span
                                                    className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                                    onClick={addContactDetails}></span>
                                            </h5>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col sm={4}>
                                            <Form.Label>Contact Type</Form.Label>
                                        </Col>
                                        <Col sm={4}>
                                            <Form.Label>Value </Form.Label>
                                        </Col>
                                        <Col sm={4}>
                                            <Form.Label>Use</Form.Label>
                                        </Col>
                                    </Row>

                                    {constantContact.map((item, index) => (
                                        <Row key={index} className="mb-2">
                                            <Col sm={4}>
                                                <Form.Select
                                                    className="text-capitalize"
                                                    value={item.system}
                                                    data-has-value={!!watch(`constantContact[${index}].system`)}
                                                    {...register(`constantContact[${index}].system`)}
                                                    onChange={(e) =>
                                                        handleContactChange(index, 'system', e.target.value)
                                                    }
                                                    disabled={contactDetails.includes(item.type)}>
                                                    <option value="" disabled>
                                                        Select Contact Type
                                                    </option>
                                                    {contactOptions.map((option) => (
                                                        <option className="text-capitalize" key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Col>
                                            <Col sm={4}>
                                                {item.system === 'phone' ? (
                                                    <InputGroup className="position-relative">
                                                        {/* Country Code Prefix */}
                                                        <InputGroup.Text className="ps-4 p-0 pe-1 fw-bold text-black">
                                                            +1
                                                        </InputGroup.Text>
                                                        {/* Phone Input */}
                                                        <Form.Control
                                                            type="tel"
                                                            placeholder="(123)456-7890"
                                                            value={formatDisplayValue(item.value)}
                                                            onChange={(e) =>
                                                                handleContactChange(index, 'value', e.target.value)
                                                            }
                                                            maxLength={14}
                                                            onKeyPress={(event) => {
                                                                if (!/[0-9]/.test(event.key)) event.preventDefault();
                                                            }}
                                                            style={{ paddingLeft: '40px' }}
                                                        />
                                                        {/* Flag Icon */}
                                                        <div
                                                            className="position-absolute"
                                                            style={{
                                                                left: '10px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                            }}>
                                                            <img src={us} alt="flag" width={20} />
                                                        </div>
                                                    </InputGroup>
                                                ) : (
                                                    <Form.Control
                                                        type={item.system === 'email' ? 'email' : 'text'}
                                                        placeholder={
                                                            item.system === 'email' ? 'Enter email' : 'Enter value'
                                                        }
                                                        value={item.value || ''}
                                                        onChange={(e) =>
                                                            handleContactChange(index, 'value', e.target.value)
                                                        }
                                                    />
                                                )}
                                            </Col>

                                            <Col sm={4} className="position-relative">
                                                <Form.Select
                                                    value={item.use}
                                                    data-has-value={!!watch(`constantContact[${index}].use`)}
                                                    {...register(`constantContact[${index}].use`)}
                                                    onChange={(e) => handleContactChange(index, 'use', e.target.value)}>
                                                    <option value="">Select Option</option> {/* Placeholder option */}
                                                    <option value="temp">Temp</option>
                                                    <option value="work">Work</option>
                                                    <option value="old">Old</option>
                                                    {/* Add more options as needed */}
                                                </Form.Select>
                                                {index >= contactDetails.length && (
                                                    <span
                                                        className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                                                        style={{ right: '-1%', top: '12%' }}
                                                        onClick={() => removeContact(index)}>
                                                        <CiCircleMinus />
                                                    </span>
                                                )}
                                            </Col>
                                        </Row>
                                    ))}
                                </Col>
                            </Row>
                            <hr className="mb-1" />
                            {/* <Col sm={12}>
                                <Row>
                                    <Col sm={12} className="mb-1">
                                        <span className="text-black fw-semibold form-label">Address Details </span>
                                    </Col>
                                    <Col sm={6}>
                                        <Row className="position-relative">
                                            <Col sm={12}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className="mb-0">
                                                        Primary Address <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <div style={{ position: 'relative' }}>
                                                        <Form.Control
                                                            data-has-value={!!watch('address')}
                                                            type="text"
                                                            defaultValue={
                                                                updatePage ? clinicDataToUpdate?.address?.address : ''
                                                            }
                                                            {...register('address', {
                                                                required: 'Primary Address is required',
                                                            })}
                                                            onChange={(e) => {
                                                                getGeolocation(e);
                                                                setFocused(true);
                                                            }}
                                                            onFocus={() => setFocused(true)}
                                                            onBlur={() => {
                                                                setTimeout(() => setFocused(false), 200);
                                                            }}
                                                            placeholder="Search for address"
                                                            autoComplete="off"
                                                        />
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                top: '100%',
                                                                left: 0,
                                                                width: '100%',
                                                                maxHeight: '150px',
                                                                overflow: 'auto',
                                                                zIndex: 111,
                                                                backgroundColor: '#fff',
                                                                border: '1px solid #ced4da',
                                                                borderTop: 'none',
                                                            }}
                                                            className={`scroll-container hover-bg-change ${
                                                                searchedLocations?.length === 0 || !focused
                                                                    ? 'd-none'
                                                                    : ''
                                                            }`}>
                                                            {searchedLocations?.map((data, index) => (
                                                                <p
                                                                    key={index}
                                                                    onClick={() => {
                                                                        setSelectedLocation(data);
                                                                        setFocused(false);
                                                                    }}
                                                                    style={{
                                                                        margin: 0,
                                                                        padding: '8px 12px',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    className="hover-bg-change text-black">
                                                                    {data?.formatted}
                                                                </p>
                                                            ))}
                                                            {searchedLocations?.length === 0 && (
                                                                <p className="text-muted px-2 py-1">No results found</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {errors.address && (
                                                        <span className="text-danger">{errors.address.message}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                            <Col sm={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label className="mb-0">
                                                        Latitude <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        data-has-value={!!latitude}
                                                        defaultValue={latitude}
                                                        placeholder="Latitude"
                                                    />
                                                    {errors.latitude && (
                                                        <span className="text-danger">{errors.latitude.message}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className="mb-0">
                                                        Longitude <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        data-has-value={!!longitude}
                                                        defaultValue={longitude}
                                                        placeholder="Longitude"
                                                    />
                                                    {errors.longitude && (
                                                        <span className="text-danger">{errors.longitude.message}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col sm={6}>
                                        <Row>
                                            <Col sm={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className="mb-0">
                                                        State <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Select
                                                        className="form-control"
                                                        {...register('stateName', { required: 'State is required' })}
                                                        onChange={(e) => handleStateSelection(e)}
                                                        data-has-value={!!watch('stateName')}>
                                                        <option value="" hidden>
                                                            State
                                                        </option>
                                                        {statesData?.states?.map((data) => (
                                                            <option
                                                                key={data?.id}
                                                                data-key={JSON.stringify({
                                                                    id: data?.id,
                                                                    _id: data?._id,
                                                                })}
                                                                value={data?._id}>
                                                                {data?.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    {errors.stateName && (
                                                        <span className="text-danger">{errors.stateName.message}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className="mb-0">
                                                        City <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Select
                                                        className="form-control"
                                                        data-has-value={!!watch('city')}
                                                        disabled={store?.getCitiesReducer?.loading}
                                                        {...register('city', { required: 'City is required' })}>
                                                        <option value="" hidden>
                                                            {store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}
                                                        </option>
                                                        {cities1?.map((data) => (
                                                            <option
                                                                data-key={JSON.stringify({
                                                                    _id: data?._id,
                                                                    latitude: data?.latitude,
                                                                    longitude: data?.longitude,
                                                                })}
                                                                key={data?._id}
                                                                value={data?._id}>
                                                                {data?.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    {errors.city && (
                                                        <span className="text-danger">{errors.city.message}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className="mb-0">
                                                        Street <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        data-has-value={!!watch('street')}
                                                        {...register('street', {
                                                            required: 'Street is required',
                                                        })}
                                                        onKeyPress={handleFirstSpace}
                                                        placeholder="Street"
                                                    />

                                                    {errors.street && (
                                                        <span className="text-danger">{errors.street.message}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label className="mb-0">
                                                        Zip <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        defaultValue={
                                                            updatePage ? clinicDataToUpdate?.address?.zip : ''
                                                        }
                                                        type="text"
                                                        data-has-value={!!watch('zip')}
                                                        {...register('zip', {
                                                            required: 'Zip is requried',
                                                            minLength: {
                                                                value: 5,
                                                                message: 'ZIP code must be at least 5 characters long',
                                                            },
                                                            pattern: {
                                                                value: /^[0-9]+$/,
                                                                message: 'ZIP code must contain numbers only',
                                                            },
                                                        })}
                                                        onKeyPress={handleFirstSpace}
                                                        placeholder="Zip"
                                                        maxLength={5}
                                                    />
                                                    {errors.zip && (
                                                        <span className="text-danger">{errors.zip.message}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col> */}

                            <Row>
                                <Col sm={12}>
                                    <h5>
                                        Address Details
                                        <span
                                            className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                            onClick={addAddress}></span>
                                    </h5>
                                </Col>
                            </Row>
                            {addresses.map((item, index) => (
                                <Row key={index} className="mb-2">
                                    <Col sm={4} className="mb-2">
                                        <Form.Label className="mb-1">Use</Form.Label>
                                        <Form.Select
                                            value={item?.type}
                                            className="text-capitalize"
                                            data-has-value={!!watch(`address[${index}].type`)}
                                            {...register(`address[${index}].type`)}
                                            onChange={(e) => handleAddressChange(index, 'type', e.target.value)}>
                                            <option value="">Select</option>
                                            {addressTypes.map((data) => (
                                                <option key={data} className="text-capitalize" value={data}>
                                                    {data}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col sm={4} className="mb-2">
                                        <Form.Label className="mb-1">Use</Form.Label>
                                        <Form.Select
                                            value={item.use}
                                            className="text-capitalize"
                                            data-has-value={!!watch(`address[${index}].use`)}
                                            {...register(`address[${index}].use`)}
                                            onChange={(e) => handleAddressChange(index, 'use', e.target.value)}>
                                            <option value="">Select</option>
                                            {addressUses.map((use) => (
                                                <option key={use} className="text-capitalize" value={use}>
                                                    {use}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col sm={4} className="mb-2 position-relative">
                                        <Form.Label className="mb-1">Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Street Address"
                                            value={item.line[0]}
                                            onChange={(e) => {
                                                handleAddressChange(index, 'line', e.target.value);
                                                // Set active index so suggestions appear for this address
                                                setActiveAddressIndex(index);
                                                setAddressFocused(true);
                                                // Call your geolocation API with the current input value
                                                getGeolocation(e)?.then((data) => {
                                                    // Expecting your getGeolocation to return an object with results
                                                    if (data && data.results) {
                                                        setSearchedLocations(data.results);
                                                    }
                                                });
                                            }}
                                            onFocus={() => {
                                                setActiveAddressIndex(index);
                                                setAddressFocused(true);
                                            }}
                                            onBlur={() => {
                                                setTimeout(() => setAddressFocused(false), 200);
                                            }}
                                        />
                                        {activeAddressIndex === index &&
                                            addressFocused &&
                                            searchedLocations?.length > 0 && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        left: 0,
                                                        width: '100%',
                                                        maxHeight: '150px',
                                                        overflowY: 'auto',
                                                        zIndex: 111,
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #ced4da',
                                                        borderTop: 'none',
                                                    }}>
                                                    {searchedLocations?.map((data, suggestionIndex) => (
                                                        <p
                                                            key={suggestionIndex}
                                                            // onClick={() => {
                                                            //     if (item?.type === 'physical') {
                                                            //         dispatch(getCitiesAction({ state_code: statesData?.states?.find((state) => state?.name === data.components?.state)?.id, name: data?.components?.city || '', limit: 25, skip: '' }));
                                                            //     } else if (item?.type === 'postal') {
                                                            //         dispatch(getCities2Action({ state_code: statesData?.states?.find((state) => state?.name === data.components?.state)?.id, name: data?.components?.city || '', limit: 25, skip: '' }));
                                                            //     } else if (item?.type === 'both') {
                                                            //         dispatch(getCities3Action({ state_code: statesData?.states?.find((state) => state?.name === data.components?.state)?.id, name: data?.components?.city || '', limit: 25, skip: '' }));
                                                            //     }
                                                            //     // Extract the necessary fields from the API response
                                                            //     const formatted = data.formatted || '';
                                                            //     const components = data.components || {};
                                                            //     // Build the new address object with auto-populated fields
                                                            //     console.log({ components })
                                                            //     const newAddress = {
                                                            //         use: item.use, // preserve existing use
                                                            //         line: [data?.formatted ? data?.formatted : ''],
                                                            //         // city:
                                                            //         //     components.city ||
                                                            //         //     components.town ||
                                                            //         //     components.village ||
                                                            //         //     '',
                                                            //         state:
                                                            //             components.state || components.state_code || '',
                                                            //         postalCode: components.postcode || '',
                                                            //         country: components.country || '',
                                                            //     };
                                                            //     // Update the specific address entry
                                                            //     const updatedAddresses = [...addresses];
                                                            //     updatedAddresses[index] = newAddress;
                                                            //     setAddresses(updatedAddresses);
                                                            //     // Clear suggestions and remove focus
                                                            //     setSearchedLocations([]);
                                                            //     setAddressFocused(false);
                                                            //     setValue(
                                                            //         `address[${index}].state`,
                                                            //         components?.state_code
                                                            //     );
                                                            //     setValue(`postalCode`, components?.postcode);
                                                            //     setSelectedState(components?.state_code);
                                                            // }}

                                                            onClick={() => {
                                                                const state = statesData?.states?.find(s => s.name === data.components?.state);
                                                                const stateCode = state?.id;
                                                                const cityName = data.components?.city || data.components?.town || data.components?.village || '';

                                                                // Dispatch city load based on address type
                                                                if (item?.type === 'physical') {
                                                                    dispatch(getCitiesAction({ state_code: stateCode, name: cityName, limit: 25, skip: '' }));
                                                                } else if (item?.type === 'postal') {
                                                                    dispatch(getCities2Action({ state_code: stateCode, name: cityName, limit: 25, skip: '' }));
                                                                } else {
                                                                    dispatch(getCities3Action({ state_code: stateCode, name: cityName, limit: 25, skip: '' }));
                                                                }

                                                                // Update address
                                                                const newAddress = {
                                                                    ...item,
                                                                    line: [data.formatted || ''],
                                                                    state: data.components?.state || '',
                                                                    city: cityName,  // Set the city name
                                                                    postalCode: data.components?.postcode || '',
                                                                    country: data.components?.country || '',
                                                                };

                                                                const updatedAddresses = [...addresses];
                                                                updatedAddresses[index] = newAddress;
                                                                setAddresses(updatedAddresses);

                                                                // Clear suggestions
                                                                setSearchedLocations([]);
                                                                setAddressFocused(false);
                                                            }}
                                                            style={{
                                                                margin: 0,
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                            }}
                                                            className="hover-bg-change text-black">
                                                            {data.formatted}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                    </Col>
                                    <Col sm={4} className="mb-2">
                                        <Form.Label className="mb-1">State</Form.Label>
                                        <Form.Select
                                            {...register(`address[${index}].state`)}
                                            data-has-value={!!getValues(`address[${index}].state`)}
                                            value={item?.state}
                                            onChange={(e) => {
                                                handleStateSelection(e, item?.type, index);
                                                const updatedAddresses = [...addresses];
                                                updatedAddresses[index] = {
                                                    ...updatedAddresses[index],
                                                    state: e.target.value,
                                                };
                                                setAddresses(updatedAddresses);
                                            }}>
                                            <option value="">Select State</option>
                                            {statesData?.states?.map((data) => (
                                                <option key={data?.name} data-key={data?.id} value={data?.name}>
                                                    {data?.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    {/* <Col sm={4} className="mb-2">
                                        <Form.Label className="mb-1">City</Form.Label>
                                        <Form.Select
                                            data-has-value={!!getValues(`address[${index}].city`)}
                                            {...register(`address[${index}].city`)}
                                            onChange={(e) => {
                                                const updatedAddresses = [...addresses];
                                                updatedAddresses[index] = {
                                                    ...updatedAddresses[index],
                                                    city: e.target.value,
                                                };
                                                setAddresses(updatedAddresses);
                                            }}>
                                            <option value="">
                                                {store?.getCitiesReducer?.loading ? 'Loading...' : 'Select City'}
                                            </option>
                                            {(item?.use === 'physical' ? cities1 :
                                                item?.use === 'postal' ? cities2 :
                                                    cities3)?.map((data) => (
                                                        <option key={data?.name} value={data?._id}>
                                                            {data?.name}
                                                        </option>
                                                    ))}
                                        </Form.Select>
                                    </Col> */}
                                    <Col sm={4} className="mb-2">
                                        <Form.Label className="mb-1">City</Form.Label>
                                        <Form.Select
                                            data-has-value={!!getValues(`address[${index}].city`)}
                                            {...register(`address[${index}].city`)}
                                            value={item?.city}
                                            onChange={(e) => {
                                                const updatedAddresses = [...addresses];
                                                updatedAddresses[index] = {
                                                    ...updatedAddresses[index],
                                                    city: e.target.value,
                                                };
                                                setAddresses(updatedAddresses);
                                            }}>
                                            <option value="">
                                                {store?.getCitiesReducer?.loading ? 'Loading...' : 'Select City'}
                                            </option>
                                            {(() => {
                                                const cities =
                                                    item?.type === 'physical' ? cities1 :
                                                        item?.type === 'postal' ? cities2 :
                                                            cities3;

                                                return cities?.map((data) => (
                                                    <option key={data?._id} value={data?.name}>
                                                        {data?.name}
                                                    </option>
                                                ));
                                            })()}
                                        </Form.Select>
                                    </Col>
                                    <Col sm={4} className="position-relative">
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Postal Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={item?.postalCode}
                                                placeholder="Postal Code"
                                                {...register(`address[${index}].postalCode`, {
                                                    minLength: {
                                                        value: 5,
                                                        message: 'Postal code must be at least 5 characters long',
                                                    },
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Postal code must contain numbers only',
                                                    },
                                                })}
                                                onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                                                maxLength={5}
                                                onKeyPress={handleFirstSpace}
                                            />
                                            {addresses.length > 1 && index !== 0 && (
                                                <span
                                                    className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                                                    style={{ right: '-2%', top: '50%' }}
                                                    onClick={() => removeAddress(index)}>
                                                    <CiCircleMinus />
                                                </span>
                                            )}
                                            {errors?.address?.[index]?.postalCode && (
                                                <span className="text-danger">
                                                    {errors.address[index].postalCode.message}
                                                </span>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    {/* <Col sm={4} className="position-relative">
                                        <Form.Label className="mb-1">Country</Form.Label>

                                        <Form.Control
                                            type="text"
                                            placeholder="Country"
                                            value={item.country}
                                            onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                                        />
                                       
                                    </Col> */}
                                </Row>
                            ))}
                            <hr className="mb-1" />
                            <Row>
                                <Col sm={12}>
                                    <h5>
                                        Points of Contact (POC)
                                        <span
                                            className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                            onClick={addPoc}></span>
                                    </h5>
                                </Col>
                            </Row>
                            {pocs.map((poc, pocIndex) => (
                                <div key={pocIndex} className="p-1">
                                    <Row>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Full Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={poc.name.text}
                                                    onChange={(e) =>
                                                        handlePocChange(pocIndex, 'name.text', e.target.value)
                                                    }
                                                    placeholder="Enter full name"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6} className="position-relative">
                                            <Form.Group>
                                                <Form.Label>Role</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Role"
                                                    value={poc.role}
                                                    onChange={(e) => handlePocChange(pocIndex, 'role', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col sm={6}>
                                            <Form.Group>
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Enter Email"
                                                    value={poc.email}
                                                    onChange={(e) => handlePocChange(pocIndex, 'email', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        {poc?.telecom?.map((telecom, telecomIndex) => (
                                            <Col sm={6} key={telecomIndex}>
                                                <Form.Group className="mb-2 position-relative">
                                                    <Form.Label className="mb-1">Phone Number</Form.Label>
                                                    <InputGroup>
                                                        {/* Country Code Prefix */}
                                                        <InputGroup.Text className="ps-3 pe-1 p-0 fw-bold text-black">
                                                            &nbsp;&nbsp;+1
                                                        </InputGroup.Text>

                                                        {/* Phone Input Field */}
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Phone Number"
                                                            value={formatDisplayValue(telecom.value)} // Apply formatting
                                                            onChange={(e) =>
                                                                handleTelecomChange(
                                                                    pocIndex,
                                                                    telecomIndex,
                                                                    'value',
                                                                    e.target.value
                                                                )
                                                            }
                                                            maxLength={14} // To accommodate formatted (XXX)XXXXXXX
                                                            onKeyPress={(event) => {
                                                                if (!/[0-9]/.test(event.key)) {
                                                                    event.preventDefault(); // Prevent non-numeric input
                                                                }
                                                            }}
                                                        />
                                                    </InputGroup>

                                                    {/* Flag Icon */}
                                                    <div
                                                        className="position-absolute"
                                                        style={{ top: '52%', left: '1%' }}>
                                                        <img src={us} alt="country code flag" width={20} />
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            ))}

                            <Col md={12} className="mt-0 d-flex gap-2 justify-content-end">
                                <Button
                                    as={Link}
                                    to={'/apps/Practice/new-practice'}
                                    variant="primary"
                                    className="custom-buttons">
                                    Add Multiple
                                </Button>
                                <Button variant="primary" className="custom-buttons" onClick={() => setShowModal(true)}>
                                    Change Password
                                </Button>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={store?.createClinicsReducer?.loading}
                                    onClick={() => setNextClicked(true)}
                                    className="custom-buttons">
                                    {store?.createClinicsReducer?.loading ? (
                                        <Spinner color="white" className="spinner-border-sm" />
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row className="mt-2">
                        <Col xs={12}>
                            <Row>
                                <Col>
                                    {store?.getSubClinicsReducer?.loading ? (
                                        <div className="text-center my-3">
                                            <Spinner />
                                        </div>
                                    ) : getTableData && getTableData.length === 0 ? (
                                        <div className="text-center my-3">{''}</div>
                                    ) : (
                                        <Table responsive className="table-centered table-nowrap mb-0">
                                            <thead className="text-white">
                                                <tr>
                                                    <th className="text-white">S.No.</th>
                                                    <th className="text-white">PRACTICE NAME</th>
                                                    <th className="text-white">LOCATION</th>
                                                    <th className="text-white">PRACTICE TYPE</th>
                                                    {/* <th className="text-white">SPECIALITY</th> */}
                                                    <th className="text-white">STATUS</th>
                                                    <th className="text-white">ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getTableData?.map((patient, index) => (
                                                    <tr key={patient?.id || `patient-${index}`}>
                                                        <td>{index + 1}</td>
                                                        <td>{patient?.name}</td>
                                                        <td className='cursor-pointer' data-toggle="tooltip" data-placement="top" title={patient?.address?.[0]?.line?.[0]}>
                                                            {patient?.address?.[0]?.line?.[0]?.length > 27 ? patient?.address?.[0]?.line?.[0]?.slice(0, 26) + '...' : patient?.address?.[0]?.line?.[0] || 'N/A'}
                                                        </td>
                                                        <td>{patient.orgType}</td>
                                                        {/* <td>{patient.practiceSpecialty || 'N/A'}</td> */}
                                                        <td>
                                                            <Form.Switch
                                                                className={patient.active ? 'custom-active' : ''}
                                                                checked={patient.active === patient.status}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="text-center">
                                                                <Link
                                                                    to={`/apps/Practice/updateSubClinic?id=${patient?.userId?._id}&clinicId=${patient?._id}`}
                                                                    className="text-black cursor-pointer ps-2">
                                                                    <FiEdit className="fs-4 cursor-pointer" />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Modal show={showModalPic} onHide={handleCloseModal} centered>
                        <Modal.Body>
                            <div className="d-flex justify-content-center">
                                <p className="fw-bold" style={{ color: '#6169D0' }}>
                                    {' '}
                                    File Preview
                                </p>
                            </div>
                            <div
                                style={{
                                    overflow: 'hidden',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <img
                                    src={modalFileUrl} // Set the source of the image
                                    alt="File Preview"
                                    style={{
                                        maxWidth: '100%', // Ensures the image fits within the modal width
                                        maxHeight: '100vh', // Prevents the image from exceeding the viewport height
                                        objectFit: 'contain', // Ensures the image maintains its aspect ratio
                                        display: 'block',
                                    }}
                                />
                            </div>
                        </Modal.Body>
                    </Modal>
                    <ChangePasswordModal show={showModal} closeModal={closeModal} />
                </>
            )}
        </>
    );
};

export default ClinicForm;
