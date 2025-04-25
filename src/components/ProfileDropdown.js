// @flow
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Dropdown, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import classNames from 'classnames';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { changeEmailAction } from '../redux/clinics/actions';
import { IoMdClose } from 'react-icons/io';
import { useForm } from 'react-hook-form';

type ProfileMenuItem = {
    label: string,
    icon: string,
    redirectTo: string,
};

type ProfileDropdownProps = {
    menuItems: Array<ProfileMenuItem>,
    profilePic?: any,
    username: string,
    userTitle?: string,
};

type ProfileDropdownState = {
    dropdownOpen?: boolean,
};

const ProfileDropdown = (props: ProfileDropdownProps, state: ProfileDropdownState): React$Element<any> => {
    console.log(props, 'propspropsprops')
    const {
        handleSubmit,
        // formState: { errors },
    } = useForm();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const [otp, setOtp] = useState(Array(6).fill(""));
    const store = useSelector((state) => state);
    const changeEmailApiResponse = store?.changeEmailReducer?.data?.status
    const closeModal = () => {
        setShow(false);
    }
    useEffect(() => {
        if (changeEmailApiResponse === 200) {
            setShow(true);
        }
    }, [changeEmailApiResponse])
    /*
     * toggle profile-dropdown
     */
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const user = JSON.parse(sessionStorage.getItem('hyper_user'));
    const userName = user?.name || '';
    const changedLogo = sessionStorage.getItem('logo');
    const logo = JSON.parse(sessionStorage.getItem('hyper_user'))?.logo;
    console.log(logo, 'logologologologo')
    const handleOtpGeneration = () => {
        dispatch(changeEmailAction())
    }

    // Handle input changes
    const handleChange = (value, index) => {
        if (!/^[0-9]$/.test(value) && value !== "") return; // Allow only digits
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Automatically focus next field
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    // Handle key navigation (e.g., Backspace)
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };
    const onSubmit = () => {
    }
    return (
        <Dropdown show={dropdownOpen} onToggle={toggleDropdown} drop="down" align="end">
            <Dropdown.Toggle
                variant="link"
                id="dropdown-profile"
                as={Link}
                to="#"
                onClick={toggleDropdown}
                className="nav-link  border-0 dropdown-toggle  nav-user arrow-none me-0">
                <span className="account-user-avatar pb-2">
                    {
                        logo ?
                            <img src={logo} className="rounded-circle object-fit-cover" alt="user" />
                            :
                            <FaUserCircle className="rounded-circle fs-1  text-dark" />
                    }
                </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-animated topbar-dropdown-menu profile-dropdown">
                <div onClick={toggleDropdown}>
                    <p className='mb-0 ps-3 text-start fw-bold'>Practice</p>
                    <hr className='my-0' />
                    {props.menuItems.map((item, i) => {
                        return (
                            <Link to={item.redirectTo} className="dropdown-item notify-item" key={i + '-profile-menu'}>
                                <i className={classNames(item.icon, 'me-1')}></i>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                    <Link to='#' onClick={handleOtpGeneration} className="dropdown-item notify-item" >
                        <i className='mdi mdi-email-edit cursor-pointer me-1'></i>
                        <span>Change Email</span>
                    </Link>
                </div>
            </Dropdown.Menu>
            <Modal centered show={show} onHide={closeModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Email to Doctor</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                        </Col>
                    </Row>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="mb-3">
                            <Col sm={12} className="my-2">
                                <div className="text-center">
                                    <p className="mb-2">
                                        To confirm your new email address, please enter the One-Time Password (OTP) sent to your current email address. This step helps us verify your identity and secure your account.
                                    </p>
                                </div>
                            </Col>
                            <Col md={12} className="d-flex justify-content-center align-items-center px-4 otp-input-group">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="otp-input w-25 mx-1 p-1 rounded-2 text-center"
                                        aria-label={`OTP Digit ${index + 1}`}
                                        placeholder="•"
                                    />
                                ))}
                            </Col>
                        </Row>
                        <Modal.Footer className="d-flex justify-content-center">
                            <Button type="submit" className="custom-button">
                                Verify
                            </Button>
                        </Modal.Footer>
                    </form>

                </Modal.Body>
            </Modal >
        </Dropdown >
    );
};

export default ProfileDropdown;
