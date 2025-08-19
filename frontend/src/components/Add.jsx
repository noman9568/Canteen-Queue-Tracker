import { useState } from 'react';
import '../add.css';
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const Add = () =>{
  const [image,setImage] = useState(null);

  const handleChange = (e) =>{
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(!image){
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("name",e.target.name.value);
    formData.append("price",e.target.price.value);
    formData.append("quantity",e.target.quantity.value);
    formData.append("category",e.target.category.value);
    formData.append("image",image);

    try{
      const response = await fetch(`{API_URL}/api/add`,{
        method : "POST",
        body : formData,
      })
      const result = await response.json();
      alert(result.message);
      e.target.reset();
      setImage(null);
    }
    catch(error) {
      console.log("Error uploading image : ",error);
    }
  }
  return (
    <div className='add-container'>
      <form onSubmit={handleSubmit} className='addForm' >
        <h1>Add Dish</h1>
        <input type='text' className='input' name='name' placeholder='Enter the name...' required/>
        <input type="text" className='input' name='quantity' placeholder='Enter the quantity available...' required/>
        <input type="text" className='input' name='price' placeholder='Enter the price...' required/>
        <div>
          <label htmlFor="category">Select the category</label>
          <select id='category' name='category' required>
            <option name="">--Please choose an option--</option>
            <option name="Chinese">Chinese</option>
            <option name="Veg Dishes">Veg Dishes</option>
          </select>
        </div>
        <input type="file" className='file' onChange={handleChange}/>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default Add