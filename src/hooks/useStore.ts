import { useContext } from "react";
import { StoreContext } from "~/providers/StoreProvider";

function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within a storeContextProvider");
  }

  return context;
}

export default useStore;
