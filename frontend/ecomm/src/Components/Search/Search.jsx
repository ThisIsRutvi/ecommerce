import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import './Search.css'
import Searchbtn from '../Assets/magnifying-glass-solid-full.svg'
function Search(){
  const [search,setSearch] = useState("")
  const [products,setProducts] = useState([])
  const [showList,setShowList] = useState(false)

  const navigate = useNavigate()


 const handleChange = (e)=>{
    const value = e.target.value
    setSearch(value)

    if(value.trim()===""){
      setShowList(false)
      setProducts([])
      return
    }

    setShowList(true)
    fetchproduct(value)
 }

 const fetchproduct = async (name) => {
  try {
    const res = await axios.get("http://localhost:4000/search", {
      params: { name }
    })
    setProducts(res.data)

  } catch (err) {
    console.log(err)
  }
 }

 const handleProductClick=(id)=>{
  setSearch("")
  setProducts([])
  setShowList(false)
  navigate(`/product/${id}`)
 }

  return(
    <div className="main">
  <div className="search">
      <img className="search-img" src={Searchbtn}></img>
       <input placeholder="Search..." type="text" name="name" value={search} onChange={handleChange}></input>


        {showList && products.length > 0 && (
          <div className="list">
       <div className="product-list">
        <ul>
        {products.map((item,i)=>(
            <li key={item.id} onClick={()=>handleProductClick(item.id)}>{item.name}</li>
        ))}
        </ul>
         </div>
       </div>
        )}
      
  </div>
  </div>)
}

export default Search