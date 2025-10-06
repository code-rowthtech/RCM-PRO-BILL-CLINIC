import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { getAppointmentsAction, rescheduleAppointmentAction } from '../../../../../redux/appointments/action';
import { encryptMessage } from '../../../../../cryptoUtils';
import { appointmentStatus } from '../../../../../utils/DataSets/commonData';
import CancellationPopup from '../modals/CancellationPopup';

const AppointmentRow = ({ appointment, index, appointmentPeriod, skip, clinicId }) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const { handleSubmit } = useForm();
  
  const [cancelationPopupRow, setCancelationPopupRow] = useState(null);
  const [cancelationReason, setCancelationReason] = useState('');
  
  const updateSuccess = store?.rescheduleAppointmentReducer?.data?.status;

  useEffect(() => {
    if (updateSuccess === 200) {
      dispatch(getAppointmentsAction({ 
        clinicId: clinicId, 
        status: appointmentPeriod, 
        skip: skip, 
        limit: 10 
      }));
      setCancelationPopupRow(null);
      setCancelationReason('');
    }
  }, [updateSuccess, dispatch, clinicId, appointmentPeriod, skip]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.cancellation-popup') && cancelationPopupRow !== null) {
        setCancelationPopupRow(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cancelationPopupRow]);

  const formatTimeWithAmPm = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatPatientName = (subject) => {
    return (subject?.name?.[0]?.prefix?.[0]
      ? subject?.name?.[0]?.prefix?.[0] + ' '
      : '') +
      (subject?.name?.[0]?.family || '') +
      (subject?.name?.[0]?.given?.length > 0
        ? ' ' + subject?.name?.[0]?.given?.join(' ')
        : '') || 'N/A';
  };

  const getPatientPhone = (subject) => {
    return subject?.telecom?.find(
      (item) => item.system === 'phone' && item.value
    )?.value || 'Phone number not available';
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.slice(0, maxLength - 1) + '...' : text;
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    
    if (newStatus === 'cancelled') {
      setCancelationPopupRow(appointment?._id);
    } else {
      dispatch(rescheduleAppointmentAction({
        id: appointment?._id,
        key: encryptMessage({ status: newStatus }),
      }));
      setCancelationPopupRow(null);
    }
  };

  const submitWithReason = () => {
    const payload = {
      cancellationReason: [{
        coding: [{
          system: '',
          code: '',
          display: cancelationReason,
        }],
        text: cancelationReason,
      }],
      status: 'cancelled',
    };
    
    dispatch(rescheduleAppointmentAction({
      id: cancelationPopupRow,
      key: encryptMessage(payload),
    }));
  };

  const getStatusClassName = (status) => {
    const statusClasses = {
      pending: 'pendingColor',
      proposed: 'proposedColor',
      booked: 'bookedColor',
      arrived: 'arrivedColor',
      fulfilled: 'fulfilledColor',
      cancelled: 'cancelledColor',
      noshow: 'noshowColor',
      'entered-in-error': 'enteredinerrorColor',
      'checked-in': 'checkedinColor',
      waitlist: 'waitlistColor',
    };
    return statusClasses[status] || '';
  };

  return (
    <tr>
      <td>{index + 1}</td>
      <td className="text-capitalize position-relative">
        <Form.Select
          defaultValue={appointment?.status}
          onChange={handleStatusChange}
          className={`schedule-status-select ${getStatusClassName(appointment?.status)}`}
        >
          {appointmentStatus?.map((status, idx) => (
            <option value={status?.code} key={idx}>
              {status?.display}
            </option>
          ))}
        </Form.Select>
        
        <CancellationPopup
          show={cancelationPopupRow === appointment?._id}
          onClose={() => setCancelationPopupRow(null)}
          onSubmit={submitWithReason}
          reason={cancelationReason}
          onReasonChange={setCancelationReason}
        />
      </td>
      
      <td className="text-capitalize">
        {formatPatientName(appointment?.subject)}
        <div className="d-flex gap-2">
          <span>
            {appointment?.subject?.birthDate
              ? new Date(appointment.subject.birthDate).toISOString().split('T')[0]
              : 'N/A'}
          </span>
          <span>{getPatientPhone(appointment?.subject)}</span>
        </div>
      </td>
      
      <td>
        {formatTimeWithAmPm(appointment?.start)} - {formatTimeWithAmPm(appointment?.end)}
      </td>
      
      <td>{new Date(appointment?.date).toLocaleDateString('en-GB')}</td>
      
      <td className="text-capitalize">
        {appointment?.doctorId?.name?.[0]?.text + ' '}
      </td>
      
      <td
        className="text-capitalize cursor-pointer"
        data-toggle="tooltip"
        data-placement="top"
        title={appointment?.appointmentType?.coding?.[0]?.display}
      >
        {truncateText(appointment?.appointmentType?.coding?.[0]?.display)}
      </td>
      
      <td
        className="text-capitalize cursor-pointer"
        data-toggle="tooltip"
        data-placement="top"
        title={appointment?.reason?.[0]?.coding?.[0]?.display || 'N/A'}
      >
        {truncateText(appointment?.reason?.[0]?.coding?.[0]?.display)}
      </td>
      
      <td>
        <Link
          to={`/apps/appointments/newAppointment?updateid=${appointment?._id}`}
          className="action-icon"
        >
          <i className="mdi mdi-square-edit-outline cursor-pointer"></i>
        </Link>
      </td>
    </tr>
  );
};

export default AppointmentRow;