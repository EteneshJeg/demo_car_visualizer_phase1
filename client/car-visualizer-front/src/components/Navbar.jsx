import { useUser } from "../store/UserContext";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, removeToken } = useUser();
  const navigate = useNavigate();

  const login = () => {
    navigate("/auth");
  }

  const logout = async () => {
    await removeToken();
    navigate("/");
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <div className="text-xl font-bold">AI Wheel</div>
      <button
        onClick={() => {
          user.isAuthenticated ? logout() : login();
        }}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded cursor-pointer"
      >
        {user.isAuthenticated ? "Logout" : "Sign In"}
      </button>
    </nav>
  );
};

export default Navbar;
