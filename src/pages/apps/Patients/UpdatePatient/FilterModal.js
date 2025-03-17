import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { IoFilter } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { getClinicEmployeesAction, getTaskAction } from '../../../../redux/actions';

const FilterDropdown = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const employees = store?.getClinicEmployeesReducer?.data?.result || [];

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        assignedTo: '',
        status: '',
        category: '',
        priority: '',
        sortBy: '', // Default sorting option
    });

    const filterDropdownRef = useRef(null);

    useEffect(() => {
        dispatch(getClinicEmployeesAction());
    }, [dispatch]);

    // Static filters (except assignedTo)
    const staticFilters = {
        status: ['All', 'In Progress', 'Hold', 'Complete'],
        category: ['Lab Result', 'Blood Testing', 'Other'],
        priority: ['Urgent', 'High', 'Medium', 'Low', 'All'],
        sortBy: [{name:'Start Date',value:'startDate'}, {name:'Due Date',value:'dueDate'},{name:'Recently Created',value:'createdAt'},{name: 'First Created', value:'createdAt'}], // New sorting filter
    };

    // Handle filter value changes
    const handleFilterChange = (key, value) => {
        setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Dispatch filters on Apply
    const handleApplyFilters = () => {
        const data = {
            assignedToId: selectedFilters.assignedTo,
            taskStatus: selectedFilters.status,
            category: selectedFilters.category,
            priority: selectedFilters.priority,
            sortBy: selectedFilters.sortBy, // Include sorting in API call
        };
        dispatch(getTaskAction(data));
        setShowFilterDropdown(false);
        console.log(data, 'Filter Data');
    };

    // Close dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="position-relative">
     
            <Button
                className="custom-buttons d-flex align-items-center me-2"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                aria-label="Toggle Filter Dropdown">
                <span className="me-2">Filters</span>
                <IoFilter className="fs-4" />
            </Button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
                <div
                    ref={filterDropdownRef}
                    className="filter-dropdown position-absolute bg-white border p-3 rounded shadow-sm"
                    style={{
                        top: '5.3vh',
                        left: '-22vw',
                        zIndex: 1002,
                        width: '500px',
                    }}>
                    {/* Header */}
                    <Row className="pb-2">
                        <Col sm={12} className="text-center">
                            <h4 className="mb-0 fw-bold">Filters</h4>
                        </Col>
                    </Row>

                    {/* Assigned To (Dynamic) */}
                    <Row className="align-items-center mb-2">
                        <Col md={4}>
                            <span className="fw-bold text-dark">Assigned To</span>
                        </Col>
                        <Col md={8}>
                            <Form.Select
                                value={selectedFilters.assignedTo}
                                onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                                aria-label="Select Assigned To">
                                <option value="">Select Assign To</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp._id}>
                                        {emp.firstName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>

                    {/* Other Static Filters */}
                    {Object.keys(staticFilters).map(
                        (key) =>
                            key !== 'sortBy' && ( // Exclude "Sort By" for now
                                <Row key={key} className="align-items-center mb-2">
                                    <Col md={4}>
                                        <span className="fw-bold text-dark">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </span>
                                    </Col>
                                    <Col md={8}>
                                        <Form.Select
                                            value={selectedFilters[key]}
                                            onChange={(e) => handleFilterChange(key, e.target.value)}
                                            aria-label={`Select ${key}`}>
                                            <option value="">Select {key}</option>
                                            {staticFilters[key].map((item, index) => (
                                                <option key={index} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Row>
                            )
                    )}

                    {/* Sort By (Newest / Oldest) */}
                    <Row className="align-items-center mb-2">
                        <Col md={4}>
                            <span className="fw-bold text-dark">Sort By</span>
                        </Col>
                        <Col md={8}>
                            <Form.Select
                                value={selectedFilters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                aria-label="Select Sort By">
                                {staticFilters.sortBy.map((option, index) => (
                                    <option key={index} value={option?.value}>
                                        {option?.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>

                    {/* Footer - Apply Button */}
                    <Row>
                        <Col className="d-flex mb-1 justify-content-end">
                            <Button variant="primary" className="custom-buttons" onClick={handleApplyFilters}>
                                Apply
                            </Button>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
