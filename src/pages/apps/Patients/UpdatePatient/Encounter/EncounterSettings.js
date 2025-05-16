import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { Button, Offcanvas, Form } from 'react-bootstrap';
import { Trash, Plus } from 'lucide-react';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';

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
        subMenu: ['Vitals', 'Allergy', 'Problems', 'Medications', 'Social History']
    },
    {
        name: 'Templates',
        subMenu: []
    },
    {
        name: 'Past Encounters',
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
            items: initialData?.items || []
        }
    });

    const [selectedMenuItem, setSelectedMenuItem] = useState('');
    const items = watch('items');

    useEffect(() => {
        if (initialData) {
            reset({
                items: initialData.items
            });
        }
    }, [initialData, reset]);

    const onSubmit = (data) => {
        data.userId = loggedInUser?._id;
        data.clinicId = loggedInUser?.clinicId;
        console.log('Form submitted:', data);
        // Here you would typically send data to your API
        closeSettings();
    };

    const addPredefinedMenuItem = () => {
        if (!selectedMenuItem) return;

        const selectedItem = predefinedMenuItems.find(item => item.name === selectedMenuItem);
        if (!selectedItem) return;

        const newItems = [...getValues('items')];
        const existingIndex = newItems.findIndex(item => item.name === selectedItem.name);

        if (existingIndex >= 0) {
            // Item already exists, don't add duplicate
            return;
        }

        const newItem = {
            name: selectedItem.name,
            order: newItems.length,
            show: true,
            subMenu: selectedItem.subMenu.map((subItem, index) => ({
                name: subItem,
                order: index,
                hide: false
            }))
        };

        newItems.push(newItem);
        setValue('items', newItems);
        setSelectedMenuItem(''); // Reset selection
    };

    const addCustomMenuItem = () => {
        const newItems = [...getValues('items')];
        newItems.push({
            name: '',
            order: newItems.length,
            show: true,
            subMenu: []
        });
        setValue('items', newItems);
    };

    const removeMenuItem = (index) => {
        const newItems = [...getValues('items')];
        newItems.splice(index, 1);
        setValue('items', newItems);
    };

    const addSubMenuItem = (itemIndex) => {
        const newItems = [...getValues('items')];
        const subMenu = newItems[itemIndex].subMenu || [];
        subMenu.push({ name: '', order: subMenu.length, hide: false });
        newItems[itemIndex].subMenu = subMenu;
        setValue('items', newItems);
    };

    const removeSubMenuItem = (itemIndex, subIndex) => {
        const newItems = [...getValues('items')];
        newItems[itemIndex].subMenu.splice(subIndex, 1);
        setValue('items', newItems);
    };

    return (
        <Offcanvas show={showSettings} placement='end' className='w-100' onHide={closeSettings}>
            <Offcanvas.Header closeButton className='border-bottom'>
                <Offcanvas.Title className='fw-bold'>Encounter Menu Settings</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form onSubmit={handleSubmit(onSubmit)} className="h-100 d-flex flex-column">
                    <div className="flex-grow-1 overflow-auto scroll-container">
                        <div className="mb-4">
                            <h5 className="mb-0 fw-semibold">Add Menu Items</h5>

                            <div className="card mb-0">
                                <div className="card-body py-0 px-0">
                                    <div className="row g-2 px-0 align-items-end">
                                        <div className="col-md-10 mt-2">
                                            <Form.Label className='mb-0'>Select Predefined Menu</Form.Label>
                                            <Form.Select
                                                value={selectedMenuItem}
                                                onChange={(e) => setSelectedMenuItem(e.target.value)}
                                            >
                                                <option value="">Select a menu item</option>
                                                {predefinedMenuItems.map((item, index) => (
                                                    <option key={index} value={item.name}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                        <div className="col-md-2">
                                            <Button
                                                className="w-100 custom-buttons"
                                                onClick={addPredefinedMenuItem}
                                                disabled={!selectedMenuItem}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                    {/* <div className="text-center my-2">OR</div>
                                    <Button
                                        className="w-100 custom-buttons"
                                        onClick={addCustomMenuItem}
                                    >
                                        <Plus size={16} className="me-1" />
                                        Add Custom Menu Item
                                    </Button>
                                </div> */}
                                </div>

                                {items?.length > 0 ?
                                    <h5 className="my-2 fw-semibold">Current Menu Items</h5> : <></>}

                                {items?.map((item, itemIndex) => (
                                    <div key={itemIndex} className="card border mb-2">
                                        <div className="card-header py-1 bg-light d-flex justify-content-between align-items-center">
                                            <span className="fw-semibold">{item.name || `Menu Item ${itemIndex + 1}`}</span>
                                            <Trash
                                                onClick={() => removeMenuItem(itemIndex)}
                                                className='cursor-pointer text-danger'
                                                size={14}
                                            />
                                        </div>
                                        <div className="card-body px-0">
                                            <div className="row g-2 px-0">
                                                <div className="col-md-6">
                                                    <label className="form-label mb-0">Name</label>
                                                    <input
                                                        {...register(`items.${itemIndex}.name`)}
                                                        className={`form-control ${errors.items?.[itemIndex]?.name ? 'is-invalid' : ''}`}
                                                        placeholder="Menu item name"
                                                    />
                                                    {errors.items?.[itemIndex]?.name && (
                                                        <div className="invalid-feedback">
                                                            {errors.items[itemIndex].name.message}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label mb-0">Order</label>
                                                    <input
                                                        type="number"
                                                        {...register(`items.${itemIndex}.order`)}
                                                        className={`form-control ${errors.items?.[itemIndex]?.order ? 'is-invalid' : ''}`}
                                                    />
                                                    {errors.items?.[itemIndex]?.order && (
                                                        <div className="invalid-feedback">
                                                            {errors.items[itemIndex].order.message}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-2 d-flex align-items-end">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id={`show-${itemIndex}`}
                                                            {...register(`items.${itemIndex}.show`)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`show-${itemIndex}`}>
                                                            Show
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {item.subMenu?.length > 0 && (
                                                <div className="mt-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h6 className="fw-semibold mb-0">Submenu Items</h6>
                                                        {/* <Button
                                                            className="custom-buttons text-white fs-6"
                                                            onClick={() => addSubMenuItem(itemIndex)}
                                                        >
                                                            Add Submenu
                                                        </Button> */}
                                                    </div>

                                                    {item.subMenu?.map((subItem, subIndex) => (
                                                        <div key={subIndex} className="card mb-2">
                                                            <div className="card-body">
                                                                <div className="row g-2 py-0">
                                                                    <div className="col-md-6">
                                                                        <label className="form-label mb-0">Name</label>
                                                                        <input
                                                                            {...register(`items.${itemIndex}.subMenu.${subIndex}.name`)}
                                                                            className={`form-control ${errors.items?.[itemIndex]?.subMenu?.[subIndex]?.name ? 'is-invalid' : ''}`}
                                                                            placeholder="Submenu name"
                                                                        />
                                                                        {errors.items?.[itemIndex]?.subMenu?.[subIndex]?.name && (
                                                                            <div className="invalid-feedback">
                                                                                {errors.items[itemIndex].subMenu[subIndex].name.message}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <label className="form-label mb-0">Order</label>
                                                                        <input
                                                                            type="number"
                                                                            {...register(`items.${itemIndex}.subMenu.${subIndex}.order`)}
                                                                            className={`form-control ${errors.items?.[itemIndex]?.subMenu?.[subIndex]?.order ? 'is-invalid' : ''}`}
                                                                        />
                                                                        {errors.items?.[itemIndex]?.subMenu?.[subIndex]?.order && (
                                                                            <div className="invalid-feedback">
                                                                                {errors.items[itemIndex].subMenu[subIndex].order.message}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="col-md-2 d-flex align-items-end">
                                                                        <div className="form-check form-switch mb-3">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-check-input"
                                                                                id={`hide-${itemIndex}-${subIndex}`}
                                                                                {...register(`items.${itemIndex}.subMenu.${subIndex}.hide`)}
                                                                            />
                                                                            <label className="form-check-label" htmlFor={`hide-${itemIndex}-${subIndex}`}>
                                                                                Hide
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-end mt-2">
                                                                    <Trash
                                                                        className='text-danger cursor-pointer'
                                                                        onClick={() => removeSubMenuItem(itemIndex, subIndex)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    <div className="border-top pt-2 d-flex justify-content-end mt-auto">
                        {/* <Button
                                className="custom-buttons"
                                onClick={addCustomMenuItem}
                            >
                                <Plus size={16} className="me-1" />
                                Add Menu Item
                            </Button> */}
                        <div className='d-flex align-items-center gap-1'>
                            <Button
                                className="custom-buttons"
                                onClick={closeSettings}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="custom-buttons">
                                Save Settings
                            </Button>
                        </div>
                    </div>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default EncounterSettingsForm;