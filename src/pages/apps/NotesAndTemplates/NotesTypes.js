import { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Modal } from 'react-bootstrap';
import { IoClose, IoSearchSharp } from 'react-icons/io5';
import SettingTabs from './SettingTabs';
import AddModalSetting from './Modals/AddModalSetting';
import NoteTypeCards from './Modals/NoteCards';
import { useDispatch } from 'react-redux';
import { getNoteCategoriesAction } from '../../../redux/noteCategories/action';
import { useSelector } from 'react-redux';
import { loggedInUser } from '../../../helpers/api/loggedInUser';
import { FormInput } from 'lucide-react';
import { Controller, Form, useForm } from 'react-hook-form';
import Paginations from '../../../helpers/Paginations';

const NotesTypes = () => {
    const [openTabs, setOpenTabs] = useState([]);
    const [activeTabId, setActiveTabId] = useState('note-categories'); // Default tab
    const [addModal, setAddModal] = useState(false);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1);
    const store = useSelector((state) => state);
    const [noteType, setNoteType] = useState('');
    const newDataOftypes = [
        'Encounter-Based',
        'Nursing & Allied Health',
        'Psychiatric & Behavioral Health',
        'Administrative & Communication',
        'Diagnostic & Monitoring',
        'Specialty-Specific',
        'System & Meta',
    ];
    const [selectedNote, setSelectedNote] = useState(null);
    const ClinicId = loggedInUser?.clinicId;
    const {
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();
    useEffect(() => {
        dispatch(
            getNoteCategoriesAction({
                search: search,
                skip: skip,
                limit: 8,
                clinicId: ClinicId,
                active: status === 'active' ? true : false,
                noteType: noteType,
            })
        );
    }, [dispatch, search, noteType, skip]);
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
    const handleActiveTab = () => {
        dispatch(getNoteCategoriesAction({ search: search, page: skip, limit: 8, clinicId: ClinicId }));
    };

    const [status, setStatus] = useState('active');

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    useEffect(() => {
        const storedTabId = localStorage.getItem('note_activeTabId');
        const storedOpenTabs = localStorage.getItem('note_openTabs');

        if (storedTabId) setActiveTabId(storedTabId);

        if (storedOpenTabs) {
            try {
                setOpenTabs(JSON.parse(storedOpenTabs));
            } catch (e) {
                console.error('Error parsing openTabs from localStorage');
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('note_activeTabId', activeTabId);
        localStorage.setItem('note_openTabs', JSON.stringify(openTabs));
    }, [activeTabId, openTabs]);
    return (
        <Row className="mt-2">
            <Col xs={12} className="px-0">
                <Card className="" style={{ height: '90vh' }}>
                    <Card.Body className="px-2 py-1">
                        <Row className="">
                            <Col className="border-bottom" sm={12}>
                                <div
                                    className="d-flex gap-3 mb-1"
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
                                            {tab?.title} Display Setting
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
                                <Col md={12} className="mt-2">
                                    <Row>
                                        <Col md={6}>
                                            <Button
                                                onClick={() => {
                                                    setStatus('active');
                                                    setSkip(1); // Reset to first page
                                                    dispatch(
                                                        getNoteCategoriesAction({
                                                            active: true,
                                                            search: search,
                                                            page: 1,
                                                            limit: 8,
                                                            clinicId: ClinicId,
                                                            noteType: noteType,
                                                        })
                                                    );
                                                }}
                                                className={`me-md-2 active_inactive_buttons ${
                                                    status === 'active'
                                                        ? ' text-white py-'
                                                        : 'bg-white border-primary text-dark py-'
                                                }`}>
                                                Active
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setStatus('inactive');
                                                    setSkip(1); // Reset to first page
                                                    dispatch(
                                                        getNoteCategoriesAction({
                                                            active: false,
                                                            search: search,
                                                            page: 1,
                                                            limit: 8,
                                                            clinicId: ClinicId,
                                                            noteType: noteType,
                                                        })
                                                    );
                                                }}
                                                className={`me-md-2 ms-sm-1 active_inactive_buttons text-nowrap ${
                                                    status === 'inactive'
                                                        ? ' text-white py-'
                                                        : 'bg-white border-primary text-dark py-'
                                                }`}>
                                                Inactive
                                            </Button>
                                            {/* <Button
                                                onClick={() =>{setStatus('private');dispatch(getNoteCategoriesAction({private:true,active:true, search: search, page: skip, limit: 8, clinicId: ClinicId,noteType:noteType }));}}
                                                className={`me-md-2 ms-sm-1 active_inactive_buttons text-nowrap ${
                                                    status==='private'
                                                        ? ' text-white py-'
                                                        : 'bg-white border-primary text-dark py-'
                                                }`}>
                                                Private
                                            </Button> */}
                                        </Col>

                                        <Col sm={6} className="d-flex justify-content-end align-items-center">
                                            <div>
                                                <select
                                                    className="form-select form-select-lg"
                                                    onChange={(e) => setNoteType(e.target.value)}
                                                    aria-label="Large select example">
                                                    <option value="">All</option>
                                                    {newDataOftypes?.map((type) => (
                                                        <option key={type} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="ms-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    placeholder="Search"
                                                />
                                            </div>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="custom-buttons ms-2"
                                                onClick={() => {
                                                    setSelectedNote(null);
                                                    setAddModal(true);
                                                }}>
                                                Add Category
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            )}
                        </Row>
                        {activeTabId === 'note-categories' ? (
                            <NoteTypeCards handleOpenTab={handleOpenTab} handleOpenEditModal={handleOpenEditModal} />
                        ) : activeNote ? (
                            <SettingTabs noteType={activeNote} />
                        ) : (
                            <p>No settings available.</p>
                        )}
                        {activeTabId === 'note-categories' && (
                            <Card.Footer>
                                <Paginations
                                    currentPage={skip}
                                    totalPages={store?.getNoteCategoriesReducer?.data?.pagination?.pages}
                                    onPageChange={handlePageChange}
                                />
                            </Card.Footer>
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
