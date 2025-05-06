// components/SuggestionOffcanvas.js
import React from 'react';
import { Offcanvas, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const SuggestionOffcanvas = ({ show, onClose, onSelect }) => {
    const store = useSelector((state) => state);
    const suggestions = store?.createSuggestionsReducer?.data?.data;
    const loading = store?.createSuggestionsReducer?.loading;
    // const { suggestions, loading } = useSelector((state) => state.createSuggestionsReducer);
    console.log(suggestions, 'suggestions');

    return (
        <Offcanvas show={show} onHide={onClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>✨ Suggestions</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="scroll-container">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                        <Spinner />
                    </div>
                ) : (
                    suggestions?.map((data, index) => (
                        <div
                            key={index}
                            className="suggestion-item border-bottom py-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                onSelect(data?.text);
                                onClose();
                            }}>
                            <div
                                dangerouslySetInnerHTML={{ __html: data?.text }}
                                style={{ fontSize: '14px', color: '#333' }}
                            />
                        </div>
                    ))
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default SuggestionOffcanvas;
