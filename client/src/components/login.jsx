import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";

const Login = props => {

  const initialUserState = {
    name: "",
    id: "",
  };

  const navigate = useNavigate();

  const [user, setUser] = useState(initialUserState);

  const handleInputChange = e => {
    const {name, value} = e.target;
    setUser({...user, [name]:value});
  };

  const login = () => {
    props.login(user)
    navigate('/');
  }

  return (
    <div className="submit-form">
      <div>
        <div className="form-group">
          <label htmlFor="user">Username</label>
          <input 
            type="text" 
            className="form-control"
            id='name'
            required
            value={user.name}
            onChange={handleInputChange}
            name='name'
          />
        </div>

        <div className="form-group">
          <label htmlFor="id">ID</label>
          <input 
            type="text" 
            className="form-control"
            id='id'
            required
            value={user.id}
            onChange={handleInputChange}
            name='id' 
          />
        </div>

        <button onClick={login} className='btn btn-success mt-3'>Login</button>
      </div>
    </div>
  );
  
};


export default Login;