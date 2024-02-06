import { motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import { updateOrderStatus } from "~/apiEndpoints"; // Make sure to update the import path
import { format, formatDistanceToNow } from "date-fns";
import { TOrder } from "~/types";

// Assuming TOrder is defined elsewhere and imported appropriately
interface OrderProps {
  order: TOrder;
}

const statusToColor = {
  READY: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETE: "bg-blue-100 text-blue-800",
  PICKED_UP: "bg-gray-100 text-gray-800",
};

// Adjusted to include OrderProps for type checking
function Order({ order }: OrderProps) {
  const [orderStatus, setOrderStatus] = useState<string>(order.status);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrderStatus(newStatus); // Assuming this updates your local app state
    } catch (error) {
      console.error("Failed to update order status:", error);
      // Implement additional error handling as needed
      // For example, displaying an error message to the user
    }
  };

  const formatProductOptions = (options?: Record<string, string>) => {
    return options
      ? Object.entries(options).map(([key, value]) => (
          <div key={key}>{`${key}: ${value}`}</div>
        ))
      : null;
  };

  return (
    <div className="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-lg">
      <div className="bg-blue-gray-500 shadow-blue-gray-500/40 relative mx-4 mt-4 overflow-hidden rounded-xl bg-clip-border text-white shadow-lg">
        <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60"></div>
        <button
          className="!absolute  right-4 top-4 h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase text-red-500 transition-all hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path>
            </svg>
          </span>
        </button>
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <h5 className="text-blue-gray-900 block font-sans text-xl font-medium leading-snug tracking-normal antialiased">
            {order.buyerName}
          </h5>
          <p className="text-blue-gray-900 flex items-center gap-1.5 font-sans text-base font-normal leading-relaxed antialiased">
            {formatDistanceToNow(order.purchaseTime.toDate(), {
              addSuffix: true,
            })}
          </p>
        </div>
        <p className="block font-sans text-base font-light leading-relaxed text-gray-700 antialiased">
          {order.products?.map((product, index) => (
            <div key={index} className="mb-4">
              {" "}
              {/* Added mb-4 for margin-bottom */}
              <div className="flex justify-between">
                <div>
                  <h4 className="text-lg font-semibold">{product.name}</h4>
                  <p className="text-lg text-gray-900">
                    {formatProductOptions(product.options)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </p>
      </div>
      <div className="p-6 pt-3">
        {orderStatus === "ORDER_PLACED" ? (
          <button
            onClick={() => {
              // Call the async function within a synchronous handler
              handleStatusChange("READY").catch((error) =>
                console.error("Error updating status:", error),
              );
            }}
            className="block w-full select-none rounded-lg bg-gray-900 px-7 py-3.5 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Klar nå
          </button>
        ) : (
          orderStatus === "READY" && (
            <button
              onClick={() => {
                // Call the async function within a synchronous handler
                handleStatusChange("PICKED_UP").catch((error) =>
                  console.error("Error updating status:", error),
                );
              }}
              className="block w-full select-none rounded-lg bg-gray-900 px-7 py-3.5 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Plukket opp
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default Order;
