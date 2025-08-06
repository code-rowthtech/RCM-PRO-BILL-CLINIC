import { useEffect, useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Accordion, Button, Card, Form, ListGroup, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateTemplateAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { TiTick } from 'react-icons/ti';
import Spinner from '../../../../constants/Spinner';

const TemplateSection = ({ sectionsId, setActiveTab, template, onHide, reset, setTags }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const updateResponse = store?.updateTemplateReducer?.data?.success;
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        text: '',
        order: 0,
        shortcut: '',
        archived: false,
    });
    const [activeAccordionKey, setActiveAccordionKey] = useState(null);

    useEffect(() => {
        if (template?._id) {
            setItems(template?.items);
        }
    }, [template]);

    const sectionLabels = ['Subjective', 'Objective', 'Assessment', 'Plan', 'Care Plan', 'Notes'];

    useEffect(() => {
        if ((updateResponse == true && sectionsId) || (updateResponse == true && template?._id)) {
            onHide();
            reset();
            setActiveTab('details');
            setTags([]);
            setItems([]);
        }
    }, [updateResponse, sectionsId, template]);

    const handleAddSection = (sectionType) => {
        if (!items.some((item) => item.label === sectionType)) {
            const newItems = [
                ...items,
                {
                    label: sectionType,
                    list: [],
                    order: items.length,
                },
            ];
            setItems(newItems);
            // Open the newly added section
            setActiveAccordionKey(newItems.length - 1);
        }
    };

    const handleRemoveSection = (index) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddItem = (sectionIndex) => {
        if (newItem.text) {
            const updatedItems = [...items];
            updatedItems[sectionIndex].list = [
                ...(updatedItems[sectionIndex].list || []),
                {
                    ...newItem,
                    order: updatedItems[sectionIndex].list?.length || 0,
                },
            ];

            setItems(updatedItems);

            setNewItem({
                text: '',
                order: 0,
                shortcut: '',
                archived: false,
            });
        }
    };

    const updateTemplateSection = () => {
        const data = {
            items: items,
        };
        dispatch(updateTemplateAction({ key: encryptMessage(data), templateId: sectionsId }));
    };

    return (
        <div className="d-flex flex-column" style={{ height: '90%' }}>
            <div className="scroll-container" style={{ height: '98%' }}>
                <div className="row mb-2">
                    {/* <h5 className="mb-1 fs-5">Add Section</h5> */}
                    <div className="col-8 d-flex flex-wrap ">
                        {sectionLabels?.map((label) => (
                            <button
                                key={label}
                                variant="outlined"
                                size="sm"
                                // style={{ width: '' }}
                                onClick={() => handleAddSection(label)}
                                className={`cursor-pointer p-1 fs-6  flex-fill  rounded-0  list-group-item  
                                    d-flex align-items-center justify-content-center fw-bold 
                                    ${items?.some((item) => item.label === label) ? 'active-patient-chart-tab fw-medium border border-white' : 'border border-muted'}`}>
                                {label}&nbsp;
                                {items?.some((item) => item.label === label) ? (
                                    <TiTick size={14} />
                                ) : (
                                    <Plus size={14} />
                                )}
                                &nbsp;
                            </button>
                        ))}
                    </div>
                    <div className="col-4"></div>
                </div>

                {!items?.length ? (
                    <div className="alert alert-info mb-4">
                        <i className="dripicons-information me-2"></i>
                        No sections added to this template yet. Click the buttons above to add sections.
                    </div>
                ) : (
                    <Row>
                        <Col md={activeAccordionKey !== null ? 8 : 12}>
                            <Accordion
                                activeKey={activeAccordionKey?.toString()}
                                onSelect={(key) => setActiveAccordionKey(key ? parseInt(key) : null)}
                                className="mb-4">
                                {items?.map((section, sectionIndex) => (
                                    <Accordion.Item
                                        className="templateAccordionItem mb-1"
                                        key={sectionIndex}
                                        eventKey={sectionIndex.toString()}>
                                        <Accordion.Header className="d-flex align-items-center templatesAccordion">
                                            <div className="d-flex justify-content-between align-items-center w-100 me-2">
                                                <div className="d-flex align-items-center">
                                                    <span className="badge bg-primary me-2">{sectionIndex + 1}</span>
                                                    <span className="fs-6 fw-semibold">{section.label}</span>
                                                </div>
                                                <Trash
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveSection(sectionIndex);
                                                    }}
                                                    className="cursor-pointer text-danger"
                                                    size={14}
                                                />
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {!section.list?.length ? (
                                                <div className="alert alert-warning m-1 p-1">
                                                    No items in this section
                                                </div>
                                            ) : (
                                                <ListGroup className="mb-0">
                                                    {section.list.map((item, itemIndex) => (
                                                        <ListGroup.Item key={itemIndex} className="py-2 px-3">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="d-flex align-items-center">
                                                                    <span
                                                                        className="text-muted fw-semibold fs-6 me-1"
                                                                        style={{ width: '30px' }}>
                                                                        {itemIndex + 1}
                                                                    </span>
                                                                    <div>
                                                                        <div className="fs-6 text-black">
                                                                            {item.text}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="d-flex gap-1">
                                                                    {/* <ChevronUp
                                                                        className='cursor-pointer'
                                                                        onClick={() => handleMoveItem(sectionIndex, itemIndex, 'up')}
                                                                        size={16} />
                                                                    <ChevronDown
                                                                        onClick={() => handleMoveItem(sectionIndex, itemIndex, 'down')}
                                                                        className='cursor-pointer'
                                                                        size={16} /> */}
                                                                    {/* <Trash
                                                                        onClick={() => handleRemoveItem(sectionIndex, itemIndex)}
                                                                        className='cursor-pointer text-danger'
                                                                        size={16} /> */}
                                                                </div>
                                                            </div>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Col>

                        {activeAccordionKey !== null && (
                            <Col md={4} className="ps-0 border ">
                                <Card className="h-100 mb-4 rounded-0">
                                    <Card.Header
                                        className=""
                                        style={{ background: '#ecedee', padding: '0.456rem 0.6rem' }}>
                                        <h6 className="my-0 fw-semibold">
                                            Add New Item to {items[activeAccordionKey]?.label}
                                        </h6>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <Form.Group>
                                                    <Form.Label className="mb-0">
                                                        Item Text <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        style={{ height: '80px' }}
                                                        name="text"
                                                        value={newItem.text}
                                                        onChange={(e) =>
                                                            setNewItem({
                                                                ...newItem,
                                                                text: e.target.value,
                                                            })
                                                        }
                                                        placeholder=" "
                                                        required
                                                        maxLength={1000}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-12">
                                                <Form.Group>
                                                    <Form.Label className="mb-0">Shortcut</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="shortcut"
                                                        value={newItem.shortcut}
                                                        onChange={(e) =>
                                                            setNewItem({
                                                                ...newItem,
                                                                shortcut: e.target.value,
                                                            })
                                                        }
                                                        placeholder=""
                                                    />
                                                </Form.Group>
                                            </div>
                                            {/* <div className="col-12">
                                                <Form.Check
                                                    type="switch"
                                                    id="itemArchived"
                                                    label="Archived"
                                                    name="archived"
                                                    checked={newItem.archived}
                                                    onChange={(e) => setNewItem({
                                                        ...newItem,
                                                        archived: e.target.checked
                                                    })}
                                                />
                                            </div> */}
                                        </div>
                                        <div className="d-flex justify-content-end mt-3">
                                            <Button
                                                onClick={() => handleAddItem(activeAccordionKey)}
                                                disabled={!/\p{L}|\p{N}/u.test(newItem.text)}
                                                className="d-flex align-items-center gap-1 custom-buttons">
                                                <Plus size={16} />
                                                Add Item
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}
                    </Row>
                )}
            </div>
            <div className="d-flex gap-1 justify-content-end  align-items-end" style={{ height: '8%' }}>
                <Button
                    onClick={() => {
                        onHide();
                        reset();
                        setItems([]);
                        setActiveTab('details');
                    }}
                    className="custom-buttons">
                    Cancel
                </Button>
                <Button
                    disabled={items?.length < 1 || store?.updateTemplateReducer?.loading}
                    onClick={updateTemplateSection}
                    className="custom-buttons">
                    {store?.updateTemplateReducer?.loading ? (
                        <Spinner className="spinner-border-sm" color="white" />
                    ) : (
                        `Save Template`
                    )}
                </Button>
            </div>
        </div>
    );
};

export default TemplateSection;
