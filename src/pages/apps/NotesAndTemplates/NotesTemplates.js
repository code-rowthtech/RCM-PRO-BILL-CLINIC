import React, { useState, useEffect } from 'react';
import {
  Button, Card, Col, Row, Table,
  Badge, Dropdown, Spinner, Alert
} from 'react-bootstrap';
import {
  FiFileText, FiFilter, FiEdit2, FiCopy,
  FiArchive, FiTrash2, FiMoreVertical
} from 'react-icons/fi';
import { IoSearchSharp } from 'react-icons/io5';
import { FormInput } from '../../../components';
import TemplateModal from './Modals/TemplateModal';
import { Plus } from 'lucide-react';

const TemplatesPage = () => {
  // State management
  const [showModal, setShowModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('active');

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call
        // const response = await api.get('/templates');
        const mockData = [
          {
            uid: '1',
            title: 'SOAP Note Template',
            templateType: 'SOAP',
            category: 'General',
            status: 'active',
            sections: 4,
            usageCount: 42,
            lastUsed: '2023-05-15',
            tags: ['general', 'soap']
          },
          {
            uid: '2',
            title: 'Pediatric Assessment',
            templateType: 'AssessmentPlan',
            category: 'Pediatrics',
            status: 'active',
            sections: 3,
            usageCount: 18,
            lastUsed: '2023-05-10',
            tags: ['pediatrics']
          }
        ];
        setTemplates(mockData);
        setFilteredTemplates(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Filter templates based on search and status
  useEffect(() => {
    let results = templates;

    // Filter by status
    if (activeStatus !== 'all') {
      results = results.filter(t => t.status === activeStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(t =>
        t.title.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        t.tags?.some(tag => tag.toLowerCase().includes(term))
      ); // <-- this closing parenthesis was missing
    }

    setFilteredTemplates(results);
  }, [searchTerm, activeStatus, templates]);

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
  };

  // Template CRUD operations
  const handleSaveTemplate = async (templateData) => {
    try {
      setIsLoading(true);

      if (templateData.uid) {
        // Update existing template
        // await api.put(`/templates/${templateData.uid}`, templateData);
        setTemplates(templates.map(t =>
          t.uid === templateData.uid ? templateData : t));
      } else {
        // Create new template
        // const response = await api.post('/templates', templateData);
        const newTemplate = {
          ...templateData,
          uid: Date.now().toString(),
          status: 'active',
          sections: templateData.items?.length || 0,
          usageCount: 0,
          lastUsed: null
        };
        setTemplates([...templates, newTemplate]);
      }

      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    // confirmAlert({
    //   title: 'Confirm deletion',
    //   message: 'Are you sure you want to delete this template?',
    //   buttons: [
    //     {
    //       label: 'Yes',
    //       onClick: async () => {
    //         try {
    //           setIsLoading(true);
    //           // await api.delete(`/templates/${templateId}`);
    //           setTemplates(templates.filter(t => t.uid !== templateId));
    //         } catch (err) {
    //           setError(err.message);
    //         } finally {
    //           setIsLoading(false);
    //         }
    //       }
    //     },
    //     {
    //       label: 'No',
    //       onClick: () => { }
    //     }
    //   ]
    // });
  };

  const handleDuplicateTemplate = (template) => {
    const newTemplate = {
      ...template,
      uid: Date.now().toString(),
      title: `${template.title} (Copy)`,
      usageCount: 0,
      lastUsed: null
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleStatusChange = (templateId, newStatus) => {
    setTemplates(templates.map(t =>
      t.uid === templateId ? { ...t, status: newStatus } : t));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const variants = {
      active: 'success',
      inactive: 'secondary',
      archive: 'warning'
    };
    return (
      <Badge bg={variants[status] || 'primary'} className="text-capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <Row className="mt-2">
      <Col xs={12} className="px-0">
        <Card className="scroll-container page-height">
          <Card.Body>
            <Row className="mb-2 align-items-center">
              <Col sm={6}>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant={activeStatus === 'active' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveStatus('active')}
                    disabled
                    className="text-nowrap custom-buttons text-white"
                  >
                    Active ({templates.filter(t => t.status === 'active').length})
                  </Button>
                  <Button
                    variant={activeStatus === 'inactive' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveStatus('inactive')}
                    disabled
                    className="text-nowrap custom-buttons text-white"
                  >
                    Inactive ({templates.filter(t => t.status === 'inactive').length})
                  </Button>
                  <Button
                    variant={activeStatus === 'archive' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveStatus('archive')}
                    disabled
                    className="text-nowrap custom-buttons text-white"
                  >
                    Archived ({templates.filter(t => t.status === 'archive').length})
                  </Button>
                </div>
              </Col>
              <Col sm={6} className="text-end mt-md-0 mt-2 mt-sm-0">
                <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                  <Col xs="auto" className="d-flex gap-2">
                    <div className="input-group" style={{ maxWidth: '300px' }}>
                      <span className="input-group-text bg-white">
                        <IoSearchSharp />
                      </span>
                      <FormInput
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-start-0"
                      />
                    </div>
                    <Button
                      variant="primary"
                      onClick={openCreateModal}
                      className="d-flex custom-buttons align-items-center"
                    >
                      New
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>

            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}

            {isLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading templates...</p>
              </div>
            ) : (
              <Table responsive className="table-centered table-nowrap mb-0 rounded">
                <thead className="table-light">
                  <tr>
                    <th>S.No.</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Sections</th>
                    <th>Usage</th>
                    <th>Last Used</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.length === 0 ? (
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
                            <Button variant="primary" onClick={openCreateModal}>
                              Create New Template
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTemplates.map((template, index) => (
                      <tr key={template.uid}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{template.title}</strong>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {template.tags?.map((tag, i) => (
                              <Badge key={i} bg="light" text="dark" className="text-capitalize">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="text-capitalize">{template.templateType}</td>
                        <td>{template.category || '-'}</td>
                        <td>
                          <StatusBadge status={template.status} />
                        </td>
                        <td>{template.sections}</td>
                        <td>{template.usageCount}</td>
                        <td>{formatDate(template.lastUsed)}</td>
                        <td>
                          <FiEdit2 onClick={() => openEditModal(template)} className=" cursor-pointer me-1 fs-5 text-info" />
                          <FiArchive
                            onClick={() => handleStatusChange(
                              template.uid,
                              template.status === 'active' ? 'inactive' : 'active'
                            )}
                            className=" cursor-pointer me-1 fs-5 text-warning" />
                          <FiTrash2 onClick={() => handleDeleteTemplate(template.uid)} className="fs-5 text-danger" />
                          {/* <Dropdown>
                            <Dropdown.Toggle variant="light" size="sm" className="px-2">
                              <FiMoreVertical />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item >
                                 Edit
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDuplicateTemplate(template)}>
                                <FiCopy className="me-2" /> Duplicate
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleStatusChange(
                                  template.uid,
                                  template.status === 'active' ? 'inactive' : 'active'
                                )}
                              >
                                <FiArchive className="me-2" />
                                {template.status === 'active' ? 'Deactivate' : 'Activate'}
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                onClick={() => handleDeleteTemplate(template.uid)}
                                className="text-danger"
                              >
                                <FiTrash2 className="me-2" /> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown> */}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        <TemplateModal
          show={showModal}
          onHide={closeModal}
          template={selectedTemplate}
          onSave={handleSaveTemplate}
        />
      </Col>
    </Row>
  );
};

export default TemplatesPage;