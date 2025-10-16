import React, { useEffect } from 'react';
import { OverlayTrigger, Spinner, Table, Tooltip } from 'react-bootstrap';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { deleteScheduleAction, getScheduleAction } from '../../../redux/schedule/action';
import { decryptMessage, encryptMessage } from '../../../cryptoUtils';
import { formatDateByUserTimeZone } from '../../../components/timeZonePipe';

const DoctorHoliday = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    // const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const clinicId = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';
    const scheduleResponse = store?.getScheduleReducer?.data?.holidays || [];
    const isLoading = store?.getScheduleReducer?.loading;
    const deleteResponse = store?.deleteScheduleReducer?.data?.response?.status;

    useEffect(() => {
        if (deleteResponse === 200) {
            const payload = {
                clinicId: clinicId,
            };
            dispatch(getScheduleAction({ key: encryptMessage(payload) }));
        }
    }, [deleteResponse]);

    const deleteHandle = (id) => {
        dispatch(deleteScheduleAction(id));
    };

    return (
        <div>
            <Table
                responsive
                className="table-centered table-nowrap mb-0  rounded"
                style={{ height: scheduleResponse?.length === 0 ? '75vh' : 'auto' }}>
                <thead className="text-white">
                    <tr>
                        <th className="text-white " style={{ fontSize: '13px' }}>
                            {`Sr.No.`}
                        </th>
                        <th className="text-white " style={{ fontSize: '13px' }}>
                            {`Provider Name`}
                        </th>
                        <th className="text-white " style={{ fontSize: '13px' }}>
                            {`Reason`}
                        </th>
                        <th className="text-white " style={{ fontSize: '13px' }}>
                            {`Date`}
                        </th>
                        <th className="text-white " style={{ fontSize: '13px' }}>
                            {`Action`}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={7} className="text-center ">
                                <Spinner animation="border" role="status" />
                            </td>
                        </tr>
                    ) : scheduleResponse.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center">
                                <h3 className="my-5">{`No Data Found`}</h3>
                            </td>
                        </tr>
                    ) : (
                        scheduleResponse.map((holiday, index) => (
                            <tr key={holiday?.id || index}>
                                <td className="" style={{ fontSize: '13px', fontWeight: '400', cursor: 'none' }}>
                                    {index + 1}
                                </td>
                                <td className="text-capitalize " style={{ fontSize: '13px', fontWeight: '400' }}>
                                    {(holiday?.doctorId?.name?.[0]?.prefix?.[0]
                                        ? holiday?.doctorId?.name?.[0]?.prefix?.[0] + ' '
                                        : '') +
                                        (holiday?.doctorId?.name?.[0]?.family || '') +
                                        (holiday?.doctorId?.name?.[0]?.given?.length > 0
                                            ? ' ' + holiday?.doctorId?.name?.[0]?.given?.join(' ')
                                            : '') || 'N/A'}

                                </td>
                                <td className="text-capitalize " style={{ fontSize: '13px', fontWeight: '400' }}>
                                    {(holiday?.reason?.length || 0) > 20 ? (
                                        <OverlayTrigger placement="top" overlay={<Tooltip>{holiday.reason}</Tooltip>}>
                                            <span style={{ cursor: 'pointer' }}>{holiday.reason.slice(0, 20)}...</span>
                                        </OverlayTrigger>
                                    ) : (
                                        holiday?.reason || 'N/A'
                                    )}
                                </td>
                                <td className="" style={{ fontSize: '13px', fontWeight: '400' }}>
                                    <div
                                        className="text-white text-center bg-secondary rounded-2"
                                        style={{ width: '100px' }}>
                                        {formatDateByUserTimeZone(holiday?.date, {}, 'date')}
                                    </div>
                                </td>
                                <td className="" style={{ fontSize: '13px', fontWeight: '400' }}>
                                    <RiDeleteBin5Line
                                        onClick={() => deleteHandle(holiday?._id)}
                                        className="fs-4 text-danger ms-2 cursor-pointer"
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default DoctorHoliday;
