// @flow
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import logo from '../assets/images/logo.png';

// actions
import { changeSidebarType } from '../redux/actions';

// constants
import * as layoutConstants from '../constants/layout';

// components
import ThemeCustomizer from '../components/ThemeCustomizer/';

// utils
import { changeBodyAttribute } from '../utils';

// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const Topbar = React.lazy(() => import('./Topbar'));
const LeftSidebar = React.lazy(() => import('./LeftSidebar'));
const Footer = React.lazy(() => import('./Footer'));
const RightSidebar = React.lazy(() => import('./RightSidebar'));

const loading = () => <div className=""></div>;

type VerticalLayoutProps = {
    children?: any,
};

type VerticalLayoutState = {
    isMenuOpened?: boolean,
};

const VerticalLayout = ({ children }: VerticalLayoutProps, state: VerticalLayoutState): React$Element<any> => {
    const dispatch = useDispatch();
    const { layoutColor, leftSideBarTheme, leftSideBarType, layoutWidth } = useSelector((state) => ({
        layoutColor: state.Layout.layoutColor,
        layoutWidth: state.Layout.layoutWidth,
        leftSideBarTheme: state.Layout.leftSideBarTheme,
        leftSideBarType: state.Layout.leftSideBarType,
    }));

    const [isMenuOpened, setIsMenuOpened] = useState(false);

    /*
     * layout defaults
     */
    useEffect(() => {
        changeBodyAttribute('data-layout', layoutConstants.LAYOUT_VERTICAL);
    }, []);

    useEffect(() => {
        changeBodyAttribute('data-layout-color', layoutColor);
    }, [layoutColor]);

    useEffect(() => {
        changeBodyAttribute('data-layout-mode', layoutWidth);
    }, [layoutWidth]);

    useEffect(() => {
        changeBodyAttribute('data-leftbar-theme', leftSideBarTheme);
    }, [leftSideBarTheme]);

    useEffect(() => {
        changeBodyAttribute('data-leftbar-compact-mode', leftSideBarType);
    }, [leftSideBarType]);

    /**
     * Open the menu when having mobile screen
     */
    const openMenu = () => {
        setIsMenuOpened((prevState) => {
            setIsMenuOpened(!prevState);
        });

        if (document.body) {
            if (isMenuOpened) {
                document.body.classList.remove('sidebar-enable');
            } else {
                document.body.classList.add('sidebar-enable');
            }
        }
    };

    const updateDimensions = useCallback(() => {
        // activate the condensed sidebar if smaller devices like ipad or tablet
        if (window.innerWidth >= 768 && window.innerWidth <= 1028) {
            dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED));
        } else if (window.innerWidth > 1028) {
            dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_FIXED));
        }
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, [dispatch, updateDimensions]);

    const isCondensed = leftSideBarType === layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED;
    const isLight = leftSideBarTheme === layoutConstants.LEFT_SIDEBAR_THEME_LIGHT;

    return (
        <>
            <div className="wrapper">
                {/* Fixed Navbar */}
                {/* <nav className="navbar navbar-expand-lg navbar-custom-top fixed-top d-none d-md-block py-1">
                    <div className="container-fluid d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center ms-5 ps-1">
                            <span className="logo-lg">
                                <Link to='/'>
                                    <img src={logo} alt="logo" height="18" />
                                </Link>
                            </span>
                        </div>
                        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                            <ul className="navbar-nav text-center fw-bold">
                                <li className="nav-item"><Link className="nav-link text-white" to="#">File</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="#">Tasks</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="/apps/patients/list">Patient</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="#">Billing</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="#">Modules</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="#">Exports</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="#">System Setting</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="#">Utilities</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="#">Help</Link></li>
                            </ul>
                        </div>
                    </div>
                </nav> */}
                <Suspense fallback={loading()}>
                    <LeftSidebar isCondensed={isCondensed} isLight={isLight} hideUserProfile={true} />
                </Suspense>

                {/* Add margin to push content below navbar */}
                <div className="content-page ">
                    <div className="content">
                        <Suspense fallback={loading()}>
                            <Topbar openLeftMenuCallBack={openMenu} hideLogo={true} />
                        </Suspense>
                        <Container fluid className='px-2'>
                            <Outlet />
                        </Container>
                    </div>
                </div>
                {/* <div className="row m-0 p-0 " style={{ overflowX: 'hidden !important', overflowY: 'hidden !important' }}>
                    <div className="col-2 p-0 m-0">
                        <Suspense fallback={loading()}>
                            <LeftSidebar isCondensed={isCondensed} isLight={isLight} hideUserProfile={true} />
                        </Suspense>
                    </div>
                    <div className="col-10 p-0 m-0">
                        <div className="row p-0 m-0">
                            <div className="col-12 p-0 m-0">
                                <Suspense fallback={loading()}>
                                    <Topbar openLeftMenuCallBack={openMenu} hideLogo={true} />
                                </Suspense>
                            </div>
                            <div className="col-12 w-100 p-2 pe-0 mt-4 m-0">
                                <Container fluid className='px-2'>
                                    <Outlet />
                                </Container>
                            </div>
                        </div>
                    </div>
                </div> */}

            </div>

            <Suspense fallback={loading()}>
                <RightSidebar>
                    <ThemeCustomizer />
                </RightSidebar>
            </Suspense>
        </>
    );
};
export default VerticalLayout;
