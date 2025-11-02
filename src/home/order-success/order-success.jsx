import { useState } from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import './order-success.css'
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'


function OrderSuccess() {
    const { orderId } = useParams();
    useEffect(() => {

    }, []);


    return (
        <>
            <div className="container">
                <div className="order-success-message">
                    <h1>Thank you for your order!</h1>
                    <p>Your order has been placed successfully.</p>
                    <p>Your Order ID is: <strong>{orderId}</strong></p>
                    <Link to="/">
                        <div className='shopping-btn'>Continue Shopping</div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default OrderSuccess;