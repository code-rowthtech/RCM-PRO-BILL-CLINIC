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
// Full code: NoteTypeCards.jsx

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IoSettings, IoDocumentTextOutline } from 'react-icons/io5';
import '../settingtabs.css';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../../../constants/Spinner';
import { getNoteCategoriesAction, updateNoteCategoriesAction } from '../../../../redux/noteCategories/action';
import { encryptMessage } from '../../../../cryptoUtils';

const NoteTypeCards = ({ handleOpenTab, handleOpenEditModal }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [noteTypes, setNoteTypes] = useState([]);
    console.log(noteTypes,'notes')
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    const notesCategoriesData = store?.getNoteCategoriesReducer?.data?.data;
    const loading = store?.getNoteCategoriesReducer?.loading;

    useEffect(() => {
        if (notesCategoriesData) setNoteTypes(notesCategoriesData);
    }, [notesCategoriesData]);

    const sendUpdate = (id, note) => {
        const payload = {
            clinicId: clinic_id,
            noteType: note.noteType,
            format: note.format,
            active: note.active,
            private: note.private,
            default: note.isDefault,
        };
        console.log('Raw Payload:', payload);
        dispatch(updateNoteCategoriesAction({ id, key: encryptMessage(payload) }));
    };

    const handleChange = (id, field, value) => {
        const updated = noteTypes.map((note) => (note._id === id ? { ...note, [field]: value } : note));
        setNoteTypes(updated);

        const current = updated.find((n) => n._id === id);
        sendUpdate(id, current);
    };

    const handleNoteTypeBlur = (id, value) => {
        if (!value.trim() || value.trim().length < 2) return;

        const updated = noteTypes.map((note) => (note._id === id ? { ...note, noteType: value.trim() } : note));
        setNoteTypes(updated);

        const current = updated.find((n) => n._id === id);
        sendUpdate(id, current);
    };

    const handleDefaultChange = (id) => {
        const updated = noteTypes.map((note) => ({
            ...note,
            isDefault: note._id === id,
        }));
        setNoteTypes(updated);

        const note = updated.find((n) => n._id === id);
        sendUpdate(id, note);
    };

    return (
        <Row className="mt-2">
            {loading ? (
                <div className="d-flex justify-content-center align-items-center w-100" style={{ height: '82vh' }}>
                    <Spinner color="white" className="spinner-border-sm" />
                </div>
            ) : (
                noteTypes?.map((note) => (
                    <Col key={note._id} md={6} lg={4} xl={3} className="mb-2 px-2">
                        <Card className="border-0 shadow-sm rounded-3 p-0">
                            <div
                                className="d-flex align-items-center justify-content-between px-2 py-1 rounded-top"
                                style={{ backgroundColor: ' #e8f0fe' }}>
                                <div className="d-flex align-items-center gap-0">
                                    <div
                                        className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: 28, height: 28 }}>
                                        <IoDocumentTextOutline size={16} />
                                    </div>
                                    {/* <div className="d-flex align-items-center">
                                        <Form.Control
                                            type="text"
                                            value={note.noteType}
                                            onChange={(e) => {
                                                const updated = noteTypes?.map((n) =>
                                                    n._id === note?._id ? { ...n, noteType: e.target.value } : n
                                                );
                                                setNoteTypes(updated);
                                            }}
                                            onBlur={(e) => handleNoteTypeBlur(note._id, e.target.value)}
                                            className="form-control-sm border-0 border-bottom"
                                            style={{ width: '100px', backgroundColor: 'transparent' }}
                                            placeholder="Note Type"
                                        />
                                        {note?.isDefault && (
                                            <span className="text-muted" style={{ fontSize: '10px' }}>
                                                (Default)
                                            </span>
                                        )}
                                    </div> */}
                                    <div className="small ms-1">
                                        <strong
                                         title={note?.noteType}>
                                            {note?.noteType?.length > 20
                                                ? `${note.noteType.slice(0, 20)}...`
                                                : note?.noteType}
                                        </strong>{' '}
                                    </div>
                                </div>

                                {/* <div className="text-muted small" style={{ fontSize: '10px' }}>
                                    Created On:
                                    <strong className="ms-1">
                                        {new Date(note?.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: '2-digit',
                                        })}
                                    </strong>
                                    <span className='ms-1'>
                                        <i
                                            className=" mdi mdi-square-edit-outline text-info cursor-pointer"
                                            onClick={() => {
                                                handleOpenEditModal(note);
                                            }}
                                        />
                                    </span>
                                </div> */}
                                {
                                    <div>
                                        <i
                                            className=" mdi mdi-square-edit-outline text-primary fs-4 cursor-pointer"
                                            title="Edit"
                                            onClick={() => {
                                                handleOpenEditModal(note);
                                            }}
                                        />
                                    </div>
                                }
                            </div>

                            <hr className="my-0" />

                            {/* <div className=" small d-flex align-items-center justify-content-between px-2 py-1 border-bottom">
                                <strong>Format</strong>
                                <Form.Select
                                    size="sm"
                                    value={note.format}
                                    onChange={(e) => handleChange(note?._id, 'format', e.target.value)}
                                    className=""
                                    style={{ width: '100px' }}>
                                    <option value="Simple">Simple</option>
                                    <option value="SOAP">SOAP</option>
                                    <option value="Custom">Custom</option>
                                </Form.Select>
                            </div> */}
                            <div className="d-flex align-items-center justify-content-between px-2 py-2 border-bottom small">
                                <strong>Format</strong>
                                <div>{note?.format}</div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center small border-bottom px-2 py-2">
                                <strong>Confidential</strong>
                                <Form.Check
                                    type="switch"
                                    checked={note?.private}
                                    onChange={(e) => handleChange(note?._id, 'private', e.target.checked)}
                                />
                            </div>

                            <div className="d-flex justify-content-between align-items-center small border-bottom px-2 py-2">
                                <strong>Active</strong>
                                <Form.Check
                                    type="switch"
                                    checked={note.active}
                                    onChange={(e) => handleChange(note?._id, 'active', e.target.checked)}
                                />
                            </div>

                            <div
                                className="d-flex align-items-center justify-content-between rounded-bottom  small px-2 py-2"
                                // style={{ backgroundColor: '#5582E51A' }}
                            >
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="radio"
                                        name="defaultNote"
                                        className="me-1"
                                        checked={note?.default}
                                        onChange={() => handleDefaultChange(note?._id)}
                                    />
                                    <strong>Set as default</strong>
                                </div>

                                <OverlayTrigger placement="left" overlay={<Tooltip>Edit Settings</Tooltip>}>
                                    <div
                                        className=" cursor-pointer text-primary d-flex align-items-center gap-1"
                                        role="button"
                                        onClick={() => handleOpenTab(note)}>
                                        <IoSettings size={16} />
                                        <strong className="text-primary">Setting</strong>
                                    </div>
                                </OverlayTrigger>
                            </div>
                        </Card>
                    </Col>
                ))
            )}
        </Row>
    );
};

export default NoteTypeCards;
