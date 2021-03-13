import { makeVar } from "@apollo/client";

export const cartItemsVar = makeVar([
  {
    name: "cart item",
    price: 0,
    imgUrl: "",
  },
]);
