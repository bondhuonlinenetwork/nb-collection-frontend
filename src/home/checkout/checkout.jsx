import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./checkout.css";
import { useLocation } from "react-router-dom";
import Header from '../header/header';
import { api } from '../../utils/api';
import axios from "axios";
const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { products } = location.state || [];
    const [shipping, setShipping] = useState(70);
    const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + shipping;
    const [orderInfo, setOrderInfo] = useState({
        phone: '',
        name: '',
        address: '',
        city: '',
        postalCode: '',
        paymentType: 'Cash on delivery',
        paymentMethod: 'Bkash',
        transactionId: '',
        date: new Date(),
        subtotalAmount: subtotal,
        shippingAmount: shipping,
        totalAmount: total,
        orderState: 'pending',
        products: products
    });
    const [errors, setErrors] = useState({});
    function inputHandler(e) {
        const { name, value } = e.target;
        setOrderInfo((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        console.log(orderInfo);
    }

    const handleSubmit = async () => {
        setErrors({});
        try {
            const response = await api.post('/order', orderInfo);
            localStorage.setItem('cart', []);
            navigate(`/order-success/${response.data.id}`);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const backendErrors = error.response.data.errors;
                const newErrors = {};

                backendErrors.forEach((err) => {
                    newErrors[err.field] = err.message;
                });

                setErrors(newErrors);
            } else {
                console.error("⚠️ Server error:", error);
            }
        }
    };
    return (
        <>
            <Header />
            <div className="checkout-container">
                {/* Left Side - Form */}
                <div className="checkout-left">
                    {/* Phone */}
                    <div className="section">
                        <h3>Phone Number</h3>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            onChange={inputHandler}
                            value={orderInfo.phone}
                        />
                        {errors.phone && <p style={{ color: "red", margin: "0" }}>{errors.phone}</p>}
                    </div>

                    {/* Delivery Info */}
                    <div className="section">
                        <h3>Delivery</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            onChange={inputHandler}
                            value={orderInfo.name}
                        />
                        {errors.name && <p style={{ color: "red", margin: "0" }}>{errors.name}</p>}
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            onChange={inputHandler}
                            value={orderInfo.address}
                        />
                        {errors.address && <p style={{ color: "red", margin: "0" }}>{errors.address}</p>}
                        <div className="row">
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                onChange={inputHandler}
                                value={orderInfo.city}
                            />
                            {errors.city && <p style={{ color: "red", margin: "0" }}>{errors.city}</p>}
                            <input
                                type="text"
                                name="postalCode"
                                placeholder="Postal code (optional)"
                                onChange={inputHandler}
                                value={orderInfo.postalCode}
                            />
                            {errors.postalCode && <p style={{ color: "red", margin: "0" }}>{errors.postalCode}</p>}
                        </div>
                    </div>
                    <div className="section">
                        <h3>Payment Method</h3>
                        <select name="paymentType" id="" value={orderInfo.paymentType} onChange={inputHandler}>
                            <option value="Cash on delivery" >Cash on delivery</option>
                            <option value="Pay total" >Pay total</option>
                        </select>
                        {orderInfo.paymentType === 'Pay total' &&
                            <div>
                                <h4>To confirm order Please pay TK {total.toFixed(2)} to the following number:</h4>
                                <p>01787725824</p>
                            </div>
                        }
                        {orderInfo.paymentType === 'Cash on delivery' &&
                            <div>
                                <h4>To confirm order Please pay TK {shipping.toFixed(2)} to the following number:</h4>
                                <p>01787725824</p>
                            </div>
                        }
                        <input
                            type="text"
                            name="transactionId"
                            id=""
                            placeholder="transaction id"
                            onChange={inputHandler}
                            value={orderInfo.transactionId}
                        />
                        {errors.transactionId && <p style={{ color: "red", margin: "0" }}>{errors.transactionId}</p>}
                        <select name="paymentMethod" value={orderInfo.paymentMethod} id="" onChange={inputHandler}>
                            <option value="Bkash" >Bkash</option>
                            <option value="Rocket" >Rocket</option>
                            <option value="Upay" >Upay</option>
                        </select>
                        {errors.paymentMethod && <p style={{ color: "red", margin: "0" }}>{errors.paymentMethod}</p>}
                        <div className="pay-btn" onClick={handleSubmit}>Place Order</div>
                    </div>
                </div>

                {/* Right Side - Summary */}
                <div className="checkout-right">
                    {products.map((product) => (
                        <div className="summary-item" key={product.id}>
                            <img
                                src={`${import.meta.env.VITE_API_URL}/${product.image}`}
                                alt="Product"
                                className="product-img"
                            />
                            <div>
                                <div className="product-title">{product.name}</div>
                                <div className="product-quantity">Quantity {product.quantity}</div>
                                <div className="product-total">Tk {product.price}</div>
                                {product.size &&
                                    <div className="product-total">Size : {product.size}</div>
                                }
                            </div>
                        </div>
                    ))}
                    {/* <div className="discount">
                    <input type="text" placeholder="Discount code" />
                    <button>Apply</button>
                </div> */}

                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>৳ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>৳ {shipping.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>৳ {total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;
