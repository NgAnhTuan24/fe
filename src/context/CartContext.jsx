import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user) {
      const savedCart =
        JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
      setCartItems(savedCart);
    } else {
      setCartItems([]);
    }
  }, [user]);

  const saveCart = (cart) => {
    if (user) localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
  };

  const addToCart = (cat) => {
    if (cartItems.some((i) => i.id === cat.id)) return;
    const updated = [...cartItems, cat];
    setCartItems(updated);
    saveCart(updated);
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter((i) => i.id !== id);
    setCartItems(updated);
    saveCart(updated);
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) localStorage.removeItem(`cart_${user.id}`);
  };

  // Tổng số lượng item
  const totalItems = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        // setCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook cho tiện
export const useCart = () => useContext(CartContext);
