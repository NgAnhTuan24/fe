import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../layouts/admin/Sidebar";
import AdminDashboard from "../pages/admin/AdminPage";
import UserManagement from "../pages/admin/Users/UserManagement";
import UserDetail from "../pages/admin/Users/UserDetail";
import CatManagement from "../pages/admin/Cats/CatManagement";
import CatDetail from "../pages/admin/Cats/CatDetail";
import CatForm from "../pages/admin/Cats/CatForm";
import OrderManagement from "../pages/admin/Orders/OrderManagement";
import OrderDetail from "../pages/admin/Orders/OrderDetail";

export default function AdminRoutes() {
  return (
    <Sidebar>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="cats" element={<CatManagement />} />
        <Route path="cats/:id" element={<CatDetail />} />
        <Route path="cats/add" element={<CatForm mode="add" />} />
        <Route path="cats/edit/:id" element={<CatForm mode="edit" />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="orders/:id" element={<OrderDetail />} />
      </Routes>
    </Sidebar>
  );
}
