import React, { useContext } from "react";
import './Productdis.css';
import star from "../Assets/star_icon.png";
import stardull from "../Assets/star_dull_icon.png";
import { Shopcontext } from "../../context/Shopcontext";


function Productdis(props){
    const {product} = props;
    const {addToCart} = useContext(Shopcontext);
    
    return(

        <div className="productdis"> 
           <div className="productdis-left">
              <div className="productdis-img-list">
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
              </div>
              <div className="productdisplay-img">
              <img className="productdisplay-main-img" src={product.image} alt="" />
              </div>
           </div>
           <div className="productdis-right">
               <h1>{product.name}</h1>
               <div className="productdisplay-right-star">
                <img src={star} alt="" />
                <img src={star} alt="" />
                <img src={star} alt="" />
                <img src={star} alt="" />
                <img src={stardull} alt="" />
                <p>{122}</p>
               </div>
               <div className="productdis-right-prices">
                  <div className="productdis-right-price-old">
                    ${product.old_price}
                  </div>
                  <div className="productdis-right-price-new">
                    ${product.new_price}
                  </div>
               </div>
               <div className="productdis-right-descr">
                  fghbrththtrhthrt
                  hrthrthrthr
                  thyrthyrrerjngo34jrokemflkwm3p2i4095849gh
               </div>
               <div className="productdis-right-size">
                <h1>Select size</h1>
                <div className="productdis-right-sizes">
                    <div>S</div>
                    <div>M</div>
                    <div>L</div>
                    <div>XL</div>
                    <div>XXL</div>
                </div>
               </div>
               <button onClick={()=>{addToCart(product.id)}}>ADD TO CART</button>
               <p className="productdis-right-category"><span>Category :</span>Women,Tshirt,croptop</p>
               <p className="productdis-right-category"><span>Tags :</span>Morden,Latest</p>

            </div>
        </div>
    )
}
export default Productdis