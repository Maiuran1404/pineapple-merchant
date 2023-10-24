import { motion } from "framer-motion";
import { useState } from "react";
import Container from "~/components/Container";
import Order from "~/components/Order";
import Tabs from "~/components/Tabs";
import {
  orders as initialOrders,
  type OrderProps,
  type OrderStatusType,
} from "~/constants/orders";
import Empty from "./Empty";

function OrdersPage() {
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
      </div>
    </Container>
  );
}

export default OrdersPage;
