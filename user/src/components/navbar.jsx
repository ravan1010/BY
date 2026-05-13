import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Booked", path: "/booked" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">  
          
          {/* Logo */}
          <div className="text-xl font-bold text-blue-600">
            BYSLOT
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-gray-700 hover:text-blue-600 font-medium ${
                  location.pathname === link.path
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden text-gray-700 hover:text-blue-600 ">
            <button onClick={() => setIsOpen(!isOpen)}>
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
  <div
    className="
      md:hidden
      absolute
      top-16
      left-0
      w-full
      bg-white/95
      backdrop-blur-md
      shadow-2xl
      border-t
      animate-slideDown
      z-50
    "
  >
    <div className="flex flex-col p-3 gap-2">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          onClick={() => setIsOpen(false)}
          className={`
            px-4 py-3
            rounded-xl
            font-medium
            transition-all duration-300
            flex items-center
            hover:translate-x-2
            hover:shadow-md

            ${
              location.pathname === link.path
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          {link.name}
        </Link>
      ))}
    </div>
  </div>
)}
    </nav>
  );
}