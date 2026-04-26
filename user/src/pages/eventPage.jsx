import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import CalendarPicker from "../components/Calendar";
import Navbar from "../components/navbar";

const EventPage = () => {
    const { id, vendor, variant } = useParams();
    const navigate = useNavigate();

    const [activeVariant, setActiveVariant] = useState(null);
    const [eventPost, setEventPost] = useState(null);
    const [dates, setdates] = useState([])
    const [mobile, setmobile] = useState("")
    const [seletedDate, setseleteDate] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEventPost = async () => {
            try {
                const res = await api.get(`/api/user/vendorPost/${id}/${vendor}`);
                setEventPost(res.data.eventPosts);

                const today = new Date();
                today.setHours(0, 0, 0, 0); // normalize to midnight

                const formattedDates = res.data.vendor.availableDates
                    .map(date => new Date(date))
                    .filter(date => date >= today) // ✅ keep only today & future
                    .map(date => date.toISOString().split("T")[0]);

                console.log(formattedDates);
                setdates(formattedDates);
                // setActiveVariant(variant)

            } catch (err) {
                setError("Failed to load event post details. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventPost();
    }, [id, vendor]);

    const bookSubmit = async () => {

        if (!mobile) {
            return alert("Enter mobile number or date")
        }

        await api.post(`/api/user/booking/${id}/${vendor}/${variant}`, {
            mobile,
            seletedDate
        }).then((res) => {
            if (res.data.success) {
                setmobile('')
                setseleteDate(null)

            }
        })
    }

    const selectedVariant = eventPost?.variants?.find(
        (v) => v._id === variant
    );

    if (loading) {
        return (
            <div>
                <p className="mt-20 text-center">Loading event post...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p className="mt-20 text-center text-red-500">{error}</p>
            </div>
        );
    }

    if (!eventPost) {
        return (
            <div>
                <p className="mt-20 text-center">No event post found</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="mt-10 p-2  max-w-4xl mx-auto">
                <div className="bg-white border-l border-b border-gray-500 shadow-lg rounded-2xl overflow-hidden">

                    {/* Image */}

                    {/* Content */}
                    <div className="p-6">

                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="mb-4 text-sm text-blue-600 hover:underline"
                        >
                            ← Back
                        </button>

                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {eventPost.eventName}
                        </h1>

                        <p className="text-gray-700 mb-4">
                            {eventPost.EventType}
                        </p>

            <div className="flex gap-4 border-t-2 border-b-2 py-4 overflow-x-auto scrollbar-hide mb-2 dark:border-gray-700">
  {eventPost?.variants?.map((v) => (
    <div
      key={v._id}
      onClick={() => {
        setActiveVariant(v._id);
        navigate(`/event/${id}/${vendor}/${v._id}`);
      }}
      className={`min-w-[120px] p-3 rounded-xl cursor-pointer flex flex-col items-center transition
        ${
          activeVariant === v._id
            ? "border-blue-600 bg-blue-200 dark:bg-blue-900/40 shadow-md"
            : "bg-white dark:bg-gray-800 border hover:shadow-md"
        }
      `}
    >
      {/* Image */}
      {v.images?.[0] && (
        <img
          src={v.images[0]}
          alt={v.name}
          className="w-full h-20 object-cover rounded-lg mb-2"
        />
      )}

      {/* Name */}
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">
        {v.name}
      </p>

      {/* Price */}
      <p className="text-lg font-bold text-green-600 dark:text-green-400">
        ₹ {v.price}
      </p>

      {/* MRP */}
      {v.mrp && (
        <p className="text-xs text-gray-400 dark:text-gray-500 line-through">
          ₹ {v.mrp}
        </p>
      )}
    </div>
  ))}
</div>

                        {/* Book Button */}
                        {selectedVariant && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Event Details
                                </h2>

                                <div className="bg-white rounded-xl shadow-md overflow-hidden">

                                    {/* Images */}
                                    <div className="flex overflow-x-auto gap-3 p-3">
                                        {selectedVariant.images?.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={selectedVariant.name}
                                                className="w-full max-w-[200px] h-32 object-cover rounded-lg flex-shrink-0"
                                            />
                                        ))}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-center font-semibold text-lg mt-2">
                                        {selectedVariant.name}
                                    </h3>

                                    {/* Price */}
                                    <div className="flex justify-between items-center p-3">
                                        <p className="text-gray-500 line-through text-sm">
                                            ₹ {selectedVariant.mrp}
                                        </p>
                                        <p className="text-lg font-bold text-green-600">
                                            ₹ {selectedVariant.price}
                                        </p>
                                    </div>

                                    {/* Why */}
                                    {selectedVariant.why?.length > 0 && (
                                        <div className="px-3">
                                            <p className="font-semibold border-b mb-1">Why</p>
                                            {selectedVariant.why.map((reason, i) => (
                                                <p key={i} className="text-sm">
                                                    {i + 1}. {reason}
                                                </p>
                                            ))}
                                        </div>
                                    )}

                                    {/* Includes */}
                                    {selectedVariant.includes?.length > 0 && (
                                        <div className="px-3 mt-2">
                                            <p className="font-semibold border-b mb-1">Includes</p>
                                            {selectedVariant.includes.map((item, i) => (
                                                <p key={i} className="text-sm">
                                                    {i + 1}. {item}
                                                </p>
                                            ))}
                                        </div>
                                    )}

                                    {/* Calendar */}
                                    <div className="p-3">
                                        <CalendarPicker
                                            availableDates={dates}
                                            onDateSelect={(date) => setseleteDate(date)}
                                        />
                                    </div>

                                    {/* Booking */}
                                    {seletedDate && (
                                        <div className="p-3 space-y-3">
                                            <input
                                                type="tel"
                                                placeholder="Enter mobile number"
                                                value={mobile}
                                                maxLength={10}
                                                onChange={(e) => setmobile(e.target.value)}
                                                className="w-full p-3 border rounded-lg"
                                            />

                                            <button
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                                                onClick={bookSubmit}
                                                disabled={!mobile || mobile.length !== 10}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPage;