import { sortingOptions } from "../constants/sort";
import { getDummyApiUrl } from "../utils/envUtils";
import localProducts from "../localProducts.json";

export const getProductCategories = async () => {
  const result = await fetch(`${getDummyApiUrl()}/products/categories`);
  console.log("Fetching from:",`${getDummyApiUrl()}/products/categories`);
  const response = await result.json();
  const filteredCategroy = response.filter(
    (category) => category !== "electronics"
  );
  return filteredCategroy;
};

export const getProducts = async (filters/*, sortingId*/) => {
  let url = `${getDummyApiUrl()}/products`;
  console.log("Fetching from:", url);

  

  if (filters.category) {
    url += `/category/${filters.category}`;
    console.log("Fetching from:", url);
  }

  // if (sortingId) {
  //   const sortOption = sortingOptions.find((option) => option.id === sortingId);

  //   if (sortOption) {
  //     url += `?sortBy=${sortOption.key}&order=${sortOption.order}`;
  //     console.log("Fetching from:", url);
  //   }
  // }

  const result = await fetch(url);
  
  const response = await result.json();
  console.log(response);
  // Filtrează produsele pentru a elimina categoria "electronics"
  const filteredProducts = response.filter(
    (product) => product.category !== "electronics"
  );
  let locale=localProducts;
  if (filters.category) {
    locale=localProducts.filter((product)=>product.category==filters.category)
  }
  const combinedProducts = [...filteredProducts, ...locale];
  return combinedProducts;
};
