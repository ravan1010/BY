import { useState } from 'react'
import api from '../api'
import { useEffect } from 'react'

const VendorBooking = () => {

    const [bookingData, setbookingData] = useState([])
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);


    const fetchData = async () => {
        try {
            await api.get('/api/vendor/booking')
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
            await api.post(`/api/vendor/cancel/booking/${id}`)
                .then((res) => {
                    alert(res.data.message)
                    fetchData()
                })
        } catch (error) {
            console.log(error)
        }
    }

    const accepted = async (id) => {

        try {
            await api.post(`/api/vendor/booking/toProgress/${id}`)
                .then((res) => {
                    alert(res.data.message)
                    fetchData()
                })
        } catch (error) {
            console.log(error)
        }
    }

    const handleProgressVerify = async (id) => {
        if (!otp || otp.length !== 4) {
            return alert("Enter valid 4-digit OTP");
        }

        try {
            setLoading(true);

            const res = await api.post(
                `/api/vendor/booking/toProgress/verify/${id}`,
                { otp }
            );

            if (res.data.success) {
                alert("OTP Verified ✅");
                setOtp("");
                fetchData()
            }
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
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

                                <p className="text-sm text-gray-500 mt-2">
                                    client : {booking.UserId.name}
                                </p>

                                {/* Optional actions */}
                                {booking.status === "cancel"
                                    ?
                                    <div className='w-full p-4 text-center'>
                                        <h1 className='text-red-500'> Booking got cancelled </h1>
                                    </div> :
                                    <div className="mt-4 flex gap-2">
                                        {booking.status === "pending" && (<>
                                            <button
                                                onClick={() => cancel(booking._id)}
                                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => accepted(booking._id)}
                                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded">
                                                accept
                                            </button>
                                        </>
                                        )}

                                        {booking.status === "accepted" && (
                                            <>
                                                <div className="mt-3 w-full space-y-3">
                                                    <p className="text-sm text-gray-600">
                                                        📞 Mobile: {booking.UserMobile}
                                                    </p>
                                                    <input
                                                        type="number"
                                                        placeholder="Enter 4-digit OTP"
                                                        value={otp}
                                                        minLength={4}
                                                        maxLength={4}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        className="w-full p-3 border rounded-lg text-center tracking-widest"
                                                    />

                                                    <button
                                                        onClick={() => handleProgressVerify(booking._id)}
                                                        disabled={loading}
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg disabled:opacity-50"
                                                    >
                                                        {loading ? "Verifying..." : "Verify OTP"}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                            {booking.status === "progress" && (
                                            <>
                                                <div className="mt-3 w-full space-y-3">
                                                    <p className="text-sm text-gray-600">
                                                        📞 Mobile: {booking.UserMobile}
                                                    </p>
                                                    <input
                                                        type="number"
                                                        placeholder="Enter 4-digit OTP"
                                                        value={otp}
                                                        minLength={4}
                                                        maxLength={4}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        className="w-full p-3 border rounded-lg text-center tracking-widest"
                                                    />

                                                    <button
                                                        onClick={() => (booking._id)}
                                                        disabled={loading}
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg disabled:opacity-50"
                                                    >
                                                        {loading ? "Verifying..." : "Verify OTP"}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                        
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}

export default VendorBooking
