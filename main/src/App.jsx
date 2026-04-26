import { useEffect, useState } from "react";
import api from "./api.js";

export default function App() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔽 Fetch inactive vendors
  const fetchVendors = async () => {
    try {
      const res = await api.get("/main/vendor/data");
      setVendors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // 🔽 Activate vendor
  const activateVendor = async (id) => {
    try {
      await api.post(`/main/vendor/active/${id}`);

      // remove activated vendor from UI
      setVendors((prev) => prev.filter((v) => v._id !== id));
      fetchVendors();

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Vendors</h2>

      {vendors.length === 0 ? (
        <p>No vendors pending</p>
      ) : (
        <div className="grid gap-4">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              className="p-4 border rounded-xl flex justify-between items-center shadow"
            >
              <div>
                <h3 className="font-semibold">{vendor.name}</h3>
                <p className="text-sm text-gray-500">{vendor.email}</p>
              </div>

              <button
                onClick={() => activateVendor(vendor._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Activate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}