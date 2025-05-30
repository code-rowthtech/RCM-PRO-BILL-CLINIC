import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Table, Badge } from 'react-bootstrap';
import { FiFileText, FiEdit2, FiArchive, FiTrash2 } from 'react-icons/fi';
import { IoSearchSharp } from 'react-icons/io5';
import { FormInput } from '../../../components';
import TemplateModal from './Modals/TemplateModal';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getTemplateAction } from '../../../redux/actions';
import Paginations from '../../../helpers/Paginations';
import Spinner from '../../../constants/Spinner';
import { IoMdClose } from 'react-icons/io';

const TemplatesPage = () => {
    // State management
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const templatesData = store?.getTemplateReducer?.data?.data;
    const createResponse = store?.createTemplateReducer?.data?.success;
    const updateResponse = store?.updateTemplateReducer?.data?.success;
    const [showModal, setShowModal] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [skip, setSkip] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeStatus, setActiveStatus] = useState('active');

    // Fetch templates from API
    useEffect(() => {
        dispatch(getTemplateAction({ search: searchTerm, skip: skip, limit: 10, status: activeStatus }));
    }, [dispatch, searchTerm, activeStatus, skip]);
    // useEffect(() => {
    //   if (createResponse === true || updateResponse === true) {
    //     dispatch(getTemplateAction({ search: '', page: 1, limit: 10, status: activeStatus }))
    //   }
    // }, [createResponse, updateResponse])
    // Modal handlers
    const openCreateModal = () => {
        setSelectedTemplate(null);
        setShowModal(true);
    };

    const openEditModal = (template) => {
        setSelectedTemplate(template);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTemplate(null);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    // Status badge component
    const StatusBadge = ({ status }) => {
        const variants = {
            active: 'success',
            inactive: 'secondary',
            archive: 'warning',
        };
        return (
            <Badge bg={variants[status] || 'primary'} className="text-capitalize">
                {status}
            </Badge>
        );
    };

    return (
        <Row className="mt-2 h-100">
            <Col xs={12} className="px-0">
                <Card className="scroll-container page-height">
                    <Card.Body>
                        <Row className="mb-3 align-items-center">
                            <Col sm={6}>
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button
                                        onClick={() => setActiveStatus('active')}
                                        className={` active_inactive_buttons text-nowrap ${
                                            activeStatus === 'active'
                                                ? ' text-white py-'
                                                : 'bg-white border-primary text-dark py-'
                                        }`}>
                                        Active
                                    </Button>
                                    <Button
                                        onClick={() => setActiveStatus('inactive')}
                                        className={` active_inactive_buttons text-nowrap ${
                                            activeStatus === 'inactive'
                                                ? ' text-white py-'
                                                : 'bg-white border-primary text-dark py-'
                                        }`}>
                                        Inactive
                                    </Button>
                                    <Button
                                        onClick={() => setActiveStatus('archive')}
                                        className={` active_inactive_buttons text-nowrap ${
                                            activeStatus === 'archive'
                                                ? ' text-white py-'
                                                : 'bg-white border-primary text-dark py-'
                                        }`}>
                                        Archived
                                    </Button>
                                </div>
                            </Col>
                            <Col sm={6} className="text-end mt-md-0 mt-2 mt-sm-0">
                                <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                    <Col xs="auto" className="d-flex gap-2">
                                        <div
                                            className="input_search_box position-relative"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                borderRadius: '4px',
                                                backgroundColor: '#e8f0fe',
                                                padding: '0px 5px',
                                                minWidth: 180,
                                            }}>
                                            <FormInput
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    const currentValue = e.target.value;
                                                    setSearchTerm(currentValue);
                                                }}
                                                className="pe-4"
                                                style={{
                                                    border: 'none',
                                                    outline: 'none',
                                                    flex: 1,
                                                    backgroundColor: '#ccc',
                                                    paddingRight: 30,
                                                }}
                                            />
                                            {searchTerm ? (
                                                <IoMdClose
                                                    style={{
                                                        fontSize: '1.2rem',
                                                        color: 'lightgray',
                                                        position: 'absolute',
                                                        right: 10,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => {
                                                        setSearchTerm('');
                                                    }}
                                                />
                                            ) : (
                                                <IoSearchSharp
                                                    style={{
                                                        fontSize: '1.2rem',
                                                        color: 'lightgray',
                                                        position: 'absolute',
                                                        right: 10,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <Button
                                            variant="primary"
                                            onClick={openCreateModal}
                                            className="d-flex custom-buttons align-items-center">
                                            New Template
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {store?.getTemplateReducer?.loading ? (
                            <div className="text-center py-5">
                                <Spinner />
                            </div>
                        ) : (
                            <Table responsive className="table-centered table-nowrap mb-0 rounded">
                                <thead className="table-light">
                                    <tr>
                                        <th className="text-white">Title</th>
                                        <th className="text-white">Note Type</th>
                                        <th className="text-white">Category</th>
                                        <th className="text-white">Related Practices</th>
                                        <th className="text-white">Status</th>
                                        <th className="text-white">Last Used</th>
                                        <th className="text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {templatesData?.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="text-center py-4">
                                                <div className="d-flex flex-column align-items-center">
                                                    <FiFileText size={48} className="text-muted mb-2" />
                                                    <h5>No templates found</h5>
                                                    <p className="text-muted">
                                                        {searchTerm
                                                            ? 'Try adjusting your search query'
                                                            : activeStatus !== 'all'
                                                              ? `There are no ${activeStatus} templates`
                                                              : 'Create your first template to get started'}
                                                    </p>
                                                    {!searchTerm && (
                                                        <Button className="custom-buttons" onClick={openCreateModal}>
                                                            Create New Template
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        templatesData?.map((template, index) => (
                                            <tr key={template?.uid}>
                                                <td>
                                                    <p className="text-capitalize mb-0">{template?.title || '-'}</p>
                                                    <div className="d-flex flex-wrap gap-1 mt-1">
                                                        {template?.tags?.map((tag, i) => (
                                                            <Badge
                                                                key={i}
                                                                variant="secondary"
                                                                text="white"
                                                                className="text-capitalize"
                                                                style={{ fontSize: '11px !important' }}>
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="text-capitalize">{template?.templateType}</td>
                                                <td className="text-capitalize">{template?.category || '-'}</td>
                                                <td className="text-capitalize">{template?.practiceType || '-'}</td>
                                                <td>
                                                    <StatusBadge status={template?.status} />
                                                </td>
                                                <td>{formatDate(template?.lastUsed)}</td>
                                                <td>
                                                    <i
                                                        onClick={() => openEditModal(template)}
                                                        className="mdi mdi-square-edit-outline me-1 cursor-pointer fs-4"></i>
                                                    <i
                                                        style={{ cursor: 'not-allowed' }}
                                                        className="bi bi-trash me-1 fs-5"></i>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        )}
                        <div className="row">
                            <div className="col">
                                <Paginations
                                    currentPage={skip}
                                    totalPages={store?.getTemplateReducer?.data?.pagination?.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <TemplateModal
                    show={showModal}
                    onHide={closeModal}
                    setSelectedTemplate={setSelectedTemplate}
                    template={selectedTemplate}
                />
            </Col>
        </Row>
    );
};

export default TemplatesPage;
