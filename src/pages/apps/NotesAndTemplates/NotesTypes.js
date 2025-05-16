import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Form, Button, Modal } from 'react-bootstrap';
import { IoClose, IoSettings } from 'react-icons/io5';
import SettingTabs from './SettingTabs';
import { useForm } from 'react-hook-form';
import AddModalSetting from './Modals/AddModalSetting';
import NoteTypeCards from './Modals/NoteCards';
import { useDispatch } from 'react-redux';
import { getNoteCategoriesAction } from '../../../redux/noteCategories/action';
import { useSelector } from 'react-redux';

const NotesTypes = () => {
    const [openTabs, setOpenTabs] = useState([]);
    console.log(openTabs, 'opentabs');
    const [activeTabId, setActiveTabId] = useState('note-categories'); // Default tab
    const [addModal, setAddModal] = useState(false);
    const dispatch = useDispatch();
    const [selectedNote, setSelectedNote] = useState(null);

    useEffect(() => {
        dispatch(getNoteCategoriesAction());
    }, [dispatch]);
    const handleOpenTab = (note) => {
        const exists = openTabs.find((tab) => tab?._id === note?._id);
        if (!exists) {
            setOpenTabs((prev) => [...prev, note]);
        }
        setActiveTabId(note?._id);
    };

    const handleCloseTab = (id) => {
        const updatedTabs = openTabs.filter((tab) => tab?._id !== id);
        setOpenTabs(updatedTabs);

        if (activeTabId === id) {
            setActiveTabId(updatedTabs?.length > 0 ? updatedTabs[0]?._id : 'note-categories');
        }
    };

    const activeNote = openTabs.find((tab) => tab?._id === activeTabId);
    // for edit
    const handleOpenEditModal = (note) => {
        setSelectedNote(note);
        setAddModal(true);
    };

    return (
        <Row className="mt-2">
            <Col xs={12} className="px-0">
                <Card className="scroll-container " style={{ height: '90vh', overflowY: 'scroll' }}>
                    <Card.Body className="px-2 py-1">
                        <Row className="">
                            <Col className="" sm={10}>
                                <div
                                    className="d-flex gap-3"
                                    style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                                    <span
                                        onClick={() => setActiveTabId('note-categories')}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') setActiveTabId('note-categories');
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        className={`fw-semibold cursor-pointer font_active_tabs ${
                                            activeTabId === 'note-categories' ? 'active_tabs_link fw-bold' : ''
                                        }`}>
                                        Note Categories
                                    </span>

                                    {openTabs?.map((tab, index) => (
                                        <span
                                            key={tab?._id}
                                            onClick={() => setActiveTabId(tab?._id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') setActiveTabId(tab?._id);
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            className={`fw-semibold cursor-pointer font_active_tabs ${
                                                activeTabId === tab?._id ? 'active_tabs_link fw-bold' : ''
                                            }`}>
                                            {tab?.noteType} Display Setting
                                            <span
                                                style={{
                                                    marginLeft: 8,
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCloseTab(tab?._id);
                                                }}
                                                title="Close tab">
                                                <IoClose />
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </Col>
                            {(openTabs?.length === 0 || activeTabId === 'note-categories') && (
                                <Col sm={2} className="d-flex justify-content-end">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="custom-buttons"
                                        onClick={() => {
                                            setSelectedNote(null);
                                            setAddModal(true);
                                        }}>
                                        Add Category
                                    </Button>
                                </Col>
                            )}
                        </Row>
                        {activeTabId === 'note-categories' ? (
                            <NoteTypeCards handleOpenTab={handleOpenTab} handleOpenEditModal={handleOpenEditModal} />
                        ) : activeNote ? (
                            <SettingTabs />
                        ) : (
                            <p>No settings available.</p>
                        )}
                    </Card.Body>
                </Card>
            </Col>
            <AddModalSetting
                addModal={addModal}
                setAddModal={setAddModal}
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote} // ✅ Pass setter
            />
        </Row>
    );
};

export default NotesTypes;
