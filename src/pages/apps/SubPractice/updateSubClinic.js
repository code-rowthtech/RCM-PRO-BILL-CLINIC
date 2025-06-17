import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud, FiEye } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { handleUpload } from '../../../helpers/HandleUpload';
import { encryptMessage } from '../../../cryptoUtils';
import { updateSubClinicAction } from '../../../redux/sub clinic/actions';
import { CiCircleMinus } from 'react-icons/ci';
import us from '../../../assets/images/flags/us.jpg';
import {
    getCities2Action,
    getCities3Action,
    getCitiesAction,
    getClinicAction,
    getClinicTypeAction,
    getStatesByCountryAction,
} from '../../../redux/actions';
import ToastHandle from '../../../helpers/ToastMessage';
import { handleFirstSpace } from '../../../helpers/noSpace';
import { MdVerified } from 'react-icons/md';
import EmailToDoctorModal from './EmailToSubClinicModal';
import AddressForm from '../Common Pages/AddressForm';
const SubUpdateClinic = () => {
    const [searchParams] = useSearchParams();
    const idUpdateDataSubClinics = searchParams.get('id');
    const clinicId = searchParams.get('clinicId');
    const logoFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [btnShow, setBtnShow] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => setShowModal(false);
    const [showModalPic, setShowModalPic] = useState(false); // State to control modal visibility
    const [updatePracticeAddresses, setUpdatePracticeAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    ]);
    const [modalFileUrl, setModalFileUrl] = useState(''); // State to store file URL for modal

    const handleShowModal = (url) => {
        setModalFileUrl(url); // Set the URL of the file to display in modal
        setShowModalPic(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowModalPic(false); // Close the modal
        setModalFileUrl(''); // Reset file URL
    };

    const handleLogoClick = () => {
        logoFileInputRef.current.click();
    };
    const [logoUploading, setLogoUploading] = useState(false);
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setLogoUploading);
            // setLogo(url?.url?.split('?')[0]);
            setLogo({ url: url?.url?.split('?')[0] });
            setLogoName(selectedFile?.name);
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };
    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' },
    ]);

    const [stateDetails, setStateDetails] = useState([{ name: '', number: '', url: null, fileName: '' }]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [taxonomyCodes, setTaxonomyCodes] = useState(['']);
    const store = useSelector((state) => state);
    const clinectypes = store?.getClinicTypeReducer?.data?.result;
    const statesData = store?.getStatesReducer?.data;
    const subClinicsDetailsGet = store?.getClinicsReducer?.data?.clinic;
    const [identifierDocument, setIdentifierDocumnent] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    useEffect(() => {
        setLogo(subClinicsDetailsGet?.logo?.url);
    }, [subClinicsDetailsGet]);
    const cities = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const updateLoading = store?.updateSubClinicReducer?.loading;
    const updateSuccess = store?.updateSubClinicReducer?.data?.status;
    const [searchedLocations, setSearchedLocations] = useState([]);
    const [searchedLocations2, setSearchedLocations2] = useState(null);
    const [focused, setFocused] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [latitude1, setLatitude1] = useState(null);
    const [longitude, setLongitude] = useState('');
    const [longitude1, setLongitude1] = useState(null);
    const [stateToSelect, setStateToSelect] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [newaccreditationLogo, setNewAccreditationLogo] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

    useEffect(() => {
        if (showModalPic && modalFileUrl) {
            setImageLoading(true);
        }
    }, [showModalPic, modalFileUrl]);
    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch]);

    useEffect(() => {
        if (latitude && longitude) {
            setFocused(false);
        }
    }, [latitude, longitude]);

    const getGeolocation = async (e) => {
        const addressToSearch = e.target.value;

        if (!addressToSearch) {
            setSearchedLocations([]);
            return;
        }

        const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            addressToSearch
        )}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.status}`);
            }
            const data = await response.json();
            setSearchedLocations(data.results || []);
        } catch (error) {
            console.error('Failed to fetch geocode data:', error);
        }
    };
    const getGeolocation2 = (e) => {
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
                setSearchedLocations2(data?.results);
            } else {
            }
        });
    };
    useEffect(() => {
        if (stateToSelect) {
            dispatch(getCitiesAction({ state_code: stateToSelect, name: '', limit: 25, skip: '' }));
        }
    }, [stateToSelect]);

    const handleStateSelection = (e) => {
        const stateCode = e.target.value;
        if (stateCode) {
            setStateToSelect(stateCode);
            dispatch(getCitiesAction({ state_code: stateCode, name: '', limit: 25, skip: '' }));
        }
    };

    const handleCitySelection = (e) => {
        const city = e.target.value;
        if (city) {
            setSelectedCity(city);
        }
    };

    const stateGeoLocation = 'stateName';
    useEffect(() => {
        if (stateGeoLocation) {
            setStateToSelect(
                statesData?.states && statesData?.states.find((data) => data?.state_code === stateGeoLocation)
            );
        }
    }, [stateGeoLocation]);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
        getValues,
        watch,
        clearErrors,
    } = useForm({
        defaultValues: {
            accreditationDetails: [{ name: '', documentNumber: '' }],
            medicalLicenses: [{ name: '', documentNumber: '' }],
            stateLicensing: [{ state: '', documentNumber: '' }],
        },
    });
    // const closepassModal = () => {
    //     setPassShow(false);
    // }
    useEffect(() => {
        dispatch(getClinicTypeAction());
    }, [dispatch]);
    useEffect(() => {
        dispatch(getClinicAction({ key: encryptMessage({ clinicId: clinicId }) }));
    }, [idUpdateDataSubClinics]);

    const handleAccreditationInputChange = (e, field, index) => {
        const value = e.target.value;
        setAccreditationDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value,
            };
            return updatedDetails;
        });
    };
    const handleAccreditationChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setNewAccreditationLogo);
            setAccreditationDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url?.url?.split('?')[0],
                    fileName: selectedFile.name,
                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const clinic_MainId = JSON.parse(sessionStorage.getItem('hyper_user'));

    const [formData, setFormData] = useState({
        clinicname: '',
        clinicType: '',
        email: '',
        contactPerson: '',
    });
    const setField = (key, value) => value && setValue(key, value);
    useEffect(() => {
        if (subClinicsDetailsGet) {
            if (subClinicsDetailsGet?.orgType) {
                setValue('clinicType', subClinicsDetailsGet?.orgType);
            }
            setValue('clinicname', subClinicsDetailsGet?.name);
            setValue('email', subClinicsDetailsGet?.userId?.email);
            if (subClinicsDetailsGet?.orgLogo) {
                setLogoName(subClinicsDetailsGet.orgLogo.fileName);
            }

            // ✅ Ensure at least 'NPI', 'CLIA', 'NAIC' are set
            let identifiers =
                subClinicsDetailsGet?.identifier?.map((data) => ({
                    type: data.identifierType || '',
                    number: data?.value || '',
                    // file: data?.file|| '',
                    file: data?.documents?.[0]
                        ? {
                            url: data?.documents?.[0], // Store URL
                            name: data?.documents?.[0]?.url?.split('/').pop(), // Extract filename from URL
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
                subClinicsDetailsGet.telecom?.map((contact) => ({
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
            setUpdatePracticeAddresses(
                subClinicsDetailsGet?.address?.map((addr) => ({
                    use: addr.use || '',
                    type: addr.type || '',
                    line: addr.line && Array.isArray(addr.line) ? addr.line : [''], // Ensure array
                    city: addr.city || '',
                    state: addr.state || '',
                    postalCode: addr.postalCode || '',
                    country: addr.country || '',
                })) || [{ use: '', line: [''], city: '', state: '', postalCode: '', country: '' }]
            );
            // ✅ Set POCs (Point of Contacts)
            setPocs(
                subClinicsDetailsGet?.poc?.map((pocs) => ({
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
    }, [subClinicsDetailsGet, setValue, clinectypes]);

    const handleAddAccreditation = () => {
        const isIncomplete = accreditationDetails.some(
            (subClinicsDetailsGet) =>
                !subClinicsDetailsGet.name || !subClinicsDetailsGet.number || !subClinicsDetailsGet.url
        );
        if (isIncomplete) {
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setAccreditationDetails([...accreditationDetails, { name: '', number: '', url: null }]);
    };

    const handleRemoveAccreditation = (index) => {
        setAccreditationDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };

    const handleAddTaxonomy = () => {
        const lastCode = taxonomyCodes[taxonomyCodes.length - 1];

        if (lastCode) {
            const validCodes = taxonomyCodes.filter((code) => code.trim() !== '');
            setTaxonomyCodes([...validCodes, '']);
        } else {
            ToastHandle('Please complete the current Taxonomy Code field before adding another.', 'danger');
        }
    };
    const handleTaxonomyChange = (index, value) => {
        const updatedCodes = [...taxonomyCodes];
        updatedCodes[index] = value;
        setTaxonomyCodes(updatedCodes);
    };
    const handleRemoveTaxonomy = (index) => {
        setTaxonomyCodes((prev) => {
            const updatedCodes = prev.filter((_, i) => i !== index);
            return updatedCodes.length > 0 ? updatedCodes : [''];
        });
    };
    const [posDetails, setPosDetails] = useState([{ name: '', email: '', role: '', contact: '', fileName: '' }]);

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
    const submitSubData = (data) => {
        const payload = {
            clinicId: clinicId,
            userId: idUpdateDataSubClinics,
            name: data?.clinicname,
            email: data?.email,
            orgType: data?.clinicType,
            orgLogo: {
                url: logo?.url?.split('?')[0] || '',
                fileName: logoName || '',
            },
            identifier: constantIdentifiers.map((item) => ({
                identifierType: item.type,
                use: item.use,
                value: item.number,
                ...(item?.file && { documents: { url: item.file.url, fileName: item.file.name || '' } }),
                expirationDate: item.expiry,
                status: 'active',
                system: 'urn:oid:2.16.840.1.113883.4.7',
                sliceName: item.type,
                issuingAuthority: item.issuingAuthority,
            })),
            telecom: constantContact,
            address: updatePracticeAddresses,
            poc: pocs,
            flag: 'subClinic',
            ...(posDetails && { pos: posDetails }),
        };
        dispatch(updateSubClinicAction({ key: encryptMessage(payload) }));
    };
    useEffect(() => {
        if (updateSuccess === 200) {
            navigate('/apps/crm/addPractice');
        }
    }, [updateSuccess]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedLocation2, setSelectedLocation2] = useState(null);

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
        if (selectedLocation2) {
            setLatitude1(selectedLocation2?.bounds?.southwest?.lat);
            setLongitude1(selectedLocation2?.bounds?.southwest?.lng);
            setValue('mailingAddress', selectedLocation2?.formatted);
            const stateId =
                statesData?.states &&
                statesData?.states.find((data) => data?.state_code === selectedLocation2?.components?.state_code)?.id;
            const selectedState =
                statesData?.states &&
                statesData?.states.find((data) => data?.state_code === selectedLocation2?.components?.state_code)?._id;
            setValue('mailingStateName', selectedState);
            const countyName = selectedLocation2?.components?.county;
            dispatch(getCities2Action({ state_code: stateId, name: countyName, limit: '', skip: '' }));
        }
    }, [dispatch, selectedLocation, selectedLocation2, setValue, statesData]);
    useEffect(() => {
        if (cities) {
            const selectedCounty =
                cities &&
                cities.find(
                    (event) =>
                        event?.name === selectedLocation?.components?.county ||
                        subClinicsDetailsGet?.userId?.primaryAddress?.city?.name
                )?._id;
            setValue('city', selectedCounty);
        }
        if (cities2) {
            const selectedCounty1 =
                cities2 &&
                cities2.find(
                    (event) =>
                        event?.name === selectedLocation2?.components?.county ||
                        subClinicsDetailsGet?.userId?.mailingAddress?.city?.name
                )?._id;
            setValue('mailingCity', selectedCounty1);
        }
    }, [cities, cities2, setValue]);
    const [selectedStates, setSelectedStates] = useState([]);
    const [statesMenu, setStatesMenu] = useState(false);
    const handleCheckboxChange = (stateName) => {
        setSelectedStates((prev) => {
            const updatedStates = prev.includes(stateName)
                ? prev.filter((name) => name !== stateName)
                : [...prev, stateName];

            setStateDetails((prevDetails) => {
                const newDetails = updatedStates.map(
                    (state) =>
                        prevDetails.find((detail) => detail.name === state) || {
                            name: state,
                            number: '',
                            url: null,
                            fileName: '',
                        }
                );
                return newDetails;
            });

            return updatedStates;
        });
    };

    const handleStateInputChange = (e, field, index) => {
        const value = e.target.value;
        setStateDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value,
            };
            return updatedDetails;
        });
    };
    const [stateLogoUpload, setStateLogoUpload] = useState(false);

    const handleStateChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setStateLogoUpload);
            setStateDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url?.url?.split('?')[0],
                    fileName: selectedFile.name,
                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const handleRemoveState = (index) => {
        setStateDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            setSelectedStates(updatedDetails.map((detail) => detail.name));
            return updatedDetails;
        });
    };
    const menuRef = useRef(null);
    const containerRef = useRef(null);
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
    // new Chnages
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
    const addressUses = ['home', 'work', 'temp', 'old', 'billing', 'mailing', 'primary'];
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
        'CCN',
        'Taxonomy',
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
        { use: '', line: [''], city: '', state: '', postalCode: '', country: '' }, // Default address
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
        setAddresses([...addresses, { use: '', line: [''], city: '', state: '', postalCode: '', country: '' }]);
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
        updatedContacts[index][field] = value;
        setConstantContact(updatedContacts);
    };
    const handleAddressChange = (index, field, value) => {
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
        const updatedPocs = [...pocs];
        updatedPocs[pocIndex].telecom[telecomIndex][field] = value;
        setPocs(updatedPocs);
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
    const formatDisplayValue = (value) => {
        if (!value) return '';
        const rawValue = value.replace(/\D/g, '');
        return rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
            if (p3) return `(${p1})${p2}-${p3}`;
            if (p2) return `(${p1})${p2}`;
            return `(${p1}`;
        });
    };

    return (
        <>
            <div className="pt-1 pb-2">
                <div className="container-fluid mt-2 px-0">
                    <Card className="px-md-2 py-md-2 scroll-container" style={{ height: '90vh', overflow: 'scroll' }}>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <div>
                                    <ul className="nav nav-underline">
                                        <li className="nav-item">
                                            <button className="text-black nav-link font_active_tabs active">
                                                Practice Sub Update Information
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="d-flex gap-2  d-none d-md-block">
                                    {btnShow && (
                                        <>
                                            <Button as={Link} className="cancel-button" to={'/apps/crm/addPractice'}>
                                                Back
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <>
                                {store?.getClinicsReducer?.loading ? (
                                    <div
                                        className="d-flex justify-content-center align-items-center"
                                        style={{ height: '82vh' }}>
                                        <Spinner />
                                    </div>
                                ) : (
                                    <Form className="mt-1" onSubmit={handleSubmit(submitSubData)}>
                                        <Row>
                                            <Col sm={3}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className="mb-0">
                                                        Practice Name <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        data-has-value={!!watch('clinicname')}
                                                        {...register('clinicname', {
                                                            required: 'Practice Name is required',
                                                        })}
                                                        placeholder="Practice name"
                                                    />
                                                    {errors.clinicname && (
                                                        <p className="text-danger">{errors.clinicname.message}</p>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col sm={3}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className="mb-0">
                                                        Practice type <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Select
                                                        {...register('clinicType', {
                                                            required: 'Practice Type is required',
                                                        })}
                                                        defaultValue=""
                                                        className="form-control"
                                                        data-has-value={!!watch('clinicType')}>
                                                        <option value="" hidden>
                                                            Select Clinic type
                                                        </option>
                                                        {clinectypes?.map((data) => (
                                                            <option key={data?._id} value={data?.name}>
                                                                {data?.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    {errors.clinicType && (
                                                        <p className="text-danger">{errors.clinicType.message}</p>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col sm={3}>
                                                <Form.Group className="mb-1 position-relative">
                                                    <Form.Label className="mb-0">
                                                        Email <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        data-has-value={!!watch('email')}
                                                        placeholder="Email"
                                                        disabled={true}
                                                        {...register('email', {
                                                            required: 'Email is required',
                                                            pattern: {
                                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                message: 'Please enter a valid email address',
                                                            },
                                                        })}
                                                    />
                                                    <span
                                                        style={{ right: '2%', top: '43%' }}
                                                        className={`${subClinicsDetailsGet?.userId?.email
                                                            ? 'text-success position-absolute fs-4'
                                                            : 'd-none'
                                                            }`}>
                                                        <MdVerified />
                                                    </span>
                                                    {errors.email && (
                                                        <p className="text-danger">{errors.email.message}</p>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                            <Col sm={3}>
                                                <Form.Label className="mb-0">Upload Logo</Form.Label>
                                                <div
                                                    onClick={handleLogoClick}
                                                    className={`custom-file-upload justify-content-between cursor-pointer ${logoName || logoUploading
                                                        ? 'form-control'
                                                        : 'custom-form-fields'
                                                        }`}>
                                                    {logoName
                                                        ? logoName.split('/').pop().slice(0, 30) + '...'
                                                        : logoUploading
                                                            ? 'Uploading...'
                                                            : 'Upload Logo'}
                                                    <div className="d-flex align-items-center gap-2">
                                                        <FiEye
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent file input trigger
                                                                handleShowModal(
                                                                    logo ? logo : subClinicsDetailsGet?.orgLogo?.url
                                                                );
                                                                // Show the logo preview
                                                            }}
                                                            className="text-dark cursor-pointer"
                                                            style={{ zIndex: 1 }}
                                                        />
                                                        <p className="mb-0">
                                                            <FiDownloadCloud />
                                                        </p>
                                                    </div>
                                                </div>
                                                <Form.Control
                                                    type="file"
                                                    ref={logoFileInputRef}
                                                    style={{ display: 'none' }}
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
                                                        <Col>
                                                            <Form.Label>Identifier Document</Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label>Issuing Authority</Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label>
                                                                Identifier Expiry{' '}
                                                                <span className="text-secondary">(If Applicable)</span>
                                                            </Form.Label>
                                                        </Col>
                                                    </Row>

                                                    {/* Dynamic Identifier Fields */}
                                                    {constantIdentifiers.map((item, index) => (
                                                        <Row key={index} className="mb-2">
                                                            {/* Identifier Type */}
                                                            <Col>
                                                                <Form.Select
                                                                    value={item.type}
                                                                    data-has-value={
                                                                        !!watch(`identifiers[${index}].type`)
                                                                    }
                                                                    {...register(
                                                                        `identifiers[${index}].type`
                                                                        //  { required: 'Identifier Type is required' }
                                                                    )}
                                                                    onChange={(e) =>
                                                                        handleChange(index, 'type', e.target.value)
                                                                    }
                                                                    disabled={defaultIdentifiers.includes(item.type)}>
                                                                    <option value="" disabled>
                                                                        Select Identifier Type
                                                                    </option>
                                                                    {identifierOptions.map((option) => (
                                                                        <option
                                                                            key={option}
                                                                            className=""
                                                                            value={option}>
                                                                            {option}
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                                {errors?.[index]?.type && (
                                                                    <span className="text-danger">
                                                                        This field is required
                                                                    </span>
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
                                                                                : undefined
                                                                    }
                                                                    {...register(`identifiers[${index}].number`, {
                                                                        // required: defaultIdentifiers.includes(item.type)
                                                                        //     ? 'Document Number is required'
                                                                        //     : false,
                                                                        validate: (value) => {
                                                                            if (!value) return true; // Skip validation if field is empty (for dynamic fields)

                                                                            if (
                                                                                item.type === 'NPI' &&
                                                                                !/^[0-9]{10}$/.test(value)
                                                                            ) {
                                                                                return 'NPI number must be exactly 10 digits long';
                                                                            }
                                                                            if (
                                                                                item.type === 'CLIA' &&
                                                                                !/^[A-Z0-9]{2}D[0-9]{7}$/.test(value)
                                                                            ) {
                                                                                return 'CLIA number must be in the format XXDXXXXXXX, where X is alphanumeric and the rest are digits';
                                                                            }
                                                                            if (
                                                                                item.type === 'NAIC' &&
                                                                                !/^[0-9]{5}$/.test(value)
                                                                            ) {
                                                                                return 'NAIC number must be exactly 5 digits long';
                                                                            }
                                                                            return true; // No validation for other types (like DUNS, etc.)
                                                                        },
                                                                    })}
                                                                    onChange={(e) => {
                                                                        let value = e.target.value;

                                                                        // Enforce length limit only for NPI, CLIA, and NAIC
                                                                        if (
                                                                            item.type === 'NPI' ||
                                                                            item.type === 'CLIA'
                                                                        ) {
                                                                            value = value.slice(0, 10);
                                                                        } else if (item.type === 'NAIC') {
                                                                            value = value.slice(0, 10);
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
                                                                        document
                                                                            .getElementById(
                                                                                `fileInput-identifier-${index}`
                                                                            )
                                                                            .click()
                                                                    }
                                                                    className={`custom-file-upload justify-content-between cursor-pointer ${item.file
                                                                        ? 'form-control'
                                                                        : 'custom-form-fields'
                                                                        }`}>
                                                                    {item.file?.name
                                                                        ? (() => {
                                                                            const decodedName = decodeURIComponent(
                                                                                item.file.name
                                                                            );
                                                                            return decodedName.length > 30
                                                                                ? decodedName.slice(0, 25) + '...'
                                                                                : decodedName;
                                                                        })()
                                                                        : 'Upload Document'}
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        {(item?.file?.url ||
                                                                            subClinicsDetailsGet?.orgLogo?.url) && (
                                                                                <FiEye
                                                                                    className="cursor-pointer"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        handleShowModal(
                                                                                            item?.file?.url ||
                                                                                            subClinicsDetailsGet
                                                                                                ?.orgLogo?.url
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        <p className="mb-0">
                                                                            <FiDownloadCloud />
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Form.Control
                                                                    type="file"
                                                                    id={`fileInput-identifier-${index}`}
                                                                    style={{ display: 'none' }}
                                                                    accept=".png, .jpg, .jpeg, .pdf"
                                                                    onChange={(e) =>
                                                                        handleIdentifierFileChange(e, index)
                                                                    }
                                                                />
                                                                {errors?.[index]?.file && (
                                                                    <span className="text-danger">
                                                                        Please upload a document
                                                                    </span>
                                                                )}
                                                            </Col>

                                                            {/* Issuing Authority */}
                                                            <Col>
                                                                <Form.Select
                                                                    value={item.issuingAuthority}
                                                                    data-has-value={
                                                                        !!watch(
                                                                            `identifiers[${index}].issuingAuthority`
                                                                        )
                                                                    }
                                                                    {...register(
                                                                        `identifiers[${index}].issuingAuthority`
                                                                    )}
                                                                    onChange={(e) =>
                                                                        handleChange(
                                                                            index,
                                                                            'issuingAuthority',
                                                                            e.target.value
                                                                        )
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
                                                                    <span className="text-danger">
                                                                        This field is required
                                                                    </span>
                                                                )}
                                                            </Col>
                                                            {/* Expiry Date */}
                                                            <Col className="position-relative">
                                                                <Form.Control
                                                                    type="date"
                                                                    value={
                                                                        item?.expiry
                                                                            ? formatDateForInput(item.expiry)
                                                                            : ''
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleChange(index, 'expiry', e.target.value)
                                                                    }
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
                                                                    data-has-value={
                                                                        !!watch(`constantContact[${index}].system`)
                                                                    }
                                                                    {...register(`constantContact[${index}].system`)}
                                                                    onChange={(e) =>
                                                                        handleContactChange(
                                                                            index,
                                                                            'system',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    disabled={contactDetails.includes(item.type)}>
                                                                    <option value="" disabled>
                                                                        Select Contact Type
                                                                    </option>
                                                                    {contactOptions.map((option) => (
                                                                        <option
                                                                            className="text-capitalize"
                                                                            key={option}
                                                                            value={option}>
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
                                                                                handleContactChange(
                                                                                    index,
                                                                                    'value',
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            maxLength={14}
                                                                            onKeyPress={(event) => {
                                                                                if (!/[0-9]/.test(event.key))
                                                                                    event.preventDefault();
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
                                                                        type={
                                                                            item.system === 'email' ? 'email' : 'text'
                                                                        }
                                                                        placeholder={
                                                                            item.system === 'email'
                                                                                ? 'Enter email'
                                                                                : 'Enter value'
                                                                        }
                                                                        value={item.value || ''}
                                                                        onChange={(e) =>
                                                                            handleContactChange(
                                                                                index,
                                                                                'value',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                            </Col>

                                                            <Col sm={4} className="position-relative">
                                                                <Form.Select
                                                                    value={item.use}
                                                                    data-has-value={
                                                                        !!watch(`constantContact[${index}].use`)
                                                                    }
                                                                    {...register(`constantContact[${index}].use`)}
                                                                    onChange={(e) =>
                                                                        handleContactChange(
                                                                            index,
                                                                            'use',
                                                                            e.target.value
                                                                        )
                                                                    }>
                                                                    <option value="">Select Option</option>{' '}
                                                                    {/* Placeholder option */}
                                                                    <option value="temp">Temp</option>
                                                                    <option value="home">Home</option>
                                                                    <option value="work">Work</option>
                                                                    <option value="old">Old</option>
                                                                    <option value="mobile">Mobile</option>
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
                                            <AddressForm
                                                addresses={updatePracticeAddresses}
                                                setAddresses={setUpdatePracticeAddresses}
                                            />
                                            <hr className="mb-1" />
                                            {pocs.map((poc, pocIndex) => (
                                                <div key={pocIndex} className="p-2">
                                                    <Row>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label>Full Name</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={poc.name.text}
                                                                    onChange={(e) =>
                                                                        handlePocChange(
                                                                            pocIndex,
                                                                            'name.text',
                                                                            e.target.value
                                                                        )
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
                                                                    onChange={(e) =>
                                                                        handlePocChange(
                                                                            pocIndex,
                                                                            'role',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </Form.Group>
                                                            {pocs.length > 1 && (
                                                                <span
                                                                    className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                                                                    style={{ right: '-1%', top: '50%' }}
                                                                    onClick={() => removePoc(pocIndex)}>
                                                                    <CiCircleMinus />
                                                                </span>
                                                            )}
                                                        </Col>

                                                        <Col sm={6}>
                                                            <Form.Group>
                                                                <Form.Label>Email</Form.Label>
                                                                <Form.Control
                                                                    type="email"
                                                                    placeholder="Enter Email"
                                                                    value={poc.email}
                                                                    onChange={(e) =>
                                                                        handlePocChange(
                                                                            pocIndex,
                                                                            'email',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        {poc.telecom.map((telecom, telecomIndex) => (
                                                            <Col sm={6} key={telecomIndex}>
                                                                <Form.Group className="mb-2 position-relative">
                                                                    <Form.Label className="mb-1">
                                                                        Phone Number
                                                                    </Form.Label>
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
                                                                        <img
                                                                            src={us}
                                                                            alt="country code flag"
                                                                            width={20}
                                                                        />
                                                                    </div>
                                                                </Form.Group>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                            ))}
                                            <Col md={12} className="mt-1 d-flex gap-2 justify-content-end">
                                                <Button
                                                    variant="primary"
                                                    className="custom-buttons"
                                                    onClick={() => setShowModal(true)}>
                                                    Change Password
                                                </Button>

                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                    className="custom-buttons"
                                                    style={{ width: '65px' }}
                                                    disabled={updateLoading}>
                                                    {updateLoading ? (
                                                        <Spinner color="white" className="spinner-border-sm" />
                                                    ) : idUpdateDataSubClinics ? (
                                                        'Update'
                                                    ) : (
                                                        'Submit'
                                                    )}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                )}
                            </>
                        </div>
                    </Card>
                </div>
                {/* <ResetPassword closeModal={closepassModal} show={passShow} /> */}
                <EmailToDoctorModal
                    show={showModal}
                    formData={formData}
                    setFormData={setFormData}
                    closeModal={closeModal}
                />
            </div>
            <Modal show={showModalPic} onHide={handleCloseModal} centered>
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                        <p className="fw-bold" style={{ color: '#6169D0' }}>
                            File Preview
                        </p>
                    </div>
                    <div
                        style={{
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '300px', // minimum height to keep space for loader
                        }}>
                        {imageLoading && (
                            <div className="d-flex justify-content-center align-items-center">
                                <Spinner />
                            </div>
                        )}
                        <img
                            src={modalFileUrl?.url || modalFileUrl}
                            alt="File Preview"
                            onLoad={() => setImageLoading(false)}
                            onError={() => setImageLoading(false)} // hide spinner on error too
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100vh',
                                objectFit: 'contain',
                                display: imageLoading ? 'none' : 'block', // hide while loading
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default SubUpdateClinic;
