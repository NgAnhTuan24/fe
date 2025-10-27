import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../layouts/user/Header";
import Footer from "../layouts/user/Footer";
import HomePage from "../pages/user/HomePage";
import ShopPage from "../pages/user/ShopPage";
import CatDetailPage from "../pages/user/CatDetailPage";
import ContactPage from "../pages/user/ContactPage";
import CartPage from "../pages/user/CartPage";
import CheckoutPage from "../pages/user/CheckoutPage";
import ProfilePage from "../pages/user/ProfilePage";
import OrdersPage from "../pages/user/OrdersPage";
import PaymentPage from "../pages/user/PaymentPage";

export default function UserRoutes() {
  return (
    <div>
      <Header />
      <Routes>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:id" element={<CatDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="/payment-gateway/:orderCode" element={<PaymentPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
