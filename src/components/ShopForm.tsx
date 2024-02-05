import { useState, useEffect } from 'react';
import { fetchShopData, saveShopInfoInFirestore }  from "~/apiEndpoints";

const ShopForm = ({ shopId }) => {
  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    location: '',
    // Initialize other fields as needed
  });
  const [loading, setLoading] = useState(false); // Start with loading false, since we always show the form now

  useEffect(() => {
    const loadShopData = async () => {
      setLoading(true); // Begin loading
      const response = await fetchShopData(shopId);
      if (response.success) {
        setShopData(response.data);
      } // No else case needed; we always show the form
      setLoading(false); // End loading
    };

    if (shopId) loadShopData(); // Only load data if shopId is provided
  }, [shopId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use saveShopInfoInFirestore, which can handle both update and create
    const response = await saveShopInfoInFirestore(shopId || Date.now().toString(), shopData);
    alert(response.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={shopData.name || ''} onChange={handleChange} placeholder="Shop Name" />
      <input type="text" name="description" value={shopData.description || ''} onChange={handleChange} placeholder="Description" />
      <input type="text" name="location" value={shopData.location || ''} onChange={handleChange} placeholder="Location" />
      {/* Add other fields as necessary */}
      <button type="submit">Save</button>
    </form>
  );
};

export default ShopForm;