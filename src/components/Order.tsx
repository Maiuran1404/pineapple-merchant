import { motion } from 'framer-motion';
import { useState } from 'react';
import { clsx } from 'clsx';

// Assuming you have a utility to map statuses to Tailwind CSS classes
// import { statusToColor } from '~/utils';

// Example of status to color mapping utility
const statusToColor = {
  READY: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  COMPLETE: 'bg-blue-100 text-blue-800',
  // Add other statuses as needed
};

function Order({ order }) {
  const [orderStatus, setOrderStatus] = useState(order.status);

  // Example of function to handle status change, adjust based on your logic
  const handleStatusChange = (newStatus) => {
    setOrderStatus(newStatus);
    // Add logic to update the order status in your database
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 border rounded-lg shadow hover:shadow-md transition"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold">{order.buyerName}</h3>
          <p className="text-gray-600">{order.shopName}</p>
        </div>
        <div
          className={clsx(
            'px-2 py-1 rounded-full text-sm font-semibold',
            statusToColor[orderStatus]
          )}
        >
          {orderStatus}
        </div>
      </div>
      {/* <ul className="list-disc pl-5 mb-4">
        {order.products.map((product, index) => (
          <li key={index} className="text-gray-700">{product}</li>
        ))}
      </ul> */}
      <div className="flex justify-end">
        {orderStatus !== 'COMPLETE' && (
          <button
            onClick={() => handleStatusChange('COMPLETE')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Mark as Complete
          </button>
        )}
      </div>
    </motion.div>
  );
}


export default Order;
