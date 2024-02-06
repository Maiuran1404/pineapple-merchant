import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { addFormDataToFirestore } from "~/apiEndpoints"; // Adjust the path as necessary
import ShopForm from "~/components/ShopForm";
import { Shop } from "~/types"; // Ensure this is correctly defined in your types
import { useUser } from '@clerk/clerk-react';

const Store = () => {
  const { user } = useUser();
  const [shopId, setShopId] = useState<string | undefined>();

  useEffect(() => {
    const shopIdFromMetadata = user?.publicMetadata?.shopId as string | undefined;
    setShopId(shopIdFromMetadata);
  }, [user]);

  return (
    <>
      <h1>Store Setup</h1>
      <ShopForm shopId={shopId}/>
    </>
  );
};

export default Store;
