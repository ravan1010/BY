import React from 'react'
import Navbar from '../components/navbar'
import { useState } from 'react'
import api from '../api'
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

const Booked = () => {
  const navigate = useNavigate();

  const [bookingData, setbookingData] = useState([])

  const fetchData = async () => {
    try {
      await api.get('/api/user/get/booking')
        .then((res) => {
          setbookingData(res.data)
        })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const cancel = async (id) => {

    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      await api.post(`/api/user/cancel/booking/${id}`)
        .then((res) => {
          alert(res.data.message)
          fetchData()
        })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="mt-6 px-4 max-w-5xl mx-auto">
        {bookingData.length === 0 ? (
          <p className="text-gray-500 text-center">
            You have no booked events at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 mt-20 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(bookingData) && bookingData.map((booking) => (
              <div
                key={booking._id}
                className="bg-white shadow-md rounded-xl p-4 border"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {booking.EventPostID?.eventName || "Event"}
                </h2>

                {booking.EventPostID?.variants
                  ?.find(v => v._id === booking.VariantID)?.name || "Event"}

                <img src={booking.EventPostID?.variants
                  ?.find(v => v._id === booking.VariantID)?.images[0]}
                  className='w-full h-60'
                />

                <h1 className='font-bold text-lg'>
                  ₹{booking.EventPostID?.variants?.find(v => v._id === booking.VariantID)?.price}
                </h1>

                <p className="text-sm text-gray-600 mt-1">
                  📅 Date: {booking.date}
                </p>

                <p className="text-sm text-gray-600">
                  📞 Mobile: {booking.UserMobile}
                </p>

                <div className='flex justify-between '>
                  <p className="text-sm text-gray-500 mt-2">
                    Vendor : {booking.VendorId.eventName}
                  </p>
                  {booking.ProgressOTP > 0 && (
                    <h1> OTP : {booking.ProgressOTP} </h1>
                  )}

                  {booking.completeOTP > 0 && (
                    <h1> OTP : {booking.completeOTP} </h1>
                  )}

                </div>

                {/* Optional actions */}
                <div className="mt-4 flex gap-2">

                  <button onClick={() => navigate(`/event/${booking.EventPostID._id}/${booking.VendorId._id}`)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded">
                    View
                  </button>
                  {
                    booking.status === "pending" && (
                      <button
                        onClick={() => cancel(booking._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded">
                        Cancel
                      </button>
                    )
                  }
                  {
                    booking.status === "cancel" && (
                      <button

                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded">
                        Canceled
                      </button>
                    )
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Booked
