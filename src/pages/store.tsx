import { useState, ChangeEvent, FormEvent } from "react";
import { addFormDataToFirestore } from "~/apiEndpoints"; // Adjust the path as necessary
import ShopForm from "~/components/ShopForm";
import { Shop } from "~/types"; // Ensure this is correctly defined in your types

const Store = () => {



  return (
    <>
      <h1>Store Setup</h1>
      <ShopForm shopId={'abcabcabc'}/>
    </>
  );
};

export default Store;
