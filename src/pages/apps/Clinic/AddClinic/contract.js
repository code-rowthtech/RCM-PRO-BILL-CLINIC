import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createContractAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';

const Contract = ({ billingId, activeTab }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const contract = store?.createContractReducer?.data;
    useEffect(() => {
        if (activeTab === 'contract') {
            const payload = {
                parentClinicId: billingId,
            };
            dispatch(createContractAction({ key: encryptMessage(payload) }));
        }
    }, [activeTab, billingId, dispatch]);

    const handleDownload = (fileUrl) => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        }
    };

    return (
        <>
        {contract?
        `${contract}`
        :
        <Table responsive className="table-centered border border-muted table-nowrap mb-0">
                <thead>
                    <tr>
                        <th className="text-white">Contract Name</th>
                        <th className="text-white">Clinic Sign</th>
                        <th className="text-white">Probill Sign</th>
                        {/* Only show Date and Action headers if contract is signed */}
                        {contract?.clinicSignStatus && contract?.adminSignStatus && (
                            <>
                                <th className="text-white">Date</th>
                                <th className="text-white">Action</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {store?.createContractReducer?.loading ? (
                        <tr>
                            <td className="text-center" colSpan={5}>
                                <Spinner color="white" className="spinner-border-sm" />
                            </td>
                        </tr>
                    ) : !contract ? (
                        <tr>
                            <td colSpan={5} className="text-center">
                                <h3 className="my-5">No Contract Found</h3>
                            </td>
                        </tr>
                    ) : (
                        <tr>
                            <td className="text-black">{contract?.contractName}</td>
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
                            {/* Only render Date and Action columns if contract is signed */}
                            {contract?.clinicSignStatus && contract?.adminSignStatus && (
                                <>
                                    <td>{contract?.sentDate}</td>
                                    <td>
                                        <i
                                            className="fs-5 mdi mdi-eye cursor-pointer"
                                            onClick={() => handleDownload(contract?.certificateFileUrl)}
                                        ></i>
                                        <i
                                            className="fs-5 mdi mdi-download cursor-pointer"
                                            onClick={() => handleDownload(contract?.certificateFileUrl)}
                                        ></i>
                                    </td>
                                </>
                            )}
                        </tr>
                    )}
                </tbody>
            </Table>
        }
            
        </>
    );
};

export default Contract;
