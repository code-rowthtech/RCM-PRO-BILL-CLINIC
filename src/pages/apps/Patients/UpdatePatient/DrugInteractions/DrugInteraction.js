// import React from 'react'
// import { Button, Col, Form, Row, Table } from 'react-bootstrap'
// import DatePicker from 'react-datepicker'

// const DrugInteractionReport = [
//     {
//         providerName: 'Dr. Alice Green',
//         patientName: 'John Smith',
//         interaction: 'Ibuprofen + Lisinopril',
//         severity: 'Moderate',
//         alert: 'Possible renal risk',
//         response: 'Acknowledged',
//         date: '2025-06-11'
//     },
//     {
//         providerName: 'Dr. Mark Lee',
//         patientName: 'Emily Davis',
//         interaction: 'Warfarin + Aspirin',
//         severity: 'High',
//         alert: 'Increased bleeding risk',
//         response: 'Alternative prescribed',
//         date: '2025-06-10'
//     },
//     {
//         providerName: 'Dr. Sarah Patel',
//         patientName: 'Michael Johnson',
//         interaction: 'Metformin + Contrast Dye',
//         severity: 'Severe',
//         alert: 'Risk of lactic acidosis',
//         response: 'Procedure delayed',
//         date: '2025-06-09'
//     }
// ]

// const DrugInteraction = () => {
//     return (
//         <div>
//             <Row>
//                 <Col sm={2}>
//                     <h5 className='mb-0'>Drug Interactions</h5>
//                 </Col>
//                 <Col sm={10} className='d-flex justify-content-end gap-2'>
//                     <div>
//                         <DatePicker
//                             selectsRange
//                             isClearable
//                             placeholderText="Select a date range"
//                             className="border-0"
//                             style={{ width: '14rem!important' }}
//                         />
//                     </div>
//                     <div>
//                         <Form.Select aria-label="Filter Options" style={{ width: '10vw' }}>
//                             <option hidden>All Providers</option>
//                             <option value="Provider 1">Provider 1</option>
//                             <option value="Provider 2">Provider 2</option>
//                             <option value="Provider 3">Provider 3</option>
//                         </Form.Select>
//                     </div>
//                     <div>
//                         <Form.Select aria-label="Sort Order" style={{ width: '10vw' }}>
//                             <option hidden>Alert Level</option>
//                             <option value="All Levels">All Levels</option>
//                             <option value="Very Mild">Very Mild</option>
//                             <option value="Mild">Mild</option>
//                             <option value="Moderate">Moderate</option>
//                             <option value="Severe">Severe</option>
//                         </Form.Select>
//                     </div>
//                     <div>
//                         <Button className="custom-buttons d-none d-md-block">
//                             Run Report
//                         </Button>
//                     </div>
//                 </Col>
//             </Row>
//             <div className='mt-2'>
//                 <Table responsive className="table-centered table-nowrap mb-0">
//                     <thead className="text-white bg-dark">
//                         <tr>
//                             <th className="text-white">PROVIDER NAME</th>
//                             <th className="text-white">PATIENT NAME</th>
//                             <th className="text-white">INTERACTION</th>
//                             <th className="text-white">SEVERITY</th>
//                             <th className="text-white">ALERT</th>
//                             <th className="text-white">RESPONSE</th>
//                             <th className="text-white">DATE</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {DrugInteractionReport?.map((data, index) => (
//                             <tr key={index}>
//                                 <td className="text-capitalize">{data.providerName}</td>
//                                 <td className="text-capitalize">{data.patientName}</td>
//                                 <td className="text-capitalize">{data.interaction}</td>
//                                 <td className="text-capitalize">{data.severity}</td>
//                                 <td className="text-capitalize">{data.alert}</td>
//                                 <td className="text-capitalize">{data.response}</td>
//                                 <td className="text-capitalize">{data.date}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             </div>
//         </div>
//     )
// }

// export default DrugInteraction
import React from 'react'

const DrugInteraction = () => {
  return (
    <div>
      In Progress...
    </div>
  )
}

export default DrugInteraction

