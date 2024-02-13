import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { addFormDataToFirestore } from "~/apiEndpoints"; // Adjust the path as necessary
import ShopForm from "~/components/ShopForm";
import { Shop } from "~/types"; // Ensure this is correctly defined in your types
import { useUser } from "@clerk/clerk-react";
import Container from "~/components/Container";

const Store = () => {
  const { user } = useUser();
  const [shopId, setShopId] = useState<string | undefined>();

  useEffect(() => {
    const shopIdFromMetadata = user?.publicMetadata?.shopId as
      | string
      | undefined;
    setShopId(shopIdFromMetadata);
  }, [user]);

  return (
    <Container>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Store Setup{" "}
        </h1>
      </div>
      <ShopForm shopId={shopId} />
    </Container>
  );
};

export default Store;
