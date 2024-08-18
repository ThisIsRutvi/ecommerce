import React, { useContext } from "react";
import './CSS/shopcat.css'
import { Shopcontext } from "../context/Shopcontext";
import drop_icon from '../Components/Assets/dropdown_icon.png';
import Items from '../Components/items/items.jsx'

function Shopcategory(props){

    const {all_product} = useContext(Shopcontext);
    return(
        <div className="shopcat">
            <img className="shopcat_banner" src={props.banner} alt="" />
            <div className="shopcatindex">
                <p>
                    <span>Showing 1-12 </span>out of 36 products
                </p>
                <div className="shopcatsort">
                    sort by<img sec={drop_icon}></img>
                </div>
            </div>
            <div className="shopcatprod">
                {all_product.map((item,i)=>{
                    if(props.category === item.category){
                        return<Items key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price}  old_price={item.old_price}/>
                    }
                    else{
                        return null;
                    }
                })}
            </div>
              <div className="shopcat-load">
                Explore More
              </div>
        </div>
    )
}
export default Shopcategory