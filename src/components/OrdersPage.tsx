import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getTransactionProducts,
  getTransactions,
  subscribeToOrdersRealTime
} from "~/apiEndoints";
import Container from "~/components/Container";
import Order from "~/components/Order";
import Tabs from "~/components/Tabs";
import {
  orders as initialOrders,
  type OrderProps,
  type OrderStatusType,
} from "~/constants/orders";
import useStore from "~/hooks/useStore";
import Empty from "./Empty";

function OrdersPage() {
  const { store } = useStore();
  const [currentTab, setCurrentTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOrdersUpdate = (updatedOrders, error) => {
      if (error) {
        console.error("Error fetching orders:", error);
        // Handle error state
        return;
      }
      setOrders(updatedOrders);
      setLoading(false);
    };
  
    // Subscribe to real-time updates
    const unsubscribe = subscribeToOrdersRealTime(handleOrdersUpdate);
  
    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  const filteredOrders = orders.filter(
    (order) => currentTab === "all" || order.status === currentTab,
  );

  function changeOrderStatus(id, newStatus) {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order,
    );
    setOrders(updatedOrders);
  }

  console.log(orders);

  return (
    <Container>
      <div className="flex flex-col gap-y-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Orders
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Orders from customers will appear here.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Tabs current={currentTab} setTab={setCurrentTab} />
          </div>
        </div>

        <h1>Orders</h1>
        {orders.length > 0 ? (
          <motion.div layout className="flex flex-col gap-6">
            {orders.map((order) => (
              <Order
                key={order.id}
                order={order}
                changeStatus={changeOrderStatus}
              />
            ))}
          </motion.div>
        ) : (
          <Empty />
        )}
      </div>
    </Container>
  );
}

export default OrdersPage;

const OrderList = ({ storeId }) => {
  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", storeId],
    queryFn: () => getTransactions(storeId),
    enabled: !!storeId,
  });

  if (isLoading) return <p>Loading transactions...</p>;
  if (isError) return <p>Error fetching transactions.</p>;

  return transactions?.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {transactions.map((order) => (
        <div key={order.id} className="rounded border p-4 shadow-md">
          <h2 className="mb-2 text-xl font-semibold">{order.shopName}</h2>
          <p className="mb-2 text-gray-600">{order.shopLocation}</p>
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">Products:</h3>
            <ProductList transactionId={order.id} />
          </div>
          <p className="text-gray-700">Total Amount: ${order.amount}</p>
        </div>
      ))}
    </div>
  ) : (
    <p>No transactions found.</p>
  );
};

const ProductList = ({ transactionId }) => {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", transactionId],
    queryFn: () => getTransactionProducts(transactionId),
    enabled: !!transactionId,
  });

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Error fetching products.</p>;

  return (
    <ul>
      {products?.map((product) => (
        <li key={product.id} className="mb-2 flex items-center">
          <img
            src={product.photo}
            alt={product.name}
            className="mr-2 h-8 w-8"
          />
          <span>
            {product.name} - {product.quantity}x
          </span>
        </li>
      ))}
    </ul>
  );
};
