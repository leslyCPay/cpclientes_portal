import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/Login.css';

// Definimos los tipos para los estados
interface LoginFormState {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  // Estado para los campos de entrada (usuario y contraseña)
  const [formData, setFormData] = useState<LoginFormState>({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  // Manejador del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email:string = formData.username;
    const password:string = formData.password;

      try { 

        const response = await axios.post('/api/login', { email, password, }); 
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('email', email); 
        navigate('/cases', { state: { email } });
        // Redirect or update UI on successful login
        window.location.href = '/cases'; 
      } catch (err) { 
        setErrorMessage('Invalid login credentials'); 
      } 

    // Validación simple de usuario y contraseña
    /*if (formData.username === 'admin' && formData.password === '1234') {
      setErrorMessage('');
      window.location.href = '/cases';      
    } else {
      setErrorMessage('User or Password wrong');
    }*/


  };

  // Manejo de cambio en los campos de formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    
    <div className="login flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 text-black">
      <div className='login-container bg-tussock-400' >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">        
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight ">
            HomeOwners' Area Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-tussock-500">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="username"
                  type="text"
                  required
                  placeholder='Please enter your registered email'
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-tussock-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 pl-2"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-tussock-500">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-tussock-600 hover:text-tussock-300">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  //autoComplete="current-password"
                  placeholder='Password'
                  value={formData.password}
                  onChange={handleChange}                  
                  className="block w-full rounded-md border-0 py-1.5 text-tussock-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-tussock-600 sm:text-sm/6 pl-2"
                />
              </div>
            </div>

            <div>
              {errorMessage && <p className="error">{errorMessage}</p>}
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-tussock-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-tussock-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tussock-600"
              >
                Sign in
              </button>              
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-tussock-200">
            Not a register yet?{' '}
            <a href="#" className="font-semibold text-tussock-600 hover:text-tussock-500">
              Register
            </a>
          </p>
        </div>
        
      </div>
      <Outlet />
    </div>
  );
};
export default Login;
