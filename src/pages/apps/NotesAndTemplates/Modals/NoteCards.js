// import React, { useEffect, useState } from 'react';
// import { Row, Col, Card, Form } from 'react-bootstrap';
// import { IoSettings, IoDocumentTextOutline } from 'react-icons/io5';
// import '../settingtabs.css';
// import { useSelector } from 'react-redux';
// import Spinner from '../../../../constants/Spinner';

// const NoteTypeCards = ({ handleOpenTab }) => {
//     const store = useSelector((state) => state);
//     const [noteTypes, setNoteTypes] = useState([]);

//     const notesCategoriesData = store?.getNoteCategoriesReducer?.data?.data;
//     const loading = store?.getNoteCategoriesReducer?.loading;
//     useEffect(() => {
//         setNoteTypes(notesCategoriesData);
//     }, [notesCategoriesData]);
//     const handleDefaultChange = (id) => {
//         const updated = noteTypes?.map((note) => ({
//             ...note,
//             isDefault: note?._id === id,
//         }));
//         setNoteTypes(updated);
//     };
//     return (
//         <Row className="mt-3">
//             {loading ? (
//                 <div className="d-flex justify-content-center align-items-center w-100" style={{ height: '82vh' }}>
//                     <Spinner color="white" className="spinner-border-sm" />
//                 </div>
//             ) : (
//                 noteTypes?.map((note, index) => (
//                     <Col key={index} md={6} lg={4} xl={3} className="mb-4">
//                         <Card className="border-0 shadow-sm rounded-3 note-type-card" style={{ height: '190px' }}>
//                             <Card.Body className="p-2">
//                                 <Row className="h-100">
//                                     {/* LEFT */}
//                                     <Col md={8} className="d-flex flex-column justify-content-between">
//                                         {/* Icon + Name */}
//                                         <div className="d-flex align-items-center mb-2">
//                                             <div
//                                                 className="d-flex align-items-center justify-content-center me-2"
//                                                 style={{
//                                                     width: 32,
//                                                     height: 32,
//                                                     backgroundColor: '#e0f0ff',
//                                                     borderRadius: '50%',
//                                                     color: '#0d6efd',
//                                                 }}>
//                                                 <IoDocumentTextOutline size={16} />
//                                             </div>
//                                             <div>
//                                                 <div className="fw-bold text-dark">{note?.noteType}</div>
//                                                 {note?.isDefault && (
//                                                     <div className="text-muted" style={{ fontSize: '10px' }}>
//                                                         (Default)
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>

//                                         {/* Labels */}
//                                         <div className="text-muted small">
//                                             <div className="fw-semibold">Format</div>
//                                             <div className="fw-semibold">Confidential</div>
//                                             <div className="fw-semibold">Enabled</div>
//                                         </div>

//                                         {/* Radio */}
//                                         <div className="d-flex align-items-center mt-1">
//                                             <Form.Check
//                                                 type="radio"
//                                                 name="defaultNote"
//                                                 className="me-1"
//                                                 checked={note?.isDefault}
//                                                 onChange={() => handleDefaultChange(note?._id)}
//                                             />
//                                             <span className="small fw-medium">Default</span>
//                                         </div>
//                                     </Col>

//                                     {/* RIGHT */}
//                                     <Col md={4} className="d-flex flex-column justify-content-between">
//                                         {/* Date */}
//                                         <div>
//                                             <div className="text-muted small mb-0">Created on</div>
//                                             <div className="fw-bold" style={{ fontSize: '10px', color: '#6c757d' }}>
//                                                 {new Date(note?.createdAt).toLocaleDateString('en-US', {
//                                                     year: 'numeric',
//                                                     month: 'short',
//                                                     day: 'numeric',
//                                                 })}
//                                             </div>
//                                         </div>

//                                         {/* Values */}
//                                         <div className="small text-muted mt-2">
//                                             <div>{note?.format}</div>
//                                             <div>{note?.private ? 'Yes' : 'No'}</div>
//                                         </div>

//                                         {/* Toggle */}
//                                         <div>
//                                             <Form.Check
//                                                 type="switch"
//                                                 checked={note?.active}
//                                             />
//                                         </div>

//                                         {/* Settings */}
//                                         <div className="mt-2">
//                                             <button
//                                                 className="btn btn-sm text-primary d-flex align-items-center p-0"
//                                                 onClick={() => handleOpenTab(note)}
//                                                 style={{ gap: '4px' }}>
//                                                 <IoSettings size={16} /> Settings
//                                             </button>
//                                         </div>
//                                     </Col>
//                                 </Row>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 ))
//             )}
//         </Row>
//     );
// };

// export default NoteTypeCards;
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IoSettings, IoDocumentTextOutline } from 'react-icons/io5';
import '../settingtabs.css';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../../../constants/Spinner';
import { getNoteCategoriesAction, updateNoteCategoriesAction } from '../../../../redux/noteCategories/action';
import { encryptMessage } from '../../../../cryptoUtils';

