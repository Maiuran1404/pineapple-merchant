
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import Container from "~/components/Container";
import EditProductModal from "~/components/product/EditProductModal";
import Product from "~/components/product/Product";
import type { ItemProps } from "~/types";
import useProducts from "~/hooks/useProducts";

function Products() {
  const { isLoading, error, products, addProduct, updateProduct } = useProducts();
  const [open, setOpen] = useState(false);

  function handleSetOpen(open: boolean) {
    setOpen(open);
  }

  return (
    <Container>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Your products
        </h1>
        <button
          onClick={() => handleSetOpen(!open)}
          type="button"
          title="Add a new product"
          className="flex h-10 w-10 items-center justify-center gap-1 rounded-full bg-gray-900 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          <BiPlus size={24} />
        </button>
      </div>

      <form className="mt-12">
        <div>
          <h2 className="sr-only">Products in your store</h2>

          <ProductList
            isLoading={isLoading}
            error={error}
            products={products}
          />
        </div>
      </form>

      {/* Treating this as a addProduct modal*/}
      <EditProductModal
        updateProduct={addProduct} 
        open={open}
        setOpen={handleSetOpen}
      />
    </Container>
  );
}

export default Products;

const ProductList = ({
  isLoading,
  error,
  products,
}: {
  isLoading: boolean;
  error: unknown;
  products: ItemProps[];
}) => {
  if (!products || isLoading)
    return (
      <ul role="list" className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            key={i}
            className="h-64 w-full animate-pulse rounded-xl border border-gray-200 bg-gray-100"
          />
        ))}
      </ul>
    );

  if (error) return <div>An error has occurred</div>;

  return (
    <ul role="list" className="flex flex-col gap-3">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </ul>
  );
};







// import React, { useEffect, useState } from "react";
// import { doc, setDoc } from "firebase/firestore"; // Assuming you're using Firebase v9+
// import { fetchShopData, saveShopInfoInFirestore } from "~/apiEndpoints";
// import { useUser } from "@clerk/nextjs";
// import { MenuItem, MenuOption } from "~/types";

// const Products: React.FC = () => {
//   const { user } = useUser();
//   const shopId =
//     typeof user?.publicMetadata?.shopId === "string"
//       ? user.publicMetadata.shopId
//       : undefined;
//   const [newItem, setNewItem] = useState<MenuItem>({
//     name: "",
//     price: "",
//     description: "",
//     imageUrl: "",
//     optionCategories: [],
//   });
//   const [menu, setMenu] = useState<MenuItem[]>([]);

//   useEffect(() => {
//     const getMenuData = async () => {
//       if (shopId) {
//         const result = await fetchShopData(shopId);
//         // Using optional chaining to simplify and improve readability
//         if (result.success && result.data?.menu) {
//           // Explicitly cast result.data.menu to Item[]
//           const menuData: MenuItem[] = result.data.menu as MenuItem[];
//           setMenu(menuData);
//         } else {
//           console.error(result.message ?? "Failed to fetch shop data");
//         }
//       } else {
//         console.error("shopId is undefined, unable to fetch shop data");
//       }
//     };

//     void getMenuData();
//   }, [shopId]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setNewItem((prevItem) => ({
//       ...prevItem,
//       [name]: value,
//     }));
//   };

//   const handleOptionCategoryChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     index: number,
//   ) => {
//     const { name, value } = e.target;
//     const updatedCategories = newItem.optionCategories.map((category, i) =>
//       i === index ? { ...category, [name]: value } : category,
//     );
//     setNewItem({ ...newItem, optionCategories: updatedCategories });
//   };

//   const addOptionCategory = () => {
//     setNewItem({
//       ...newItem,
//       optionCategories: [
//         ...newItem.optionCategories,
//         { name: "", description: "", options: [] },
//       ],
//     });
//   };

//   const handleOptionChange = (
//     categoryIndex: number,
//     optionIndex: number,
//     e: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const { name, value } = e.target;
//     const updatedCategories = newItem.optionCategories.map((category, i) => {
//       if (i === categoryIndex) {
//         const updatedOptions = category.options.map((option, j) =>
//           j === optionIndex ? { ...option, [name]: value } : option,
//         );
//         return { ...category, options: updatedOptions };
//       }
//       return category;
//     });
//     setNewItem({ ...newItem, optionCategories: updatedCategories });
//   };

