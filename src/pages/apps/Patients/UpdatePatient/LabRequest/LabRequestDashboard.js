import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Badge, Form, Row, Col, Spinner } from 'react-bootstrap';
import { FiEye, FiEdit, FiX, FiFilter, FiFileText } from 'react-icons/fi';
import { IoSearchSharp } from 'react-icons/io5';
import { useSelector, useDispatch } from 'react-redux';
import { formatDateByUserTimeZone } from '../../../../../components/timeZonePipe';
import Paginations from '../../../../../helpers/Paginations';

const LabRequestDashboard = ({
    patientId,
    patientDetails,
    onViewRequest,
    onEditRequest,
    onCreateNew,
    searchTerm,
    statusFilter,
    priorityFilter,
    sortBy
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const store = useSelector((state) => state);
    const dispatch = useDispatch();

    // Mock data - replace with actual Redux state
    const [labRequests, setLabRequests] = useState([
        {
            id: '1',
            code: { coding: [{ code: '33747-0', display: 'General health panel' }] },
            status: 'active',
            priority: 'routine',
            authoredOn: '2024-01-15T10:30:00Z',
            requester: { display: 'Dr. Smith' },
            reasonCode: [{ text: 'Annual checkup' }],
            specimen: [{ type: { text: 'Blood' } }]
        },
        {
            id: '2',
            code: { coding: [{ code: '24323-8', display: 'Comprehensive metabolic panel' }] },
            status: 'completed',
            priority: 'urgent',
            authoredOn: '2024-01-10T14:15:00Z',
            requester: { display: 'Dr. Johnson' },
            reasonCode: [{ text: 'Follow-up diabetes' }],
            specimen: [{ type: { text: 'Blood' } }]
        }
    ]);

    const loading = false; // Replace with actual loading state

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { variant: 'secondary', text: 'Draft' },
            active: { variant: 'primary', text: 'Active' },
            completed: { variant: 'success', text: 'Completed' },
            'on-hold': { variant: 'warning', text: 'On Hold' },
            revoked: { variant: 'danger', text: 'Cancelled' }
        };

        const config = statusConfig[status] || { variant: 'secondary', text: status };
        return <Badge bg={config.variant}>{config.text}</Badge>;
    };

    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            routine: { variant: 'secondary', text: 'Routine' },
            urgent: { variant: 'warning', text: 'Urgent' },
            asap: { variant: 'info', text: 'ASAP' },
            stat: { variant: 'danger', text: 'STAT' }
        };

        const config = priorityConfig[priority] || { variant: 'secondary', text: priority };
        return <Badge bg={config.variant}>{config.text}</Badge>;
    };

    const filteredRequests = useMemo(() => {
        return labRequests.filter(request => {
            const matchesSearch = !searchTerm ||
                request.code.coding[0].display.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.requester.display.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = !statusFilter || request.status === statusFilter;
            const matchesPriority = !priorityFilter || request.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [labRequests, searchTerm, statusFilter, priorityFilter]);

    const handleCancelRequest = (requestId) => {
        // Implement cancel functionality
        console.log('Cancel request:', requestId);
    };

    return (
        <div>
            {/* Lab Requests Table */}
            <div className="table-responsive">
                <Table hover className="table-centered mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Test Name</th>
                            <th>Order Date</th>
                            <th>Provider</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Reason</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="text-center py-5">
                                    <Spinner animation="border" />
                                </td>
                            </tr>
                        ) : filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-5">
                                    <div className="d-flex flex-column align-items-center">
                                        <FiFileText size={44} className="text-muted mb-2" />
                                        <h6 className="text-muted">No lab requests found</h6>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={onCreateNew}
                                            className="mt-2"
                                        >
                                            Create First Lab Order
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>
                                        <div>
                                            <div className="fw-semibold">
                                                {request.code.coding[0].display}
                                            </div>
                                            <small className="text-muted">
                                                {request.code.coding[0].code}
                                            </small>
                                        </div>
                                    </td>
                                    <td>
                                        {formatDateByUserTimeZone(request.authoredOn, {}, 'datetime')}
                                    </td>
                                    <td>{request.requester.display}</td>
                                    <td>{getStatusBadge(request.status)}</td>
                                    <td>{getPriorityBadge(request.priority)}</td>
                                    <td>
                                        <span title={request.reasonCode?.[0]?.text}>
                                            {request.reasonCode?.[0]?.text?.length > 30
                                                ? request.reasonCode[0].text.substring(0, 30) + '...'
                                                : request.reasonCode?.[0]?.text || '-'
                                            }
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-1">

                                            <i title='View Request' onClick={() => onViewRequest(request)} className="bi bi-eye cursor-pointer fs-4 text-primary"></i>
                                            {(request.status === 'draft' || request.status === 'active') && (
                                                <>
                                                    <i onClick={() => onEditRequest(request)} title='Edit Request' className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-secondary" />
                                                    <i title='Cancel Request' onClick={() => handleCancelRequest(request.id)} className="bi bi-trash-fill cursor-pointer fs-4 text-danger"></i>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Pagination */}
            {filteredRequests.length > 0 && (
                <div className="d-flex justify-content-end mt-3">
                    <Paginations
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredRequests.length / 10)}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default LabRequestDashboard;