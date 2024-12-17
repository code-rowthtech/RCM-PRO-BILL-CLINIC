import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createContractAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';

const Contract = ({ billingId, activeTab }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [viewList, setViewList] = useState(false);
    const contract = store?.createContractReducer?.data?.contract;
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    useEffect(() => {
        if (activeTab === 'contract') {
            const payload = {
                clinicId: clinic_id,
            };
            console.log(payload, 'billingId')
            dispatch(createContractAction({ key: encryptMessage(payload) }));
        }
    }, [activeTab]);

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
                        <th className="text-white">Practice Sign</th>
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
                                <Spinner />
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
                                    className={`${contract?.clinicSignStatus ? 'bg-success' : 'bg-secondary'
                                        } text-light px-1 rounded-1`}
                                >
                                    {contract?.clinicSignStatus ? 'Signed' : 'Pending'}
                                </span>
                            </td>
                            <td>
                                <span
                                    className={`${contract?.adminSignStatus ? 'bg-success' : 'bg-secondary'
                                        } text-light px-1 rounded-1`}
                                >
                                    {contract?.adminSignStatus ? 'Signed' : 'Pending'}
                                </span>
                            </td>
                            {contract?.clinicSignStatus && contract?.adminSignStatus && (
                                <>
                                    <td>{contract?.sentDate}</td>
                                    <td>
                                        <i className="fs-4 me-1 uil-external-link-alt"
                                            onClick={() => {
                                                setViewList(!viewList);
                                            }}></i>
                                        <div className={`${viewList ? 'px-1 position-absolute bg-white' : 'd-none'}`}>
                                            <p className='mb-0 border px-1 pe-3 cursor-pointer view-docs' onClick={() => {
                                                handleDownload(contract?.documentFileUrl);
                                                setViewList(false);
                                            }}>Document</p>
                                            <p className='mb-0 border px-1 pe-3 cursor-pointer view-docs' onClick={() => {
                                                handleDownload(contract?.certificateFileUrl);
                                                setViewList(false);
                                            }}>Certificate</p>
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    )}
                </tbody>
            </Table>

        </>
    );
};

export default Contract;
