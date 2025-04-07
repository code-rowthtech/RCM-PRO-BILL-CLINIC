import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createDoctorDetailAction } from "../../../redux/actions";
import { encryptMessage } from "../../../cryptoUtils";
import { useForm } from "react-hook-form";
import { getMastersDataAction } from "../../../redux/settings/action";
import { useSearchParams } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";
import { CiCircleMinus } from "react-icons/ci";
import { handleUpload } from "../../../helpers/HandleUpload";
import IdentifierForm from "../Common Pages/IdentifierForm";
import Select from 'react-select';
import { qualificationsData } from "../../../utils/DataSets/qualification.data";
import DoctorIdentifierForm from "./DoctorIdentifier";
import { getFilteredTaxonomies } from "../../../utils/DataSets/commonData";
import { taxonomyOptions as taxonomy } from "../../../utils/DataSets/commonData";
import AsyncSelect from 'react-select/async';
const DoctorQualifications = () => {
    // const defaultIdentifiers = ['NPI'];
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const doctorDetails = store?.getDoctorDetailsReducer?.data?.result;
    const id = doctorDetails?._id;

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
    } = useForm();
    const [searchParams] = useSearchParams();

    const updateId = searchParams.get('id');
    const [qualifications, setQualifications] = useState([{ degreeName: '', degreeFile: null, issuerOrganisation: '' }]);
    const [documents, setDocuments] = useState([{ name: '', number: '', issuingAuthority: '', document: null, note: '' }]);
    const [documentUploading, setDocumentUploading] = useState(false);
    const addQualification = () => {
        setQualifications((prev) => [
            ...prev,
            {
                degreeName: '', degreeFile: null, issuerOrganisation: '',
            },
        ]);
        // const newQualification = { id: qualifications.length + 1, degreeName: '', degreeFile: null, issuerOrganisation: '' };
        // setQualifications([...qualifications, newQualification]);
    };

    const removeQualification = (id) => {
        if (qualifications.length > 1) { // Ensure at least one row remains
            const updatedQualifications = qualifications.filter((qual) => qual.id !== id);
            setQualifications(updatedQualifications);
        }
    };

    // Handle changes in qualification fields
    const handleQualificationChange = (index, field, value) => {
        const updatedQualifications = qualifications.map((qual, i) =>
            i === index ? { ...qual, [field]: field === 'degreeFile' ? value : value } : qual
        );
        setQualifications(updatedQualifications);
    };

    // Handle file upload for degree
    const handleFileChangeDegree = async (index, event) => {
        const file = event.target.files[0];
        try {
            const url = await handleUpload(file, setDegreeUploading);
            const fileName = file.name
            handleQualificationChange(index, 'degreeFile', { url: url?.url, fileName });
        } catch (error) {

        }
    };
    const [degreeUploading, setDegreeUploading] = useState(false);
    const QualificationOptions = qualificationsData.map((qualification) => ({
        value: qualification.code,
        label: qualification.display,
        data: qualification, // Store full object for later use
    }));

    const onsubmit = (data) => {
        const qualificationData = qualifications?.map((item) => ({
            code: item?.degreeName,
            documents: item?.degreeFile,
            issuer: item?.issuerOrganisation,
        }))
        const payload = {
            ...(updateId ? { doctorId: id } : { doctorId: store?.createtDoctorsReducer?.data?.doctor?._id }),
            qualification: qualificationData,
            otherDocuments: documents
        }
        dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
    }
    useEffect(() => {
        if (doctorDetails && updateId) {
            // Set qualifications data
            const updatedQualifications = doctorDetails?.qualification?.map((item, index) => ({
                degreeName: {
                    code: item?.code?.code,
                    display: item?.code?.display,
                    definition: item?.code?.display,
                    system: item?.code?.system
                },
                specialties: item?.specialties?.[0] || 'N/A',
                degreeFile: item?.documents?.[0] || null, // Use the first document if available
                issuerOrganisation: item?.issuer || '', // Use the issuer reference if available
            }));
            const updatedDocuments = doctorDetails?.otherDocuments?.map((item, index) => ({
                name: item?.name || '', number: item?.number || '', issuingAuthority: item?.issuingAuthority || '', document: item?.document || null, note: item?.note || ''
            }));
            setDocuments(updatedDocuments)
            setQualifications(updatedQualifications);
        }
    }, [doctorDetails, setValue, updateId]);


    const addDocuments = () => {
        setDocuments((prev) => [
            ...prev,
            {
                name: '',
                number: '',
                issuingAuthority: '',
                // status: '',
                document: null,
                note: '',
            },
        ]);
    };
    const handleDocumentsChange = (index, field, value) => {
        const updatedDocuments = documents.map((docs, i) =>
            i === index ? { ...docs, [field]: field === 'document' ? value : value } : docs
        );
        setDocuments(updatedDocuments);
    };

    const handleFileChangeDocuments = async (index, event) => {
        const file = event.target.files[0];
        try {
            const url = await handleUpload(file, setDocumentUploading);
            const fileName = file.name
            handleDocumentsChange(index, 'document', { url: url?.url, fileName });
        } catch (error) {

        }
    };


    return (
        <>
            <div className="container-fluid">
                <Form onSubmit={handleSubmit(onsubmit)}>
                    {store?.getDoctorDetailsReducer?.loading ?
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ height: '75vh' }}
                        >
                            <Spinner />
                        </div>
                        :
                        <>
                            <Row>
                                <Col sm={12}>
                                    <Row>
                                        <h5>
                                            Qualifications
                                            <span
                                                className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                                onClick={addQualification}
                                            ></span>
                                        </h5>
                                        {qualifications?.map((qualification, index) => (
                                            <React.Fragment key={index}>
                                                <div className="col-md-4 col-12">
                                                    <Form.Group className="mb-1">
                                                        <Form.Label className="mb-0">Select Degree Name</Form.Label>
                                                        <Select
                                                            options={QualificationOptions}
                                                            isSearchable
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            placeholder="&nbsp; Select "
                                                            value={QualificationOptions.find(option => option.value === qualification?.degreeName?.code)}
                                                            onChange={(selectedOption) =>
                                                                handleQualificationChange(index, 'degreeName', selectedOption)
                                                            }
                                                            styles={{
                                                                control: (provided) => ({
                                                                    ...provided,
                                                                    height: '30px',
                                                                    minHeight: '30px',
                                                                    border: '0px',
                                                                }),
                                                                placeholder: (provided) => ({
                                                                    ...provided,
                                                                    fontWeight: 'bold',
                                                                    fontSize: '12px',
                                                                    paddingBottom: '5px',
                                                                }),
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-4 col-12">
                                                    <div className="mb-1 d-flex flex-column position-relative">
                                                        <Form.Label className="mb-0">Degree</Form.Label>
                                                        <div
                                                            onClick={() => document.getElementById(`fileInput-degree-${index}`).click()}
                                                            className={`custom-file-upload justify-content-between cursor-pointer form-control ${qualification.degreeName || qualification.degreeFile ? '' : 'custom-form-fields'}`}
                                                        >
                                                            {degreeUploading ? 'Uploading...' : qualification.degreeFile?.fileName ? qualification.degreeFile.fileName : 'Upload Degree'}
                                                            <p className="mb-0">
                                                                <FiUploadCloud />
                                                            </p>
                                                        </div>
                                                        <Form.Control
                                                            type="file"
                                                            id={`fileInput-degree-${index}`}
                                                            // {...register(`degree[${index}]`)}
                                                            className="d-none"
                                                            // ref={degreeFileInputRef}
                                                            onChange={(event) => handleFileChangeDegree(index, event)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-12">
                                                    <Form.Group className="mb-1">
                                                        <Form.Label className="mb-0">Issuer Organisation</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={qualification.issuerOrganisation}
                                                            onChange={(e) => handleQualificationChange(index, 'issuerOrganisation', e.target.value)}
                                                            placeholder="Enter Issuer Organisation"
                                                        />
                                                    </Form.Group>
                                                </div>
                                                {index > 0 && (
                                                    <div className="col-md-12 text-end">
                                                        <span
                                                            className="text-danger position-absolute cursor-pointer fs-5 fw-bold"
                                                            style={{ marginTop: '-35px' }}
                                                            onClick={() => removeQualification(qualification.id)}>
                                                            <CiCircleMinus />
                                                        </span>
                                                    </div>
                                                )}
                                                {qualifications?.length > 1 && index < qualifications.length - 1 && <hr className="mt-2" />}

                                            </React.Fragment>
                                        ))}
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col sm={12}>
                                    <Row>
                                        <h5>
                                            Other Documents
                                            <span
                                                className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                                onClick={addDocuments}
                                            ></span>
                                        </h5>
                                        {documents?.map((data, index) => (
                                            <>
                                                <Row key={index} >
                                                    <div className="col-md-3 col-12">
                                                        <Form.Group className="mb-1">
                                                            <Form.Label className="mb-0">Document Name</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={data?.name || ''}
                                                                {...register(`documentName[${index}]`)}
                                                                onChange={(e) => handleDocumentsChange(index, 'name', e.target.value)}
                                                                placeholder="Enter Document Name"
                                                            />
                                                        </Form.Group>
                                                    </div>
                                                    <div className="col-md-3 col-12">
                                                        <div className="mb-1 d-flex flex-column position-relative">
                                                            <Form.Label className="mb-0">Document Number</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={data?.number}
                                                                {...register(`documentNumber[${index}]`)}
                                                                onChange={(e) => handleDocumentsChange(index, 'number', e.target.value)}
                                                                placeholder="Enter Document Number"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 col-12">
                                                        <Form.Group className="mb-1">
                                                            <Form.Label className="mb-0">Issuing Authority</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={data.issuingAuthority}
                                                                {...register(`issuingAuthority[${index}]`)}
                                                                onChange={(e) => handleDocumentsChange(index, 'issuingAuthority', e.target.value)}
                                                                // value={data.issuerOrganisation}
                                                                // onChange={(e) => handledataChange(index, 'issuerOrganisation', e.target.value)}
                                                                placeholder="Enter Issuing Authority"
                                                            />
                                                        </Form.Group>
                                                    </div>
                                                    <div className="col-md-3 col-12">
                                                        <div className="mb-1 d-flex flex-column position-relative">
                                                            <Form.Label className="mb-0">Document</Form.Label>
                                                            <div
                                                                onClick={() => document.getElementById(`fileInput-documents-${index}`).click()}
                                                                // onClick={() => documentsFileInputRef.current.click()}
                                                                className={`custom-file-upload justify-content-between cursor-pointer form-control ${data.degreeName || data.degreeFile ? '' : 'custom-form-fields'}`}
                                                            >
                                                                {documentUploading ? 'Uploading...' : data?.document?.fileName ? data.document.fileName : 'Upload Degree'}
                                                                <p className="mb-0">
                                                                    <FiUploadCloud />
                                                                </p>
                                                            </div>
                                                            <Form.Control
                                                                type="file"
                                                                id={`fileInput-documents-${index}`}
                                                                // {...register(`document[${index}]`)}
                                                                className="d-none"
                                                                // ref={documentsFileInputRef}
                                                                onChange={(event) => handleFileChangeDocuments(index, event)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 col-12">
                                                        <Form.Group className="mb-1">
                                                            <Form.Label className="mb-0">Note</Form.Label>
                                                            <Form.Control
                                                                as='textarea'
                                                                value={data?.note}
                                                                {...register(`note[${index}]`)}
                                                                onChange={(e) => handleDocumentsChange(index, 'note', e.target.value)}
                                                                // value={qualification.issuerOrganisation}
                                                                // onChange={(e) => handleQualificationChange(index, 'issuerOrganisation', e.target.value)}
                                                                placeholder="Enter Note"
                                                            />
                                                        </Form.Group>
                                                    </div>
                                                    {documents?.length > 1 && index < documents.length - 1 && <hr className="mt-2" />}
                                                </Row>
                                            </>
                                        ))}
                                    </Row>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-end gap-2 mt-1">
                                <Button className="cancel-button">
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="custom-buttons"
                                    disabled={store?.createtDoctorsDetailReducer?.loading}
                                >
                                    {store?.createtDoctorsDetailReducer?.loading ? (
                                        <Spinner color="white" className="spinner-border-sm" />
                                    ) : (
                                        'Update'
                                    )}
                                </Button>

                            </div>
                        </>
                    }
                </Form>
            </div>
        </>
    );
};

export default DoctorQualifications;
