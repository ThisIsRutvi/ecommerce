import React, { useContext } from "react";
import { Shopcontext } from "../context/Shopcontext";
import { useParams } from "react-router-dom";
import Breadcrums from "../Components/Breadcrums/Breadcrums.jsx";
import Productdis from "../Components/Productdis/Productdis.jsx";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox.jsx";
//import RelatedProducts from "../Components/RelatedProducts/RelatedProducts.jsx";

function Product(){
    const {all_product} = useContext(Shopcontext);
    const {productId} = useParams();
    const product = all_product.find((e)=> e.id === Number(productId));
    return(
        <div>
          <Breadcrums product={product}></Breadcrums>
          <Productdis product={product}></Productdis>
          <DescriptionBox></DescriptionBox>
        </div>
    )
}
export default Product

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Breadcrums from "../Components/Breadcrums/Breadcrums.jsx";
// import Productdis from "../Components/Productdis/Productdis.jsx";
// import DescriptionBox from "../Components/DescriptionBox/DescriptionBox.jsx";
// import axios from "axios";

// function Product() {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     axios.get(`http://localhost:4000/product/${productId}`)
//       .then(res => setProduct(res.data))
//       .catch(err => console.log(err));
//   }, [productId]);

//   if (!product) return <div>Loading...</div>;

//   return (
//     <div>
//       <Breadcrums product={product} />
//       <Productdis product={product} />
//       <DescriptionBox />
//     </div>
//   );
// }

// export default Product;
