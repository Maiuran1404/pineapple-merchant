import { useContext } from "react";
import { StoreStatusContext } from "~/providers/StoreStatusProvider";

function useStoreStatus() {
  const context = useContext(StoreStatusContext);

  if (!context) {
    throw new Error(
      "useStoreStatus must be used within a StoreStatusContextProvider",
    );
  }

  return context;
}

export default useStoreStatus;
