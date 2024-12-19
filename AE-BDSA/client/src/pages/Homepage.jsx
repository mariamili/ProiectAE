import { useState } from "react";
import Filters from "../components/Filters";
import Products from "../components/Products";
import DataSorting from "../components/DataSorting";
import "./homepage.css";


function Homepage() {
  const [filters, setFilters] = useState({
    category: "",
  });
  const [sorting, setSorting] = useState(1);

    // Function to clear the filters
    const clearFilters = () => {
      setFilters({ category: "" }); // Reset to initial state
    };

  return (
    <div className="homepageWrapper">
  <div className="filtersContainer">
    <Filters setFilters={setFilters} />
    <button
      onClick={clearFilters}
      className="clearFiltersButton"
    >
      Sterge filtre
    </button>
  </div>
  <div className="productsContainer">
    <Products filters={filters} sorting={sorting} />
  </div>
</div>

  );
}

export default Homepage;