const NoteTypeCards = ({ handleOpenTab }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [noteTypes, setNoteTypes] = useState([]);
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    const notesCategoriesData = store?.getNoteCategoriesReducer?.data?.data;
    const loading = store?.getNoteCategoriesReducer?.loading;
    const updateResponse = store?.getNoteCategoriesReducer?.data?.status;

    useEffect(() => {
        setNoteTypes(notesCategoriesData || []);
    }, [notesCategoriesData]);

    const handleChange = (id, field, value) => {
        // Update the local state with the changed field
        const updated = noteTypes.map((note) =>
            note._id === id ? { ...note, [field]: value } : note
        );
        setNoteTypes(updated);

        // Find the updated note to create the payload
        const current = updated.find((n) => n._id === id);

        // Debugging: Log the updated note data to verify

        // Prepare the payload for the API call
        const payload = {
            clinicId: clinic_id,
            noteType: current.noteType,
            format: current.format,
            isActive: current.active,
            confidential: current.confidential,
            isDefault: current.isDefault,
        };

        // Debugging: Log the payload before dispatching

        // Call the API to update the note category
        dispatch(updateNoteCategoriesAction({ id, key: encryptMessage(payload) }));
    };

    const handleNoteTypeBlur = (id, value) => {
        if (value.trim().length < 10) return;

        // Find the updated note to create the payload
        const current = noteTypes.find((n) => n._id === id);

        // Debugging: Log the updated note data to verify

        // Prepare the payload for the API call
        const payload = {
            clinicId: clinic_id,
            noteType: value.trim(),
            format: current.format,
            isActive: current.active,
            confidential: current.confidential,
            isDefault: current.isDefault,
        };

        // Debugging: Log the payload before dispatching

        // Call the API to update the note category
        dispatch(updateNoteCategoriesAction({ id, key: encryptMessage(payload) }));
    };

    const handleDefaultChange = (id) => {
        // Set the note with the selected ID as default
        const updated = noteTypes.map((note) => ({
            ...note,
            isDefault: note._id === id,
        }));
        setNoteTypes(updated);

        // Find the note marked as default to create the payload
        const note = updated.find((n) => n._id === id);
        const payload = {
            clinicId: clinic_id,
            noteType: note.noteType,
            format: note.format,
            isActive: note.active,
            confidential: note.confidential,
            isDefault: true,
        };

        // Debugging: Log the payload before dispatching

        // Call the API to update the note category
        dispatch(updateNoteCategoriesAction({ id: note._id, key: encryptMessage(payload) }));
    };

    return (
        <Row className="mt-3">
            {loading ? (
                <div className="d-flex justify-content-center align-items-center w-100" style={{ height: '82vh' }}>
                    <Spinner color="white" className="spinner-border-sm" />
                </div>
            ) : (
                noteTypes.map((note) => (
                    <Col key={note._id} md={6} lg={4} xl={3} className="mb-4">
                        <Card
                            className="border-0 shadow-sm rounded-4 px-3 py-3 h-100"
                            style={{ backgroundColor: '#fdfdfd' }}>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <div
                                        className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: 32, height: 32 }}>
                                        <IoDocumentTextOutline size={16} />
                                    </div>
                                    <Form.Control
                                        type="text"
                                        value={note.noteType}
                                        onChange={(e) => {
                                            const updated = noteTypes.map((n) =>
                                                n._id === note._id ? { ...n, noteType: e.target.value } : n
                                            );
                                            setNoteTypes(updated);
                                        }}
                                        onBlur={(e) => handleNoteTypeBlur(note._id, e.target.value)}
                                        className="form-control-sm border-0 border-bottom"
                                        style={{ width: '140px', backgroundColor: 'transparent' }}
                                        placeholder="Note Type"
                                    />
                                </div>

                                <OverlayTrigger placement="left" overlay={<Tooltip>Edit Settings</Tooltip>}>
                                    <div
                                        className="text-muted cursor-pointer d-flex align-items-center gap-1"
                                        role="button"
                                        onClick={() => handleOpenTab(note)}>
                                        <IoSettings size={16} />
                                    </div>
                                </OverlayTrigger>
                            </div>

                            <hr className="my-2" />

                            <div className="mb-2 small d-flex align-items-center justify-content-between">
                                <strong>Format</strong>
                                <Form.Select
                                    size="sm"
                                    value={note.format}
                                    onChange={(e) => handleChange(note._id, 'format', e.target.value)}
                                    className="mt-1"
                                    style={{ width: '120px' }}>
                                    <option value="Simple">Simple</option>
                                    <option value="SOAP">SOAP</option>
                                    <option value="Narrative">Custom</option>
                                </Form.Select>
                            </div>

                            <div className="d-flex justify-content-between align-items-center small text-muted mt-2">
                                <span>Confidential</span>
                                <Form.Check
                                    type="switch"
                                    checked={note.confidential}
                                    onChange={(e) => handleChange(note._id, 'confidential', e.target.checked)}
                                />
                            </div>

                            <div className="d-flex justify-content-between align-items-center small text-muted mt-2">
                                <span>Active</span>
                                <Form.Check
                                    type="switch"
                                    checked={note.active}
                                    onChange={(e) => handleChange(note._id, 'active', e.target.checked)}
                                />
                            </div>

                            <div className="d-flex align-items-center mt-3 small">
                                <Form.Check
                                    type="radio"
                                    name="defaultNote"
                                    className="me-2"
                                    checked={note.isDefault}
                                    onChange={() => handleDefaultChange(note._id)}
                                />
                                <span>Set as default</span>
                            </div>

                            <div className="text-muted small mt-3 text-end" style={{ fontSize: '10px' }}>
                                Created:{' '}
                                {new Date(note.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </div>
                        </Card>
                    </Col>
                ))
            )}
        </Row>
    );
};

export default NoteTypeCards;


// extra code

// <i
//                                                 className=" bi bi-pencil text-info cursor-pointer"
//                                                 onClick={() => {
//                                                     handleOpenEditModal(note);
//                                                 }}
//                                             />
