import { type UserInfo } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { database } from "~/../firebase";
import { ItemProps } from "./constants/orders";

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
      console.log(clerkData);
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

    console.log(image);

    const newItemData = {
      ...item,
      image: image,
    };

    // Add a new document to the "products" sub-collection with the provided data
    const newItemRef = await setDoc(doc(productsCollection), newItemData);

    // Log the newly created item's ID
    console.log("New item added with ID:", newItemRef.id);

    return newItemRef;
  } catch (error) {
    // Handle any errors that occurred during the addition
    console.error("Error adding store item:", error);
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
    console.log(storageRef);

    await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}
