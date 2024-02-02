import { useEffect, useState } from "react";
import { subscribeToOrdersRealTime } from "~/apiEndoints";
import Container from "~/components/Container";
import Order from "~/components/Order";
import Empty from "./Empty";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOrdersUpdate = (updatedOrders, error) => {
      if (error) {
        console.error("Error fetching orders:", error);
        return;
      }
      setOrders(updatedOrders);
      setLoading(false);
    };

    const unsubscribe = subscribeToOrdersRealTime("yhTqXHvykMTjepPZOxPs", handleOrdersUpdate);

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Filter orders by status
  const ordersPlaced = orders.filter(order => order.status === 'ORDER_PLACED');
  const ordersComplete = orders.filter(order => order.status === 'COMPLETE');

  return (
    <div className="h-screen w-full"> 
    <Container className="w-full max-w-none"> 
      <div className="flex flex-col gap-y-12">
        <div className="sm:flex sm:items-center">
        </div>
        <div className="flex gap-10">
          <div className="w-2/3"> {/* Adjusted for two-thirds and grid layout */}
            <h2 className="mb-4 text-lg font-semibold">Order Placed</h2>
            <div className="grid grid-cols-1 gap-4"> {/* Grid layout for two items horizontally */}
              {ordersPlaced.length > 0 ? ordersPlaced.map((order) => (
                <Order key={order.id} order={order} />
              )) : <Empty />}
            </div>
          </div>
          <div className="w-1/3"> {/* Adjusted for one-third */}
            <h2 className="mb-4 text-lg font-semibold">Complete</h2>
            <div className="flex flex-col"> {/* Ensure single column layout */}
              {ordersComplete.length > 0 ? ordersComplete.map((order) => (
                <Order key={order.id} order={order} />
              )) : <Empty />}
            </div>
          </div>
        </div>
      </div>
    </Container>
    </div>
  );
}

export default OrdersPage;
