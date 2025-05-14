import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Form, Button, Modal } from 'react-bootstrap';
import { IoClose, IoSettings } from 'react-icons/io5';
import SettingTabs from './SettingTabs';
import { useForm } from 'react-hook-form';
import AddModalSetting from './Modals/AddModalSetting';
import NoteTypeCards from './Modals/Noteshelper';

const noteTypeData = [
    { id: 1, name: 'Case Review', isActive: false, format: 'Simple', isPsychotherapyNote: false, isDefault: false },
    { id: 2, name: 'Nutrition Notes', isActive: false, format: 'Simple', isPsychotherapyNote: false, isDefault: false },
    { id: 3, name: 'Other', isActive: false, format: 'Simple', isPsychotherapyNote: false, isDefault: false },
    {
        id: 4,
        name: 'Patient Email Message',
        isActive: false,
        format: 'Simple',
        isPsychotherapyNote: false,
        isDefault: false,
    },
    {
        id: 5,
        name: 'Patient Phone Message',
        isActive: true,
        format: 'Simple',
        isPsychotherapyNote: false,
        isDefault: false,
    },
    { id: 6, name: 'SOAP Note', isActive: true, format: 'SOAP', isPsychotherapyNote: false, isDefault: true },
];

const NotesTypes = () => {
    const [noteTypes, setNoteTypes] = useState(noteTypeData);
    const [openTabs, setOpenTabs] = useState([]);
    const [activeTabId, setActiveTabId] = useState('note-categories'); // Default tab
    const [addModal, setAddModal] = useState(false);

    const handleDefaultChange = (id) => {
        const updated = noteTypes.map((note) => ({
            ...note,
            isDefault: note.id === id,
        }));
        setNoteTypes(updated);
    };

    const handleOpenTab = (note) => {
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

                                    {openTabs.map((tab, index) => (
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
                                            {tab?.name} {index + 1}
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
                                noteTypes={noteTypes}
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
                onSubmit={(newNote) => {
                    const id = noteTypes.length + 1;
                    const noteWithId = { id, isPsychotherapyNote: false, ...newNote };
                    setNoteTypes((prev) => [...prev, noteWithId]);
                }}
            />{' '}
        </Row>
    );
};

export default NotesTypes;
