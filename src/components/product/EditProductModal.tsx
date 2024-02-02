import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { BiX } from "react-icons/bi";
import { currency } from "~/constants/misc";
import type { ItemProps } from "~/constants/orders";

export default function EditProductModal({
  product,
  updateProduct,
  open,
  setOpen,
}: {
  product?: ItemProps;
  updateProduct: (updatedProduct: ItemProps) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const cancelButtonRef = useRef(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(product?.name ?? "");
  const [price, setPrice] = useState<number>(product?.price ?? 0);
  const [description, setDescription] = useState<string>(
    product?.description ?? "",
  );
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null,
  );

  function handleChangeName(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function handleChangePrice(event: React.ChangeEvent<HTMLInputElement>) {
    const nunber = Number(event.target.value);

    if (Number.isNaN(nunber)) return;

    if (nunber < 0) return;

    setPrice(nunber);
  }

  function handleChangeDescription(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    setDescription(event.target.value);
  }

  function handleChangeImage(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length < 1) return;
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setImage(file);

      // Read and display image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      clearFile();
    }
  }

  function clearFile() {
    setImage(undefined);
    setImagePreview(null);
  
    // Check if formRef.current is not null before calling reset
    if (formRef.current !== null) {
      formRef.current.reset();
    }
  }
  

  // async function handleApplyChanges() {
  //   setIsLoading(true);
  
  //   if (product?.id) {
  //     // Await the async operation to ensure it completes before proceeding
  //     await updateProduct({
  //       ...product,
  //       name,
  //       price: Number(price),
  //       description,
  //       image,
  //       imageAlt: image?.name,
  //     } as ItemProps); // Assert that the object matches `ItemProps`
      
  //   } else {
  //     // Handle the case where product.id is undefined
  //     // Maybe show an error message or ensure this function can't be called without a valid id
  //     console.error("Product ID is undefined, cannot update product.");
  //     // Implement your logic for handling this error case
  //   }
  
  //   setOpen(false);
  //   setIsLoading(false);
  // }
  
  
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                {isLoading && (
                  <div className="absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-white/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 text-gray-900">
                      <AiOutlineLoading size={64} className="animate-spin" />
                      <div className="text-xl font-medium ">Updating...</div>
                    </div>
                  </div>
                )}
                <form>
                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Product
                          </h2>
                          <p className="mt-1 text-sm leading-6 text-gray-600">
                            Edit product details
                          </p>
                        </div>
                        <div
                          onClick={() => setOpen(false)}
                          title="Close modal"
                          className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-300 hover:text-gray-900"
                        >
                          <BiX size={24} />
                        </div>
                      </div>

                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Product name
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-900 sm:max-w-md">
                              <input
                                type="text"
                                name="Product name"
                                value={name}
                                onChange={handleChangeName}
                                id="product-name"
                                autoComplete="given-name"
                                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-4">
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Price
                          </label>
                          <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">
                                {currency.token}
                              </span>
                            </div>
                            <input
                              type="number"
                              name="price"
                              value={price}
                              onChange={handleChangePrice}
                              id="price"
                              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                              placeholder="0.00"
                              aria-describedby="price-currency"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <span
                                className="text-gray-500 sm:text-sm"
                                id="price-currency"
                              >
                                {currency.code}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="about"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Description
                          </label>
                          <div className="mt-2">
                            <textarea
                              id="description"
                              name="description"
                              rows={3}
                              value={description}
                              onChange={handleChangeDescription}
                              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            Write a few sentences the product.
                          </p>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="photo"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Photo
                          </label>
                          <div className="mt-2 flex items-center gap-x-3">
                            <div className="relative h-12 w-12 rounded-full border border-gray-300 bg-gray-300 text-gray-300">
                              {imagePreview && (
                                <img
                                  src={imagePreview}
                                  alt={image?.name ?? "Product image"}
                                  className="h-12 w-12 rounded-full"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            <form ref={formRef}>
                              <input
                                type="file"
                                name="photo"
                                onChange={handleChangeImage}
                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              />
                            </form>
                            {image && (
                              <button onClick={clearFile}>
                                <BiX size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  {/* <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 sm:col-start-2"
                    onClick={handleApplyChanges}
                  >
                    Apply changes
                  </button> */}
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
