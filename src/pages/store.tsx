import { useState } from "react";
import { addFormDataToFirestore } from "~/apiEndpoints"; // Adjust the path as necessary
import { Shop } from "~/types";

const Store = () => {
  const [shop, setShop] = useState<Shop>({
    address: "",
    contactInfo: { email: "", phone: "" },
    image: null,
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Directly call the async function without await
    addFormDataToFirestore(shop)
      .then((response) => {
        if (response.success) {
          alert("Shop added successfully!");
        } else {
          throw new Error(response.message);
        }
      })
      .catch((error) => {
        alert("Error adding shop: ");
      });
  };

  // Input change handlers...

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields... */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Store;
