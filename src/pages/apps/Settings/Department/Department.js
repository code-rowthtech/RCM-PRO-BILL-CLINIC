import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import Spinner from '../../../../constants/Spinner';
import { FormInput } from '../../../../components';
import { FiFileText, FiFilter } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../../cryptoUtils';
import {
  createMastersDataAction,
  getDepartmentDataAction,
  getMastersDataAction,
  stateEmptydAction,
  updateMastersDataAction
} from '../../../../redux/settings/action';
import { IoMdClose } from 'react-icons/io';
import Paginations from '../../../../helpers/Paginations';
import { formatDate } from '../../../../helpers/dateFormat';

const Department = () => {
  const store = useSelector((state) => state);
  console.log(store, 'stoed')
  const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const nameValue = watch("name");
  const [addDepartmentModal, setAddDepartmentModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(true);
  const [skip, setSkip] = useState(1);

  const closeAddModal = () => {
    setAddDepartmentModal(false);
    setEdit(null);
    reset();
  };

  const handleEdit = (data) => {
    setEdit(data);
    setValue("name", data.name);
    setValue("reEnterName", data.name);
    setValue("description", data.description);
    setAddDepartmentModal(true);
  };

  const addDepartment = (data) => {
    const payload = {
      //   id: edit?._id,
      ...(edit ? { id: edit?._id } : {}),
      name: data?.name,
      description: data?.description || 'N/A',
      category: 'Department',
      clinicId: clinic_id,
      showTo: "clinic",
    };
    if (edit) {
      dispatch(updateMastersDataAction({ key: encryptMessage(payload) }));
      console.log("Updated", payload);
    } else {
      dispatch(createMastersDataAction({ key: encryptMessage(payload) }));
      console.log("create", payload);

    }

  };

  const createResponse = store?.createMastersDataReducer?.data?.status;
  const tableGetData = store?.getMastersDataReducer?.data?.result;

  const updateResponse = store?.updateMastersDataReducer?.data?.status;
  useEffect(() => {
    if (createResponse === 200) {
      setAddDepartmentModal(false);
      reset();
    }
  }, [createResponse]);
  useEffect(() => {
    if (updateResponse === 200) {
      setAddDepartmentModal(false);
      reset();
      setEdit(null);
    }
  }, [updateResponse]);
  useEffect(() => {
    dispatch(getMastersDataAction({ status: status, category: 'Department', limit: 10, skip, search: search }));
    if (createResponse === 200 || updateResponse === 200) {
      dispatch(getMastersDataAction({ status: status, category: 'Department', search: search, limit: 10, skip: skip }));
      dispatch(stateEmptydAction());
    }
  }, [dispatch, createResponse, updateResponse, status, search, skip]);

  const handleStatusChange = (data) => {
    setStatus(data);
    setSearch('');

  };

  const handlePageChange = (pageNumber) => {
    setSkip(pageNumber);
  };

  const handleUpdate = (data) => {
    const payload = { id: data?._id, isActive: !data?.isActive };
    dispatch(updateMastersDataAction({ key: encryptMessage(payload) }));
  };


  return (
    <Row className='mt-2'>
      <Col xs={12}>
        <Card >
          <Card.Body style={{ height: '76vh' }}>
            <Row className="mb-2">
              <Col sm={6}>
                <Button
                  variant={status === true ? 'outlined' : ''}
                  onClick={() => handleStatusChange(true)}
                  className={`${status === true ? 'custom-buttons text-light' : 'bg-none border-primary'} me-2`}
                  style={{ fontSize: '13px', fontWeight: '400', height: '30px' }}
                >
                  Active
                </Button>

                <Button
                  variant={status === false ? 'outlined' : ''}
                  onClick={() => handleStatusChange(false)}
                  className={`${status === false ? 'custom-buttons text-light' : 'bg-none border-primary'} me-2`}
                  style={{ fontSize: '13px', fontWeight: '400', height: '30px' }}
                >
                  Inactive
                </Button>
              </Col>
              <Col sm={6} className='text-end'>
                <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                  <Col xs="auto" className='d-flex gap-2'>
                    <FormInput
                      type="text"
                      onChange={(e) => { setSearch(e.target.value); setSkip(1); }}
                      placeholder="Search..."
                      style={{ height: '30px' }}
                    />
                    <Button className="custom-buttons py-0" style={{ height: '30px' }} ><FiFilter className='fs-5' style={{ fontSize: '13px', fontWeight: '400' }} /></Button>
                    <Button className="custom-buttons py-0" style={{ height: '30px' }} ><FiFileText className='fs-5' style={{ fontSize: '13px', fontWeight: '400' }} /></Button>
                    <Button onClick={() => { setAddDepartmentModal(true); setEdit(null) }} className="custom-buttons py-1" style={{ fontSize: '13px', height: '30px', fontWeight: '400' }}>
                      New Department
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Table
              responsive
              className="table-centered table-nowrap mb-0  rounded"
              style={{ height: tableGetData?.length === 0 ? '76vh' : 'auto' }}
            >
              <thead className="text-white">
                <tr>
                  <th className='text-white py-2' style={{ fontSize: '13px' }}>S.No.</th>
                  <th className='text-white py-2' style={{ fontSize: '13px' }}>Department Name</th>
                  <th className='text-white py-2' style={{ fontSize: '13px' }}>Description</th>
                  <th className='text-white py-2' style={{ fontSize: '13px' }}>Created Date</th>
                  <th className='text-white py-2' style={{ fontSize: '13px' }}>Status</th>
                  <th className='text-white py-2' style={{ fontSize: '13px' }}>Action</th>
                </tr>
              </thead>
              <tbody >
                {store?.getMastersDataReducer?.loading ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      <Spinner />
                    </td>
                  </tr>
                ) : tableGetData?.length ? (
                  tableGetData?.map((data, index) => (
                    <tr key={data._id} className="border-bottom">
                      <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>{index + 1}</td>
                      <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>{data?.name?.charAt(0).toUpperCase() + data?.name?.slice(1)}</td>
                      <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>{data.description}...</td>
                      <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>{formatDate(data.createdAt)}</td>
                      <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>
                        <Form.Switch
                          checked={data.isActive}
                          onChange={() => handleUpdate(data)}
                        />
                      </td>
                      <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>
                        <i
                          className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-primary"
                          onClick={() => handleEdit(data)}
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key={''}>
                  <td colSpan={7} className='text-center'>
                      <h3 className='my-5'>No Data Found</h3>
                  </td>
              </tr>
                )}
              </tbody>
            </Table>

            <Row>
              <Col className='mt-2 d-flex justify-content-end'>
                {/* <Paginations
                  currentPage={skip}
                  totalPages={store?.getMastersDataReducer?.data?.totalPages}
                  onPageChange={handlePageChange}
                /> */}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      <Modal centered show={addDepartmentModal} onHide={closeAddModal}>
        <Modal.Body>
          <Row className="border-bottom mb-2 pb-2">
            <Col sm={11} className='text-center'><h4>{edit ? 'Edit Department' : 'New Department'}</h4></Col>
            <Col sm={1}><IoMdClose className="fs-4 cursor-pointer" onClick={closeAddModal} /></Col>
          </Row>
          <Form onSubmit={handleSubmit(addDepartment)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Department Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      validate: {
                        noEmpty: (value) => value.trim() !== "" || "Name cannot be empty or only spaces",
                        noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                      },
                    })}
                    placeholder="Enter Department Name"
                    onInput={(e) => {
                      const value = e.target.value;
                      // Prevent spaces when input is empty
                      if (value.trim() === "") {
                        e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                      }
                    }}
                  />
                  {errors.name && <p className="text-danger">{errors.name.message}</p>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Re-Enter Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    {...register("reEnterName", {
                      required: "Re-enter department name",
                      validate: {
                        noEmpty: (value) => value.trim() !== "" || "Name cannot be empty or only spaces",
                        noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                        matchName: (value) => value === watch('name') || "Name do not match", // Match with 'name' field value
                      },
                    })}
                    placeholder="Re-enter Department Name"
                    onInput={(e) => {
                      const value = e.target.value;
                      // Prevent spaces when input is empty
                      if (value.trim() === "") {
                        e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                      }
                    }}
                  />

                  {errors.reEnterName && <p className="text-danger">{errors.reEnterName.message}</p>}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register("description")}
                    placeholder="Enter description"
                    onInput={(e) => {
                      const value = e.target.value;
                      // Prevent spaces when input is empty
                      if (value.trim() === "") {
                        e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                      }
                    }}
                  />
                </Form.Group>


              </Col>
            </Row>
            <Modal.Footer>
              <Button onClick={closeAddModal} className="custom-buttons">Close</Button>
              <Button type="submit" className="custom-buttons">
                {store?.createMastersDataReducer?.loading || store?.updateMastersDataReducer?.loading ? (
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>

                ) : (
                  'Submit'
                )}
              </Button>
            </Modal.Footer>
          </Form>

        </Modal.Body>
      </Modal>
    </Row>
  );
};

export default Department;
