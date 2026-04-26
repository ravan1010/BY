import React, { useEffect, useState } from "react";
import { Home, PlusCircle, List, LogOut, Menu, X, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api"
import { generateAndSaveFCMToken } from "../utilis/token";

export default function VendorDashboard() {
  const [open, setOpen] = useState(false);
  const [vendorData, setvendorData] = useState()
  const [ active, setactive ] = useState(false)
  const [loading, setloading] = useState(true)

  // Generate and save FCM token on component mount
  useEffect(() => {
    generateAndSaveFCMToken();
  }, []);

  // vendor active status
  const VendorActiveStatus = async () => {
    api.get('/api/active')
    .then((res) => {
      if(res.data.success){
        setactive(true)
        setloading(false)
      }else{
        setactive(false)
        setloading(false)
      }
    })
  }

  // logout handle
  const VendorhandleLogout  = async () => {
  try {
    await api.post("/auth/vendor/logout")
    .then((res) => {
      alert(res.data.message)
      window.location.reload();
    })

    // redirect
    window.location.href = "/login";
  } catch (err) {
    console.error(err);
  }

  }

  // vendor dashboard
  const fetchvendorData = async () => {
    try {
      await api.get('/api/vendor/dashboard')
      .then((res) => {
        setvendorData(res.data.vendor)
        console.log(res.data.vendor)
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    VendorActiveStatus()
    fetchvendorData()
  },[])

  if(loading){
    return(
       <div className="fixed inset-0 flex items-center justify-center z-50">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Loader */}
      <div className="z-10 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white mt-3">Loading...</p>
      </div>
    </div>
    )
  }

  if(!active){
    return(
      <div className="fixed inset-0 flex items-center justify-center z-50">
      
                    {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black opacity-60"
            ></div>
            {/* Popup Content */}
            <div className="bg-white rounded-2xl shadow-lg text-center z-10 w-96 p-6">
              <h1 className="text-red-500 mb-5">
                ACTIVATE YOUR ACCOUNT
              </h1>
              <p>
                contact (7349343243) or (8088303214) <br /> to active 
              </p>
            
            </div>
          </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white shadow-lg p-5 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-blue-600">
            Vendor Panel
          </h2>

          {/* Close button (mobile) */}
          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>

        <nav className="space-y-4">
          <Link to="/" className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <Home size={20} /> Dashboard
          </Link>

          <Link to="/eventpost" className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <PlusCircle size={20} /> Add Event
          </Link>

          <Link to="/calendar" className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <Calendar size={20} /> Availability
          </Link>

          <Link to="/myevents" className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <List size={20} /> My Events
          </Link>

          <Link to="/vendor/bookings" className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <List size={20} /> Bookings
          </Link>

          <button onClick={VendorhandleLogout} className="flex items-center gap-2 cursor-pointer hover:text-red-500 mt-10">
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 p-4 md:p-6">

        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            
            {/* Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>

            <h1 className="text-xl md:text-2xl font-semibold">
              Dashboard
            </h1>
          </div>

          <Link to="/eventpost" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm md:text-base">
            + Create Event
          </Link>
        </div>

        {/* Stats + Commission */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Events</p>
            <h2 className="text-xl md:text-2xl font-bold">{vendorData?.eventPosts.length}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Bookings</p>
            <h2 className="text-xl md:text-2xl font-bold">{vendorData?.VendorBookings.length}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Revenue</p>
            <h2 className="text-xl md:text-2xl font-bold">{vendorData?.Revenue}</h2>
          </div>

          {/* 🔥 Commission Card */}
          <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Platform Commission</p>
            <h2 className="text-xl md:text-2xl font-bold text-blue-600">{vendorData?.Commission}
            </h2>
            <p className="text-xs text-gray-400">
              {/* (20% deducted) */}
            </p>
          </div>

        </div>

        {/* Recent Events */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Recent Events
          </h2>

          <div className="space-y-3 text-sm md:text-base">

            {/* <div className="flex justify-between border-b pb-2">
              <p>Birthday Decoration</p>
              <span className="text-green-600">Active</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <p>Wedding Stage Setup</p>
              <span className="text-yellow-600">Pending</span>
            </div>

            <div className="flex justify-between">
              <p>Corporate Event</p>
              <span className="text-red-500">Inactive</span>
            </div> */}

          </div>
        </div>

      </div>
    </div>
  );
}