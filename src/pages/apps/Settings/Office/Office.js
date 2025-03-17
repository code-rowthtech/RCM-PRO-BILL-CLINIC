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
import { IoSearchSharp } from 'react-icons/io5';

const Office = () => {
  const store = useSelector((state) => state);
  const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const nameValue = watch("name");
  const [office, setOffice] = useState(false);
  const [edit, setEdit] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(true);
  const [skip, setSkip] = useState(1);

  const closeAddModal = () => {
    setOffice(false);
    setEdit(null);
    reset();
  };

  const handleEdit = (data) => {
    setEdit(data);
    setValue("name", data.name);
    setValue("reEnterName", data.name);
    setValue("description", data.description);
    setOffice(true);
  };

  const addOffice = (data) => {
    const payload = {
      //   id: edit?._id,
      ...(edit ? { id: edit?._id } : {}),
      name: data?.name,
      description: data?.description || 'N/A',
      category: 'Office',
      clinicId: clinic_id,
      showTo: "clinic",
    };
    if (edit) {
      dispatch(updateMastersDataAction({ key: encryptMessage(payload) }));
    } else {
      dispatch(createMastersDataAction({ key: encryptMessage(payload) }));

    }

  };

  const createResponse = store?.createMastersDataReducer?.data?.status;
  const tableGetData = store?.getMastersDataReducer?.data1?.data?.result;
  const updateResponse = store?.updateMastersDataReducer?.data?.status;
  useEffect(() => {
    if (createResponse === 200) {
        setOffice(false);
      reset();
    }
  }, [createResponse]);
  useEffect(() => {
    if (updateResponse === 200) {
        setOffice(false);
      reset();
      setEdit(null);
    }
  }, [updateResponse]);
  useEffect(() => {
    dispatch(getMastersDataAction({ status: status, category: 'Office', limit: 10, skip, search: search }));
    if (createResponse === 200 || updateResponse === 200) {
      dispatch(getMastersDataAction({ status: status, category: 'Office', search: search, limit: 10, skip: skip }));
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
    const payload = { id: data?._id, isActive: !data?.isActive , category:'Office'};
    dispatch(updateMastersDataAction({ key: encryptMessage(payload) }));
  };


  return (
    <Row className='mt-2'>
      <Col xs={12} className='px-0'>
        <Card className="scroll-container" style={{ height: '82vh', overflow: 'scroll' }}>
          <Card.Body >
            <Row className="mb-2 ">
              <Col sm={6}>
                <Button
                  variant={status === true ? 'outlined' : ''}
                  onClick={() => handleStatusChange(true)}
                  className={`active_inactive_buttons ${status === true ? 'text-white' : 'bg-white border-primary text-dark'} me-2`}
                >
                  Active
                </Button>

                <Button
                  variant={status === false ? 'outlined' : ''}
                  onClick={() => handleStatusChange(false)}
                  className={` active_inactive_buttons ${status === false ? 'text-white' : 'bg-white border-primary text-dark'} me-2`}
                >
                  Inactive
                </Button>
              </Col>
              <Col sm={6} className='text-end mt-md-0 mt-2 mt-sm-0'>
                <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                  <Col xs="auto" className='d-flex gap-2'>
                    <div
                      className="input_search_box"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "4px",
                        backgroundColor: "#e8f0fe",
                        padding: "0px 5px",
                      }}
                    >
                      <IoSearchSharp
                        style={{
                          fontSize: "1.2rem",
                          color: "black",
                          marginRight: "10px",
                        }}
                      />
                      <FormInput
                        type="text"
                        onChange={(e) => { setSearch(e.target.value); setSkip(1); }}
                        className=""
                        style={{
                          border: "none",
                          outline: "none",
                          flex: 1,
                          backgroundColor: "#ccc",

                        }}
                      />
                    </div>
                    <Button className="custom-buttons py-0"  ><FiFilter className='fs-5' /></Button>
                    <Button className="custom-buttons py-0"><FiFileText className='fs-5' /></Button>
                    <Button onClick={() => { setOffice(true); setEdit(null) }} className="custom-buttons py-1">
                      New Office
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
                  <th className='text-white py-2' style={{ fontSize: '13px' }}>Office Name</th>
                  <th className='text-white py-2' style={{ fontSize: '13px' }}>Description</th>
                  <th className='text-white py-2' style={{ fontSize: '13px' }}>Created Date</th>
                  <th className='text-white py-2' style={{ fontSize: '13px' }}>Status</th>
                  <th className='text-white py-2' style={{ fontSize: '13px' }}>Action</th>
                </tr>
              </thead>
              <tbody >
                {store?.getMastersDataReducer?.data1?.loading ? (
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
                          className={data.isActive ? "custom-active" : ""}
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

      <Modal centered show={office} onHide={closeAddModal}>
        <Modal.Body>
          <Row className="border-bottom mb-2 pb-2">
            <Col sm={11} className='text-center'><h4>{edit ? 'Edit Office' : 'New Office'}</h4></Col>
            <Col sm={1}><IoMdClose className="fs-4 cursor-pointer" onClick={closeAddModal} /></Col>
          </Row>
          <Form onSubmit={handleSubmit(addOffice)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label> Office Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      validate: {
                        noEmpty: (value) => value.trim() !== "" || "Name cannot be empty or only spaces",
                        noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                      },
                    })}
                    placeholder="Enter Office Name"
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
                      required: "Re-enter office name",
                      validate: {
                        noEmpty: (value) => value.trim() !== "" || "Name cannot be empty or only spaces",
                        noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                        matchName: (value) => value === watch('name') || "Name do not match", // Match with 'name' field value
                      },
                    })}
                    placeholder="Re-enter office Name"
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

export default Office;

