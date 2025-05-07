// components/SuggestionOffcanvas.js
import React from 'react';
import { ListGroup, Offcanvas, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const SuggestionOffcanvas = ({ show, onClose, onSelect }) => {
    const store = useSelector((state) => state);
    const suggestions = store?.createSuggestionsReducer?.data?.data;
    const loading = store?.createSuggestionsReducer?.loading;
    const TobaccoSkeleton = () => {
        const skeletonItems = Array.from({ length: 7 });

        return (
            <ListGroup variant="flush">
                {skeletonItems.map((_, idx) => (
                    <ListGroup.Item key={idx} className="pb-3 px-0 border-bottom">
                        <div className="skeleton-line w-50 mb-2"></div>
                        <div className="skeleton-line w-75 mb-1"></div>
                        <div className="skeleton-line w-100"></div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    };
    return (
        <Offcanvas show={show} onHide={onClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>✨ Suggestions</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="scroll-container">
                {loading ? (
                    <TobaccoSkeleton />
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
