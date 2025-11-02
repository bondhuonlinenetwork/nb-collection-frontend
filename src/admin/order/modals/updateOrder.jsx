import React from 'react';
import { useState } from 'react';
import { api } from '../../../utils/api';
import './updateOrder.css';
const UpdateOrder = ({
    setUpdateOrder,
    updateOrderId,
    updateOrderData,
    setUpdateOrderData,
    refreshTable
}) => {
    const [orderData, setOrderData] = useState(updateOrderData || {});
    const handleUpdateOrder = async () => {
        try {
            const response = await api.put(`/order/${updateOrderId}`, orderData);
            console.log('Response:', response.data);
            setUpdateOrder(false);
            refreshTable()
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderData((prev) => ({ ...prev, [name]: value }));
    };
    const handleCancel = () => {
        setUpdateOrder(false);
    };

    return (
        <div className="update-order-container" onClick={() => setUpdateOrder(false)}>
            <div className="update-order-wrapper" onClick={(e) => e.stopPropagation()}>

                <h2>Order Details</h2>
                <form className="order-form" onSubmit={handleUpdateOrder}>
                    <div className="view-section">
                        <p><strong>Order ID:</strong> {orderData.id}</p>
                        <p><strong>Name:</strong> {orderData.name}</p>
                        <p><strong>Phone:</strong> {orderData.phone}</p>
                        <p><strong>Address:</strong> {orderData.address}</p>
                        <p><strong>City:</strong> {orderData.city}</p>
                        <p><strong>Payment Type:</strong> {orderData.paymentType}</p>
                        <p><strong>Payment Method:</strong> {orderData.paymentMethod}</p>
                        <p><strong>Transaction ID:</strong> {orderData.transactionId}</p>
                        <p><strong>Date:</strong> {new Date(orderData.date).toLocaleString()}</p>
                    </div>


                    <h3>Products</h3>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderData.products.map((p) => (
                                <tr key={p.id}>
                                    <td><img src={`http://localhost:8080${p.image}`} alt={p.name} width="50" height="40" /></td>
                                    <td>{p.name}</td>
                                    <td>৳ {p.price}</td>
                                    <td>{p.quantity}</td>
                                    <td>৳ {Number(p.price) * Number(p.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    <div className="summary">
                        <p>Subtotal: ৳ {orderData.subtotalAmount}</p>
                        <p>Shipping: ৳ {orderData.shippingAmount}</p>
                        <p className="total">Total: ৳ {orderData.totalAmount}</p>
                    </div>


                    <div className="form-group">
                        <label>Order State</label>
                        <select name="orderState" value={orderData.orderState} onChange={handleInputChange}>
                            <option value="pending">pending</option>
                            <option value="processing">processing</option>
                            <option value="shipped">shipped</option>
                            <option value="delivered">delivered</option>
                            <option value="cancelled">cancelled</option>
                        </select>
                    </div>
                    <div className="btn-wrapper">
                        <button className="save-btn" type="submit">Update</button>
                        <button className="cancel-btn" type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateOrder;
