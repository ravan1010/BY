import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import api from '../api.js'
import { LogOut } from "lucide-react"

const Profile = () => {
  const [userMail, setUserMail] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await api.get("/api/user/profile");
      setUserMail(response.data.email);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // user logout
  const userLogout = async () => {
    try {
      await api.post("/auth/user/logout")
      .then((res) => {
        alert(res.data.message)
        window.location.reload();
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-16">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-80 text-center">

          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Profile
          </h2>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-blue-600 font-medium break-words">
              {userMail || "Loading..."}
            </p>
          </div>

          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            Vendor
          </a>
          
          <button onClick={userLogout} className="flex items-center gap-2 cursor-pointer hover:text-red-500 mt-10">
            <LogOut size={20} /> Logout
          </button>

        </div>
      </div>
    </div>
  )
}

export default Profile