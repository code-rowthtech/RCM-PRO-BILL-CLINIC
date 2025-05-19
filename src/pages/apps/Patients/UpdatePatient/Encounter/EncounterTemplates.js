import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './Encounter.css';
import Spinner from '../../../../../constants/Spinner';
import { FiFileText, FiFilter, FiTag, FiLayers, FiList } from 'react-icons/fi';
import { Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';

const EncounterTemplates = () => {
    const store = useSelector((state) => state);
    const templatesData = store?.getTemplateReducer?.data?.data || [{
        // Your sample data here as fallback for demonstration
        category: "General",
        createdAt: "2025-05-19T11:20:40.448Z",
        default: true,
        description: "<p>test tag</p>",
        isEditable: true,
        items: [
            { label: 'Subjective', list: Array(3), order: 0, _id: '682b14d5f9afb25cf461767f' },
            { label: 'Objective', list: Array(2), order: 1, _id: '682b14d5f9afb25cf4617680' },
            { label: 'Assessment', list: Array(2), order: 2, _id: '682b14d5f9afb25cf4617681' },
            { label: 'Plan', list: Array(2), order: 3, _id: '682b14d5f9afb25cf4617682' },
            { label: 'Care Plan', list: Array(2), order: 4, _id: '682b14d5f9afb25cf4617683' },
            { label: 'Notes', list: Array(2), order: 5, _id: '682b14d5f9afb25cf4617684' }
        ],
        practiceId: "67f5107c8e24aa1d2c9cab5e",
        practiceType: "Obstetrics and Gynecology",
        shareable: true,
        shortcut: "soap_gen",
        status: "active",
        tags: ['tag1', 'tag2', 'tag3', 'tag4tag4tag4tag', 'tag5tag5tag5tag'],
        templateType: "SOAP",
        title: "General SOAP Template",
        updatedAt: "2025-05-19T11:24:26.068Z",
        usageCount: 0,
        userId: "67f5107c8e24aa1d2c9cab5c",
        __v: 0,
        _id: "682b1408f04f6568eae0e8f3"
    }];

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const renderTemplateCard = (template) => {
        const createdDate = formatDate(template.createdAt);
        const updatedDate = formatDate(template.updatedAt);

        return (
            <div className='template-card p-2' key={template._id}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 title={template?.title} className='fw-bold cursor-pointer  my-0 '>{template?.title?.length > 30 ? template?.title?.slice(0, 29) + '...' : template?.title}</h5>
                    <Badge bg={template.default ? "success" : "secondary"} className="fs-6">
                        {template?.default ? "Default" : "Custom"}
                    </Badge>
                </div>

                <div className="d-flex align-items-center justify-content-between fs-6 mb-2">
                    <p className='my-0'>
                        <FiLayers className="me-1" />
                        <span className="fw-semibold">{template?.templateType} Template</span>
                    </p>
                    <p className='my-0'>
                        <FiFilter className="me-1" />
                        <span className='fw-semibold cursor-pointer' title={template?.practiceType}>{template?.practiceType?.length > 35 ? template?.practiceType + '...' : template?.practiceType}</span>
                    </p>
                </div>

                <div className="mb-3">
                    <h6 className="fw-semibold d-flex align-items-center">
                        <FiList className="me-2" />
                        Sections Included:
                    </h6>
                    <div className="d-flex flex-wrap gap-1">
                        {template.items?.map((item) => (
                            <Badge key={item._id} bg="primary" className="text-uppercase fw-semibold">
                                {item.label}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* <div className="mb-3">
                    <h6 className="fw-semibold d-flex align-items-center">
                        <FiTag className="me-2" />
                        Tags:
                    </h6>
                    <div className="d-flex flex-wrap gap-1">
                        {template.tags?.map((tag, index) => (
                            <Badge key={index} bg="light" text="dark" className="text-lowercase">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div> */}

                <div className="d-flex justify-content-between text-muted small">
                    <div>
                        <span className="me-2">Used: {template?.usageCount} times</span>
                        <Badge className='text-capitalize' bg={template?.status === 'active' ? 'success' : 'danger'}>
                            {template?.status}
                        </Badge>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Row className='gy-2 position-relative'>
            <Col sm={12} className='mt-0 scroll-container' style={{ height: '69vh' }}>
                {store?.getTemplateReducer?.loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading templates...</p>
                    </div>
                ) : (
                    <div className="template-cards-container">
                        {templatesData?.length === 0 ? (
                            <div className="no-templates-placeholder text-center py-4">
                                <FiFileText size={48} className="text-muted mb-2" />
                                <h5>No templates found</h5>
                                <p className="text-muted">Create your first template to get started</p>
                            </div>
                        ) : (
                            <div className='template-grid px-0'>
                                {templatesData?.map(renderTemplateCard)}
                            </div>
                        )}
                    </div>
                )}
            </Col>
        </Row>
    );
};

export default EncounterTemplates;