import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { Button, Offcanvas, Form, Row, Col, Card, Badge } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Trash, Plus, GripVertical } from 'lucide-react';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';
import { useDispatch } from 'react-redux';
import { createEncounterSettingsAction, getEncounterSettingsAction, updateEncounterSettingsAction } from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useSelector } from 'react-redux';

// Schema validation using Yup
const settingsSchema = yup.object().shape({
    items: yup.array().of(
        yup.object().shape({
            name: yup.string().required('Name is required'),
            order: yup.number().required('Order is required').positive().integer(),
            show: yup.boolean().required(),
            subMenu: yup.array().of(
                yup.object().shape({
                    name: yup.string().required('Submenu name is required'),
                    order: yup.number().required('Order is required').positive().integer(),
                    hide: yup.boolean().required(),
                })
            )
        })
    )
});

const predefinedMenuItems = [
    {
        name: 'Summary',
        show: true,
        subMenu: ['Vitals', 'Allergy', 'Problems', 'Medications', 'Social History'].map(name => ({
            name,
            hide: false
        }))
    },
    {
        name: 'Templates',
        show: true,
        subMenu: []
    },
    {
        name: 'Past Encounters',
        show: true,
        subMenu: []
    }
];

const EncounterSettingsForm = ({ showSettings, closeSettings, initialData }) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
        watch,
        setValue,
        getValues
    } = useForm({
        resolver: yupResolver(settingsSchema),
        defaultValues: {
            items: initialData?.items?.map(item => ({
                ...item,
                order: item.order + 1, // Convert from 0-based to 1-based
                subMenu: item.subMenu?.map(sub => ({
                    ...sub,
                    order: sub.order + 1 // Convert from 0-based to 1-based
                })) || []
            })) || predefinedMenuItems.map((item, index) => ({
                ...item,
                order: index + 1,
                subMenu: item.subMenu.map((sub, subIndex) => ({
                    ...sub,
                    order: subIndex + 1
                }))
            }))
        }
    });

    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const createResponse = store?.createEncounterSettingsReducer?.data?.status;
    const updateResponse = store?.updateEncounterSettingsReducer?.data?.status;
    const settingsData = store?.getEncounterSettingsReducer?.data?.data;
    const items = watch('items');
    useEffect(() => {
        if (createResponse === 201 || updateResponse === 200) {
            dispatch(getEncounterSettingsAction())
            closeSettings()
        }
    }, [createResponse, updateResponse])
    useEffect(() => {
        if (initialData) {
            reset({
                items: initialData.items.map(item => ({
                    ...item,
                    order: item.order + 1, // Convert from 0-based to 1-based
                    subMenu: item.subMenu?.map(sub => ({
                        ...sub,
                        order: sub.order + 1 // Convert from 0-based to 1-based
                    })) || []
                }))
            });
        }
    }, [initialData, reset]);

    useEffect(() => {
        if (settingsData?._id) {
            reset({
                items: settingsData?.items.map(item => ({
                    ...item,
                    order: item?.order + 1, // Convert from 0-based to 1-based
                    subMenu: item?.subMenu?.map(sub => ({
                        ...sub,
                        order: sub?.order + 1 // Convert from 0-based to 1-based
                    })) || []
                }))
            });
        }
    }, [settingsData])


    const onSubmit = (data) => {
        const submissionData = {
            items: data?.items?.map(item => ({
                ...item,
                order: item.order - 1,
                subMenu: item.subMenu?.map(sub => ({
                    ...sub,
                    order: sub.order - 1
                })) || []
            })),
            userId: loggedInUser?._id,
            clinicId: loggedInUser?.clinicId
        };
        if (settingsData?._id) {
            submissionData._id = settingsData?._id;
            dispatch(updateEncounterSettingsAction({ key: encryptMessage(submissionData) }));
        } else {
            dispatch(createEncounterSettingsAction({ key: encryptMessage(submissionData) }));
        }
    };

    const removeSubMenuItem = (itemIndex, subIndex) => {
        const newItems = [...getValues('items')];
        newItems[itemIndex].subMenu.splice(subIndex, 1);
        // Recalculate submenu orders after removal
        newItems[itemIndex].subMenu = newItems[itemIndex].subMenu.map((sub, i) => ({
            ...sub,
            order: i + 1
        }));
        setValue('items', newItems);
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const newItems = [...getValues('items')];
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);

        // Update orders based on new positions
        const updatedItems = newItems.map((item, index) => ({
            ...item,
            order: index + 1
        }));

        setValue('items', updatedItems);
    };

    const onSubMenuDragEnd = (itemIndex, result) => {
        if (!result.destination) return;

        const newItems = [...getValues('items')];
        const subMenu = [...newItems[itemIndex].subMenu];
        const [reorderedSubItem] = subMenu.splice(result.source.index, 1);
        subMenu.splice(result.destination.index, 0, reorderedSubItem);

        // Update submenu orders based on new positions
        newItems[itemIndex].subMenu = subMenu.map((sub, index) => ({
            ...sub,
            order: index + 1
        }));

        setValue('items', newItems);
    };


    return (
        <Offcanvas show={showSettings} placement='end' className='w-100' onHide={closeSettings}>
            <Offcanvas.Header closeButton className='border-bottom'>
                <Offcanvas.Title className='fw-bold'>Encounter Menu Settings</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form onSubmit={handleSubmit(onSubmit)} className="h-100 d-flex flex-column">
                    <div className="flex-grow-1 overflow-auto ">
                        {items?.length > 0 && (
                            <Card >
                                <Card.Body className='p-0 px-1'>
                                    <h5 className="mt-0 mb-1 fw-semibold">Menu Items Configuration</h5>
                                    <p className="text-muted fs-6 mt-0 mb-2">
                                        Drag and drop items to reorder them. The order number will update automatically.
                                        Toggle the switch to include/exclude items from the menu.
                                    </p>

                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <Droppable droppableId="menuItems">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {items.map((item, itemIndex) => (
                                                        <Draggable key={itemIndex} draggableId={`item-${itemIndex}`} index={itemIndex}>
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className="mb-2"
                                                                >
                                                                    <Card className='my-0 py-0'>
                                                                        <Card.Header className="d-flex p-1 px-2 justify-content-between align-items-center bg-light">
                                                                            <div className="d-flex align-items-center">
                                                                                <span {...provided.dragHandleProps} className="me-2">
                                                                                    <GripVertical size={18} />
                                                                                </span>
                                                                                <span className="fw-semibold"><span className='text-primary'>{item.order}.&nbsp;</span> {item.name} </span>
                                                                                {/* <Badge bg="secondary" className="ms-2">
                                                                                    Order: 
                                                                                </Badge> */}
                                                                            </div>
                                                                            <Form.Check
                                                                                type="switch"
                                                                                id={`show-${itemIndex}`}
                                                                                label={item.show ? 'Hide' : 'Show'}
                                                                                checked={item.show}
                                                                                onChange={(e) => {
                                                                                    const newItems = [...getValues('items')];
                                                                                    newItems[itemIndex].show = e.target.checked;
                                                                                    setValue('items', newItems);
                                                                                }}
                                                                                className="ms-3"
                                                                            />

                                                                        </Card.Header>
                                                                        {item.show && item.subMenu?.length > 0 && (
                                                                            <Card.Body className='py-0'>
                                                                                {item.subMenu?.length > 0 && (
                                                                                    <div className="mt-0 pt-2">
                                                                                        {/* <h6 className="fw-semibold my-0">Submenu Items</h6> */}
                                                                                        <DragDropContext onDragEnd={(result) => onSubMenuDragEnd(itemIndex, result)}>
                                                                                            <Droppable droppableId={`submenu-${itemIndex}`}>
                                                                                                {(provided) => (
                                                                                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                                                                                        {item.subMenu.map((subItem, subIndex) => (
                                                                                                            <Draggable key={subIndex} draggableId={`subitem-${itemIndex}-${subIndex}`} index={subIndex}>
                                                                                                                {(provided) => (
                                                                                                                    <div
                                                                                                                        ref={provided.innerRef}
                                                                                                                        {...provided.draggableProps}
                                                                                                                        className="mb-0"
                                                                                                                    >
                                                                                                                        <Card className="bg-light mb-1">
                                                                                                                            <Card.Body className='p-1 pe-2'>
                                                                                                                                <Row className="align-items-center">
                                                                                                                                    <Col md={1} {...provided.dragHandleProps}>
                                                                                                                                        <GripVertical size={16} />
                                                                                                                                    </Col>
                                                                                                                                    <Col md={5}>
                                                                                                                                        <Form.Control
                                                                                                                                            {...register(`items.${itemIndex}.subMenu.${subIndex}.name`)}
                                                                                                                                            readOnly
                                                                                                                                            isInvalid={!!errors.items?.[itemIndex]?.subMenu?.[subIndex]?.name}
                                                                                                                                        />
                                                                                                                                    </Col>
                                                                                                                                    <Col md={2}>
                                                                                                                                        <Form.Control
                                                                                                                                            {...register(`items.${itemIndex}.subMenu.${subIndex}.order`)}
                                                                                                                                            readOnly
                                                                                                                                            isInvalid={!!errors.items?.[itemIndex]?.subMenu?.[subIndex]?.order}
                                                                                                                                        />
                                                                                                                                    </Col>
                                                                                                                                    <Col md={4}>
                                                                                                                                        <Form.Check
                                                                                                                                            type="switch"
                                                                                                                                            id={`hide-${itemIndex}-${subIndex}`}
                                                                                                                                            label={watch(`items.${itemIndex}.subMenu.${subIndex}.hide`) ? 'Hide' : 'Show'}
                                                                                                                                            {...register(`items.${itemIndex}.subMenu.${subIndex}.hide`)}
                                                                                                                                        />
                                                                                                                                    </Col>
                                                                                                                                    {/* <Col md={1}>
                                                                                                                                        <i onClick={() => removeSubMenuItem(itemIndex, subIndex)}
                                                                                                                                            className="bi bi-trash-fill text-danger cursor-pointer" />
                                                                                                                                    </Col> */}
                                                                                                                                </Row>
                                                                                                                            </Card.Body>
                                                                                                                        </Card>
                                                                                                                    </div>
                                                                                                                )}
                                                                                                            </Draggable>
                                                                                                        ))}
                                                                                                        {provided.placeholder}
                                                                                                    </div>
                                                                                                )}
                                                                                            </Droppable>
                                                                                        </DragDropContext>
                                                                                    </div>
                                                                                )}
                                                                            </Card.Body>
                                                                        )}
                                                                    </Card>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </Card.Body>
                            </Card>
                        )}
                    </div>

                    <div className="border-top pt-3 ">
                        <div className="d-flex justify-content-end gap-2">
                            {/* <Button className='custom-buttons' onClick={closeSettings}>
                                Cancel
                            </Button> */}
                            <Button type="submit" className='custom-buttons'>
                                {settingsData?._id ? `Update ` : `Save `}Settings
                            </Button>
                        </div>
                    </div>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default EncounterSettingsForm;