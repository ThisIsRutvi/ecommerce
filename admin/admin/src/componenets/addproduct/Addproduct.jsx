import './Addproduct.css';
import upload_area from '../../assets/upload_area.svg'
import { useState } from 'react';
function Addproduct(){

    const [image,setImage] = useState(false);
    const [productDetails,setProductDetails] = useState({
        name:"",
        image:"",
        category:"women",
        new_price:"",
        old_price:""
    })

    const imghndler = (e) =>{
        setImage(e.target.files[0]); 
    }

    const changeHandler = (e)=>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }

    const Add_product = async ()=>{
       //console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product',image);
        await fetch('http://localhost:4000/upload',{
            method:'POST',
            headers:{
                Accept:'application/json',
            },
<<<<<<< HEAD
            body:formData, 
        }).then((resp)=> resp.json()).then((data)=>{responseData=data})//promise//parse data
=======
            body:formData,
        }).then((resp)=> resp.json()).then((data)=>{responseData=data})
>>>>>>> 9f2ac68eeb2e96cae2627e63a47ee74e74e7e08f
   
        if(responseData.success){
            product.image = responseData.img_url;
            console.log(product);
            await fetch('http://localhost:4000/addproduct',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("product added"):alert("failed")
            })
        }
    }

    return(<>
            <div className="add-product">
                 <div className="addproduct-item">
                    <p>Product title</p>
                    <input value={productDetails.name} onChange={changeHandler}type='text' name='name' placeholder='Type here'></input>
                 </div>
                 <div className="addproduct-price">
                    <div className="addproduct-item">
                        <p>Price</p>
                        <input value={productDetails.old_price} onChange={changeHandler} type='text' name='old_price' placeholder='Type here'></input>
                    </div>
                    <div className="addproduct-item">
                        <p>Offer Price</p>
                        <input value={productDetails.new_price} onChange={changeHandler}type='text' name='new_price' placeholder='Type here'></input>
                    </div>
                 </div>
                 <div className="addproduct-item">
                    <p>Product Category</p>
                    <select value={productDetails.category} onChange={changeHandler}name='category' className='add-product-selector' >
                        <option value="women">Women</option>
                        <option value="men">men</option>
                        <option value="kid">kid</option>
                    </select>
                 </div>
                 <div className="addproduct-item">
                    <label htmlFor='file-input'>
                        <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img'></img>
                    </label>
                    <input onChange={imghndler} type='file' name='image' id='file-input' hidden></input>
                 </div>
                 <button onClick={()=>{Add_product()}}className='addproduct-btn'>ADD</button>
            </div>
          </>
    )
}

export default Addproduct
