import { useEffect, useState } from "react";
import Pay from "../components/Pay";

const Cart = ({ setCartCount , id }) =>{

  const [cartitems,setCartitems] = useState([]);
  const [amount,setAmount] = useState(0);

  const fetchCartitems = () =>{
    const items = JSON.parse(localStorage.getItem(`cart_${id}`)) || [];
    const tempAmount = items.reduce((acc,element) =>  acc += element.quantity * element.price,0);
    setAmount(tempAmount);
    setCartitems(items);
    console.log(items);
    setCartCount(items.reduce((acc, item) => acc + item.quantity, 0));
  }
  useEffect(()=>{
    fetchCartitems();
    const handleStorageChange = () =>{
      fetchCartitems();
    }
    window.addEventListener('storage',handleStorageChange);
    return () =>{
      window.removeEventListener('storage',handleStorageChange);
    }

  },[]);

  const updateCart = (updatedCart) =>{
    localStorage.setItem(`cart_${id}`,JSON.stringify(updatedCart));
    setCartitems(updatedCart);
    setCartCount(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
  }

  const increaseCount = (dishId) =>{
    const updatedCart = cartitems.map((item) =>
      item.dishId === dishId ? { ...item, quantity: item.quantity+1 } : item
    );
    const amount = updatedCart.reduce((acc,item) => acc + item.quantity*item.price , 0);
    setAmount(amount);
    updateCart(updatedCart);
  }
  const decreaseCount = (dishId) =>{
    const updatedCart = cartitems.map((item) =>
      item.dishId === dishId ? { ...item, quantity: item.quantity-1 } : item
    ).filter((item) => item.quantity > 0);
    const amount = updatedCart.reduce((acc,item) => acc + item.quantity*item.price , 0);
    setAmount(amount);
    updateCart(updatedCart);
  }
  useEffect(() => {
    fetchCartitems();
    const handleStorageChange = () => fetchCartitems();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [id]);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-item-container">
        {cartitems.length === 0 ? (
          <p style={{ color : "#ff3a3a" , fontSize : '1.4rem' , fontWeight : "500"}}>Cart is Empty!</p>
        ) : (
          cartitems.map((element) =>(
            <div className="cart-item" key={element.dishId}>
              <p>{element.name}</p>
              <span className="item-price-quantity">
                <span className="item-price">₹ {element.price}</span>
                <div className="count-container">
                  <button className="count-button-cart">
                    <div
                      className="minus-cart"
                      onClick={() => decreaseCount(element.dishId)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </div>
                    <span className="count-display">{element.quantity}</span>
                    <div
                      className="plus-cart"
                      onClick={() => increaseCount(element.dishId)}
                      aria-label="Increase quantity"
                    >
                      +
                    </div>
                  </button>
                </div>
              </span>
            </div>
          ))
        ) }
      </div>
      {cartitems.length > 0 ? (
        <div>
          <div className="bill">
            <div className="total-bill">To pay <span>₹ {amount}</span></div>
            <div className="item-bill">
              {cartitems.map((element) =>(
                <div className="bill-box-item" key={element.dishId}>
                  <span>{element.name}</span><span>{element.quantity} x {element.price}</span>
                </div>
              ))}
            </div>
          </div>
        <Pay amount={amount} id={id} cartitems={cartitems}/>
        </div>
      ) : ( '' )}
    </div>
  )
}
export default Cart;