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
    const [activeTabId, setActiveTabId] = useState('note-categories'); // Default tab
    const [addModal, setAddModal] = useState(false);
    const dispatch = useDispatch();
    const [noteTypes, setNoteTypes] = useState([]);
    const handleDefaultChange = (id) => {
        const updated = noteTypes?.map((note) => ({
            ...note,
            isDefault: note?.id === id,
        }));
        setNoteTypes(updated);
    };

    useEffect(() => {
        dispatch(getNoteCategoriesAction());
    }, [dispatch]);
    const handleOpenTab = (note) => {
        console.log(note, 'nnnnnnnnnnnnnnnnnnnnn')
        const exists = openTabs.find((tab) => tab.id === note.id);
        if (!exists) {
            setOpenTabs((prev) => [...prev, note]);
        }
        setActiveTabId(note.id);
    };

    const handleCloseTab = (id) => {
        const updatedTabs = openTabs.filter((tab) => tab.id !== id);
        setOpenTabs(updatedTabs);

        if (activeTabId === id) {
            setActiveTabId(updatedTabs.length > 0 ? updatedTabs[0].id : 'note-categories');
        }
    };

    const activeNote = openTabs.find((tab) => tab.id === activeTabId);

    return (
        <Row className="mt-2">
            <Col xs={12} className="px-0">
                <Card className="scroll-container" style={{ height: '90vh', overflowY: 'scroll' }}>
                    <Card.Body className="px-2 py-1">
                        <Row className="">
                            <Col className="" sm={6}>
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
                                        className={`fw-semibold cursor-pointer font_active_tabs ${activeTabId === 'note-categories' ? 'active_tabs_link fw-bold' : ''
                                            }`}>
                                        Note Categories
                                    </span>

                                    {openTabs?.map((tab, index) => (
                                        <span
                                            key={tab.id}
                                            onClick={() => setActiveTabId(tab.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') setActiveTabId(tab.id);
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            className={`fw-semibold cursor-pointer font_active_tabs ${activeTabId === tab.id ? 'active_tabs_link fw-bold' : ''
                                                }`}>
                                            {tab?.noteType}
                                            <span
                                                style={{
                                                    marginLeft: 8,
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCloseTab(tab.id);
                                                }}
                                                title="Close tab">
                                                <IoClose />
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </Col>
                            <Col sm={6} className="d-flex justify-content-end">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="custom-buttons"
                                    onClick={() => setAddModal(true)}>
                                    New Note Category
                                </Button>
                            </Col>
                        </Row>
                        {activeTabId === 'note-categories' ? (
                            <NoteTypeCards
                                handleDefaultChange={handleDefaultChange}
                                handleOpenTab={handleOpenTab}
                            />
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
            />
        </Row>
    );
};

export default NotesTypes;
