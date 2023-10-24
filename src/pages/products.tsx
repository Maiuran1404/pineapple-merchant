import { BiPlus } from "react-icons/bi";
import Container from "~/components/Container";
import Product from "~/components/product/Product";
import useProducts from "~/hooks/useProducts";

function Products() {
  const { products } = useProducts();
  return (
    <Container>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Your products
        </h1>
        <button
          onClick={() => void {}}
          type="button"
          title="Add a new product"
          className="flex h-10 w-10 items-center justify-center gap-1 rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <BiPlus size={24} />
        </button>
      </div>

      <form className="mt-12">
        <div>
          <h2 className="sr-only">Products in your store</h2>

          <ul role="list" className="flex flex-col gap-3">
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </ul>
        </div>
      </form>
    </Container>
  );
}

export default Products;
