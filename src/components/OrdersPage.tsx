import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { getTransactionProducts, getTransactions } from "~/apiEndoints";
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

  const [orders, setOrders] = useState<OrderProps[]>(initialOrders);
  const [currentTab, setCurrentTab] = useState<OrderStatusType>("pending");
  const filteredOrders = orders.filter((order) =>
    currentTab === "all" ? order : order.status === currentTab,
  );

  function changeOrderStatus(id: string, newStatus: OrderStatusType) {
    const orderIndex = orders.findIndex((order) => order.id === id);
    const newOrders = [...orders];

    newOrders[orderIndex].status = newStatus;
    setOrders(newOrders);
  }
  return (
    <Container>
      <div className="flex flex-col gap-y-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Orders
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Orders from customers will appear here
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Tabs current={currentTab} setTab={setCurrentTab} />
          </div>
        </div>

        {/* <motion.ul layout className="flex h-fit w-full flex-col gap-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Order
                key={order.id}
                order={order}
                changeStatus={changeOrderStatus}
              />
            ))
          ) : (
            <Empty />
          )}
        </motion.ul> */}

        {filteredOrders.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Order date
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <motion.tbody layout className="divide-y divide-gray-200 bg-white">
              {filteredOrders.map((order) => (
                <Order
                  key={order.id}
                  order={order}
                  changeStatus={changeOrderStatus}
                />
              ))}
            </motion.tbody>
          </table>
        ) : (
          <Empty />
        )}

        {store?.id && <OrderList storeId={store.id} />}
      </div>
    </Container>
  );
}

export default OrdersPage;

const OrderList = ({ storeId }: { storeId: string }) => {
  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = useQuery({
    queryKey: ["orders", storeId],
    queryFn: () => getTransactions(storeId),
    enabled: !!storeId,
  });

  return (
    <div>
      {isTransactionsLoading && <p>Loading transactions...</p>}
      {isTransactionsError && <p>Error fetching transactions</p>}

      {transactions && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {transactions.map((order) => (
            <div key={order.id} className="rounded border p-4 shadow-md">
              <h2 className="mb-2 text-xl font-semibold">{order.shopName}</h2>
              <p className="mb-2 text-gray-600">{order.shopLocation}</p>
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">Products:</h3>
                {/* Fetch and display products */}
                <ProductList transactionId={order.id} />
              </div>
              <p className="text-gray-700">Total Amount: ${order.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ProductListProps {
  transactionId: string;
}

const ProductList: React.FC<ProductListProps> = ({ transactionId }) => {
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery({
    queryKey: ["products", transactionId],
    queryFn: () => getTransactionProducts(transactionId),
    enabled: !!transactionId,
  });

  if (isProductsLoading) return <p>Loading products...</p>;
  if (isProductsError) return <p>Error fetching products</p>;

  return (
    <ul>
      {products &&
        products.map((product) => (
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
