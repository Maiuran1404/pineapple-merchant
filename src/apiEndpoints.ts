import { type UserInfo } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  onSnapshot,
  FirestoreError,
  addDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { database } from "~/../firebase";
import { ItemProps, OrderProps, StoreProps } from "./constants/orders";
import { MenuItem, Shop, TOrder } from "./types";

// Define the interface for the FormData that this endpoint will accept
interface FormData {
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
  total: number;
  createdAt: Date | string;
}

export async function getClerkInFirestore(
  user: UserInfo | null,
): Promise<DocumentData | null> {
  if (!user?.uid) {
    console.error("User is undefined:", user);
    return null;
  }

  const clerkRef = doc(database, "storeclerk", user.uid);

  try {
    const docSnap = await getDoc(clerkRef);
    if (docSnap.exists()) {
      // User exists in Firestore, retrieve their settings
      const fireStoreUser = docSnap.data();
      return fireStoreUser;
    } else {
      // User does not exist in Firestore, add the user

      const newUser = {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        image: user.photoURL,
        status: "pending",
      };

      await setDoc(clerkRef, newUser);

      console.log("User added to Firestore");
      return newUser; // User doesn't have any settings yet
    }
  } catch (error) {
    console.error("Error checking user in Firestore:", error);
    return null; // Handle the error as needed
  }
}

export async function updateFirestoreCollection(
  collection: string,
  collectionId: string,
  data: unknown,
) {
  const collectionRef = doc(database, collection, collectionId);

  try {
    return await setDoc(collectionRef, { data }, { merge: true });
  } catch (error) {
    console.error("Error updating data in Firestore:", error);
    return null;
  }
}

export async function getStoreItems(shopID: string) {
  const shopRef = doc(database, "shops", shopID);

  try {
    // Get the shop document
    const shopDoc = await getDoc(shopRef);

    // If the shop document exists
    if (shopDoc.exists()) {
      // Extract the menu items directly from the shop document data
      const shopData = shopDoc.data() as StoreProps;
      const products = shopData.menu; // assuming 'menu' is the key for the menu items array

      if (!products) {
        console.error("No menu is set up.");
        return; // or throw new Error("Store is undefined.");
      }

      return products.map((item: any, index: { toString: () => any }) => ({
        id: index.toString(), // Since there's no document id, we can use the array index as a unique id
        ...item,
      }));
    } else {
      // Handle the case where the shop document doesn't exist
      console.error("Shop not found");
      return null;
    }
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error("Error fetching shop items:", error);
    return null;
  }
}

