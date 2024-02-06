import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { fetchShopData, saveShopInfoInFirestore } from '~/apiEndpoints';

// Define TypeScript interfaces for better type checking and readability
interface ShopData {
  name: string;
  description: string;
  location: string;
  // Define other fields as needed
}

interface ShopFormProps {
  shopId?: string; // Assuming shopId can be optional
}

const ShopForm: React.FC<ShopFormProps> = ({ shopId }) => {
  const [shopData, setShopData] = useState<ShopData>({ name: '', description: '', location: '' });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadShopData() {
      if (!shopId) return; // Early return if no shopId
      try {
        setLoading(true);
        const response = await fetchShopData(shopId);
        if (response.success && response.data) {
          // Ensure response.data is treated as ShopData
          setShopData(response.data as ShopData);
        } else {
          // Handle case where data is missing or response is unsuccessful
          console.error('Failed to fetch shop data');
        }
      } catch (error) {
        console.error("Error loading shop data", error);
      } finally {
        setLoading(false);
      }
    }

    loadShopData();
  }, [shopId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShopData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await saveShopInfoInFirestore(shopId || Date.now().toString(), shopData);
    alert(response.message);
  };

  if (loading) return <div>Loading...</div>; // Optionally show loading indicator

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={shopData.name}
        onChange={handleChange}
        placeholder="Shop Name"
      />
      <input
        type="text"
        name="description"
        value={shopData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="text"
        name="location"
        value={shopData.location}
        onChange={handleChange}
        placeholder="Location"
      />
      {/* Add other input fields as necessary */}
      <button type="submit" disabled={loading}>Save</button>
    </form>
  );
};

export default ShopForm;