import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Accordion } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { createMedicationAction, getDrugsAction, getMedicationAction, updateMedicationAction } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, set } from 'lodash';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { medicationStatus } from '../../../../utils/DataSets/commonData2';
import { additionalInformation } from '../../../../utils/DataSets/Medication/medicationData';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { encryptMessage } from '../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';

export default function AddMedication({ show, onCancel, selectedMedication }) {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('id');
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const drugsData = store?.getDrugsReducer?.data?.ndcProducts || [];
  const problemList = store?.getProblemListReducer?.data?.problems;
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [additionalInstruction, setAdditionalInstruction] = useState();
  const createSuccess = store?.createMedicationReducer?.data?.status;
  const updateSuccess = store?.updateMedicationReducer?.data?.status;
  useEffect(() => {
    if (createSuccess === 201) {
      onCancel();
      reset();
      dispatch(getMedicationAction({ patientId: patientId }))
    }
  }, [createSuccess]);
  useEffect(() => {
    if (updateSuccess === 200) {
      onCancel();
      reset();
      dispatch(getMedicationAction({ patientId: patientId }))
    }
  }, [updateSuccess]);

  const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
  // Debounced search (memoized)
  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        dispatch(getDrugsAction({ skip: 1, search: searchValue }));
      }, 100),
    [dispatch]
  );

  useEffect(() => {
    if (selectedMedication) {
      setValue('drugInfo', selectedMedication?.drugId?.proprietaryName + ' (' + selectedMedication?.drugId?.nonProprietaryName + ')');
      setValue('frequency', selectedMedication?.dosageInstruction?.[0]?.timing?.repeat?.frequency);
      setValue('period', selectedMedication?.dosageInstruction?.[0]?.timing?.repeat?.period);
      setValue('periodUnit', selectedMedication?.dosageInstruction?.[0]?.timing?.repeat?.periodUnit);
      setValue('sequence', selectedMedication?.dosageInstruction?.[0]?.sequence);
      setValue('relatedProblem', selectedMedication?.problemId);
      setValue('status', selectedMedication?.status);
      setValue('notes', selectedMedication?.note?.[0]?.text);
      const updatedAdditionalInstruction = selectedMedication?.dosageInstruction?.[0]?.additionalInstruction?.[0]?.coding?.[0];
      setAdditionalInstruction(updatedAdditionalInstruction);
      setValue(
        'medicationStart',
        selectedMedication?.startDate
          ? new Date(selectedMedication.startDate).toISOString().split('T')[0]
          : ''
      );
      setValue(
        'medicationEnd',
        selectedMedication?.endDate
          ? new Date(selectedMedication.endDate).toISOString().split('T')[0]
          : ''
      );

    }
  }, [selectedMedication])
  const handleInputChange = (e) => {
    const value = e.target.value;
    setShowDropdown(true);
    setSelectedDrug(null);
    setValue('drugInfo', value);
    debouncedSearch(value);
  };

  const handleSelectDrug = (item) => {
    setSelectedDrug(item);
    setValue('drugInfo', item?.proprietaryName + ' (' + item?.nonProprietaryName + ')');
    setShowDropdown(false);
  };

  const onSubmit = (data) => {
    const medicationData = {
      status: data.status,
      note: [
        {
          text: data.notes, time: new Date().toISOString()
        }
      ],
      dosageInstruction: {
        sequence: parseInt(data?.sequence),
        text: additionalInstruction?.display,
        additionalInstruction: [
          {
            coding: [
              additionalInstruction
            ],
            text: additionalInstruction?.display
          }
        ],
        patientInstruction: additionalInstruction?.display,
        timing: {
          repeat: {
            frequency: Number(data.frequency),
            period: Number(data.period),
            periodUnit: data.periodUnit
          },
          code: {
            text: `${data.frequency} times every ${data.period} ${data.periodUnit}`
          }
        },
      },
      ...(!selectedMedication&&{drugId: selectedDrug?._id}),
      ...(!selectedMedication&&{startDate: data?.medicationStart}),
      ...(!selectedMedication&&{problemId: data?.relatedProblem}),
      endDate: data?.medicationEnd,
      subject: patientId
    };

    if(selectedMedication){
dispatch(updateMedicationAction({ key: encryptMessage(medicationData), medicationId: selectedMedication?._id }))
}else{
      dispatch(createMedicationAction({ key: encryptMessage(medicationData) }))
    }
  };

  const additionalInstructionOptions = additionalInformation?.map((item) => ({
    value: item,
    label: item.display,
  }));
  
  const selectedInstruction =
  additionalInstructionOptions.find((option) => option?.value?.code === additionalInstruction?.[0]?.code) ||
  additionalInstructionOptions.find((option) => option?.value?.display === additionalInstruction);

  const additionalInstructionChange = (selectedOptions) => {
    setAdditionalInstruction(selectedOptions?.value);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <Modal show={show} onHide={() => {
      onCancel();
      reset();
    }} size="md" centered>
      <Modal.Header closeButton className="px-2 py-0">
        <Modal.Title className="mb-0">{selectedMedication ? "Update" : 'Add'} Medication</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col sm={12}>
              <Form.Group className="position-relative" ref={dropdownRef}>
                <Form.Label className="mb-0">Drug</Form.Label>
                <Form.Control
                  type="text"
                  {...register('drugInfo')}
                  onChange={handleInputChange}
                  onFocus={() => drugsData.length > 0 && setShowDropdown(true)}
                  placeholder="Enter drug name"
                  autoComplete="off"
                  disabled={selectedMedication}
                />
                {drugsData.length > 0 && showDropdown && (
                  <div
                    className="bg-white border position-absolute w-100 shadow-sm list-group"
                    style={{
                      maxHeight: '20vh',
                      overflowY: 'auto',
                      zIndex: 1050,
                    }}
                  >
                    {drugsData.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleSelectDrug(item)}
                        className="list-group-item list-group-item-action py-1 px-2"
                        style={{ cursor: 'pointer' }}
                      >
                        <strong>{item.proprietaryName}</strong> ({item.nonProprietaryName})<br />
                        <small className="text-muted">
                          {item.activeNumeratorStrength} {item.activeIngredientUnit} — {item.dosageFormName}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group>
                <Form.Label className="mb-0">Frequency</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 2"
                  {...register('frequency')}
                />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group>
                <Form.Label className="mb-0">Period</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 1"
                  {...register('period')}
                />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group>
                <Form.Label className="mb-0">Period Unit</Form.Label>
                <Form.Select {...register('periodUnit')}>
                  <option value="">Select unit</option>
                  <option value="hours">Hour(s)</option>
                  <option value="days">Day(s)</option>
                  <option value="weeks">Week(s)</option>
                  <option value="months">Month(s)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="mb-0">Dosage Sequence</Form.Label>
                <Form.Control type='number' {...register('sequence')} placeholder='Enter dosage sequence' />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="mb-0">Additional Instructions</Form.Label>
                <Select
                  options={additionalInstructionOptions} // Use the formatted array
                  isSearchable
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="&nbsp; Select"
                  value={selectedInstruction}
                  onChange={additionalInstructionChange}
                />
              </Form.Group>
            </Col>


            <Col sm={6}>
              <Form.Group>
                <Form.Label className="mb-0">Related Problem</Form.Label>
                <Form.Select {...register('relatedProblem')} disabled={selectedMedication}>
                  <option value="">Select Related Problem</option>
                  {problemList?.map((option) => (
                    <option key={option?._id} value={option?._id}>
                      {option?.code?.text}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="mb-0">Status</Form.Label>
                <Form.Select {...register('status')} disabled={selectedMedication}>
                  <option value="">Select status</option>
                  {medicationStatus.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className='mb-0'>Start Date</Form.Label>
                <Form.Control type='date' {...register('medicationStart')} disabled={selectedMedication} />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className='mb-0'>End Date</Form.Label>
                <Form.Control type='date' {...register('medicationEnd')} />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className='mb-0'>Notes</Form.Label>
                <Form.Control as={'textarea'} {...register('notes')} />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-3">
            <Button onClick={() => {
              onCancel();
              reset();
            }} className="me-2 custom-buttons">
              Cancel
            </Button>
            <Button disabled={store?.createMedicationReducer?.loading||store?.updateMedicationReducer?.loading} type="submit" className='custom-buttons'>
              {selectedMedication ? 'Update' : "Save"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal >
  );
}
