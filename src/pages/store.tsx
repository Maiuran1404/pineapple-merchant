import { useState } from 'react';
import { addFormDataToFirestore } from '~/apiEndpoints'; // Adjust the path as necessary

const Store = () => {
  const [shop, setShop] = useState({
    address: '',
    contactInfo: { email: '', phone: '' },
    image: null,
    location: '',
    menu: {
      description: '',
      name: '',
      optionTypes: [{ name: '', options: [{ description: '', name: '', price: 0 }] }],
    },
    name: '',
    openingHours: {
      monday: { close: '', open: '' },
    },
    stripeConnectedId: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await addFormDataToFirestore(shop); // Call your endpoint here
      if (response.success) {
        alert('Shop added successfully!');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      alert('Error adding shop:');
    }
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
