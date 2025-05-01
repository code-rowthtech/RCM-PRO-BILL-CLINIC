import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Accordion } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { createMedicationAction, getDrugsAction } from '../../../../redux/actions';
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
  const { register, handleSubmit, setValue } = useForm();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('id');
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const drugsData = store?.getDrugsReducer?.data?.ndcProducts || [];
  const problemList = store?.getProblemListReducer?.data?.problems;
  console.log(problemList, 'problemList')
  const [selectedDrug, setSelectedDrug] = useState(null);
  console.log(selectedDrug, 'selectedDrugselectedDrug')
  const [showDropdown, setShowDropdown] = useState(false);
  const [additionalInstruction, setAdditionalInstruction] = useState();

  const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
  // Debounced search (memoized)
  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        dispatch(getDrugsAction({ skip: 1, search: searchValue }));
      }, 500),
    [dispatch]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setShowDropdown(true);
    setSelectedDrug(null);
    setValue('drugInfo', value);
    debouncedSearch(value);
  };

  const handleSelectDrug = (item) => {
    setSelectedDrug(item);
    console.log(item?.proprietaryName, 'item?.proprietaryName')
    setValue('drugInfo', item?.proprietaryName + ' (' + item?.nonProprietaryName + ')');
    setShowDropdown(false);
  };

  console.log(selectedDrug, 'selectedDrug')
  const onSubmit = (data) => {
    console.log(data, 'data')
    const medicationData = {
      status: data.status,
      note: [
        {
          text: data.notes, time: new Date().toISOString()
        }
      ],
      dosageInstruction: {
        sequence: data?.sequence,
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
      drugId: selectedDrug?._id,
      startDate: data?.medicationStart,
      endDate: data?.medicationEnd,
      problemId: data?.relatedProblem,
      subject: patientId
    };
    dispatch(createMedicationAction({ key: encryptMessage(medicationData) }))
    console.log(medicationData, 'medicationData')
  };

  const additionalInstructionOptions = additionalInformation?.map((item) => ({
    value: item?.code,
    data: item,
    label: item.display,
  }));

  const additionalInstructionChange = (selectedOptions) => {
    setAdditionalInstruction(selectedOptions?.data);
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
    <Modal show={show} onHide={onCancel} size="md" centered>
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
                  <option value="h">Hour(s)</option>
                  <option value="d">Day(s)</option>
                  <option value="wk">Week(s)</option>
                  <option value="mo">Month(s)</option>
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
                  value={additionalInstruction?.value}
                  onChange={additionalInstructionChange}
                />
              </Form.Group>
            </Col>


            <Col sm={6}>
              <Form.Group>
                <Form.Label className="mb-0">Related Problem</Form.Label>
                <Form.Select {...register('relatedProblem')} disabled={selectedMedication}>
                  <option value="">Select status</option>
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
            <Button variant="secondary" onClick={onCancel} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {selectedMedication ? 'Update' : "Save"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal >
  );
}
