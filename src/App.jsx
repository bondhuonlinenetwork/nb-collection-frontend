import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './home/home'
import Admin from './admin/admin'
import ProductPage from './home/product/product';
import CategoryPage from './home/category/category';
import CheckoutPage from './home/checkout/checkout';
import Login from './admin/login/login';
import ProtectedRoute from './admin/protectedRoutes.jsx';
import OrderSuccess from './home/order-success/order-success.jsx';
function App() {
  console.log(import.meta.env.VITE_API_URL);
  console.log(import.meta.env.VITE_APP_NAME);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
