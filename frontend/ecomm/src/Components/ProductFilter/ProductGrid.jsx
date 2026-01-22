import axios from "axios"
import { useEffect, useState ,useContext} from "react"
import Items from "../items/items"
import FilterProvider from "../../context/FilterContext";
import { FilterContext } from "../../context/FilterContext";
import { Shopcontext } from "../../context/Shopcontext";
import './ProductGrid.css'

function ProductGrid(){
   const [product,setProduct] = useState([])

  const{category,setCategory,priceRanage,setPriceRanage,applyFilter} = useContext(Shopcontext)

   const fetchProduct = (min, max, categoryArr) => {
  const params = {
    minprice: min,
    maxprice: max,
  };

  if (categoryArr.length > 0) {
    params.category = categoryArr.join(',');
  }

  axios.get('http://localhost:4000/filterproduct', { params })
    .then(res => setProduct(res.data))
    .catch(err => console.log(err));
};


   useEffect(
    ()=>{fetchProduct(priceRanage[0],priceRanage[1],category)
   },[])

    useEffect(
    ()=>{fetchProduct(priceRanage[0],priceRanage[1],category)
   },[applyFilter])
   return(
    <div className="gridmain">
      <div className="grid">
    { 
        product.map((item,i)=>(<Items key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price}  old_price={item.old_price}/>))
    }
    </div>
    </div>
   )
}

export default ProductGrid