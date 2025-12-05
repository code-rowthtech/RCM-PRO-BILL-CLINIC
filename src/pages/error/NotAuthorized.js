import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
  return (
    <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-4 col-lg-5">
            <div className="card">
              <div className="card-header pt-4 pb-4 text-center bg-primary">
                <Link to="/">
                  <span><img src="/assets/images/logo.png" alt="" height="18" /></span>
                </Link>
              </div>
              <div className="card-body p-4">
                <div className="text-center w-75 m-auto">
                  <h4 className="text-dark-50 text-center pb-0 fw-bold">Access Denied</h4>
                  <p className="text-muted mb-4">
                    You don't have permission to access any pages. Please contact your administrator.
                  </p>
                </div>
                <div className="mb-0 text-center">
                  <Link to="/account/logout" className="btn btn-primary">
                    <i className="mdi mdi-home me-1"></i> Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;