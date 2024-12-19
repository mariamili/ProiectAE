import { useEffect, useState } from "react";
import { getProductCategories } from "../routes/products";

const Filters = (props) => {
  const { setFilters } = props;
  const [categories, setCategories] = useState([]);

  const handleGetProductCategories = async () => {
    const response = await getProductCategories();
    console.log(response);
    setCategories(response);
  };

  const handleCategoryChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: event.target.value,
    }));
  };

  useEffect(() => {
    if (!categories.length) {
      handleGetProductCategories();
    }
  }, []);

  return (
    <div className="filtersWrapper">
      <div>
        <label htmlFor="categorySelect">Categorie</label>
      </div>
      <div>
        <select id="categorySelect" onChange={handleCategoryChange}>
          {categories?.map((category,index) => (
            //<option key={category.slug} value={category.slug}>
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
