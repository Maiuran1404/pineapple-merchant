import clsx from "clsx";
import { OrderStatusType } from "~/constants/orders";

const tabs = ["pending", "all", "complete", "failed"];

// function to capitalize the first letter of a string
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Tabs({
  current,
  setTab,
}: {
  current: OrderStatusType;
  setTab: (tab: OrderStatusType) => void;
}) {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          defaultValue={tabs[0]}
        >
          {tabs.map((tab) => (
            <option key={tab}>{tab}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setTab(tab as OrderStatusType)}
              className={clsx(
                tab === current
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-200 hover:text-gray-900",
                "rounded-md px-3 py-2 text-sm font-medium",
              )}
              aria-current={tab === current ? "page" : undefined}
            >
              {capitalizeFirstLetter(tab)}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Tabs;
