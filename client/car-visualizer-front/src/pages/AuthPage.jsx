import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useUser } from '../store/UserContext';
import { useToast } from "../store/ToastContext";
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const { user, setToken, setUserInfo } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [userDetails, setUserDetails] = useState({
    name: '',
    username: '',
    password1: '',
    password2: '',
  });
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  

  useEffect(() => {
    if (user.isAuthenticated) {
    //   history.push('/home');
    }
  }, [user.isAuthenticated]);
  const showError = (errorTitle, errorMessage) => {
    setErrorTitle(errorTitle);
    setErrorMessage(errorMessage);
    setIsErrorModalOpen(true);
  };
    const validateForm = () => {
        const errors = {
            username: null,
            name: null,
            password1: null,
            password2: null,
        };
    
        // Assuming 'isSignUp' is a boolean state to check if it's sign-up or login
        if (isSignUp) {
            // Sign-up validation
            if (!userDetails.username) errors.username = "Username is required";
            if (!userDetails.name) errors.username = "Username is required";
            if (!userDetails.password1) errors.password1 = "Password is required";
            if (!userDetails.password2) errors.password2 = "Please confirm your password";
            if (userDetails.password1 && userDetails.password1.length < 8) errors.password1 = "Password must be at least 8 characters long";
            if (userDetails.password1 !== userDetails.password2) errors.password2 = "Passwords do not match";
        } else {
            // Login validation
            if (!userDetails.username) errors.username = "Username is required";
            if (!userDetails.password1) errors.password1 = "Password is required";
        }
    
        // Check if there are any errors and display the first one
        if (Object.values(errors).some((error) => error)) {
            showError('Validation Error', Object.values(errors).find(error => error));
            return false;
        }
    
        return true;
    };
    

  const handleAuth = async (e) => {
    e.preventDefault();
    if(!validateForm()) return;
    setIsLoading(true);

    const { username, name, password1, password2 } = userDetails;
    try {
      if (isSignUp) {
        const response = await axios.post("/api/account/users/", { 
            username, name, password1, password2 
        });
        if (response.status === 201) {
            setUserInfo(response.data);
            setIsSignUp(false);
            showToast(5000, "The user is registered. Please log in!", "bg-green-500 dark:bg-green-500");

        }
      } else {
        const response = await axios.post("/api/account/login/", { username, password: password1 });
        if (response.status === 200) {
            setToken(response.data);
            showToast(5000, "You are logged in successfully!", "bg-green-500 dark:bg-green-500");
            navigate("/")
        }
      }
    } catch (error) {
      setErrors({ general: 'Authentication failed' });
      setIsErrorModalOpen(true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp((prev) => !prev);
    setErrors({});
    setUserDetails({ name: '', username: '', password1: '', password2: '' });
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#423434] flex items-center justify-center p-4">
      <div className="w-full max-w-md sm:max-w-md md:max-w-xl space-y-8">
        <div className="text-center mt-4">
          <p className="text-sm text-white">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={toggleAuthMode}
              disabled={isLoading}
              className="font-medium ml-1 cursor-pointer text-blue-200 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
        <div className="bg-white primary-color-background p-8 rounded-xl shadow-lg">
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-center text-gray-800 mb-8">
              {isSignUp ? 'Enter your details to get started' : 'Enter your username and password to log in'}
            </p>

            {/* Error Messages */}
            {errors.general && (
              <div className="mb-4">
                <ul className="text-sm text-red-600 list-disc pl-5 space-y-1">
                  <li>{errors.general}</li>
                </ul>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-black">Username</label>
                  <input
                    id="username"
                    value={userDetails.username}
                    onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
                    type="text"
                    required
                    disabled={isLoading}
                    className={`w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.username ? 'border-red-500' : ''}`}
                    placeholder="Enter your username"
                  />
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-black">Name</label>
                    <input
                      id="name"
                      value={userDetails.name}
                      onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                      type="text"
                      required
                      disabled={isLoading}
                      className={`w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Choose a name"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-black">Password</label>
                  <input
                    value={userDetails.password1}
                    onChange={(e) => setUserDetails({ ...userDetails, password1: e.target.value })}
                    type="password"
                    placeholder="Your password"
                    disabled={isLoading}
                    className={`w-full text-black py-2 px-3 border border-gray-200 rounded-lg ${errors.password1 ? 'border-red-500' : ''}`}
                    id="password"
                  />
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <label htmlFor="password2" className="text-sm font-medium text-black">Repeat password</label>
                    <input
                      value={userDetails.password2}
                      onChange={(e) => setUserDetails({ ...userDetails, password2: e.target.value })}
                      type="password"
                      placeholder="Confirm password"
                      disabled={isLoading}
                      className={`w-full text-black py-2 px-3 border border-gray-200 rounded-lg ${errors.password2 ? 'border-red-500' : ''}`}
                      id="password2"
                    />
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer flex max-w-md mx-auto justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && <span className="animate-spin h-5 w-5 mr-3">🔄</span>}
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {isErrorModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-900">{errorTitle}</h3>
            <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>
            <div className="mt-4">
              <button
                type="button"
                onClick={closeErrorModal}
                className="px-4 py-2 cursor-pointer text-sm font-medium text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
