import React from "react";
import './Footer.css'
import footer from '../Assets/logo_big.png'
import instagram from '../Assets/instagram_icon.png'
import pintrest from '../Assets/pintester_icon.png'
import whatsapp from '../Assets/whatsapp_icon.png'

function Footer(){
    return(
        <div className="footer">
           <div className="footerlogo">
            <img src={footer} alt="" />
            <p>SHOPPER</p>
           </div>
           <ul className="footerlinks">
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
           </ul>
           <div className="footer-social-icon">
            <div className="footer-icon-container">
                <img src={instagram} alt=""></img>
            </div>
            <div className="footer-icon-container">
                <img src={pintrest} alt=""></img>
            </div><div className="footer-icon-container">
                <img src={whatsapp} alt=""></img>
            </div>
           </div>
           <div className="footercopy">
            <hr/>
            <p>Copyright @2023 - All Right Reserved</p>
           </div>
        </div>
    )
}
export default Footer