import { useState } from 'react'
import './admin.css'
import Dashboard from './dashboard/dashboard'
import Category from './category/category'
import Product from './product/product'
import Order from './order/order'
import { RiLogoutBoxRLine } from "react-icons/ri";
import { removeToken } from './auth'
import { useNavigate } from "react-router-dom";
function Admin() {
    const navigate = useNavigate();
    const [tab, setTab] = useState(localStorage.getItem('tab') || "dashboard");
    return (
        <>
            <div className="wrapper">
                <div className='header'>
                    <div></div>
                    <div className="logo">
                        <img src="logo.png" alt="" />
                    </div>
                    <div className="logout"
                        onClick={() => {
                            removeToken();
                            navigate("/login");
                        }}>
                        <RiLogoutBoxRLine />
                    </div>
                </div>
                <div className="main-wrapper">
                    <div className="sidebar">
                        <div className="tab" onClick={() => { setTab("dashboard"); localStorage.setItem('tab', 'dashboard') }}>Dashboard</div>
                        <div className="tab" onClick={() => { setTab("category"); localStorage.setItem('tab', 'category') }}>Category</div>
                        <div className="tab" onClick={() => { setTab("product"); localStorage.setItem('tab', 'product') }}>Product</div>
                        <div className="tab" onClick={() => { setTab("order"); localStorage.setItem('tab', 'order') }}>Order</div>
                    </div>
                    <div className="main">
                        {tab === "dashboard" ? (
                            <Dashboard />
                        ) : tab === "category" ? (
                            <Category />
                        ) : tab === "product" ? (
                            <Product />
                        ) : tab === "order" ? (
                            <Order />
                        ) : <Dashboard />}
                    </div>
                </div>
                <div className="footer"></div>
            </div>
        </>
    )
}
export default Admin;