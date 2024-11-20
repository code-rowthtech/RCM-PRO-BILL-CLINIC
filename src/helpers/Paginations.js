import React from 'react';
import { Pagination } from 'react-bootstrap';

const Paginations = ({ currentPage, totalPages, onPageChange }) => {
    let items = [];

    for (let number = 1; number <= totalPages; number++) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => onPageChange(number)} // Handle page change
            >
                {number}
            </Pagination.Item>
        );
    }

    return (
        <Pagination className="pagination-rounded">
            <Pagination.Prev
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            />
            {items}
            <Pagination.Next
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            />
        </Pagination>
    );
};

export default Paginations;
