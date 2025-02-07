import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Appbar = () => {
  const { user, loading, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/events");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && event.target.closest(".profile-menu") === null) {
        setIsProfileOpen(false);
      }
      if (isMenuOpen && event.target.closest(".menu-container") === null) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, isMenuOpen]);

  if (loading) {
    return (
      <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/events" className="flex items-center space-x-3">
          <img
            src="https://media.istockphoto.com/id/1402983271/vector/e-letters-logo-vector-design-illustration.jpg?s=612x612&w=0&k=20&c=xNE7KB7024ckdcRJKjZ2b0sXOxXDGdfJQcxCSYNTkY8="
            className="h-10 w-10 rounded-full"
            alt="Events Logo"
          />
          <span className="self-center text-2xl font-semibold">Events</span>
        </Link>

        <div className="hidden md:flex md:space-x-8">
          <Link to="/events" className="text-white hover:text-gray-300">Home</Link>
          {user && <Link to="/create-event" className="text-white hover:text-gray-300">Create Event</Link>}
          <Link to="/contact" className="text-white hover:text-gray-300">Contact</Link>
        </div>

        <div className="flex items-center md:order-2 space-x-3">
          {user ? (
            <div className="relative profile-menu">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 focus:outline-none"
                onClick={() => setIsProfileOpen((prev) => !prev)}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
                  alt="User Avatar"
                />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                  <div className="px-4 py-2 bg-gray-100">
                    <span className="block text-sm text-gray-900">{user?.name}</span>
                    <span className="block text-sm text-gray-500 truncate">{user?.email}</span>
                  </div>
                  <ul>
                    <li>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Events
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                to="/login"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-blue-700 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden w-full mt-4">
            <ul className="flex flex-col space-y-2 p-4 bg-white rounded-lg shadow-lg">
              <li>
                <Link to="/events" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Home
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/create-event" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                    Create Event
                  </Link>
                </li>
              )}
              <li>
                <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Appbar;
