import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import Spinner from '../../../constants/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput } from '../../../components';
import ToastHandle from '../../../helpers/ToastMessage';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientsAction, updatePatientsAction } from '../../../redux/patients/actions';
import Paginations from '../../../helpers/Paginations';
import { IoSearchSharp } from 'react-icons/io5';
import dummyProfile from '../../../assets/images/dummyProfile.png';
import { IoMdClose } from 'react-icons/io';
import { decryptMessage } from '../../../cryptoUtils';
import { formatDateByUserTimeZone } from '../../../components/timeZonePipe';
const Patients = () => {
    const navigate = useNavigate('');
    const [smShow, setSmShow] = useState(false);
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1);
    const [status, setStatus] = useState(true);

    const dispatch = useDispatch();
    // const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const clinicId = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';

    const store = useSelector((state) => state);
    const patientsData = store?.getPatientsReducer?.data?.data;
    useEffect(() => {
        const payload = { search: search, page: skip, limit: 10, clinicId: clinicId };
        dispatch(getPatientsAction(payload));
    }, [dispatch, skip, search]);

    const handleNewPatients = () => {
        navigate('/apps/patients/new-patient');
    };

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    return (
        <>
            <Row className="mt-2">
                <Col xs={12} className="px-0">
                    <Card className='page-height scroll-container'>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col style={{ cursor: 'not-allowed' }} title={'In-progress'} sm={6} xs={6}>
                                    <Button
                                        onClick={() => setStatus(true)}
                                        disabled
                                        className={`me-md-2 active_inactive_buttons ${status ? ' text-white py-' : 'bg-white border-primary text-dark py-'
                                            }`}>
                                        {`Active`}
                                    </Button>
                                    <Button
                                        onClick={() => setStatus(false)}
                                        disabled
                                        className={`me-md-2 ms-sm-1 active_inactive_buttons text-nowrap ${!status ? ' text-white py-' : 'bg-white border-primary text-dark py-'
                                            }`}>
                                        {`Inactive`}
                                    </Button>
                                </Col>
                                <Col sm={6} className="text-end">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className="d-flex gap-2">
                                            <div
                                                className="input_search_box position-relative"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#e8f0fe',
                                                    padding: '0px 5px',
                                                    minWidth: 180,
                                                }}>
                                                <FormInput
                                                    type="text"
                                                    value={search}
                                                    placeholder="Search..."
                                                    onChange={(e) => {
                                                        const currentValue = e.target.value;
                                                        setSearch(currentValue);
                                                        dispatch(
                                                            getPatientsAction({
                                                                search: currentValue,
                                                                page: 1,
                                                                limit: 10,
                                                                clinicId: clinicId,
                                                            })
                                                        );
                                                    }}
                                                    className="pe-4"
                                                    style={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        flex: 1,
                                                        backgroundColor: '#ccc',
                                                        paddingRight: 30,
                                                    }}
                                                />
                                                {search ? (
                                                    <IoMdClose
                                                        style={{
                                                            fontSize: '1.2rem',
                                                            color: 'lightgray',
                                                            position: 'absolute',
                                                            right: 10,
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                            setSearch('');
                                                            dispatch(
                                                                getPatientsAction({
                                                                    search: '',
                                                                    page: 1,
                                                                    limit: 10,
                                                                    clinicId: clinicId,
                                                                })
                                                            );
                                                        }}
                                                    />
                                                ) : (
                                                    <IoSearchSharp
                                                        style={{
                                                            fontSize: '1.2rem',
                                                            color: 'lightgray',
                                                            position: 'absolute',
                                                            right: 10,
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <Button onClick={handleNewPatients} className="custom-buttons py-1">
                                                New Patient
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <Table
                                        responsive
                                        className="table-centered table-nowrap mb-0  rounded"
                                        style={{ height: patientsData?.length === 0 ? '100vh' : 'auto' }}>
                                        <thead className="text-white">
                                            <tr>
                                                {["Patient", "Demographics", "Contact", "Address", "Action"]?.map((header, index) => (
                                                    <th key={index}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getPatientsReducer?.loading ? (
                                                <tr>
                                                    <td colSpan={9} className="text-center">
                                                        <Spinner />
                                                    </td>
                                                </tr>
                                            ) : patientsData && patientsData?.length === 0 ? (
                                                <tr>
                                                    <td colSpan={9} className="text-center">
                                                        <h3 className="my-5">No Data Found</h3>
                                                    </td>
                                                </tr>
                                            ) : (
                                                patientsData &&
                                                patientsData?.map((data, index) => (
                                                    <tr
                                                        onClick={() =>
                                                            navigate(`/apps/patients/update-patient?id=${data?._id}`)
                                                        }
                                                        key={data?._id}>
                                                        <td className="text-capitalize cursor-pointer">
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    height={35}
                                                                    width={35}
                                                                    className="rounded-circle me-2 object-fit-cover"
                                                                    src={data?.photo?.[0]?.url || dummyProfile}
                                                                    alt=""
                                                                />
                                                                <div>
                                                                    {(data?.name?.[0]?.prefix?.[0]
                                                                        ? data?.name?.[0]?.prefix?.[0] + ' '
                                                                        : '') +
                                                                        (data?.name?.[0]?.family || '') +
                                                                        (data?.name?.[0]?.given?.length > 0
                                                                            ? ' ' + data?.name?.[0]?.given?.join(' ')
                                                                            : '') || 'N/A'}
                                                                    <div className="text-info fw-bold fs-6">
                                                                        <span className="text-dark">MRN: </span>
                                                                        {data?.chartNumber}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className='cursor-pointer'>
                                                            <div className="text-capitalize">
                                                                {data?.gender || 'N/A'}
                                                                <div
                                                                    className={`${data?.birthDate
                                                                        ? ''
                                                                        : 'text-danger fs-6 fw-semibold'
                                                                        }`}>
                                                                    {data?.birthDate
                                                                        ? formatDateByUserTimeZone(data?.birthDate, {}, 'date')
                                                                        : 'Missing'}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className='cursor-pointer'>
                                                            <div>
                                                                {'+1-' +
                                                                    (data?.telecom?.find(
                                                                        (item) =>
                                                                            item?.system === 'phone' &&
                                                                            item?.use === 'home'
                                                                    )?.value || 'N/A')}
                                                                <div
                                                                    className={`${data?.telecom?.find(
                                                                        (item) => item?.system === 'email'
                                                                    )?.value
                                                                        ? ''
                                                                        : 'text-danger'
                                                                        }`}>
                                                                    {data?.telecom?.find(
                                                                        (item) => item?.system === 'email'
                                                                    )?.value || 'Email (Missing)'}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className='cursor-pointer'
                                                            data-toggle="tooltip"
                                                            data-placement="left"
                                                            title={data?.address?.[0]?.line?.[0]}>
                                                            {data?.address?.[0]?.line?.[0]?.length > 30
                                                                ? data?.address?.[0]?.line?.[0]?.slice(0, 29) + '...'
                                                                : data?.address?.[0]?.line?.[0] || (
                                                                    <span className="text-danger fw-semibold fs-6">
                                                                        Missing
                                                                    </span>
                                                                )}

                                                            <div className="fw-semibold fs-6">
                                                                {[data?.address?.[0]?.city, data?.address?.[0]?.state]
                                                                    .filter(Boolean)
                                                                    .join(' | ')}

                                                                {data?.address?.[0]?.postalCode &&
                                                                    ` (${data?.address?.[0]?.postalCode})`}
                                                                {!data?.address?.[0]?.city &&
                                                                    !data?.address?.[0]?.state &&
                                                                    !data?.address?.[0]?.postalCode && (
                                                                        <span className="text-danger">Missing</span>
                                                                    )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Link
                                                                to={`/apps/patients/update-patient?id=${data?._id}`}
                                                                className="action-icon">
                                                                <i className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-secondary"></i>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="text-end border-0 py-0">
                            <Paginations
                                currentPage={skip}
                                totalPages={store?.getPatientsReducer?.data?.pagination?.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Patients;
