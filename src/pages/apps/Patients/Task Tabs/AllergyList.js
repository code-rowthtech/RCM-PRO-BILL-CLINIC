import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { FiEdit, FiPlus } from 'react-icons/fi';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import AddAllergy from './AddAllergy';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../../constants/Spinner';
import {
    deleteAllergyAction,
    getAllergiesOfPatientAction,
    getAllergyDetailsAction,
} from '../../../../redux/allergyList/action';
import UpdateAllergy from './UpdateTasks/UpdateAllergy';

const AllergyList = () => {
    const [showAddAllergy, setShowAddAllergy] = useState(false);
    const [showUpdateAllergy, setShowUpdateAllergy] = useState(false);
    const [selectedAllergy, setSelectedAllergy] = useState(null);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const allergyData = store?.getAllergiesOfAPatientReducer?.data?.allergies;
    const deleteStatus = store?.deleteAllergyReducer?.data?.status;
    console.log('allergyData', allergyData);

    useEffect(() => {
        const data = {
            patientId: patientId,
        };

        dispatch(getAllergiesOfPatientAction(data));
    }, [dispatch, patientId]);

    const handleEditClick = (allergy) => {
        setSelectedAllergy(allergy);
        setShowUpdateAllergy(true);
    };

    useEffect(() => {
        if (deleteStatus === 200) {
            const data = {
                patientId: patientId,
            };
            dispatch(getAllergiesOfPatientAction(data));
        }
    }, [deleteStatus, dispatch, patientId]);

    return (
        <div className='scroll-container' style={{ overflowY: 'scroll', overflowX: 'hidden', height: '70vh' }}>
            {showAddAllergy ? (
                <AddAllergy onCancel={() => setShowAddAllergy(false)} />
            ) : showUpdateAllergy ? (
                <UpdateAllergy allergy={selectedAllergy} onCancel={() => setShowUpdateAllergy(false)} />
            ) : (
                <Row>
                    <Col sm={12} className="d-flex justify-content-between">
                        <h4>Allergy List</h4>
                        <Button className="custom-buttons text-nowrap" onClick={() => setShowAddAllergy(true)}>
                            <FiPlus className="fs-5 text-white" />
                            &nbsp; Add Allergy
                        </Button>
                    </Col>
                    <Col sm={12}>
                        <Table responsive className="table-centered table-nowrap mb-0">
                            <thead className="text-white bg-dark">
                                <tr key="">
                                    <th className="text-white">Sr.No.</th>
                                    <th className="text-white">Clinic Status</th>
                                    <th className="text-white">Verification Status</th>
                                    <th className="text-white">Allergy Type</th>
                                    <th className="text-white">Category</th>
                                    <th className="text-white">Criticality</th>
                                    <th className="text-white">Notes</th>
                                    <th className="text-white">Action</th>
                                </tr>
                            </thead>
                            {store?.getAllergiesOfAPatientReducer?.loading ? (
                                <tr>
                                    <td className="text-center" colSpan={10}>
                                        <Spinner className=" my-5 " />
                                    </td>
                                </tr>
                            ) : (
                                <tbody>
                                    {allergyData?.length === 0 ? (
                                        <tr key="">
                                            <td colSpan={10} className="text-center">
                                                <h3 className="my-5">No Allergy Found!</h3>
                                            </td>
                                        </tr>
                                    ) : (
                                        allergyData?.map((data, index) => (
                                            <tr key={index}>
                                                <td className="text-capitalize">{index + 1}.</td>
                                                <td className="text-capitalize">
                                                    {data?.clinicalStatus?.coding?.[0]?.display || 'N/A'}
                                                </td>
                                                <td className="text-capitalize">
                                                    {data?.verificationStatus?.coding?.[0]?.display || 'N/A'}
                                                </td>
                                                <td className="text-capitalize">
                                                    {data?.type?.coding?.[0]?.display || 'N/A'}
                                                </td>
                                                <td className="text-capitalize">
                                                    {data?.category?.[0]?.display || 'N/A'}
                                                </td>
                                                <td className="text-capitalize">
                                                    {data?.criticality?.display || 'N/A'}
                                                </td>
                                                <td className="text-capitalize">{data?.note?.[0]?.text || 'N/A'}</td>
                                                <td>
                                                    <IoInformationCircleOutline className="fs-4 cursor-pointer text-black" />
                                                    &nbsp;
                                                    <FiEdit
                                                        className="fs-4 cursor-pointer text-black"
                                                        onClick={() => {
                                                            handleEditClick(data);
                                                            const requestData = {
                                                                id: data?._id,
                                                            };
                                                            dispatch(getAllergyDetailsAction(requestData));
                                                        }}
                                                    />
                                                    &nbsp;
                                                    <MdDeleteOutline
                                                        className="fs-4 cursor-pointer text-black"
                                                        onClick={() => {
                                                            const requestData = {
                                                                id: data?._id,
                                                            };
                                                            dispatch(deleteAllergyAction(requestData));
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            )}
                        </Table>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default AllergyList;
