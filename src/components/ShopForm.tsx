import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { fetchShopData, saveShopInfoInFirestore } from '~/apiEndpoints';
import { Shop } from '~/types';


interface ShopFormProps {
  shopId?: string; // ShopId can be optional
}

const ShopForm: React.FC<ShopFormProps> = ({ shopId }) => {
  const initialShopData: Shop = {
    name: null,
    address: null,
    category: null,
    description: null,
    contactInfo: { email: null, phone: null },
    image: null,
    location: null,
    menu: { description: null, name: null, optionTypes: [] },
    openingHours: {
        monday: { open: null, close: null },
        tuesday: { open: null, close: null },
        wednesday: { open: null, close: null },
        thursday: { open: null, close: null },
        friday: { open: null, close: null },
        saturday: { open: null, close: null },
        sunday: { open: null, close: null },
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
  
    // Check if the name includes '.' indicating a nested object like 'contactInfo.email'
    if (name.includes('.')) {
      const [firstKey, secondKey] = name.split('.') as [keyof Shop, keyof Shop['contactInfo']];
  
      // Safely updating nested 'contactInfo' properties
      if (firstKey === 'contactInfo' && (secondKey === 'email' || secondKey === 'phone')) {
        setShopData((prevData) => ({
          ...prevData,
          [firstKey]: {
            ...prevData[firstKey],
            [secondKey]: value || null, // Set to null if value is empty
          },
        }));
      }
    } else {
      // Directly updating shallow properties
      setShopData((prevData) => ({
        ...prevData,
        [name]: value || null, // Set to null if value is empty
      }));
    }
  };
  

  const handleOpeningHoursChange = (
    day: keyof Shop['openingHours'],
    key: 'open' | 'close',
    value: string
  ) => {
    setShopData((prevData) => ({
      ...prevData,
      openingHours: {
        ...prevData.openingHours,
        [day]: {
          ...prevData.openingHours[day],
          [key]: value || null, // Set to null if value is empty
        },
      },
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
          name="tuesday.open"
          value={shopData.openingHours.tuesday.open}
          onChange={(e) => handleOpeningHoursChange('tuesday', 'open', e.target.value)}
          placeholder="Open"
        />
        <input
          style={{ display: 'block', marginBottom: '10px' }}
          type="text"
          name="tuesday.close"
          value={shopData.openingHours.tuesday.close}
          onChange={(e) => handleOpeningHoursChange('tuesday', 'close', e.target.value)}
          placeholder="Close"
        />
      </div>
      <div style={{ marginLeft: '20px' }}>
        <label>Wednesday Opening Hours:</label>
        <input
          style={{ display: 'block', marginBottom: '5px', marginTop: '5px' }}
          type="text"
          name="wednesday.open"
          value={shopData.openingHours.wednesday.open}
          onChange={(e) => handleOpeningHoursChange('wednesday', 'open', e.target.value)}
          placeholder="Open"
        />
        <input
          style={{ display: 'block', marginBottom: '10px' }}
          type="text"
          name="wednesday.close"
          value={shopData.openingHours.wednesday.close}
          onChange={(e) => handleOpeningHoursChange('wednesday', 'close', e.target.value)}
          placeholder="Close"
        />
      </div>
      <div style={{ marginLeft: '20px' }}>
        <label>Thursday Opening Hours:</label>
        <input
          style={{ display: 'block', marginBottom: '5px', marginTop: '5px' }}
          type="text"
          name="thursday.open"
          value={shopData.openingHours.thursday.open}
          onChange={(e) => handleOpeningHoursChange('thursday', 'open', e.target.value)}
          placeholder="Open"
        />
        <input
          style={{ display: 'block', marginBottom: '10px' }}
          type="text"
          name="thursday.close"
          value={shopData.openingHours.thursday.close}
          onChange={(e) => handleOpeningHoursChange('thursday', 'close', e.target.value)}
          placeholder="Close"
        />
      </div>
      <div style={{ marginLeft: '20px' }}>
        <label>Friday Opening Hours:</label>
        <input
          style={{ display: 'block', marginBottom: '5px', marginTop: '5px' }}
          type="text"
          name="friday.open"
          value={shopData.openingHours.friday.open}
          onChange={(e) => handleOpeningHoursChange('friday', 'open', e.target.value)}
          placeholder="Open"
        />
        <input
          style={{ display: 'block', marginBottom: '10px' }}
          type="text"
          name="friday.close"
          value={shopData.openingHours.friday.close}
          onChange={(e) => handleOpeningHoursChange('friday', 'close', e.target.value)}
          placeholder="Close"
        />
      </div>
      <div style={{ marginLeft: '20px' }}>
        <label>Saturday Opening Hours:</label>
        <input
          style={{ display: 'block', marginBottom: '5px', marginTop: '5px' }}
          type="text"
          name="saturday.open"
          value={shopData.openingHours.saturday.open}
          onChange={(e) => handleOpeningHoursChange('saturday', 'open', e.target.value)}
          placeholder="Open"
        />
        <input
          style={{ display: 'block', marginBottom: '10px' }}
          type="text"
          name="saturday.close"
          value={shopData.openingHours.saturday.close}
          onChange={(e) => handleOpeningHoursChange('saturday', 'close', e.target.value)}
          placeholder="Close"
        />
      </div>
      <div style={{ marginLeft: '20px' }}>
        <label>Sunday Opening Hours:</label>
        <input
          style={{ display: 'block', marginBottom: '5px', marginTop: '5px' }}
          type="text"
          name="sunday.open"
          value={shopData.openingHours.sunday.open}
          onChange={(e) => handleOpeningHoursChange('sunday', 'open', e.target.value)}
          placeholder="Open"
        />
        <input
          style={{ display: 'block', marginBottom: '10px' }}
          type="text"
          name="sunday.close"
          value={shopData.openingHours.sunday.close}
          onChange={(e) => handleOpeningHoursChange('sunday', 'close', e.target.value)}
          placeholder="Close"
        />
      </div>
      <button type="submit" disabled={loading}>Save</button>
    </form>
  );
};

export default ShopForm;