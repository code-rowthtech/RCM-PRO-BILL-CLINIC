import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createMastersDataAction, getDepartmentDataAction, getMastersDataAction } from '../../../redux/settings/action';
import { decryptMessage, encryptMessage } from '../../../cryptoUtils';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';

const Adddepartment = ({ addDepartmentModal, setAddDesiginationModal, setAddDepartmentModal, addDesiginationModal, closeAddModal }) => {
  const store = useSelector((state) => state);

  // const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
  const clinic_id = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const createResponse = store?.createMastersDataReducer?.data?.status;

  const addDepartment = (data) => {
    const payload = {
      name: data?.name,
      description: data?.description || 'N/A',
      category: 'Department',
      clinicId: clinic_id,
      showTo: "clinic",
    };

    dispatch(createMastersDataAction({ key: encryptMessage(payload) }));
  };
  useEffect(() => {
    if (createResponse === 200) {
      setAddDepartmentModal(false);
      reset();
      closeAddModal()
      dispatch(getDepartmentDataAction({ status: true, category: 'Department', limit: 10, skip: 1, search: '' }));

    }
  }, [createResponse]);
  const addDesigination = (data) => {
    const payload = {
      //   id: edit?._id,
      name: data?.name,
      description: data?.desigination,
      category: 'Desigination',
      clinicId: clinic_id,
      showTo: "clinic",
    };

    dispatch(createMastersDataAction({ key: encryptMessage(payload) }));
  };
  useEffect(() => {
    if (createResponse === 200) {
      setAddDesiginationModal(false);
      reset();
      dispatch(getMastersDataAction({ status: true, category: 'Desigination', limit: 10, skip: 1, search: '' }));

    }
  }, [createResponse]);
  return (
    <>

      <Modal centered show={addDepartmentModal} >
        <Modal.Body>
          <Row className="border-bottom mb-2 pb-2">
            <Col sm={11} className='text-center'><h4>New Department</h4></Col>
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
                      if (value.trim() === "") {
                        e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                      }
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Modal.Footer>
              <Button onClick={closeAddModal} type="button" className="cancel-button">Close</Button>
              <Button type="submit" className="custom-buttons">
                {store?.createMastersDataReducer?.loading ? (
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

      <Modal centered show={addDesiginationModal} onHide={closeAddModal}>
        <Modal.Body className='' style={{ border: '1px solid lightgray' }}>
          <Row className="border-bottom mb-2 pb-2">
            <Col sm={11} className='text-center'><h4>New Desigination</h4></Col>
            <Col sm={1}><IoMdClose className="fs-4 cursor-pointer" onClick={closeAddModal} /></Col>
          </Row>
          <Form onSubmit={handleSubmit(addDesigination)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Desigination Name *</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      validate: {
                        noEmpty: (value) => value.trim() !== "" || "Name cannot be empty or only spaces",
                        noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                      }
                    })}
                    placeholder="Enter Desigination Name"
                    onInput={(e) => {
                      const value = e.target.value;
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
                  <Form.Label>Re-Enter Name *</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("reEnterName", {
                      required: "Re-enter desigination name",
                      validate: {
                        noEmpty: (value) => value.trim() !== "" || "Name cannot be empty or only spaces",
                        noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                        matchName: (value) => value === watch('name') || "Name do not match", // Match with 'name' field value
                      },
                    })}
                    placeholder="Re-enter Desigination Name"
                    onInput={(e) => {
                      const value = e.target.value;
                      if (value.trim() === "") {
                        e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                      }
                    }}
                  />
                  {errors.reEnterName && <p className="text-danger">{errors.reEnterName.message}</p>}
                </Form.Group>
              </Col>
            </Row>
            <Modal.Footer>
              <Button onClick={closeAddModal} type="button" className="cancel-button">Close</Button>
              <Button type="submit" className="custom-buttons">
                {store?.createMastersDataReducer?.loading ? (
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
    </>
  )
}

export default Adddepartment
