import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, removeErrors, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn } from 'lucide-react';

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { error, loading, success, isAuthenticated } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: loginEmail, password: loginPassword }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'bottom-left', autoClose: 2000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  useEffect(() => {
    if (success) {
      toast.success('Login Successful', { position: 'bottom-left', autoClose: 2000 });
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);

  return (
    <div className="form-container">
      <div className="form-content">
        <div className="form-header">
          <h1>Welcome Back</h1>
          <p>Login to access your account</p>
        </div>
        <form className="form" onSubmit={loginSubmit}>
          <div className="input-field-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                required 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="input-field-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input 
                type="password" 
                placeholder="Enter your password" 
                required 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
              />
            </div>
          </div>

          <button className="authBtn" type="submit" disabled={loading}>
            {loading ? <div className="btn-loader"></div> : <><LogIn size={18} /> Sign In</>}
          </button>

          <div className="form-links-container">
            <p className="form-link-item">
              Forgot your password? <Link to="/password/forgot">Reset Here</Link>
            </p>
            <p className="form-link-item">
              Don't have an account? <Link to="/register">Sign up here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
