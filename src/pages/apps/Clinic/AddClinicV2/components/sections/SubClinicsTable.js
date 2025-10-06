import React from 'react';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import Spinner from '../../../../../../constants/Spinner';

const SubClinicsTable = ({ loading, data }) => {
  const tableHeaders = ["S.No.", "PRACTICE NAME", "LOCATION", "PRACTICE TYPE", "STATUS", "ACTION"];

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={tableHeaders.length} className="text-center my-3">
            <Spinner />
          </td>
        </tr>
      );
    }

    if (!data || data.length === 0) {
      return (
        <tr>
          <td colSpan={tableHeaders.length} className="text-center my-3">
            No sub-clinics found
          </td>
        </tr>
      );
    }

    return data.map((patient, index) => (
      <tr key={patient?.id || `patient-${index}`}>
        <td>{index + 1}</td>
        <td className='text-capitalize'>{patient?.name}</td>
        <td
          className="cursor-pointer"
          data-toggle="tooltip"
          data-placement="top"
          title={patient?.address?.[0]?.line?.[0]}
        >
          {patient?.address?.[0]?.line?.[0]?.length > 27
            ? patient?.address?.[0]?.line?.[0]?.slice(0, 26) + '...'
            : patient?.address?.[0]?.line?.[0] || 'N/A'}
        </td>
        <td className='text-capitalize'>{patient.orgType}</td>
        <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>
          <Form.Switch
            className={patient.active ? 'custom-active' : ''}
            checked={patient.active}
            readOnly
          />
        </td>
        <td>
          <div className="text-center">
            <Link
              to={`/apps/Practice/updateSubClinic?id=${patient?.userId?._id}&clinicId=${patient?._id}`}
              className="text-black cursor-pointer ps-2"
            >
              <FiEdit className="fs-4 cursor-pointer" />
            </Link>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <Row className="mt-2">
      <Col xs={12}>
        <Row>
          <Col>
            <Table responsive className="table-centered table-nowrap mb-0">
              <thead className="text-white">
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th className="text-white" key={index}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {renderTableContent()}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default SubClinicsTable;