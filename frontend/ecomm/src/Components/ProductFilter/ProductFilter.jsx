import { useContext } from "react";
import { Shopcontext } from "../../context/Shopcontext";
import Drawer from "@mui/material/Drawer";
import Filter from "./PFilter";
import ProductGrid from "./ProductGrid";
import './ProductFilter.css'

function ProductFilter(){
    const {isFilter,setIsFilter} = useContext(Shopcontext)

    return(
   <div>   <div className="filter-layout">
        <aside className="filter-sidebar">
          <Filter />
        </aside>

        <main className="product-area">
          <ProductGrid />
        </main>
      </div>

        </div>
    )
}

export default ProductFilter