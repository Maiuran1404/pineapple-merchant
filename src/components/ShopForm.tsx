import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { fetchShopData, saveShopInfoInFirestore } from '~/apiEndpoints';
import { Shop } from '~/types';


interface ShopFormProps {
  shopId?: string; // ShopId can be optional
}

const ShopForm: React.FC<ShopFormProps> = ({ shopId }) => {
  const initialShopData: Shop = {
    name: '',
    address: '',
    category: '',
    description: '',
    contactInfo: { email: '', phone: '' },
    image: '',
    location: '',
    menu: { description: '', name: '', optionTypes: [] },
    openingHours: {
        monday: { open: '', close: '' },
        tuesday: { open: '', close: '' },
        wednesday: { open: '', close: '' },
        thursday: { open: '', close: '' },
        friday: { open: '', close: '' },
        saturday: { open: '', close: '' },
        sunday: { open: '', close: '' },
    },
};

  const [shopData, setShopData] = useState<Shop>(initialShopData);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadShopData() {
      if (!shopId) return;
      setLoading(true);
      try {
        const response = await fetchShopData(shopId);
        if (response.success && response.data) {
          setShopData(response.data as Shop);
        } else {
          console.error('Failed to fetch shop data');
        }
      } catch (error) {
        console.error("Error loading shop data", error);
      } finally {
        setLoading(false);
      }
    }

    void loadShopData();
  }, [shopId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShopData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Ensure shopId is a string before calling saveShopInfoInFirestore
    if (shopId) {
      setLoading(true); // Consider setting loading to true to disable the button
      saveShopInfoInFirestore(shopId, shopData)
        .then(response => {
          alert(response.message);
        })
        .catch(error => {
          console.error("Error saving shop info", error);
          alert("Failed to save shop info");
        })
        .finally(() => {
          setLoading(false); // Reset loading state
        });
    } else {
      alert("Shop ID is missing");
    }
  };

  if (loading) return <div>Loading...</div>;

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
      <button type="submit" disabled={loading}>Save</button>
    </form>
  );
};

export default ShopForm;