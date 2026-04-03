import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { register, removeErrors, removeSuccess } from '../features/user/userSlice';
import { User, Mail, Lock, UserPlus, Image as ImageIcon } from 'lucide-react';

function Register() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState('/images/profile.png');
  const { name, email, password } = user;
  const { success, loading, error } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerDataChange = (e) => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill out all the required fields', { position: 'bottom-left', autoClose: 2000 });
      return;
    }
    const myForm = new FormData();
    myForm.set('name', name);
    myForm.set('email', email);
    myForm.set('password', password);
    myForm.set('avatar', avatar);
    dispatch(register(myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'bottom-left', autoClose: 2000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success("Registration Successful", { position: 'bottom-left', autoClose: 2000 });
      dispatch(removeSuccess());
      navigate('/login');
    }
  }, [dispatch, success, navigate]);

  return (
    <div className="form-container">
      <div className="form-content">
        <div className="form-header">
          <h2>Create Account</h2>
          <p>Join us and start shopping</p>
        </div>
        <form className="form" onSubmit={registerSubmit} encType="multipart/form-data">
          <div className="input-field-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User size={18} />
              <input 
                type="text" 
                placeholder="Choose a username" 
                name="name" 
                value={name} 
                onChange={registerDataChange} 
                required 
              />
            </div>
          </div>

          <div className="input-field-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                name="email" 
                value={email} 
                onChange={registerDataChange} 
                required 
              />
            </div>
          </div>

          <div className="input-field-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input 
                type="password" 
                placeholder="Create a password" 
                name="password" 
                value={password} 
                onChange={registerDataChange} 
                required 
              />
            </div>
          </div>

          <div className="input-field-group">
            <label>Profile Picture</label>
            <div className="avatar-selection-wrapper">
              <img src={avatarPreview} alt="Avatar Preview" className="avatar-preview-img" />
              <div className="input-wrapper">
                <ImageIcon size={16} style={{ left: '0.75rem' }} />
                <input 
                  type="file" 
                  name="avatar" 
                  className="file-input-custom" 
                  accept="image/*" 
                  onChange={registerDataChange} 
                  style={{ paddingLeft: '2.5rem', border: 'none' }}
                />
              </div>
            </div>
          </div>

          <button className="authBtn" type="submit" disabled={loading}>
            {loading ? <div className="btn-loader"></div> : <><UserPlus size={18} /> Sign Up</>}
          </button>

          <div className="form-links-container">
            <p className="form-link-item">
              Already have an account?<Link to="/login">Sign in here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
