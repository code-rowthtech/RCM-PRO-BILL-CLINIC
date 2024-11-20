import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    const navigate = useNavigate();
const handleLogout = () => {
    navigate('/account/Logout')
}
    return (
        <div className="container  d-flex justify-content-center align-items-center" style={{height:'75vh'}} >
            <div className="card p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="card-body text-center">
                    <h5 className="card-title">Are you sure you want to logout!</h5>
                    <p className="card-text my-4">
                        You are also logged out from your personal cloud and any local data apps open in this browser.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <Button type="button" className="custom-buttons " onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutPage;
