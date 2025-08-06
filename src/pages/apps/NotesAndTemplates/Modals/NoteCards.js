import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IoSettings, IoDocumentTextOutline } from 'react-icons/io5';
import '../settingtabs.css';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../../../constants/Spinner';
import { getNoteCategoriesAction, updateNoteCategoriesAction } from '../../../../redux/noteCategories/action';
import { encryptMessage } from '../../../../cryptoUtils';
import { FiFileText } from 'react-icons/fi';

const NoteTypeCards = ({ handleOpenTab, handleOpenEditModal }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [noteTypes, setNoteTypes] = useState([]);
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const notesCategoriesData = store?.getNoteCategoriesReducer?.data?.data;
    const loading = store?.getNoteCategoriesReducer?.loading;

    useEffect(() => {
        if (notesCategoriesData) setNoteTypes(notesCategoriesData);
    }, [notesCategoriesData]);

    const sendUpdate = (id, note) => {
        const payload = {
            clinicId: clinic_id || store?.Auth?.user?.clinicId,
            noteType: note.noteType,
            format: note.format,
            noteType: note.noteType,
            // title: note.title,
            customTitle: note.title === 'Other' ? note.customTitle : '',
            active: note.active,
            private: note.private,
            default: note.isDefault || note.default,
        };
        dispatch(updateNoteCategoriesAction({ id, key: encryptMessage(payload) }));
    };
    const handleChange = (id, field, value) => {
        const updated = noteTypes.map((note) => (note._id === id ? { ...note, [field]: value } : note));
        setNoteTypes(updated);
        const current = updated.find((n) => n._id === id);
        sendUpdate(id, current);
    };

    const handleDefaultChange = (id) => {
        const currentNote = noteTypes.find((n) => n._id === id);
        const isCurrentlyDefault = currentNote.default || currentNote.isDefault;
        const updated = noteTypes.map((note) => ({
            ...note,
            default: note._id === id ? !isCurrentlyDefault : false,
            isDefault: note._id === id ? !isCurrentlyDefault : false,
        }));
        setNoteTypes(updated);
        const note = updated.find((n) => n._id === id);
        sendUpdate(id, note);
    };

    return (
        <Row className="mt-2 scroll-container" style={{ maxHeight: '82vh', overflowY: 'auto' }}>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center w-100" style={{ height: '82vh' }}>
                    <Spinner color="white" className="spinner-border-sm" />
                </div>
            ) : noteTypes?.length === 0 ? (
                <div className="d-flex flex-column align-items-center">
                    <FiFileText size={48} className="text-muted mb-2" />
                    <h5>No Note found</h5>
                </div>
            ) : (
                noteTypes?.map((note) => (
                    <Col key={note._id} md={6} lg={4} xl={3} className="mb-1 px-2">
                        <Card className=" shadow-sm rounded-3 p-0">
                            <div
                                className="d-flex align-items-center justify-content-between px-2 py-1 rounded-top"
                                style={{ backgroundColor: ' #e8f0fe' }}>
                                <div className="d-flex align-items-center gap-0">
                                    <div
                                        className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: 28, height: 28 }}>
                                        <IoDocumentTextOutline size={16} />
                                    </div>
                                    <div className="small ms-1">
                                        <strong title={note?.title}>
                                            {note?.title?.length > 25 ? `${note.title.slice(0, 25)}...` : note?.title}
                                        </strong>{' '}
                                    </div>
                                </div>
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
                            <div className="d-flex align-items-center justify-content-between px-2 py-2 border-bottom small">
                                <strong>Note Type</strong>
                                <div>{note?.noteType || note?.customTitle}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between px-2 py-2 border-bottom small">
                                <strong>Format</strong>
                                <div>{note?.format}</div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center small border-bottom px-2 py-2">
                                <strong>Private</strong>
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
                                        type="checkbox"
                                        className="me-1"
                                        checked={note?.default || note?.isDefault}
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
