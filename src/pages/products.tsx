import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import Container from "~/components/Container";
import EditProductModal from "~/components/product/EditProductModal";
import Product from "~/components/product/Product";
import type { ItemProps } from "~/constants/orders";
// import useProducts from "~/hooks/useProducts";

function Products() {
  // const { isLoading, error, products, addProduct } = useProducts();
  const [open, setOpen] = useState(false);

  function handleSetOpen(open: boolean) {
    setOpen(open);
  }

  return (
    <Container>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Your products
        </h1>
        <button
          onClick={() => handleSetOpen(!open)}
          type="button"
          title="Add a new product"
          className="flex h-10 w-10 items-center justify-center gap-1 rounded-full bg-gray-900 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          <BiPlus size={24} />
        </button>
      </div>

      <form className="mt-12">
        <div>
          <h2 className="sr-only">Products in your store</h2>

          {/* <ProductList
            isLoading={isLoading}
            error={error}
            products={products}
          /> */}
        </div>
      </form>

      {/* <EditProductModal
        updateProduct={addProduct}
        open={open}
        setOpen={handleSetOpen}
      /> */}
    </Container>
  );
}

export default Products;

const ProductList = ({
  isLoading,
  error,
  products,
}: {
  isLoading: boolean;
  error: unknown;
  products: ItemProps[];
}) => {
  if (!products || isLoading)
    return (
      <ul role="list" className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            key={i}
            className="h-64 w-full animate-pulse rounded-xl border border-gray-200 bg-gray-100"
          />
        ))}
      </ul>
    );

  if (error) return <div>An error has occurred</div>;

  return (
    <ul role="list" className="flex flex-col gap-3">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </ul>
  );
};