export async function getStore(shopId: string | null) {
  if (!shopId) {
    console.error("Shop is undefined:", shopId);
    return null;
  }

  const shopRef = doc(database, "shops", shopId);

  try {
    const shopDoc = await getDoc(shopRef);
    if (shopDoc.exists()) {
      return { ...shopDoc.data(), id: shopDoc.id };
    } else {
      console.log("No such shop!");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving shop from Firestore:", error);
    return null; // Handle the error as needed
  }
}

export async function addStoreItem(shopId: string, item: ItemProps) {
  console.log("adding", shopId, item);
  try {
    // Reference to the "products" sub-collection within the specified shop
    const shopDocRef = doc(database, "shops", shopId);
    let image = "";
    if (item.image) {
      // Upload image and get doc id
      const result = await uploadImage(item.image, shopId);
      image = result ?? "";
    }

    const newItemData = {
      ...item,
      image: image,
    };

    // Add a new document to the "products" sub-collection with the provided data
    const newItemRef = await updateDoc(shopDocRef, {
      menu: arrayUnion(newItemData),
    });

    // Log the newly created item's ID
    console.log("New item added with ID:", newItemRef);

    return newItemRef;
  } catch (error) {
    // Handle any errors that occurred during the addition
    console.error("Error adding store item:", error);
    return null;
  }
}

interface UpdatedProperties extends Partial<ItemProps> {
  newImage?: File; // Optional new image for the item
}

export async function updateStoreItem(
  shopID: string,
  itemID: string | number,
  updatedProperties: UpdatedProperties,
): Promise<number | null> {
  const shopRef = doc(database, "shops", shopID);

  try {
    const shopSnap = await getDoc(shopRef);
    if (!shopSnap.exists()) {
      console.error("Shop not found");
      return null;
    }

    const shopData = shopSnap.data();
    const menu = shopData.menu as ItemProps[];

    const index = Number(itemID);
    if (isNaN(index) || index < 0 || index >= menu.length) {
      // Improved check for validity of index
      console.error("Item not found");
      return null;
    }

    if (
      updatedProperties.newImage &&
      updatedProperties.newImage instanceof File
    ) {
      const imageURL = await uploadImage(updatedProperties.newImage, shopID);
      updatedProperties.imageURL = imageURL;
      delete updatedProperties.newImage;
    }

    const validProperties: Partial<ItemProps> = Object.entries(
      updatedProperties,
    ).reduce<Partial<ItemProps>>((acc, [key, value]) => {
      if (value !== undefined && !(value instanceof File)) {
        acc[key as keyof ItemProps] = value;
      }
      return acc;
    }, {});

    const updatedItem = { ...menu[index], ...validProperties };

    menu[index] = updatedItem as ItemProps;

    // Ensure updatedItem satisfies ItemProps interface, particularly that `id` is not undefined
    if (updatedItem.id === undefined) {
      console.error("Updated item must have an id");
      return null;
    }

    await updateDoc(shopRef, { menu });

    console.log("Item updated successfully:", index);
    return index;
  } catch (error) {
    console.error("Error updating store item:", error);
    return null;
  }
}

export async function removeStoreItem(
  shopID: string,
  itemIndex: string | number,
) {
  const shopDocRef = doc(database, "shops", shopID);

  try {
    // Get the current data of the shop document
    const shopDoc = await getDoc(shopDocRef);
    if (shopDoc.exists()) {
      const shopData = shopDoc.data();

      // Convert itemIndex to number to ensure the comparison can be made
      const index = Number(itemIndex);

      // Ensure the itemIndex is within the bounds of the menu array
      if (index >= 0 && index < shopData.menu.length) {
        // Remove the menu item from the 'menu' array field by its index
        const updatedMenu = [...shopData.menu]; // Copy the menu array
        updatedMenu.splice(index, 1); // Remove the item at index

        // Update the 'menu' array field with the updated array
        await updateDoc(shopDocRef, {
          menu: updatedMenu,
        });

        console.log("Item removed at index:", index);
      } else {
        console.log("Invalid item index:", index);
      }
    } else {
      console.log("No document found with the ID:", shopID);
    }
  } catch (error) {
    console.error("Error removing store item:", error);
  }
}

export async function uploadImage(file: File, shopID: string) {
  const storePath = `shop/${shopID}/menu`;
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `${storePath}/${file.name}`);

    await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}

export async function getTransactions(shopID: string | undefined) {
  if (!shopID) {
    console.error("Shop ID is undefined:", shopID);
    return null;
  }

  const transactionsRef = collection(database, "transactions");

  try {
    const transactionsQuerySnapshot = await getDocs(
      query(transactionsRef, where("shopId", "==", shopID)),
    );

    // Extract data from transactions query snapshot
    const transactions = transactionsQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return null;
  }
}

export async function getTransactionProducts(transactionID: string) {
  const transactionRef = doc(database, "transactions", transactionID);
  const productsRef = collection(transactionRef, "products");

  try {
    // Get the transaction document
    const transactionDoc = await getDoc(transactionRef);

    // If the transaction document exists
    if (transactionDoc.exists()) {
      // Get the items from the sub-collection
      const productsQuerySnapshot = await getDocs(productsRef);

      // Extract data from items query snapshot
      const products = productsQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return products;
    } else {
      // Handle the case where the transaction document doesn't exist
      console.error("Transaction not found");
      return null;
    }
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error("Error fetching transaction products:", error);
    return null;
  }
}

