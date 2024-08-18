import './App.css';
import Navbar from './Components/Navbar/Navbar.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './pages/Shop.jsx';
import Shopcategory from './pages/Shopcategory.jsx';
import Product from './pages/Product.jsx';
import Loginsighnup from './pages/Loginsighnup.jsx';
import Cart from './pages/Cart.jsx';
import Footer from './Components/Footer/Footer.jsx';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'


function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Navbar></Navbar>
          <Routes>
            <Route path='/' element={<Shop/>} />
            <Route path='/mens' element={<Shopcategory banner ={men_banner} category="men" />} />
            <Route path='/womens' element={<Shopcategory banner ={women_banner} category="women" />} />
            <Route path='/kids' element={<Shopcategory banner ={kid_banner} category="kid" />} />
            <Route path='/product' element={<Product />}>
              <Route path=':productId' element={<Product />} />
            </Route>
            <Route path='/cart' element={<Cart />} />
            <Route path='/login' element={<Loginsighnup />} />
          </Routes>
          <Footer></Footer>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
