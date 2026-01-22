import { useContext, useState } from "react"
import Slider from '@mui/material/Slider';
import FilterProvider from "../../context/FilterContext";
import { Shopcontext } from "../../context/Shopcontext";
import './PFilter.css'

function Filter() {
    const { category, setCategory, priceRanage, setPriceRanage, applyFilter, setApplyFilter } = useContext(Shopcontext);

    const [tempCategory, setTempCategory] = useState(category);
    const [tempPriceRange, setTempPriceRange] = useState(priceRanage);

    const handleCategoryChange = (cat) => {
        setTempCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    };

    const handlePriceChange = (event, newVal) => {
        setTempPriceRange(newVal);
    };

    return (
        <div className="filtermain">
            <div className="filter">
            <h4>FILTERS</h4>
            </div>
            <hr></hr>
            <div className="category">
               <h4>Category:</h4>
               <label className="cat-item"><input type='checkbox' name='Men' checked={tempCategory.includes('men')} onChange={() => handleCategoryChange('men')} /> Men</label>
               <label className="cat-item"><input type='checkbox' name='Women' checked={tempCategory.includes('women')} onChange={() => handleCategoryChange('women')} /> Women</label>
               <label className="cat-item"><input type='checkbox' name='Kid' checked={tempCategory.includes('kid')} onChange={() => handleCategoryChange('kid')} /> Kids</label>
            </div>
            <hr></hr>
            <div className="price">
                <h4>Price:</h4>
            <Slider value={tempPriceRange} min={0} max={5000} valueLabelDisplay="auto" onChange={handlePriceChange} />
            <span>{tempPriceRange[0]}-{tempPriceRange[1]}</span>
            </div>
            <div className="apply">
                <button className="apply-btn" onClick={() => {
                    setCategory(tempCategory);       
                    setPriceRanage(tempPriceRange);   
                    setApplyFilter(prev => !prev);    
                }}>
                    Apply
                </button>
            </div>
        </div>
    );
}
export default Filter