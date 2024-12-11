import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Áo thun nam cổ tròn",
      price: 200000,
      quantity: 1,
      image: "https://via.placeholder.com/80?text=A+Thun+Nam",
    },
    {
      id: 2,
      name: "Áo sơ mi nữ trắng tay dài",
      price: 350000,
      quantity: 2,
      image: "https://via.placeholder.com/80?text=Somi+Nu+Trang",
    },
    {
      id: 3,
      name: "Quần jeans nam xanh",
      price: 400000,
      quantity: 1,
      image: "https://via.placeholder.com/80?text=Quan+Jeans+Nam",
    },
    {
      id: 4,
      name: "Đầm dự tiệc nữ",
      price: 1200000,
      quantity: 1,
      image: "https://via.placeholder.com/80?text=Dress",
    },
    {
      id: 5,
      name: "Áo khoác bomber unisex",
      price: 650000,
      quantity: 1,
      image: "https://via.placeholder.com/80?text=Bomber",
    },
    {
      id: 6,
      name: "Giày sneaker trắng nữ",
      price: 800000,
      quantity: 1,
      image: "https://via.placeholder.com/80?text=Sneaker",
    },
  ]);

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateCartItemQuantity = (id, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateCartItemQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
