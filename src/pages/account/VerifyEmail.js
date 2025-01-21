import React, { useEffect, useState } from 'react';
import AccountLayout from './AccountLayout';
import { useTranslation } from 'react-i18next';
import { Button, Col, Row } from 'react-bootstrap';
import { FormInput, VerticalForm } from '../../components';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmailAction } from '../../redux/actions';
import { MdVerified } from 'react-icons/md';
import Spinner from '../../constants/Spinner';
import { decryptMessage } from '../../cryptoUtils';

const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    {t('Back to')}{' '}
                    <Link to={'/account/login'} className="text-muted ms-1">
                        <b>{t('Log In')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const VerifyEmail = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [token, setToken] = useState(null);
    const [verified, setVerified] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const store = useSelector((state) => state);
    const loading = store?.Auth?.loading;

    useEffect(() => {
        const url = window.location.href;
        const tokenFromUrl = url.split('/').pop();
        setToken(tokenFromUrl);
        dispatch(verifyEmailAction({ token: tokenFromUrl }));
    }, [dispatch]);

    useEffect(() => {
        if (store?.Auth?.verifyEmailSuccess?.status === 200) {
            setVerified(true);
        }
    }, [store?.Auth?.verifyEmailSuccess?.status]);

    useEffect(() => {
        if (verified) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        navigate('/account/login');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer); // Cleanup timer on component unmount
        }
    }, [verified, navigate]);

    return (
        <div>
            <AccountLayout bottomLinks={<BottomLink />}>
                <div className="text-center m-auto">
                    <p className="text-muted mb-4">
                        {verified
                            ? 'Redirecting you to login in a few seconds.'
                            : 'Please wait while we are verifying your email address.'}
                    </p>
                </div>

                <VerticalForm>
                    <div className="d-flex justify-content-center">
                        {loading && <Spinner />}
                        {verified && (
                            <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
                                <MdVerified className="text-success fs-1" />
                                <p className="mt-3">Your email has been verified successfully.</p>
                                <p>Redirecting you to login in {countdown}...</p>
                            </div>
                        )}
                    </div>
                </VerticalForm>
            </AccountLayout>
        </div>
    );
};

export default VerifyEmail;
