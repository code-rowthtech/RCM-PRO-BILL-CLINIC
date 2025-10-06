import React, { useEffect, useState } from 'react';
import { Col, Form, Row, Button, Table, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { FiMinusCircle, FiDownloadCloud, FiEdit, FiEye } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

import Spinner from '../../../../../constants/Spinner';
import { createClinicAction, getClinicAction } from '../../../../../redux/clinics/actions';
import { getSubClinicAction } from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { handleUpload } from '../../../../../helpers/HandleUpload';
import { handleFirstSpace } from '../../../../../helpers/noSpace';
import ChangePasswordModal from '../../../../../components/ChangePasswordModal';
import AddressForm from '../../../Common Pages/AddressForm';
import TelecomFrom from '../../../Common Pages/TelecomFrom';

import BasicInfoSection from './sections/BasicInfoSection';
import IdentifiersSection from './sections/IdentifiersSection';
import POCSection from './sections/POCSection';
import SubClinicsTable from './sections/SubClinicsTable';
import FilePreviewModal from './modals/FilePreviewModal';

const ClinicForm = ({ setActiveTab, activeTab, setClinicId, clinicId, setBillingId }) => {
  const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm();
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const [searchParams] = useSearchParams();

  const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'));
  const updateId = searchParams.get('updateid');

  // State management
  const [logo, setLogo] = useState(null);
  const [logoName, setLogoName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalPic, setShowModalPic] = useState(false);
  const [modalFileUrl, setModalFileUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [logoUploading, setLogoUploading] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);

  // Form data states
  const [practiceAddresses, setPracticeAddresses] = useState([
    { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' }
  ]);
  const [practiceTelecom, setPracticeTelecom] = useState([{ system: '', value: '', use: '' }]);
  const [constantIdentifiers, setConstantIdentifiers] = useState([]);
  const [pocs, setPocs] = useState([{
    name: { use: '', text: '', family: '', given: [''], prefix: [''], suffix: [] },
    email: '',
    role: '',
    telecom: [{ system: '', value: '', use: '' }]
  }]);

  // Selectors
  const clinicsDataGet = store?.getClinicsReducer?.data?.clinic;
  const getTableData = store?.getSubClinicsReducer?.data?.clinics;
  const clinectypes = store?.getClinicTypeReducer?.data?.result;

  useEffect(() => {
    dispatch(getClinicAction({ key: encryptMessage({ clinicId: clinic_id?.clinicId }) }));
    dispatch(getSubClinicAction());
  }, [dispatch]);

  // Initialize form data when clinic data is loaded
  useEffect(() => {
    if (clinicsDataGet) {
      initializeFormData(clinicsDataGet);
    }
  }, [clinicsDataGet, setValue, clinectypes]);

  const initializeFormData = (data) => {
    setValue('clinicType', data?.orgType);
    setValue('clinicname', data?.name);
    setValue('email', data?.userId?.email);

    if (data?.orgLogo) {
      setLogoName(data.orgLogo.fileName);
    }

    // Initialize identifiers, addresses, telecom, and POCs
    initializeIdentifiers(data?.identifier);
    initializeAddresses(data?.address);
    initializeTelecom(data?.telecom);
    initializePOCs(data?.poc);
  };

  const initializeIdentifiers = (identifiers) => {
    const defaultIdentifiers = ['NPI', 'CLIA', 'NAIC'];
    let processedIdentifiers = identifiers?.map((data) => ({
      type: data.identifierType || '',
      number: data?.value || '',
      file: data?.documents?.[0]?.fileName ? {
        url: data?.documents?.[0]?.url,
        name: data?.documents?.[0]?.fileName
      } : '',
      expiry: data?.expirationDate || '',
      issuingAuthority: data.issuingAuthority || '',
      use: data.use || ''
    })) || [];

    if (processedIdentifiers.length === 0) {
      processedIdentifiers = defaultIdentifiers.map((type) => ({
        type, number: '', file: '', expiry: '', issuingAuthority: '', use: ''
      }));
    }

    setConstantIdentifiers(processedIdentifiers);
  };

  const initializeAddresses = (addresses) => {
    const newAddresses = addresses?.map((addr) => ({
      type: addr.type || '',
      use: addr.use || '',
      line: addr.line && Array.isArray(addr.line) ? addr.line : [''],
      city: addr?.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'US'
    })) || [{ type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }];

    setPracticeAddresses(newAddresses);
  };

  const initializeTelecom = (telecom) => {
    const contactDetails = ['phone', 'email'];
    let contacts = telecom?.map((contact) => ({
      system: contact.system || '',
      value: contact.value || '',
      use: contact.use || ''
    })) || [];

    if (contacts.length === 0) {
      contacts = contactDetails.map((system) => ({ system, value: '', use: '' }));
    }

    setPracticeTelecom(contacts);
  };

  const initializePOCs = (pocData) => {
    const processedPOCs = pocData?.map((poc) => ({
      name: {
        use: poc.name?.use || '',
        text: poc.name?.text || '',
        family: poc.name?.family || '',
        given: poc.name?.given || [''],
        prefix: poc.name?.prefix || [''],
        suffix: poc.name?.suffix || []
      },
      email: poc.email || '',
      role: poc.role || '',
      telecom: poc.telecom?.map((tele) => ({
        system: tele.system || '',
        value: tele.value || '',
        use: tele.use || ''
      })) || [{ system: '', value: '', use: '' }]
    })) || [{
      name: { use: '', text: '', family: '', given: [''], prefix: [''], suffix: [] },
      email: '',
      role: '',
      telecom: [{ system: '', value: '', use: '' }]
    }];

    setPocs(processedPOCs);
  };

  const onSubmit = (data) => {
    if (data.Password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    const payload = buildSubmissionPayload(data);
    dispatch(createClinicAction({ key: encryptMessage(payload) }));
  };

  const buildSubmissionPayload = (data) => {
    return {
      clinicId: clinic_id?.clinicId,
      userId: clinic_id?._id,
      ...(updateId && { id: updateId }),
      name: data?.clinicname,
      email: data?.email,
      orgType: data?.clinicType,
      orgLogo: {
        url: logo?.url ? logo?.url?.split('?')[0] : clinicsDataGet?.logo?.url || '',
        fileName: logoName || clinicsDataGet?.logo?.fileName || ''
      },
      identifier: constantIdentifiers.map((item) => ({
        identifierType: item.type,
        use: item.use,
        value: item.number,
        documents: item.file ? { url: item.file.url, fileName: item.file.name || '' } : null,
        expirationDate: item.expiry,
        status: 'active',
        system: 'urn:oid:2.16.840.1.113883.4.7',
        sliceName: item.type,
        issuingAuthority: item.issuingAuthority
      })),
      telecom: practiceTelecom,
      address: practiceAddresses,
      poc: pocs
    };
  };

  if (store.getClinicsReducer?.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '82vh' }}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <BasicInfoSection
          register={register}
          errors={errors}
          setValue={setValue}
          logo={logo}
          setLogo={setLogo}
          logoName={logoName}
          setLogoName={setLogoName}
          logoUploading={logoUploading}
          setLogoUploading={setLogoUploading}
          clinicsDataGet={clinicsDataGet}
          setShowModalPic={setShowModalPic}
          setModalFileUrl={setModalFileUrl}
        />

        <hr className="mb-1" />

        <IdentifiersSection
          constantIdentifiers={constantIdentifiers}
          setConstantIdentifiers={setConstantIdentifiers}
          register={register}
          errors={errors}
          setShowModalPic={setShowModalPic}
          setModalFileUrl={setModalFileUrl}
        />

        <hr className="mb-1" />
        <TelecomFrom constantContact={practiceTelecom} setConstantContact={setPracticeTelecom} />

        <hr className="mb-1" />
        <AddressForm addresses={practiceAddresses} setAddresses={setPracticeAddresses} />

        <hr className="mb-1" />

        <POCSection
          pocs={pocs}
          setPocs={setPocs}
        />

        <Col md={12} className="mt-0 d-flex gap-2 justify-content-end">
          <Button
            as={Link}
            to={'/apps/Practice/new-practice'}
            variant="primary"
            className="custom-buttons"
          >
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
            style={{ width: '55px' }}
            className="custom-buttons"
          >
            {store?.createClinicsReducer?.loading ? (
              <Spinner color="white" className="spinner-border-sm" />
            ) : (
              'Save'
            )}
          </Button>
        </Col>
      </Form>

      <SubClinicsTable
        loading={store?.getSubClinicsReducer?.loading}
        data={getTableData}
      />

      <FilePreviewModal
        show={showModalPic}
        onHide={() => setShowModalPic(false)}
        fileUrl={modalFileUrl}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
      />

      <ChangePasswordModal show={showModal} closeModal={() => setShowModal(false)} />
    </>
  );
};

export default ClinicForm;