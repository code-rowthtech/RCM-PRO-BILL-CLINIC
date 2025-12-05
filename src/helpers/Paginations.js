import React from 'react';

const Paginations = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) {
                pages.push('...');
            }
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };
    const renderPageButtons = () => {
        return getPageNumbers().map((page, index) => {
            if (page === '...') {
                return (
                    <li key={`ellipsis-${index}`} className="page-item disabled">
                        <span className="page-link border-0">...</span>
                    </li>
                );
            }
            return (
                <li key={`page-${page}-${index}`} className={`page-item fw-semibold ms-1 fs-5`}>
                    <button
                        className={`page-link p-1 py-0 ${currentPage === page ? 'active-pagination px-1' : ''} rounded-2`}
                        onClick={() => onPageChange(page)}
                        disabled={currentPage === page}
                    >
                        {page}
                    </button>
                </li>
            );
        });
    };

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination d-flex align-items-center justify-content-end">
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled text-light' : ''}`}>
                    <button
                        className="page-link border-0"
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                </li>
                {renderPageButtons()}
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
