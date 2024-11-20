// @flow
import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import ToastHandle from '../../helpers/ToastMessage';
//actions
import { resetAuth, forgotPasswordChange, verifyToken } from '../../redux/actions';

// components
import { VerticalForm, FormInput } from '../../components/';
import AccountLayout from './AccountLayout';
import { decryptMessage } from '../../cryptoUtils';

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

const ResetPassword = (): React$Element<any> => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [token, setToken] = useState('');

    useEffect(() => {
        // Get the current URL
        const url = window.location.href;
        const tokenFromUrl = url.split('/').pop(); // Gets the last segment of the URL
        console.log({tokenFromUrl})
        setToken(tokenFromUrl);
        dispatch(verifyToken({token:tokenFromUrl})); 

    }, []);

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);
 
    const store=useSelector((state)=>state);
    // console.log(store?.Auth?.verifyTokenSuccess?.data)
    // useEffect(()=>{
    //     if(store?.Auth?.verifyTokenSuccess?.data){
    //        console.log(decryptMessage(store?.Auth?.verifyTokenSuccess?.data),' decryptMessage(store?.Auth?.verifyTokenSuccess?.data)')
    //     }
    // },[store?.Auth?.verifyTokenSuccess?.data])
    const { loading, passwordChange, changePasswordSuccess } = useSelector((state) => ({
        loading: state.Auth.loading,
        passwordChange: state.Auth.passwordChange,
        changePasswordSuccess: state.Auth.changePasswordSuccess,
    }

) );


    const schemaResolver = yupResolver(
        yup.object().shape({
            password: yup.string().required(t('Please enter Password')),
            confirmPassword: yup
                .string()
                .oneOf([yup.ref('password'), null], t('Passwords must match'))
                .required(t('Please confirm your Password')),
        })
    );

    const onSubmit = (formData) => {
        dispatch(forgotPasswordChange({ token, newPassword: formData.password }));
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (changePasswordSuccess) {
            const successReset = JSON.parse(decryptMessage(changePasswordSuccess?.data));
            if (successReset?.status === 200) {
                ToastHandle(successReset?.message, 'success');
                navigate('/account/login');
            }
        }
    }, [changePasswordSuccess, navigate]);

    return (
        <AccountLayout bottomLinks={<BottomLink />}>
            <div className="text-center m-auto">
                <h4 className="text-dark-50 text-center mt-0 font-weight-bold">{t('Reset Password')}</h4>
                <p className="text-muted mb-4">
                    {t("Enter your new password, and we'll update your password.")}
                </p>
            </div>

            {!passwordChange && (
                <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
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
    );
};

export default ResetPassword;
