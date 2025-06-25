// @flow
import React, { useEffect } from 'react';
import { Button, Alert, Row, Col, Form } from 'react-bootstrap';
import { Link, Navigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
//actions
import { resetAuth, loginUser } from '../../redux/actions';
// components
import { VerticalForm, FormInput } from '../../components/';
import AccountLayout from './AccountLayout';
import { decryptMessage, encryptMessage } from '../../cryptoUtils';
import Loader from '../../components/Loader';
import Spinner from '../../constants/Spinner';
import ToastHandle from '../../helpers/ToastMessage';
import { handleFirstSpace } from '../../helpers/noSpace';

/* bottom link of account pages */
// const BottomLink = () => {
//     const { t } = useTranslation();
//     return (
//         <Row className="mt-3">
//         </Row>
//     );
// };

const Login = (): React$Element<any> => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const redirectUrl = location.state && location.state.from ? '/apps/patients/list' : '/apps/patients/list';

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    const { loading, userLoggedIn, user, error } = useSelector((state) => ({
        loading: state.Auth.loading,
        user: state.Auth.user,
        error: state.Auth.error,
        userLoggedIn: state.Auth.userLoggedIn,
    }));
    /*
    form validation schema
    */

    const schemaResolver = yupResolver(
        yup.object().shape({
            username: yup.string().required(t('Please enter email')).email(t('Please enter a valid email')), // Email format validation

            password: yup
                .string()
                .required(t('Password is required'))
                .min(8, t('Password must be at least 8 characters'))
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                    t(
                        'At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character.'
                    )
                ),
        })
    );

    /*
    handle form submission
    */
    const onSubmit = (formData) => {
        dispatch(loginUser({ email: formData.username, password: formData.password }));
    };

    return (
        <>
            {(userLoggedIn || user) && <Navigate to={redirectUrl} replace />}
            <AccountLayout>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Sign In')}</h4>
                    <p className="text-muted mb-4">
                        {t('Enter your email address and password to access Practice panel.')}
                    </p>
                </div>

                {/* {error && (
                    <Alert variant="danger" className="my-2">
                        {error ? 'Please try again' : ''}
                    </Alert>
                )} */}

                <VerticalForm
                    onSubmit={onSubmit}
                    resolver={schemaResolver}
                // defaultValues={{ username: 'test', password: 'test' }}
                >
                    <FormInput
                        label={t('Email')}
                        type="email"
                        name="username"
                        placeholder={t('Enter your Email')}
                        containerClass={'mb-3'}
                    // onChange={(e) => {
                    //     e.target.value = e.target.value.replace(/\s+/g, ''); // Remove spaces
                    // }}
                    // onKeyPress={(e) => {
                    //     if (e.key === ' ') {
                    //         e.preventDefault(); // Prevent space keypress
                    //     }
                    // }}
                    />

                    <FormInput
                        label={t('Password')}
                        type="password"
                        name="password"
                        className=''
                        onCopy={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        placeholder={t('Enter your password')}
                        containerClass={'mb-3'}>
                        <Link to="/account/forget-password" className="text-muted float-end">
                            <small>{t('Forgot your password?')}</small>
                        </Link>
                    </FormInput>

                    <div className="mb-3 mb-0 d-flex justify-content-center">
                        <Button
                            className="custom-buttons w-100 d-flex algin-items-center justify-content-center"
                            type="submit"
                            disabled={loading}>
                            {loading ? <Spinner color="white" className="spinner-border-sm " /> : `${t('Log In')}`}
                        </Button>
                    </div>
                </VerticalForm>
            </AccountLayout>
        </>
    );
};

export default Login;
