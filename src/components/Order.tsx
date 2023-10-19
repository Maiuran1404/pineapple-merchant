"use client";
import { clsx } from "clsx";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Moment from "react-moment";
import type { OrderProps, OrderStatusType } from "~/constants/orders";
import { statuses } from "~/constants/statuses";

const variants = {
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

function longerThanAWeekAgo(date: Date) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return date < weekAgo;
}

function OrderTime({ date }: { date: Date }) {
  const isOld = longerThanAWeekAgo(date);

  if (isOld) {
    return <Moment format="DD. MMMM, YYYY HH:MM">{String(date)}</Moment>;
  }

  return <Moment fromNow>{String(date)}</Moment>;
}

function Order({
  order,
  changeStatus,
}: {
  order: OrderProps;
  changeStatus: (id: string, newStatus: OrderStatusType) => void;
}) {
  const controls = useAnimation();
  const customer = order.customer;

  function handleCompleteOrder() {
    if (typeof window === "undefined") return;
    window.alert(`Order ${order.id} completed!`);
    controls
      .start({ opacity: 0, scale: 0.8, transition: { duration: 0.3 } })
      .then(() => {
        changeStatus(order.id, "complete");
      })
      .catch((e) => {
        console.error(e);
      });
  }

  const isComplete = order.status === "complete";

  return (
    <motion.tr layout variants={variants}>
      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
        <div className="flex items-center">
          <div className="h-11 w-11 flex-shrink-0">
            <Image
              className="h-12 w-12 rounded-lg"
              src={order.item.image}
              alt={order.item.alt}
            />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{order.item.name}</div>
            <div className="mt-1 font-mono text-gray-500">{order.item.id}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        <div className="text-gray-900">{order.customer.name}</div>
        <div className="mt-1 font-mono text-gray-500">{order.customer.id}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        <div
          className={clsx(
            statuses[order.status],
            "w-fit rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
          )}
        >
          {order.status}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        <OrderTime date={order.date} />
      </td>
      <td className="relative flex justify-end whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        {isComplete ? (
          <div className="w-fit rounded-full bg-gray-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          <button
            onClick={handleCompleteOrder}
            type="button"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Complete
          </button>
        )}
      </td>
    </motion.tr>
  );

  return (
    <motion.li
      layout
      variants={variants}
      className="overflow-hidden rounded-xl border border-gray-200"
    >
      <div className="flex items-center justify-between border-b border-gray-900/5 bg-gray-50 p-6">
        <div className="flex items-center gap-x-4">
          <Image
            src={order.item.image}
            alt={order.item.name}
            className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
          />
          <div className="text-sm font-medium leading-6 text-gray-900">
            {customer.name}
          </div>
        </div>
        <div>
          {isComplete ? (
            <div className="rounded-full bg-gray-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <button
              onClick={handleCompleteOrder}
              type="button"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Complete
            </button>
          )}
        </div>
      </div>

      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Placed</dt>
          <dd className="text-gray-700">
            <OrderTime date={order.date} />
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Quantity</dt>
          <div className="font-medium text-gray-900">{order.quantity}</div>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Status</dt>

          <div
            className={clsx(
              statuses[order.status],
              "rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
            )}
          >
            {order.status}
          </div>
        </div>
      </dl>
    </motion.li>
  );
}

export default Order;
