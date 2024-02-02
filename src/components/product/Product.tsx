import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { currency } from "~/constants/misc";
import type { ItemProps } from "~/constants/orders";
import useProducts from "~/hooks/useProducts";
import EditProductModal from "./EditProductModal";

const variants = {
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

function Product({ product }: { product: ItemProps }) {
  const { removeProduct, updateProduct } = useProducts();
  const [outOfStock, setOutOfStock] = useState(false);
  const [open, setOpen] = useState(false);

  function handleRemoveProduct(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const shouldRemove = window.confirm(
      "Are you sure you want to remove this product?",
    );
    if (shouldRemove) {
      removeProduct(product);
    }
  }

  function handleToggleOutOfStock() {
    const shouldToggle = window.confirm(
      `Are you sure you want to ${
        outOfStock
          ? "put this product in stock"
          : "mark this product as out of stock"
      }?`,
    );
    if (shouldToggle) {
      setOutOfStock(!outOfStock);
    }
  }

  function handleToggleModal(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOpen(!open);
  }

  return (
    <>
      <motion.li
        layout
        variants={variants}
        className="overflow-hidden rounded-xl border border-gray-200"
      >
        <div className="flex items-center justify-between border-b border-gray-900/5 bg-gray-50 p-6">
          <div className="flex items-center gap-x-4">
            {/* <img
              src={product.image}
              alt={product.imageAlt ?? product.name}
              className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
            /> */}
            <div className="text-sm font-medium leading-6 text-gray-900">
              {product?.name}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              title="Delete product"
              onClick={handleRemoveProduct}
              className="cursor-pointer rounded-full bg-gray-200 p-2 text-gray-600 hover:bg-red-500 hover:text-white"
            >
              <BiTrash size={20} />
            </button>
            <button
              onClick={handleToggleModal}
              title="Edit product"
              className="cursor-pointer rounded-full bg-gray-200 p-2 text-gray-600 hover:bg-gray-300 hover:text-gray-900"
            >
              <BiEditAlt size={20} />
            </button>
          </div>
        </div>

        <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500">Price</dt>
            <dd className="text-gray-700">
              {currency.token + " " + product.price}
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500">Description</dt>
            <dd className="text-gray-700">{product.description ?? "-"}</dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500">In stock</dt>
            <dd>
              <Switch
                checked={!outOfStock}
                onChange={handleToggleOutOfStock}
                className={clsx(
                  !outOfStock ? "bg-gray-900" : "bg-gray-200",
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
                )}
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    !outOfStock ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  )}
                />
              </Switch>
            </dd>
          </div>
        </dl>
      </motion.li>

      <EditProductModal
        product={product}
        updateProduct={updateProduct}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

export default Product;
