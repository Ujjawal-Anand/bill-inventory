import React, { useEffect } from 'react';
//Vendor
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from 'react-redux';
// Custom
import SignUpForm from './SignUpForm';
import { SignUpPage } from '../../styledComponents/auth/SignupLoginForm';
import BillyLogo from '../../../images/Billy-Logo.png';

// Component
function SignUp() {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch({ type: 'RESET_AUTH_ERROR' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SignUpPage>
      <Grid container justify="center" alignItems="center">
        <Hidden mdDown>
          <Grid item md={6} lg={6} className="signup-display">
            <h1>
              Create, <br /> Save & <br />
              Send Invoices <br />
              at Warp Speed.
            </h1>
            <div className="branding">
              <div className="brand-image">
                <img src={BillyLogo} alt="EasyDukanLogo" />
              </div>
              <p>created by</p>
              <div className="brand-image">
                <a
                  href="https://www.easydukan.online"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ujjawal Anand
                </a>
              </div>
            </div>
          </Grid>
        </Hidden>
        <Grid item xs={12} md={6} lg={6} className="signup-form">
          <SignUpForm />
        </Grid>
      </Grid>
    </SignUpPage>
  );
}

export default SignUp;
