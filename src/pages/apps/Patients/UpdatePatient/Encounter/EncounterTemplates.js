import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './Encounter.css';
import Spinner from '../../../../../constants/Spinner';
import { FiFileText, FiFilter, FiTag, FiLayers, FiList } from 'react-icons/fi';
import { Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { IoSearchSharp } from 'react-icons/io5';
import { FormInput } from '../../../../../components';
import { getTemplateAction } from '../../../../../redux/actions';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import TemplateModal from '../../../NotesAndTemplates/Modals/TemplateModal';

const EncounterTemplates = ({ selectedFromList, setSelectedFromList }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch()
    const templatesData = store?.getTemplateReducer?.data?.data;
    const [searchTemplates, setSearchTemplates] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [templateToEdit, setTemplateToEdit] = useState(null);
    const [editIcon, setEditIcon] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const closeModal = () => {
        setShowModal(false);
        setTemplateToEdit(null);
    }
   
    return (
        <Row className='gy-2 position-relative'>
            {selectedTemplate ?
                <Col sm={12} className='scroll-container ' style={{ height: '57vh' }}>
                    <Row className="align-items-center  position-relative">
                        <Col className="text-center">
                            <h5 className="my-0 fw-bold">{selectedTemplate?.title}</h5>
                        </Col>
                        <Col className="position-absolute end-0 text-end" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                            <i onClick={() => setSelectedTemplate(null)} title={'Back'} className="bi text-black fw-bold px-1 cursor-pointer bi-arrow-bar-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }}></i>
                        </Col>
                    </Row>
                    <Row>
                        {selectedTemplate?.items?.map((item, index) => (
                            <Col sm={12} key={index} className='p-2 '>
                                <Row className=''>
                                    <Col sm={12} className='d-flex  align-items-center justify-content-between'>
                                        <h5 className="my-0 fw-semibold fs-6">{item?.label}</h5>
                                        <span><i className="bi me-1 bi-plus-circle"></i>
                                            <i className="mdi mdi-square-edit-outline cursor-pointer"></i></span>
                                    </Col>
                                    <Col sm={12}>
                                        <ul className='list-unstyled fs-6 px-2'>
                                            {item?.list?.map((itemList, index) => (
                                                <li
                                                    onClick={() => {
                                                        setSelectedFromList(prev => ({
                                                            ...prev,
                                                            [item?.label]: prev[item?.label]
                                                                ? `${prev[item?.label]}\n${itemList?.text}`
                                                                : itemList?.text
                                                        }));

                                                    }}
                                                    className='border-bottom py-1 cursor-pointer list-hover' key={index}>{itemList?.text}</li>
                                            ))}
                                        </ul>
                                    </Col>
                                </Row>
                            </Col>
                        ))}

                    </Row>
                </Col>
                :
                <Col sm={12} className='mt-0 scroll-container ' style={{ height: '57vh' }}>
                    <div className='scroll-container' style={{ height: '90%' }}>
                        <div
                            className="input_search_box"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '4px',
                                backgroundColor: '#e8f0fe',
                                padding: '0px 5px',
                            }}>
                            <IoSearchSharp
                                style={{
                                    fontSize: '1.2rem',
                                    color: 'black',
                                    marginRight: '10px',
                                }}
                            />
                            <FormInput
                                type="text"
                                placeholder='Search templates'
                                value={searchTemplates}
                                onChange={(e) => {
                                    const currentValue = e.target.value;
                                    setSearchTemplates(currentValue);
                                    dispatch(getTemplateAction({ search: e.target.value, skip: 1, limit: 10, status: 'active' }))

                                }}
                                className="input_search_box"
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    flex: 1,
                                    backgroundColor: '#ccc',
                                }}
                            />
                        </div>
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
                                    <div className='template-grid d-flex flex-column py-1 gap-1 px-0'>
                                        {templatesData?.map((data) => (
                                            <div onClick={() => setSelectedTemplate(data)} className='border d-flex ps-1 pe-2 align-items-center justify-content-between'>
                                                <p title={data?.title} className='my-0  p-1 cursor-pointer fw-semibold fs-6 text-capitalize'>{data?.title?.length > 50 ? data?.title?.slice(0, 49) : data?.title}</p>
                                                {editIcon && <i
                                                    onClick={() => {
                                                        setTemplateToEdit(data);
                                                        setShowModal(true)
                                                    }}
                                                    className="mdi mdi-square-edit-outline cursor-pointer" ></i>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className='d-flex justify-content-between p-2 align-items-center'>
                        <span onClick={() => setShowModal(true)} className='fs-6 fw-semibold cursor-pointer'><i className="bi bi-plus-circle"></i>&nbsp;Add template</span>
                        {editIcon ?
                            <span onClick={() => {
                                setEditIcon(false)
                            }} className='fs-6 fw-semibold  cursor-pointer'><i className="bi bi-check2 cursor-pointer"></i>&nbsp;Done editing</span>
                            :
                            <span onClick={() => {
                                setEditIcon(true)
                            }} className='fs-6 fw-semibold  cursor-pointer'><i className="mdi mdi-square-edit-outline cursor-pointer"></i>&nbsp;Edit template</span>
                        }

                        <TemplateModal
                            show={showModal}
                            onHide={closeModal}
                            setSelectedTemplate={setTemplateToEdit}
                            template={templateToEdit}
                        />
                    </div>
                </Col>
            }
        </Row>
    );
};

export default EncounterTemplates;