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
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { database } from "~/../firebase";
import { ItemProps, OrderProps } from "./constants/orders";

interface Order {
  id: string;
  // Add other fields expected in an order, with appropriate types
  // For example, assuming each order has a 'total' and 'createdAt' field
  total: number;
  createdAt: Date; // or string if it's in ISO format etc.
}

// Define the interface for the FormData that this endpoint will accept
interface FormData {
  userId: string;
  items: Array<{ productId: string; quantity: number; }>;
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
  const productsRef = collection(shopRef, "menu");

  try {
    // Get the shop document
    const shopDoc = await getDoc(shopRef);

    // If the shop document exists
    if (shopDoc.exists()) {
      // Get the products from the sub-collection
      const productsQuerySnapshot = await getDocs(productsRef);

      // Extract data from products query snapshot
      const products = productsQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return products;
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

export async function getStore(user: UserInfo | null) {
  if (!user?.uid) {
    console.error("User is undefined:", user);
    return null;
  }

  const clerkRef = doc(database, "storeclerk", user.uid);

  try {
    const clerk = await getDoc(clerkRef);
    if (clerk.exists()) {
      const clerkData = clerk.data();
      const storeRef = doc(database, "shops", clerkData.storeID);

      const store = await getDoc(storeRef);
      if (store.exists()) {
        const fireStoreShop = { ...store.data(), id: store.id };
        return fireStoreShop;
      }
    }
  } catch (error) {
    console.error("Error checking user in Firestore:", error);
    return null; // Handle the error as needed
  }
}


export async function addStoreItem(shopID: string, item: ItemProps) {
  try {
    // Reference to the "products" sub-collection within the specified shop
    const productsCollection = collection(
      doc(database, "shops", shopID),
      "menu",
    );

    let image = "";

    if (item.image) {
      // Upload image and get doc id

      const result = await uploadImage(item.image, shopID);

      image = result ?? "";
    }

    const newItemData = {
      ...item,
      image: image,
    };

    // Add a new document to the "products" sub-collection with the provided data
    const newItemRef = await setDoc(doc(productsCollection), newItemData);

    // Log the newly created item's ID
    console.log("New item added with ID:", newItemRef);

    return newItemRef;
  } catch (error) {
    // Handle any errors that occurred during the addition
    console.error("Error adding store item:", error);
    return null;
  }
}

export async function updateStoreItem(shopID: string, item: ItemProps) {
  try {
    // Reference to the "products" sub-collection within the specified shop
    const productsCollection = collection(
      doc(database, "shops", shopID),
      "menu",
    );

    let image = ""; // Default to empty string if no new image is provided

    if (item.image) {
      // Upload image and get doc id
      const result = await uploadImage(item.image, shopID);

      image = result ?? "";
    }

    const updatedItemData = {
      ...item,
      image: image,
    };

    // Reference to the specific item document
    const itemDocRef = doc(productsCollection, item.id);

    // Update the document with the new data
    await updateDoc(itemDocRef, updatedItemData);

    console.log("Item updated successfully:", item.id);

    return item.id;
  } catch (error) {
    // Handle any errors that occurred during the update
    console.error("Error updating store item:", error);
    return null;
  }
}

export async function removeStoreItem(shopID: string, itemID: string) {
  try {
    // Reference to the "products" sub-collection within the specified shop
    const productsCollection = collection(
      doc(database, "shops", shopID),
      "menu",
    );

    // Remove the specified item from the "products" sub-collection
    await deleteDoc(doc(productsCollection, itemID));

    // Log the removed item's ID
    console.log("Item removed with ID:", itemID);
  } catch (error) {
    // Handle any errors that occurred during the removal
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

export function subscribeToOrdersRealTime(shopId: string, callback: (orders: Order[] | null, error?: FirestoreError) => void) {
  const ordersRef = collection(database, "orders");

  // Apply a where clause to filter orders by shopId
  const filteredOrdersRef = query(ordersRef, where("shopId", "==", shopId));

  return onSnapshot(
    filteredOrdersRef,
    (snapshot) => {
      const orders: Order[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Order, 'id'>, // Cast the data to match the Order type, excluding 'id' which is added separately
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
    }
  );
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const orderRef = doc(database, "orders", orderId);

  try {
    await updateDoc(orderRef, { 
      status: newStatus
    });
    console.log(`Order ${orderId} status updated to ${newStatus}`);
    return true;
  } catch (error) {
    console.error("Error updating order status: ", error);
    return false;
  }
}

export async function addFormDataToFirestore(formData: FormData): Promise<{ success: boolean; message: string; }> {
  try {
    // Adjust the path to your Firestore database as needed
    const collectionRef = collection(database, "shops");
    const docRef = await addDoc(collectionRef, formData); // Directly use formData here

    console.log("FormData added to Firestore with ID:", docRef.id);
    return { success: true, message: `FormData added successfully with ID: ${docRef.id}` };
  } catch (error) {
    console.error("Error adding FormData to Firestore:", error);

    // Convert error to string
    const errorMessage = typeof error === 'string' ? error : error instanceof Error ? error.message : String(error);

    return { success: false, message: `Error adding FormData to Firestore: ${errorMessage}` };
  }
}