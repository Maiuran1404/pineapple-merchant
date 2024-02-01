import { motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import { updateOrderStatus } from "~/apiEndoints";

// Assuming you have a utility to map statuses to Tailwind CSS classes
// import { statusToColor } from '~/utils';

const statusToColor = {
  READY: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETE: "bg-blue-100 text-blue-800",
  // Add other statuses as needed
};

function Order({ order }) {
  const [orderStatus, setOrderStatus] = useState(order.status);

  const handleStatusChange = async () => {
    const success = await updateOrderStatus(order.id, "COMPLETE");
    if (success) {
      setOrderStatus("COMPLETE");
    } else {
      // Handle the error case (e.g., show a message to the user)
    }
  };

  const formatProductOptions = (options) => {
    return options ? Object.entries(options).map(([key, value]) => `${key}: ${value}`).join(', ') : '';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-lg border p-4 shadow transition hover:shadow-md"
    >
      {order.partyId && (
        <div className="p-2 bg-purple-200 text-purple-800 text-sm font-semibold rounded-t-lg">
          Group purchase
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">{order.buyerName}</h3>
          <p className="text-gray-600">{order.shopName}</p>
        </div>
        <div
          className={clsx(
            "rounded-full px-2 py-1 text-sm font-semibold",
            statusToColor[orderStatus],
          )}
        >
          {orderStatus}
        </div>
      </div>
      <div className="space-y-4">
        {order.products && order.products.map((product, index) => (
          <div key={index} className="border-b last:border-b-0">
            <div className="flex justify-between">
              <div>
                <h4 className="text-md font-bold">{product.name}</h4>
                <p className="text-sm text-gray-500">{formatProductOptions(product.options)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{product.quantity} x ${product.price}</p>
              </div>
            </div>
          </div>
        ))}
        {order.products && (
          <div className="text-lg font-bold text-right">
            Total: ${order.products.reduce((total, product) => total + (product.quantity * product.price), 0).toFixed(2)}
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        {orderStatus !== "COMPLETE" && (
          <button
            onClick={handleStatusChange}
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Mark as Complete
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default Order;