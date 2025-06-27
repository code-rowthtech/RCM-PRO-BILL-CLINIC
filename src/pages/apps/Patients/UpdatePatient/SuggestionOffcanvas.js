// components/SuggestionOffcanvas.js
import React, { useState } from 'react';
import { Button, ListGroup, Offcanvas, Spinner } from 'react-bootstrap';
import { FaCheck, FaCopy } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const SuggestionOffcanvas = ({ show, onClose, onSelect }) => {
    const store = useSelector((state) => state);
    const suggestions = store?.createSuggestionsReducer?.data?.data;
    console.log("Suggestions:", suggestions);
    const loading = store?.createSuggestionsReducer?.loading;
    const [copiedIndex, setCopiedIndex] = useState(null);
    const handleCopy = (text, index) => {
        // Create a temporary element to strip HTML tags
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = text;
        const plainText = tempDiv.textContent || tempDiv.innerText || "";

        // Copy the plain text
        navigator.clipboard.writeText(plainText);

        // Update copied index state
        setCopiedIndex(index);
    };

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
            <Offcanvas.Body className="scroll-container px-1">
                {loading ? (
                    <TobaccoSkeleton />
                ) : (
                    suggestions?.length === 0 ?
                        <div className="d-flex flex-column align-items-center justify-content-center h-100">
                            <i className="bi bi-journal-x fs-1 text-muted"></i>
                            <p className="mt-2 mb-0 fw-semibold text-muted">No suggestions found</p>
                        </div>
                        :
                        suggestions?.map((data, index) => (
                            <div className='p-0 pb-1  border-bottom'>
                                <div className="row p-0 m-0">
                                    <div className="col-12 py-0 m-0 text-end">
                                        <span
                                            className={`ms-2 ${copiedIndex === index ? 'text-success ' : 'text-info'} copy-btn`}
                                            onClick={() => handleCopy(data?.text, index)}
                                            title={copiedIndex === index ? 'Copied!' : 'Copy to clipboard'}
                                        >
                                            {copiedIndex === index ? <FaCheck /> : <FaCopy />}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    key={index}
                                    className="suggestion-item scroll-container  pt-1"
                                    style={{ cursor: 'pointer', maxHeight: "15vh" }}
                                    onClick={() => {
                                        onSelect(data?.text);
                                        onClose();
                                    }}>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: data?.text }}
                                        style={{ fontSize: '14px', color: '#333' }}
                                    />
                                </div>

                            </div>
                        ))
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default SuggestionOffcanvas;
