import React from 'react'
import { Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';


const Contract = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
        clearErrors
    } = useForm();
    return (
        <>
            <Table responsive className="table-centered border border-muted table-nowrap mb-0">
                <thead>
                    <tr>
                        <th className='text-white'>Contract Name</th>
                        <th className='text-white'>Clinic Sign</th>
                        <th className='text-white'>Probill Sign</th>
                        <th className='text-white'>Date</th>
                        <th className='text-white'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {[0, 1, 2, 3, 4, 5].map((item) => (
                        <tr key={item}>
                            <td>XYZ</td>
                            <td><span className='bg-secondary text-light px-1 rounded-1'>Pending</span></td>
                            <td><span className='bg-secondary text-light px-1 rounded-1'>Pending</span></td>
                            <td>8:00 AM 26th Sep, 2024</td>
                            <td>
                                <i className="fs-5 mdi mdi-eye"></i>
                                <i className="fs-5 mdi mdi-download"></i>
                            </td>
                        </tr>
                    ))}


                </tbody>
            </Table>
        </>
    );
}

export default Contract