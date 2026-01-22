import React from "react";
import Navbar from "./componenets/Navbar/Navbar";
import Admin from "./pages/Admin/Admin";
import Login from "./pages/Login/Login";
import Sidebar from "./componenets/sidebar/Sidebar";
import Addproduct from "./componenets/addproduct/Addproduct.jsx";
import Listproduct from "./componenets/Listproduct/Listproduct.jsx";
import Hide from "./componenets/Hide/Hide.jsx";

function App(){


  return(
    <div>
     
      <Hide>
       <Navbar></Navbar>
       </Hide>
      
      <Admin></Admin>
      

     
    </div>
  )
}

export default App