import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { FcViewDetails } from 'react-icons/fc';
import { FiFilter } from 'react-icons/fi';

import StatusTooltip from './sections/StatusTooltip';

const AppointmentFilters = ({
  activeTab,
  selectedDoctor,
  doctorDetails,
  showTooltip,
  setShowTooltip,
  onInputChange,
  onDoctorChange,
  register,
  setValue,
  clearErrors,
  store
}) => {
  const doctorOptions = doctorDetails?.map((data) => ({
    value: data?._id,
    label: (data?.name?.[0]?.prefix?.[0]
      ? data?.name?.[0]?.prefix?.[0] + ' '
      : '') +
      (data?.name?.[0]?.family || '') +
      (data?.name?.[0]?.given?.length > 0
        ? ' ' + data?.name?.[0]?.given?.join(' ')
        : '') + ' ' +
      (data?.identifier?.find((tel) => tel?.type?.coding?.[0]?.code === 'NPI')?.value ?
        `(******${data?.identifier?.find((tel) => tel?.type?.coding?.[0]?.code === 'NPI')?.value.slice(-4)})`
        : '') || ''
  }));

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '30px',
      height: '30px',
      width: '200px',
      padding: '0px 0px 0px 7px',
      fontSize: '10px',
      border: '0px',
      backgroundColor: '#E8F0FE!important',
      boxShadow: 'none',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '30px',
    }),
    placeholder: (provided) => ({
      ...provided,
      fontWeight: 600,
      color: '#0908084f',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#b9bcbe44' : '',
      fontSize: state.isFocused ? '10px' : '10px',
      color: 'black',
      padding: '10px 12px',
      cursor: 'pointer',
      zIndex: 9999,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <Col className="text-end mt-2 mt-md-0">
      <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
        <Col xs={1} className="position-relative d-flex align-items-center justify-content-end text-end">
          <FcViewDetails
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="fs-3 text-dark"
            style={{ cursor: 'help' }}
          />
          <StatusTooltip show={showTooltip} />
        </Col>

        <Col sm="auto" className="d-flex flex-wrap gap-2 align-items-center text-start justify-content-between responnsible-party-select px-0">
          <Select
            className="basic-single"
            classNamePrefix="select"
            isLoading={store?.getDoctorsReducer?.loading}
            isClearable={true}
            value={selectedDoctor}
            isSearchable={true}
            {...register('selectedDoctor')}
            onInputChange={(inputValue) => onInputChange(inputValue)}
            onChange={(data) => {
              setValue('selectedDoctor', data);
              onDoctorChange(data);
              clearErrors('selectedDoctor');
            }}
            name="doctorName"
            options={doctorOptions}
            placeholder="Select Provider"
            styles={selectStyles}
            menuPlacement="auto"
            menuPosition="fixed"
          />

          {activeTab === 'appointments' && (
            <>
              <Button className="custom-buttons">
                <FiFilter className="fs-5" />
              </Button>
              <Button
                as={Link}
                to="/apps/appointments/newAppointment"
                className="custom-buttons"
              >
                New Appointment
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Col>
  );
};

export default AppointmentFilters;