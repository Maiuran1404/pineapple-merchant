import { Switch } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiMenu } from "react-icons/bi";
import useStoreStatus from "~/hooks/useStoreStatus";
import Banner from "./Banner";

const navigation = [
  { name: "Orders", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Store", href: "/store" },
];

export default function Header() {
  const { closed, toggleOpen } = useStoreStatus();
  const router = useRouter();
  const pathname = router?.pathname;

  const currentActiveRoute = navigation.find(
    ({ href }) => href === String(pathname),
  )?.name;

  function handleToggleOpenStore() {
    const confirm = window.confirm(
      closed
        ? "Are you sure want to open the store? Customers will be able to place orders"
        : "Are you sure you want to close the store? This will prevent customers from placing orders.",
    );
    if (confirm) {
      toggleOpen();
    }
  }

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex items-center gap-x-8 lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://em-content.zobj.net/source/apple/81/pineapple_1f34d.png"
                alt=""
              />
            </a>
            <div />
            {navigation.map((order) => (
              <Link key={order.name} href={order.href}>
                <div
                  className={clsx(
                    currentActiveRoute === order.name
                      ? " text-gray-900"
                      : "text-gray-400",
                  )}
                >
                  {order.name}
                </div>
              </Link>
            ))}
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-indigo-300"
            >
              <span className="sr-only">Open main menu</span>
              <BiMenu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Switch.Group as="div" className="flex items-center">
              <Switch.Label as="span" className="mr-3 text-sm">
                <span className="font-medium text-gray-900">Close Store</span>{" "}
              </Switch.Label>
              <Switch
                checked={closed}
                onChange={handleToggleOpenStore}
                className={clsx(
                  closed ? "bg-indigo-600" : "bg-gray-200",
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                )}
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    closed ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  )}
                />
              </Switch>
            </Switch.Group>
          </div>
        </nav>
      </header>
      {closed && <Banner />}
    </>
  );
}
