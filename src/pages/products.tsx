import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore"; // Assuming you're using Firebase v9+
import { fetchShopData, saveShopInfoInFirestore } from "~/apiEndpoints";
import { useUser } from "@clerk/nextjs";

interface Option {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface OptionCategory {
  name: string;
  description: string;
  options: Option[];
}

interface Item {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  optionCategories: OptionCategory[];
}

const Products: React.FC = () => {
  const { user } = useUser();
  const shopId =
    typeof user?.publicMetadata?.shopId === "string"
      ? user.publicMetadata.shopId
      : undefined;
  const [newItem, setNewItem] = useState<Item>({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    optionCategories: [],
  });
  const [menu, setMenu] = useState<Item[]>([]);

  useEffect(() => {
    const getMenuData = async () => {
      if (shopId) {
        const result = await fetchShopData(shopId);
        // Using optional chaining to simplify and improve readability
        if (result.success && result.data?.menu) {
          // Explicitly cast result.data.menu to Item[]
          const menuData: Item[] = result.data.menu as Item[];
          setMenu(menuData);
        } else {
          console.error(result.message ?? "Failed to fetch shop data");
        }
      } else {
        console.error("shopId is undefined, unable to fetch shop data");
      }
    };

    getMenuData();
  }, [shopId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleOptionCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { name, value } = e.target;
    const updatedCategories = newItem.optionCategories.map((category, i) =>
      i === index ? { ...category, [name]: value } : category,
    );
    setNewItem({ ...newItem, optionCategories: updatedCategories });
  };

  const addOptionCategory = () => {
    setNewItem({
      ...newItem,
      optionCategories: [
        ...newItem.optionCategories,
        { name: "", description: "", options: [] },
      ],
    });
  };

  const handleOptionChange = (
    categoryIndex: number,
    optionIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const updatedCategories = newItem.optionCategories.map((category, i) => {
      if (i === categoryIndex) {
        const updatedOptions = category.options.map((option, j) =>
          j === optionIndex ? { ...option, [name]: value } : option,
        );
        return { ...category, options: updatedOptions };
      }
      return category;
    });
    setNewItem({ ...newItem, optionCategories: updatedCategories });
  };

  const addOptionToCategory = (categoryIndex: number) => {
    const newOption: Option = {
      id: "", // Ideally, generate a unique ID here
      name: "",
      description: "",
      price: "",
    };
    const updatedCategories = newItem.optionCategories.map((category, i) =>
      i === categoryIndex
        ? { ...category, options: [...category.options, newOption] }
        : category,
    );
    setNewItem({ ...newItem, optionCategories: updatedCategories });
  };

  const addItemToMenu = async () => {
    if (
      !newItem.name.trim() ||
      !newItem.price.trim() ||
      !newItem.description.trim() ||
      !newItem.imageUrl.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }

    const updatedMenu = [...menu, newItem];
    setMenu(updatedMenu);
    setNewItem({
      name: "",
      price: "",
      description: "",
      imageUrl: "",
      optionCategories: [],
    });

    // Prepare shopData to be saved in Firestore
    const shopData = { menu: updatedMenu };

    // Call the saveShopInfoInFirestore function to update the Firestore document
    if (typeof shopId === "string") {
      // `shopId` is guaranteed to be a string here
      try {
        const saveResult = await saveShopInfoInFirestore(shopId, shopData);
        console.log(saveResult.message);
      } catch (error) {
        console.error("Failed to save shop info:", error);
      }
    } else {
      console.error("shopId is undefined, cannot save shop info");
    }
  };

  return (
    <div>
      <br />
      <br />
      <h2>Menu:</h2>
      <ul>
        {menu.map((item, index) => (
          <li key={index}>
            <p>Name: {item.name}</p>
            <p>Price: {item.price}</p>
            <p>Description: {item.description}</p>
            {/* Optionally display option categories and their options here */}
          </li>
        ))}
      </ul>
      <br />
      <br />
      <h1>Menu Page for Shop: {shopId}</h1>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="text"
          name="price"
          value={newItem.price}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={newItem.description}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Image URL:</label>
        <input
          type="text"
          name="imageUrl"
          value={newItem.imageUrl}
          onChange={handleInputChange}
        />
      </div>
      {newItem.optionCategories.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <h3>Option Category:</h3>
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={category.name}
            onChange={(e) => handleOptionCategoryChange(e, categoryIndex)}
          />
          <input
            type="text"
            name="description"
            placeholder="Category Description"
            value={category.description}
            onChange={(e) => handleOptionCategoryChange(e, categoryIndex)}
          />
          <button
            type="button"
            onClick={() => addOptionToCategory(categoryIndex)}
          >
            Add Option to Category
          </button>
          {category.options.map((option, optionIndex) => (
            <div key={optionIndex}>
              <input
                type="text"
                name="name"
                placeholder="Option Name"
                value={option.name}
                onChange={(e) =>
                  handleOptionChange(categoryIndex, optionIndex, e)
                }
              />
              <input
                type="text"
                name="description"
                placeholder="Option Description"
                value={option.description}
                onChange={(e) =>
                  handleOptionChange(categoryIndex, optionIndex, e)
                }
              />
              <input
                type="text"
                name="price"
                placeholder="Option Price"
                value={option.price}
                onChange={(e) =>
                  handleOptionChange(categoryIndex, optionIndex, e)
                }
              />
            </div>
          ))}
        </div>
      ))}
      <button type="button" onClick={addOptionCategory}>
        Add Option Category
      </button>
      <br />
      <button onClick={addItemToMenu}>Add Item to Menu</button>

      <h2>Menu:</h2>
      {/* <ul>
        {menu.map((item, index) => (
          <li key={index}>
            <p>Name: {item.name}</p>
            <p>Price: {item.price}</p>
            <p>Description: {item.description}</p>
            <img src={item.imageUrl} alt={item.name} />
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default Products;
