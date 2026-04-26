import React, { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import api from "../../src/api.js";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [eventName, setEventName] = useState("");
    const [EventType, setEventType] = useState("");
    const [variantname, setVariantName] = useState("");

    const [variants, setVariants] = useState([
        {
            name: "",
            description: "",
            images: [], // array of strings to store multiple images
            price: "",
            mrp: "",
            why: [],
            includes: [],
        }
    ]);

    // 🔹 Fetch existing event
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/api/event/${id}`);
                const data = res.data;

                setEventName(data.eventName);
                setEventType(data.EventType);
                setVariantName(data.variantname);
                setVariants(data.variants || []);
                console.log("Fetched event data:", data.variants);

            } catch (err) {
                console.error(err);
                alert("Failed to load event");
            }
        };

        fetchEvent();
    }, [id]);

    // 🔹 Same handlers (unchanged)
    const handleVariantChange = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const handleVariantAdd = () => {
        setVariants([...variants, { name: "", description: "", price: '', images: [], why: [], includes: [] }]);
    };

    const handleVariantRemove = (index) => {
        const updated = [...variants];
        updated.splice(index, 1);
        setVariants(updated);
    };

    const handleImageUpload = async (index, files) => {
        if (!files || files.length === 0) return;

        if (files.length > 3) {
            alert("Max 3 images");
            return;
        }

        const base64Images = [];

        for (let file of files) {
            const compressed = await imageCompression(file, {
                maxSizeMB: 0.025,
                maxWidthOrHeight: 800,
            });

            const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(compressed);
                reader.onloadend = () => resolve(reader.result);
            });

            base64Images.push(base64);
        }

        const updated = [...variants];
        updated[index].images = base64Images;
        setVariants(updated);
    };

    const handleWhyChange = (vIndex, wIndex, value) => {
        const updated = [...variants];
        updated[vIndex].why[wIndex] = value;
        setVariants(updated);
    };

    const handleWhyAdd = (vIndex) => {
        const updated = [...variants];
        updated[vIndex].why.push("");
        setVariants(updated);
    };

    const handlewhyRemove = (vIndex, wIndex) => {
        const updated = [...variants];
        updated[vIndex].why.splice(wIndex, 1);
        setVariants(updated);
    }

    const handleIncludesChange = (vIndex, iIndex, value) => {
        const updated = [...variants];
        updated[vIndex].includes[iIndex] = value;
        setVariants(updated);
    };

    const addIncludesPoint = (vIndex) => {
        const updated = [...variants];
        updated[vIndex].includes.push("");
        setVariants(updated);
    };

    const removeIncludesPoint = (vIndex, iIndex) => {
        const updated = [...variants];
        updated[vIndex].includes.splice(iIndex, 1);
        setVariants(updated);
    };

    // 🔥 UPDATE API
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/api/eventpost/${id}`, {
                eventName,
                EventType,
                variantname,
                variants,
            }).then((res) => {
                if (res.data.success) {
                    alert("Event updated!");
                    navigate("/myevents");
                } else {
                    alert("Update failed");
                }
            });

        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    return (
        <>
            <Link to="/myevents" className="block text-center text-blue-600 mb-2">
                Back
            </Link>

            <form onSubmit={handleUpdate} className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">

                <h2 className="text-2xl font-bold text-center border-b pb-4">
                    Edit Event
                </h2>

                {/* Top Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
                    <input value={eventName} onChange={(e) => setEventName(e.target.value)} className="border p-2 rounded" />
                    <input value={EventType} onChange={(e) => setEventType(e.target.value)} className="border p-2 rounded" />
                    <input value={variantname} onChange={(e) => setVariantName(e.target.value)} className="border p-2 rounded" />
                </div>

                {/* Variants */}
                {variants.map((v, index) => (
                    <div key={index}
                        className="border rounded-xl p-4 space-y-4 bg-gray-50"
                    >
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => handleVariantRemove(index)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Remove Variant
                            </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                                placeholder="Name"
                                value={v.name}
                                onChange={(e) =>
                                    handleVariantChange(index, "name", e.target.value)
                                }
                            />

                            <input
                                className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                                placeholder="Description"
                                value={v.description}
                                onChange={(e) =>
                                    handleVariantChange(index, "description", e.target.value)
                                }
                            />
                        </div>

                        {/* Images */}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="block w-full text-sm text-gray-600
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-600
          hover:file:bg-blue-100"
                            onChange={(e) =>
                                handleImageUpload(index, e.target.files)
                            }
                        />

                        {/* Preview */}
                        <div className="flex gap-2 flex-wrap">
                            {v.images &&
                                v.images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt="preview"
                                        className="w-20 h-20 object-cover rounded-lg border"
                                    />
                                ))}
                        </div>

                        {/* Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                placeholder="Price"
                                value={v.price}
                                className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                                onChange={(e) =>
                                    handleVariantChange(index, "price", e.target.value)
                                }
                            />

                            <input
                                type="number"
                                placeholder="MRP"
                                value={v.mrp}
                                className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                                onChange={(e) =>
                                    handleVariantChange(index, "mrp", e.target.value)
                                }
                            />

                            {/* <input
              type="number"
              placeholder="Final Price"
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              onChange={(e) =>
                handleVariantChange(index, "finalprice", e.target.value)
              }
            /> */}

                            <div>
                                <p className="font-semibold text-gray-700">Why choose this?</p>

                                {v.why.map((point, wIndex) => (
                                    <input
                                        type="text"
                                        key={wIndex}
                                        value={point}
                                        onChange={(e) =>
                                            handleWhyChange(index, wIndex, e.target.value)
                                        }
                                        placeholder={`Why point ${wIndex + 1}`}
                                        className="border p-2 rounded-lg w-full mt-2"
                                    />
                                ))}

                                <button
                                    type="button"
                                    onClick={() => handleWhyAdd(index)}
                                    className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    +
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handlewhyRemove(index, v.why.length - 1)}
                                    className="mt-2 ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    -
                                </button>


                            </div>


                            <div>
                                <p className="font-semibold text-gray-700">Includes</p>

                                {v.includes.map((point, iIndex) => (
                                    <input
                                        key={iIndex}
                                        value={point}
                                        onChange={(e) =>
                                            handleIncludesChange(index, iIndex, e.target.value)
                                        }
                                        placeholder={`Include item ${iIndex + 1}`}
                                        className="border p-2 rounded-lg w-full mt-2"
                                    />
                                ))}

                                <button
                                    type="button"
                                    onClick={() => addIncludesPoint(index)}
                                    className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    +
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeIncludesPoint(index, v.includes.length - 1)}
                                    className="mt-2 ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    -
                                </button>
                            </div>

                        </div>

                    </div>
                ))}

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={handleVariantAdd}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                    >
                        + Add Variant
                    </button>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Update Event
                    </button>
                </div>

            </form>
        </>
    );
}