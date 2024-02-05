import { useEffect, useState } from "react";
import { subscribeToOrdersRealTime } from "~/apiEndpoints";
import Container from "~/components/Container";
import Order from "~/components/Order";
import Empty from "./Empty";
import { TOrder } from "~/types";
import { FirestoreError } from "firebase/firestore";
import { useUser } from '@clerk/clerk-react';

function OrdersPage() {
  // Adding TypeScript interface for order prop
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    // Only proceed if the shopId is defined
    const shopIdFromMetadata = user?.publicMetadata?.shopId as string | undefined;
    
    if (typeof shopIdFromMetadata === 'string') {
      const handleOrdersUpdate = (
        orders: TOrder[] | null,
        error?: FirestoreError,
      ) => {
        if (error) {
          console.error("Error fetching orders:", error);
          return;
        }
        if (orders) {
          setOrders(orders);
        } else {
          console.log("No orders found or an error occurred");
          setOrders([]);
        }
        setLoading(false);
      };
  
      const unsubscribe = subscribeToOrdersRealTime(
        shopIdFromMetadata,
        handleOrdersUpdate,
      );
  
      return () => unsubscribe();
    } else {
      // Handle the case when shopId is not available yet
      console.warn("Shop ID is not available. Ensure the user is logged in and has a shopId set.");
      setLoading(false);
    }
  }, [user]);
  

  if (loading) return <div>Loading..</div>;

  console.log("Users", user);
  console.log("Users shopid", user?.publicMetadata.shopId);

  // Filter orders by status
  const ordersPlaced = orders.filter(
    (order) => order.status === "ORDER_PLACED",
  );
  const ordersComplete = orders.filter((order) => order.status === "READY");

  return (
    <div className="h-screen w-full">
      <Container className="w-full max-w-none">
        <div className="flex flex-col gap-y-12">
          <div className="sm:flex sm:items-center"></div>
          <div className="flex gap-10">
            <div className="w-2/3">
              {" "}
              {/* Adjusted for two-thirds and grid layout */}
              <h2 className="mb-4 text-lg font-semibold">Order Placed</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {" "}
                {/* Grid layout for two items horizontally */}
                {ordersPlaced.length > 0 ? (
                  ordersPlaced.map((order) => (
                    <Order key={order.id} order={order} />
                  ))
                ) : (
                  <Empty />
                )}
              </div>
            </div>
            <div className="w-1/3">
              {" "}
              {/* Adjusted for one-third */}
              <h2 className="mb-4 text-lg font-semibold">Ready</h2>
              <div className="flex flex-col">
                {" "}
                {/* Ensure single column layout */}
                {ordersComplete.length > 0 ? (
                  ordersComplete.map((order) => (
                    <Order key={order.id} order={order} />
                  ))
                ) : (
                  <Empty />
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default OrdersPage;
