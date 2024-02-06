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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) { // For nested objects like contactInfo and openingHours
      const keys = name.split('.'); // e.g., ["contactInfo", "email"]
      setShopData(prevData => ({
        ...prevData,
        [keys[0]]: { ...prevData[keys[0]], [keys[1]]: value }
      }));
    } else {
      setShopData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleOpeningHoursChange = (day: string, key: 'open' | 'close', value: string) => {
    setShopData(prevData => ({
      ...prevData,
      openingHours: {
        ...prevData.openingHours,
        [day]: { ...prevData.openingHours[day], [key]: value }
      }
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (shopId) {
      setLoading(true);
      saveShopInfoInFirestore(shopId, shopData)
        .then(response => {
          alert(response.message);
        })
        .catch(error => {
          console.error("Error saving shop info", error);
          alert("Failed to save shop info");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      alert("Shop ID is missing");
    }
  };

  if (loading) return <div>Loading...</div>;

  const inputStyle = { marginLeft: '20px', display: 'block', marginBottom: '10px' };

  return (
    <form onSubmit={handleSubmit}>
      <input
        style={inputStyle}
        type="text"
        name="name"
        value={shopData.name}
        onChange={handleChange}
        placeholder="Shop Name"
      />
      <input
        style={inputStyle}
        type="text"
        name="address"
        value={shopData.address}
        onChange={handleChange}
        placeholder="Address"
      />
      <input
        style={inputStyle}
        type="text"
        name="category"
        value={shopData.category}
        onChange={handleChange}
        placeholder="Category"
      />
      <textarea
        style={{ ...inputStyle, height: '100px' }}
        name="description"
        value={shopData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        style={inputStyle}
        type="text"
        name="contactInfo.email"
        value={shopData.contactInfo.email}
        onChange={handleChange}
        placeholder="Contact Email"
      />
      <input
        style={inputStyle}
        type="text"
        name="contactInfo.phone"
        value={shopData.contactInfo.phone}
        onChange={handleChange}
        placeholder="Contact Phone"
      />
      <input
        style={inputStyle}
        type="text"
        name="image"
        value={shopData.image}
        onChange={handleChange}
        placeholder="Image URL"
      />
      <input
        style={inputStyle}
        type="text"
        name="location"
        value={shopData.location}
        onChange={handleChange}
        placeholder="Location"
      />
      {/* Here you would add input fields for each day's opening hours */}
      {/* Example for Monday */}
      <div style={{ marginLeft: '20px' }}>
        <label>Monday Opening Hours:</label>
        <input
          style={{ display: 'block', marginBottom: '5px', marginTop: '5px' }}
          type="text"
          name="monday.open"
          value={shopData.openingHours.monday.open}
          onChange={(e) => handleOpeningHoursChange('monday', 'open', e.target.value)}
          placeholder="Open"
        />
        <input
          style={{ display: 'block', marginBottom: '10px' }}
          type="text"
          name="monday.close"
          value={shopData.openingHours.monday.close}
          onChange={(e) => handleOpeningHoursChange('monday', 'close', e.target.value)}
          placeholder="Close"
        />
      </div>
      <div style={{ marginLeft: '20px' }}>
        <label>Tuesday Opening Hours:</label>
        <input
          style={{ display: 'block', marginBottom: '5px', marginTop: '5px' }}
          type="text"
          name="monday.open"
          value={shopData.openingHours.tuesday.open}
          onChange={(e) => handleOpeningHoursChange('tuesday', 'open', e.target.value)}
          placeholder="Open"
        />
        <input
          style={{ display: 'block', marginBottom: '10px' }}
          type="text"
          name="monday.close"
          value={shopData.openingHours.tuesday.close}
          onChange={(e) => handleOpeningHoursChange('tuesday', 'close', e.target.value)}
          placeholder="Close"
        />
      </div>
      {/* Repeat for other days as needed */}
      <button type="submit" disabled={loading}>Save</button>
    </form>
  );
};

export default ShopForm;