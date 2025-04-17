import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createDoctorDetailAction } from "../../../redux/actions";
import { encryptMessage } from "../../../cryptoUtils";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";
import { CiCircleMinus } from "react-icons/ci";
import { handleUpload } from "../../../helpers/HandleUpload";
import Select from 'react-select';
import { qualificationsData } from "../../../utils/DataSets/qualification.data";

const DoctorQualifications = ({ setActiveTab, docId }) => {
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
        const newQualification = { degreeName: '', degreeFile: null, issuerOrganisation: '' };
        setQualifications([...qualifications, newQualification]);
    };

    const removeQualification = (index) => {
        if (qualifications.length > 1) { // Ensure at least one row remains
            const updatedQualifications = qualifications.filter((_, i) => i !== index);
            setQualifications(updatedQualifications);
        }
    };

    // Handle changes in qualification fields
    const handleQualificationChange = (index, field, value) => {
        if (field === 'degreeName') {
            const selectedQualification = qualificationsData.find((qualification) => qualification.code === value?.data?.code);
            if (selectedQualification) {
                const updatedQualifications = qualifications.map((qual, i) =>
                    i === index ? { ...qual, [field]: selectedQualification, degreeFile: null } : qual
                );
                setQualifications(updatedQualifications);
            }
        }
        const updatedQualifications = qualifications.map((qual, i) =>
            i === index ? { ...qual, [field]: field === 'degreeName' ? value?.data : value } : qual
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
            code: item?.degreeName?.data || item?.degreeName,
            documents: item?.degreeFile,
            issuer: item?.issuerOrganisation,
        }))
        const payload = {
            ...(updateId ? { doctorId: id } : { doctorId: docId }),
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

            const updateDocuments = doctorDetails?.otherDocuments?.map((item, index) => ({
                name: item?.name || '',
                number: item?.number || '',
                issuingAuthority: item?.issuingAuthority || '',
                document: item?.document || null,
                note: item?.note || '',
            }))
            setQualifications(updatedQualifications);
            setDocuments(updateDocuments)
        }
    }, [doctorDetails, setValue, updateId]);


    const addDocuments = () => {
        setDocuments((prev) => [
            ...prev,
            {
                // id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
                name: '',
                number: '',
                issuingAuthority: '',
                document: null,
                note: '',
            },
        ]);
    };
    const handleDocumentsChange = (index, field, value) => {
        const updatedDocuments = documents.map((docs, i) =>
            i === index ? { ...docs, [field]: field === 'degreeName' ? value?.data : value } : docs
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

    const removeDocument = (index) => {
        setDocuments((prev) => prev.filter((_, i) => i !== index));
    }

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
                                                            onClick={() => document.getElementById(`degree-file-input-${index}`).click()}
                                                            // onClick={() => degreeFileInputRef.current.click()}
                                                            className={`custom-file-upload justify-content-between cursor-pointer form-control ${qualification.degreeName || qualification.degreeFile ? '' : 'custom-form-fields'}`}
                                                        >
                                                            {degreeUploading ? 'Uploading...' : qualification.degreeFile?.fileName ? qualification.degreeFile.fileName : 'Upload Degree'}
                                                            <p className="mb-0">
                                                                <FiUploadCloud />
                                                            </p>
                                                        </div>
                                                        <Form.Control
                                                            type="file"
                                                            className="d-none"
                                                            id={`degree-file-input-${index}`}
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
                                                            onClick={() => removeQualification(index)}>
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
                                                <Row key={data.id} >
                                                    <div className="col-md-3 col-12">
                                                        <Form.Group className="mb-1">
                                                            <Form.Label className="mb-0">Document Name</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={data?.name}
                                                                // {...register(`documentName[${index}]`)}
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
                                                                // {...register(`documentNumber[${index}]`)}
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
                                                                value={data?.issuingAuthority}
                                                                // {...register(`issuingAuthority[${index}]`)}
                                                                onChange={(e) => handleDocumentsChange(index, 'issuingAuthority', e.target.value)}
                                                                placeholder="Enter Issuing Authority"
                                                            />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-3 col-12">
                                                        <div className="mb-1 d-flex flex-column position-relative">
                                                            <Form.Label className="mb-0">Document</Form.Label>
                                                            <div
                                                                onClick={() => document.getElementById(`documents-file-input-${index}`).click()}
                                                                // onClick={() => documentsFileInputRef.current.click()}
                                                                className={`custom-file-upload justify-content-between cursor-pointer form-control ${data?.document?.fileName || data.degreeFile ? '' : 'custom-form-fields'}`}
                                                            >
                                                                {documentUploading ? 'Uploading...' : data?.document?.fileName ? data?.document.fileName : 'Upload Degree'}
                                                                <p className="mb-0">
                                                                    <FiUploadCloud />
                                                                </p>
                                                            </div>
                                                            <Form.Control
                                                                type="file"
                                                                // {...register(`document[${index}]`)}
                                                                className="d-none"
                                                                id={`documents-file-input-${index}`}
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
                                                                // {...register(`note[${index}]`)}
                                                                onChange={(e) => handleDocumentsChange(index, 'note', e.target.value)}
                                                                placeholder="Enter Note"
                                                            />
                                                        </Form.Group>
                                                    </div>
                                                    {index > 0 && (
                                                        <div className="col-3 d-flex align-items-center">
                                                            <span
                                                                className="text-danger cursor-pointer fs-5 fw-bold"
                                                                onClick={() => removeDocument(index)}>
                                                                <CiCircleMinus />
                                                            </span>
                                                        </div>
                                                    )}
                                                    {documents?.length > 1 && index < documents.length - 1 && <hr className="mt-2" />}
                                                </Row>
                                            </>
                                        ))}
                                    </Row>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-end gap-2 mt-1">
                                <Button className="cancel-button" onClick={() => setActiveTab('departmentDetails')}>
                                    Previous
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
                                        'Update & Exit'
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
