import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { fetchCart } from "./redux/slices/cartSlice";
import { logout } from "./redux/slices/authSlice";

// Import Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";

// Admin Imports
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";

//chat bot
import FastBot from "./components/FastBot";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // Validate token on app mount
  useEffect(() => {
    const validateToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          // Decode and check token expiry
          const base64Url = storedToken.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = JSON.parse(atob(base64));

          // Check if token is expired
          if (jsonPayload.exp && jsonPayload.exp * 1000 < Date.now()) {
            dispatch(logout());
          }
        } catch (error) {
          // If token is invalid, clear it
          dispatch(logout());
        }
      }
    };

    validateToken();
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [token, dispatch]);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <FastBot />
        <div className="main-content">
          <Routes>
            {/* Admin Routes - Protected */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/orders" element={<Orders />} />
            <Route
              path="/*"
              element={<div className="text-center py-5">Page Not Found</div>}
            />
          </Routes>
        </div>
        <Footer />
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
