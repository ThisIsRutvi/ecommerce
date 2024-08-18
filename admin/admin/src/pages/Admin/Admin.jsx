import React from "react";
import './Admin.css';
import Sidebar from "../../componenets/sidebar/Sidebar.jsx";
import {Routes, Route} from 'react-router-dom'
import Addproduct from "../../componenets/addproduct/Addproduct.jsx";
import Listproduct from "../../componenets/Listproduct/Listproduct.jsx";

function Admin(){

  return(
    <div className="admin">
      <Sidebar></Sidebar>
      <Routes>
        <Route path='/addproduct' element={<Addproduct></Addproduct>}></Route>
        <Route path='/listproduct' element={<Listproduct> </Listproduct>}></Route>
      </Routes>
    </div>
  )
}

export default Admin