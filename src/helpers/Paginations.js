import React from 'react';

const Paginations = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled  text-light' : ' '}`}>
                    <button
                        className="page-link border-0"
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                </li>
                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, index) => (
                    <li
                        key={index + 1}
                        style={{ margin: '0 2px' }}
                        className={`page-item ${currentPage === index + 1 ? 'active px-1' : ''}`}
                    >
                        <button
                            className="page-link rounded-circle"
                            onClick={() => onPageChange(index + 1)}
                            disabled={currentPage === index + 1}
                        >
                            {index + 1}
                        </button>

                    </li>
                ))}
                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className="page-link border-0 btn"
                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Paginations;