//   const addOptionToCategory = (categoryIndex: number) => {
//     const newOption: MenuOption = {
//       id: "", // Ideally, generate a unique ID here
//       name: "",
//       description: "",
//       price: "",
//     };
//     const updatedCategories = newItem.optionCategories.map((category, i) =>
//       i === categoryIndex
//         ? { ...category, options: [...category.options, newOption] }
//         : category,
//     );
//     setNewItem({ ...newItem, optionCategories: updatedCategories });
//   };

//   const addItemToMenu = async () => {
//     if (
//       !newItem.name.trim() ||
//       !newItem.price.trim() ||
//       !newItem.description.trim() ||
//       !newItem.imageUrl.trim()
//     ) {
//       alert("Please fill in all fields");
//       return;
//     }

//     const updatedMenu = [...menu, newItem];
//     setMenu(updatedMenu);
//     setNewItem({
//       name: "",
//       price: "",
//       description: "",
//       imageUrl: "",
//       optionCategories: [],
//     });

//     // Prepare shopData to be saved in Firestore
//     const shopData = { menu: updatedMenu };

//     // Call the saveShopInfoInFirestore function to update the Firestore document
//     if (typeof shopId === "string") {
//       // `shopId` is guaranteed to be a string here
//       try {
//         const saveResult = await saveShopInfoInFirestore(shopId, shopData);
//         console.log(saveResult.message);
//       } catch (error) {
//         console.error("Failed to save shop info:", error);
//       }
//     } else {
//       console.error("shopId is undefined, cannot save shop info");
//     }
//   };

//   return (
//     <div>
//       <br />
//       <br />
//       <h2>Menu:</h2>
//       <ul>
//         {menu.map((item, index) => (
//           <li key={index}>
//             <p>Name: {item.name}</p>
//             <p>Price: {item.price}</p>
//             <p>Description: {item.description}</p>
//             {/* Optionally display option categories and their options here */}
//           </li>
//         ))}
//       </ul>
//       <br />
//       <br />
//       <h1>Menu Page for Shop: {shopId}</h1>
//       <div>
//         <label>Name:</label>
//         <input
//           type="text"
//           name="name"
//           value={newItem.name}
//           onChange={handleInputChange}
//         />
//       </div>
//       <div>
//         <label>Price:</label>
//         <input
//           type="text"
//           name="price"
//           value={newItem.price}
//           onChange={handleInputChange}
//         />
//       </div>
//       <div>
//         <label>Description:</label>
//         <input
//           type="text"
//           name="description"
//           value={newItem.description}
//           onChange={handleInputChange}
//         />
//       </div>
//       <div>
//         <label>Image URL:</label>
//         <input
//           type="text"
//           name="imageUrl"
//           value={newItem.imageUrl}
//           onChange={handleInputChange}
//         />
//       </div>
//       {newItem.optionCategories.map((category, categoryIndex) => (
//         <div key={categoryIndex}>
//           <h3>Option Category:</h3>
//           <input
//             type="text"
//             name="name"
//             placeholder="Category Name"
//             value={category.name}
//             onChange={(e) => handleOptionCategoryChange(e, categoryIndex)}
//           />
//           <input
//             type="text"
//             name="description"
//             placeholder="Category Description"
//             value={category.description}
//             onChange={(e) => handleOptionCategoryChange(e, categoryIndex)}
//           />
//           <button
//             type="button"
//             onClick={() => addOptionToCategory(categoryIndex)}
//           >
//             Add Option to Category
//           </button>
//           {category.options.map((option, optionIndex) => (
//             <div key={optionIndex}>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Option Name"
//                 value={option.name}
//                 onChange={(e) =>
//                   handleOptionChange(categoryIndex, optionIndex, e)
//                 }
//               />
//               <input
//                 type="text"
//                 name="description"
//                 placeholder="Option Description"
//                 value={option.description}
//                 onChange={(e) =>
//                   handleOptionChange(categoryIndex, optionIndex, e)
//                 }
//               />
//               <input
//                 type="text"
//                 name="price"
//                 placeholder="Option Price"
//                 value={option.price}
//                 onChange={(e) =>
//                   handleOptionChange(categoryIndex, optionIndex, e)
//                 }
//               />
//             </div>
//           ))}
//         </div>
//       ))}
//       <button type="button" onClick={addOptionCategory}>
//         Add Option Category
//       </button>
//       <br />
//       <button onClick={() => void addItemToMenu()}>Add Item to Menu</button>
//     </div>
//   );
// };

// export default Products;
