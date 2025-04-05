import React, { useEffect, useState } from 'react';

const Card = ({ dishImage, dishName, dishPrice, dishQuantity, setCartCount, dish, id }) => {
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const getCart = () => JSON.parse(localStorage.getItem(`cart_${id}`)) || [];

  const syncCart = (cart) => {
    localStorage.setItem(`cart_${id}`, JSON.stringify(cart));
    updateCartCount(cart);
  };

  const updateCartCount = (cart) => {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);
  };

  const addToCart = () => {
    const cart = getCart();
    const existingItem = cart.find((item) => item.dishId === dish._id);

    if (existingItem) {
      existingItem.quantity += 1; 
    } else {
      cart.push({
        dishId: dish._id,
        name: dishName,
        price: dishPrice,
        quantity: 1,
      });
    }

    syncCart(cart);
    setCount((prev) => prev + 1);
  };

  const updateCartQuantity = (newQuantity) => {
    const cart = getCart();
    const updatedCart = cart
      .map((item) =>
        item.dishId === dish._id ? { ...item, quantity: newQuantity } : item
      )
      .filter((item) => item.quantity > 0);

    syncCart(updatedCart);
    setCount(newQuantity);
  };

  const increaseCount = () => {
    if (count < dishQuantity) {
      updateCartQuantity(count + 1);
    }
  };

  const decreaseCount = () => {
    if (count > 0) {
      updateCartQuantity(count - 1);
    }
  };

  useEffect(() => {
    const cart = getCart();
    const existingItem = cart.find((item) => item.dishId === dish._id);
    if (existingItem) {
      setCount(existingItem.quantity);
    }
  }, [dish._id, id]);

  return (
    <div
      className={`card-container ${isHovered ? 'card-hover' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="image-container">
        <img src={dishImage} alt={dishName} className="dish-image" />
        {dishQuantity <= 5 && <div className="limited-tag">Limited!</div>}
      </div>

      <div className="content-container">
        <div className="name">{dishName}</div>
        <section>
          <div className="price">₹ {dishPrice}</div>
          <div className="quantity">{dishQuantity} left</div>
        </section>

        {count === 0 ? (
          <button
            className="add-to-cart"
            onClick={addToCart}
            disabled={dishQuantity === 0}
          >
            {dishQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        ) : (
          <div className="count-container">
            <button className="countButton">
              <div
                className="minus"
                onClick={decreaseCount}
                aria-label="Decrease quantity"
              >
                −
              </div>
              <span className="count-display">{count}</span>
              <div
                className={`plus ${count >= dishQuantity ? 'disabled' : ''}`}
                onClick={increaseCount}
                aria-label="Increase quantity"
              >
                +
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
