import { motion } from "framer-motion";
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { fetchShopData, saveShopInfoInFirestore } from "~/apiEndpoints";
import { Day, OpeningHours, type Shop } from "~/types";

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
    menu: [],
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
          console.error("Failed to fetch shop data");
        }
      } catch (error) {
        console.error("Error loading shop data", error);
      } finally {
        setLoading(false);
      }
    }

    void loadShopData();
  }, [shopId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Check if the name includes '.' indicating a nested object like 'contactInfo.email'
    if (name.includes(".")) {
      const [firstKey, secondKey] = name.split(".") as [
        keyof Shop,
        keyof Shop["contactInfo"],
      ];

      // Safely updating nested 'contactInfo' properties
      if (
        firstKey === "contactInfo" &&
        (secondKey === "email" || secondKey === "phone")
      ) {
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
    day: keyof OpeningHours,
    key: keyof Day,
    value: string
  ) => {
    setShopData((prevData) => ({
      ...prevData,
      openingHours: {
        ...prevData.openingHours,
        [day]: {
          ...prevData.openingHours[day],
          [key]: value || null,
        },
      },
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (shopId) {
      setLoading(true);
      saveShopInfoInFirestore(shopId, shopData)
        .then((response) => {
          alert(response.message);
        })
        .catch((error) => {
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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  const renderOpeningHoursInputs = (day: keyof OpeningHours) => {
    const hours = shopData.openingHours[day]; // This is now strongly typed
    return (
      <div key={day} className="flex flex-col gap-2">
        <label className="text-gray-700 capitalize">{day} Opening Hours:</label>
        <div className="flex gap-2">
          <input
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
            type="text"
            name={`${day}.open`}
            value={hours.open ?? ''}
            onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
            placeholder="Open"
          />
          <input
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
            type="text"
            name={`${day}.close`}
            value={hours.close ?? ''}
            onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
            placeholder="Close"
          />
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-5">
      <input
        className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="name"
        value={shopData.name ?? ""}
        onChange={handleChange}
        placeholder="Shop Name"
      />
      <input
        className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="address"
        value={shopData.address ?? ""}
        onChange={handleChange}
        placeholder="Address"
      />
      <input
        className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="category"
        value={shopData.category ?? ""}
        onChange={handleChange}
        placeholder="Category"
      />
      <textarea
        className="h-32 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        name="description"
        value={shopData.description ?? ""}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="contactInfo.email"
        value={shopData.contactInfo.email ?? ""}
        onChange={handleChange}
        placeholder="Contact Email"
      />
      <input
        className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="contactInfo.phone"
        value={shopData.contactInfo.phone ?? ""}
        onChange={handleChange}
        placeholder="Contact Phone"
      />
      <input
        className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="image"
        value={shopData.image ?? ""}
        onChange={handleChange}
        placeholder="Image URL"
      />
      <input
        className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="location"
        value={shopData.location ?? ""}
        onChange={handleChange}
        placeholder="Location"
      />
      {/* Here you would add input fields for each day's opening hours */}
      {renderOpeningHoursInputs("monday")}
      {renderOpeningHoursInputs("tuesday")}
      {renderOpeningHoursInputs("wednesday")}
      {renderOpeningHoursInputs("thursday")}
      {renderOpeningHoursInputs("friday")}
      {renderOpeningHoursInputs("saturday")}
      {renderOpeningHoursInputs("sunday")}
      <button type="submit" disabled={loading}>
        Save
      </button>
    </form>
  );
};

export default ShopForm;
