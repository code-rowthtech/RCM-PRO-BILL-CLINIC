// @flow
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import classNames from 'classnames';
import { FaUserCircle } from 'react-icons/fa';

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
    const profilePic = props.profilePic || null;
    const [dropdownOpen, setDropdownOpen] = useState(false);

    /*
     * toggle profile-dropdown
     */
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const user = JSON.parse(sessionStorage.getItem('hyper_user'));
    const userName = user?.name || '';
    const changedLogo=sessionStorage.getItem('logo');
    // console.log({changedLogo});
    const logo=JSON.parse(sessionStorage.getItem('hyper_user'))?.logo;

    return (
        <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
            <Dropdown.Toggle
                variant="link"
                id="dropdown-profile"
                as={Link}
                to="#"
                onClick={toggleDropdown}
                className="nav-link  border-0 dropdown-toggle nav-user arrow-none me-0">
                <span className="account-user-avatar">
                    {changedLogo?
                     <img src={changedLogo} className="rounded-circle" alt="user" />
                    :
                    logo?
                    <img src={logo} className="rounded-circle" alt="user" />
                    :
                    <FaUserCircle className="rounded-circle fs-1  text-dark" />
                    }
                </span>
                <span className='text-capitalize'>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>{userName}</Tooltip>}
                    >
                        <span className="account-user-name">
                            {userName.substring(0, 8)}{userName.length > 8 ? '...' : ''}
                        </span>
                    </OverlayTrigger>
                    <span className="account-position ">{JSON.parse(sessionStorage.getItem('hyper_user'))?.role}</span>
                </span>
            </Dropdown.Toggle>
            <Dropdown.Menu align={'end'} className="dropdown-menu-animated topbar-dropdown-menu profile-dropdown">
                <div onClick={toggleDropdown}>
                    {/* <div className="dropdown-header noti-title">
                        <h6 className="text-overflow m-0">Welcome !</h6>
                    </div> */}
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
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfileDropdown;
