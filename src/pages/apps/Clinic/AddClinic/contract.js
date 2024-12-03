import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createContractAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';

const Contract = ({ billingId, activeTab, contractId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
        clearErrors
    } = useForm();

    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const contract = store?.createContractReducer?.data?.contract;
    console.log(contract, 'new contract');

    useEffect(() => {
        if (activeTab === 'contract') {
            const payload = {
                parentClinicId: billingId,
            };
            dispatch(createContractAction({ key: encryptMessage(payload) }));
        } 
    }, [activeTab, store?.createContractReducer?.data?.status]);
    const handleDownload = (fileUrl) => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        }
    };
    return (
        <>
            <Table responsive className="table-centered border border-muted table-nowrap mb-0">
                <thead>
                    <tr>
                        <th className="text-white">Contract Name</th>
                        <th className="text-white">Clinic Sign</th>
                        <th className="text-white">Probill Sign</th>
                        <th className="text-white">Date</th>
                        <th className="text-white">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {store?.createContractReducer?.loading ? (
                        <tr>
                            <td className="text-center" colSpan={5}>
                                <Spinner />
                            </td>
                        </tr>
                    ) :
                     !contract ? (
                        <tr>
                          <td colSpan={5} className="text-center">
                            <h3 className="my-5">No Contract Found</h3>
                          </td>
                        </tr>
                      ) :  (
                        contract && (
                            <tr>
                                <td className='text-black'>{contract?.contractName}</td>
                                <td>
                                    <span
                                        className={`${
                                            contract?.clinicSignStatus ? 'bg-success' : 'bg-secondary'
                                        } text-light px-1 rounded-1`}
                                    >
                                        {contract?.clinicSignStatus ? 'Signed' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        className={`${
                                            contract?.adminSignStatus ? 'bg-success' : 'bg-secondary'
                                        } text-light px-1 rounded-1`}
                                    >
                                        {contract?.adminSignStatus ? 'Signed' : 'Pending'}
                                    </span>
                                </td>
                                <td>{contract?.sentDate}</td>
                                <td>
                                    <i className="fs-5 mdi mdi-eye cursor-pointer" onClick={()=>handleDownload(contract?.certificateFileUrl)}></i>
                                    <i className="fs-5 mdi mdi-download cursor-pointer" onClick={()=>handleDownload(contract?.certificateFileUrl)}></i>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </Table>
        </>
    );
};

export default Contract;