export function subscribeToOrdersRealTime(
  shopId: string,
  callback: (orders: TOrder[] | null, error?: FirestoreError) => void,
) {
  const ordersRef = collection(database, "orders");

  // Apply a where clause to filter orders by shopId
  const filteredOrdersRef = query(ordersRef, where("shopId", "==", shopId));

  return onSnapshot(
    filteredOrdersRef,
    (snapshot) => {
      const orders: TOrder[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<TOrder, "id">), // Cast the data to match the Order type, excluding 'id' which is added separately
      }));

      // Check if there are orders before calling the callback
      if (orders.length > 0) {
        callback(orders);
      } else {
        // Handle the case when there are no orders
        callback(null); // Using FirestoreError for consistency with Firestore's error handling
      }
    },
    (error) => {
      console.error("Error listening to orders updates:", error);
      callback(null, error); // Call callback with null and error
    },
  );
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
): Promise<void> {
  const orderRef = doc(database, "orders", orderId);

  try {
    await updateDoc(orderRef, {
      status: newStatus,
    });
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  } catch (error) {
    console.error("Error updating order status: ", error);
    throw new Error(
      `Failed to update order status: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

export async function addFormDataToFirestore(
  formData: Shop,
): Promise<{ success: boolean; message: string }> {
  try {
    // Adjust the path to your Firestore database as needed
    const collectionRef = collection(database, "shops");
    const docRef = await addDoc(collectionRef, formData); // Directly use formData here

    console.log("FormData added to Firestore with ID:", docRef.id);
    return {
      success: true,
      message: `FormData added successfully with ID: ${docRef.id}`,
    };
  } catch (error) {
    console.error("Error adding FormData to Firestore:", error);

    // Convert error to string
    const errorMessage =
      typeof error === "string"
        ? error
        : error instanceof Error
        ? error.message
        : String(error);

    return {
      success: false,
      message: `Error adding FormData to Firestore: ${errorMessage}`,
    };
  }
}

type ShopUpdate = Record<string, Shop>;

// Function to update shop information in Firestore
export async function updateShopInfoInFirestore(
  shopId: string,
  updatedData: ShopUpdate,
): Promise<{ success: boolean; message: string }> {
  const shopRef = doc(database, "shops", shopId);

  try {
    // Using as any to bypass the TypeScript error
    await updateDoc(shopRef, updatedData);
    console.log("Shop information updated successfully");
    return { success: true, message: "Shop information updated successfully" };
  } catch (error) {
    console.error("Error updating shop information:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Error updating shop information: ${errorMessage}`,
    };
  }
}

export async function fetchShopData(shopId: string) {
  const shopRef = doc(database, "shops", shopId);
  try {
    const docSnap = await getDoc(shopRef);
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      console.error("No such document!");
      return { success: false, message: "No such document!" };
    }
  } catch (error) {
    console.error("Error fetching shop data:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Error fetching shop data: ${errorMessage}`,
    };
  }
}

// Adjust this function to handle both creation and updating of a shop document
export async function saveShopInfoInFirestore(
  shopId: string,
  shopData: Partial<Shop> | MenuItem[],
): Promise<{ success: boolean; message: string }> {
  const shopRef = doc(database, "shops", shopId);

  try {
    await setDoc(shopRef, shopData, { merge: true }); // This will create the document if it doesn't exist or update it if it does
    const action = shopData.hasOwnProperty("id") ? "updated" : "created";
    console.log(`Shop information ${action} successfully`);
    return {
      success: true,
      message: `Shop information ${action} successfully`,
    };
  } catch (error) {
    console.error("Error saving shop information:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Error saving shop information: ${errorMessage}`,
    };
  }
}
