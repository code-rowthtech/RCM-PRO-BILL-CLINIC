// @flow
import React, { useEffect, useRef, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import ToastHandle from '../../helpers/ToastMessage';
//actions
import { resetAuth, forgotPasswordChange, verifyToken, setPassword, loginUser } from '../../redux/actions';

// components
import { VerticalForm, FormInput } from '../../components/';
import AccountLayout from './AccountLayout';
import { decryptMessage, encryptMessage } from '../../cryptoUtils';
import { handleFirstSpace } from '../../helpers/noSpace';

/* bottom link */
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

const SetPassword = (): React$Element<any> => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [token, setToken] = useState('');
    const location = useLocation()
    useEffect(() => {
        // Get the current URL
        const url = window.location.href;
        const tokenFromUrl = url.split('/').pop();
        setToken(tokenFromUrl);
        const payload = {
            token: tokenFromUrl
        }
        dispatch(verifyToken(payload));
    }, []);

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    const store = useSelector((state) => state);
    const redirectUrl = location.state && location.state.from ? location.state.from.pathname : '/apps/crm/addclinic';

    const { loading, passwordChange, changePasswordSuccess, changeSetPassword, user, userLoggedIn } = useSelector((state) => ({
        loading: state.Auth.loading,
        passwordChange: state.Auth.passwordChange,
        changePasswordSuccess: state.Auth.changePasswordSuccess,
        changeSetPassword: state.Auth.changeSetPassword,
        userLoggedIn: state.Auth.userLoggedIn,
        user: state.Auth.user,
    }));
    const tokenResponse = store?.Auth?.verifyTokenSuccess?.data;
    if (tokenResponse) {
        var verifyResponse = JSON.parse(decryptMessage(tokenResponse))
    }
    const schemaResolver = yupResolver(
        yup.object().shape({
            password: yup
                .string()
                .required(t('Password is required.'))
                .min(8, t('Password must be at least 8 characters long.'))
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                    t('At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character.')
                ),
            confirmPassword: yup
                .string()
                .oneOf([yup.ref('password'), null], t('Passwords must match'))
                .required(t('Password is required.')),
        })
    );


    const [loginPassword, setLoginPassword] = useState(null)
    const onSubmit = (formData) => {
        setLoginPassword(formData.password)
        dispatch(setPassword({ token, newPassword: formData.password }));
    };

    const navigate = useNavigate();
    const hasDispatched = useRef(false);

    useEffect(() => {
        if (changeSetPassword && !hasDispatched.current) {
            ToastHandle('Password generated successfully', 'success');
            dispatch(loginUser({ email: verifyResponse?.data?.email, password: loginPassword }));
            hasDispatched.current = true;
        }

        if (verifyResponse?.status !== 200 && verifyResponse) {
            ToastHandle('The token is not valid, please request new token.', 'danger')
            navigate('/account/login');
        }
    }, [changeSetPassword, navigate, verifyResponse, loginPassword]);
    return (
        <>
            {(userLoggedIn || user) && <Navigate to={redirectUrl} replace />}
            <AccountLayout bottomLinks={<BottomLink />}>
                <div className="text-center m-auto">
                    <h4 className="text-dark-50 text-center mt-0 font-weight-bold">{t('Set Password')}</h4>
                    <p className="text-muted mb-4">
                        Hey enter your new password, and we'll update your password and log you in.
                    </p>
                </div>

                {!passwordChange && (
                    <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                        <FormInput
                            label={t('Email')}
                            type="email"
                            name="email"
                            value={verifyResponse?.data?.email || ''}
                            disabled
                            placeholder={t('Your Email')}
                            containerClass={'mb-3'}

                        />

                        <FormInput
                            label='New Password'
                            type="password"
                            name="password"
                            placeholder={t('Enter your Password')}
                            containerClass={'mb-3'}
                        />
                        <FormInput
                            label='Confirm Password'
                            type="password"
                            name="confirmPassword"
                            placeholder={t('Confirm your Password')}
                            containerClass={'mb-3'}
                        />
                        <div className="mb-3 mb-0 text-center">
                            <Button variant="primary" className='custom-buttons' type="submit" disabled={loading}>
                                {t('Submit')}
                            </Button>
                        </div>
                    </VerticalForm>
                )}
            </AccountLayout>
        </>
    );
};

export default SetPassword;
