import { useState } from "react";
import { addFormDataToFirestore } from "~/apiEndpoints"; // Adjust the path as necessary
import { Shop } from "~/types";

const Store = () => {
  const [shop, setShop] = useState<Shop>({
    address: "",
    contactInfo: { email: "", phone: "" },
    image: null, // Assuming this will be handled differently since it's a file
    location: "",
    menu: {
      description: "",
      name: "",
      optionTypes: [
        { name: "", options: [{ description: "", name: "", price: 0 }] },
      ],
    },
    name: "",
    openingHours: {
      monday: { close: "", open: "" },
    },
    stripeConnectedId: "",
  });

  // // Simplified for demonstration. Implement similar handlers for other nested fields as needed.
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   if (name.includes(".")) {
  //     const keys = name.split(".");
  //     // Ensure TypeScript knows these are strings.
  //     const key1 = keys[0] as string;
  //     const key2 = keys[1] as string;
  
  //     setShop((prevShop: any) => {
  //       // Use a more specific type instead of 'any' if your shop structure is known.
  //       return {
  //         ...prevShop,
  //         [key1]: {
  //           ...prevShop[key1],
  //           [key2]: value,
  //         },
  //       };
  //     });
  //   } else {
  //     setShop((prevShop: any) => ({
  //       ...prevShop,
  //       [name]: value,
  //     }));
  //   }
  // };
  

  // // const handleOptionTypeChange = (
  // //   e: React.ChangeEvent<HTMLInputElement>,
  // //   optionTypeIndex: number,
  // //   optionIndex: number
  // // ) => {
  // //   const { name, value } = e.target;
  // //   const newOptionTypes = [...shop.menu.optionTypes];
  
  // //   // Check if optionType exists
  // //   if (optionTypeIndex >= 0 && optionTypeIndex < newOptionTypes.length) {
  // //     const optionType = newOptionTypes[optionTypeIndex];
  
  // //     if (name === "optionTypeName") {
  // //       optionType.name = value;
  // //     } else if (name.startsWith("options")) {
  // //       // Ensure option exists within the optionType
  // //       if (optionIndex >= 0 && optionIndex < optionType.options.length) {
  // //         const option = optionType.options[optionIndex];
  // //         const fieldName = name.split(".")[1]; // e.g., "options.description"
          
  // //         // Safely assign the value with appropriate type casting
  // //         option[fieldName] = fieldName === "price" ? parseFloat(value) : value;
  // //       }
  // //     }
  
  // //     // Proceed to update the shop state
  // //     setShop((prevShop) => ({
  // //       ...prevShop,
  // //       menu: {
  // //         ...prevShop.menu,
  // //         optionTypes: newOptionTypes,
  // //       },
  // //     }));
  // //   }
  // // };
  

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   try {
  //     const response = await addFormDataToFirestore(shop);
  //     if (response.success) {
  //       alert("Shop added successfully!");
  //     } else {
  //       throw new Error(response.message);
  //     }
  //   } catch (error) {
  //     alert(`Error adding shop`);
  //   }
  // };

  return (
    <h1> 
      Store
    </h1>
    // <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
    //   {/* <input type="text" name="name" value={shop.name} onChange={handleInputChange} placeholder="Shop Name" />

    //   <input type="text" name="address" value={shop.address} onChange={handleInputChange} placeholder="Address" />

    //   <input type="email" name="contactInfo.email" value={shop.contactInfo.email} onChange={handleInputChange} placeholder="Email" />
    //   <input type="text" name="contactInfo.phone" value={shop.contactInfo.phone} onChange={handleInputChange} placeholder="Phone" />

    //   <input type="text" name="location" value={shop.location} onChange={handleInputChange} placeholder="Location" />

    //   <input type="text" name="menu.name" value={shop.menu.name} onChange={handleInputChange} placeholder="Menu Name" />
    //   <textarea name="menu.description" value={shop.menu.description} onChange={handleInputChange} placeholder="Menu Description" />

    //   {/* Simplified handling for one optionType and one option. For multiple, you'd dynamically generate these fields.
    //   <input type="text" name="optionTypeName" value={shop.menu.optionTypes[0].name} onChange={(e) => handleOptionTypeChange(e, 0, 0)} placeholder="Option Type Name" />
    //   <input type="text" name="options.name" value={shop.menu.optionTypes[0].options[0].name} onChange={(e) => handleOptionTypeChange(e, 0, 0)} placeholder="Option Name" />
    //   <textarea name="options.description" value={shop.menu.optionTypes[0].options[0].description} onChange={(e) => handleOptionTypeChange(e, 0, 0)} placeholder="Option Description" />
    //   <input type="number" name="options.price" value={shop.menu.optionTypes[0].options[0].price} onChange={(e) => handleOptionTypeChange(e, 0, 0)} placeholder="Option Price" />

    //   <input type="text" name="openingHours.monday.open" value={shop.openingHours.monday.open} onChange={handleInputChange} placeholder="Monday Opening Time" />
    //   <input type="text" name="openingHours.monday.close" value={shop.openingHours.monday.close} onChange={handleInputChange} placeholder="Monday Closing Time" /> */}

    //   <input type="text" name="stripeConnectedId" value={shop.stripeConnectedId} onChange={handleInputChange} placeholder="Stripe Connected ID" />

    //   {/* Image input would need a separate handler to manage file uploads, not covered here */}
    //   {/* <input type="file" name="image" onChange={handleImageChange} /> */}

    //   <button type="submit">Submit</button> */}
    // </form>
  );
};

export default Store;