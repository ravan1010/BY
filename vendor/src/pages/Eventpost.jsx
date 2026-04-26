import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import api from "../../src/api.js";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function EventPost() {
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

  const [ active, setactive ] = useState(false)

  // vendor active status
  const VendorActiveStatus = async () => {
    api.get('/api/active')
    .then((res) => {
      if(res.data.success){
        setactive(true)
      }else{
        setactive(false)
      }
    })
  }

  useEffect(() => {
    VendorActiveStatus()
  },[])

  // Handle variant change
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // Handle single image upload
  const handleImageUpload = async (index, files) => {
    if (!files || files.length === 0) return;

    // ❌ Limit check
    if (files.length > 3) {
      alert("Maximum 3 images allowed");
      return;
    }

    const base64Images = [];

    for (let file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Only images allowed");
        return;
      }

      try {
        const options = {
          maxSizeMB: 0.025, // 25KB
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        // Convert to base64
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = () => resolve(reader.result);
        });

        base64Images.push(base64);

      } catch (err) {
        console.error(err);
        alert("Image processing failed");
      }
    }

    // ✅ Must have at least 1 image
    if (base64Images.length === 0) {
      alert("At least 1 image required");
      return;
    }

    const updated = [...variants];
    updated[index].images = base64Images;
    setVariants(updated);
  };

  // Add new variant
  const addVariant = () => {
    setVariants([
      ...variants,
      { name: "", description: "", images: [], price: "", mrp: "", finalprice: "", why: [], includes: [] }
    ]);
  };

  // Add WHY point

  const addWhyPoint = (index) => {
    const updated = [...variants];
    updated[index].why.push("");
    setVariants(updated);
  };

  // Update WHY point
  const handleWhyChange = (vIndex, wIndex, value) => {
    const updated = [...variants];
    updated[vIndex].why[wIndex] = value;
    setVariants(updated);
  };

  // remove WHY point
  const removeWhyPoint = (vIndex, wIndex) => {
    const updated = [...variants];
    updated[vIndex].why = updated[vIndex].why.filter((_, i) => i !== wIndex);
    setVariants(updated);
  };

  // Add INCLUDES point
  const addIncludesPoint = (index) => {
    const updated = [...variants];
    updated[index].includes.push("");
    setVariants(updated);
  }

  // Update INCLUDES point
  const handleIncludesChange = (vIndex, iIndex, value) => {
    const updated = [...variants];
    updated[vIndex].includes[iIndex] = value;
    setVariants(updated);
  };

  // remove INCLUDES point
  const removeIncludesPoint = (vIndex, iIndex) => {
    const updated = [...variants];
    updated[vIndex].includes = updated[vIndex].includes.filter((_, i) => i !== iIndex);
    setVariants(updated);
  };

  // Remove variant
  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate image exists
    for (let v of variants) {
      if (!v.images || v.images.length === 0) {
        alert("Each variant must have 1 to 3 images");
        return;
      }
    }

    try {
      // const token = localStorage.getItem("token");

      const res = await api.post(
        "/api/eventpost",
        {
          eventName,
          EventType,
          variantname,
          variants,
        }
      );

      alert(res.data.message);
      if (res.data.success) {
        setEventName("");
        setEventType("");
        setVariantName("");
        setVariants([{ name: "", description: "", images: [], price: "", mrp: "", why: [], includes: [] }]);
      } 

    } catch (err) {
      console.error(err);
      alert("Error creating event");
    }
  };

  return (
    <>
    <Link to="/" className="block max-w-3xl mx-auto border-2 rounded-lg text-center text-blue-600 hover:underline">
      Back to Home
    </Link>
    {
      !active && (

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
         <Link 
          to='/'
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          dashboard
        </Link>

        {/* Close Button */}
       

        
      </div>
    </div>
      )
    }
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">

      <h2 className="text-2xl font-bold text-gray-800 text-center border-b pb-4">
        Create Event
      </h2>


      {/* Event Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-gray-50">
        <input
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />

        <input
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Event Type"
          value={EventType}
          onChange={(e) => setEventType(e.target.value)}
        />

        <input
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Variant Name"
          value={variantname}
          onChange={(e) => setVariantName(e.target.value)}
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-700">Variants</h3>

      {/* Variants */}
      {variants.map((v, index) => (
        <div
          key={index}
          className="border rounded-xl p-4 space-y-4 bg-gray-50"
        >
          {index > 0 && (
            <button
              type="button"
              onClick={() => removeVariant(index)}
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

          {/* Image Upload */}
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

          {/* Pricing */}
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
                onClick={() => addWhyPoint(index)}
                className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                +
              </button>

              <button
                type="button"
                onClick={() => removeWhyPoint(index, v.why.length - 1)}
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

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={addVariant}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          + Add Variant
        </button>

      {
        active && (
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Submit
        </button>
      )
    }
      </div>

    </form>
    </>
  );
} 
