import { useState, useEffect, FC } from 'react'; // Import FC for Function Component typing
import { fetchShopData, saveShopInfoInFirestore }  from "~/apiEndpoints";

interface ShopData {
  name: string;
  description: string;
  location: string;
  // Add other fields as necessary
}

interface ShopFormProps {
  shopId?: string; // Make shopId optional
}

// Use FC (Function Component) generic type to type props
const ShopForm: FC<ShopFormProps> = ({ shopId }) => {
  const [shopData, setShopData] = useState<ShopData>({ name: '', description: '', location: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadShopData = async () => {
      if (!shopId) return; // Early return if no shopId
      setLoading(true);
      const response = await fetchShopData(shopId);
      if (response.success && response.data) { // Check if response.data is not undefined
        setShopData(response.data);
      } else {
        // If response.data is undefined, you can set a default state or handle the case as needed
        setShopData({ name: '', description: '', location: '' }); // Set default or initial state
      }
      setLoading(false);
    };
  
    loadShopData();
  }, [shopId]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShopData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uniqueId = shopId || `shop_${Date.now()}`;
    const response = await saveShopInfoInFirestore(uniqueId, shopData);
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