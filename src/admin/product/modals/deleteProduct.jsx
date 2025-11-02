import React from 'react';
import { api } from '../../../utils/api';
import './deleteProduct.css';
const DeleteProduct = ({ setDeleteProduct, deleteProductData, refreshTable }) => {

    const handleDeleteProduct = async () => {

        try {
            const response = await api.delete(`/product/${deleteProductData.id}`);
            console.log('Response:', response.data);
            setDeleteProduct(false);
            refreshTable()
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleCancel = () => {
        setDeleteProduct(false);
    };

    return (
        <div className="delete-product-container" onClick={handleCancel}>
            <div className="delete-product-wrapper" onClick={(e) => e.stopPropagation()}>
                <h3>Are you sure you want to delete this product?</h3>
                <div className="button-wrapper">
                    <div className="delete-product-submit" onClick={handleDeleteProduct}>Delete</div>
                    <div className="delete-product-cancel" onClick={handleCancel}>Cancel</div>
                </div>
            </div>
        </div>
    );
};

export default DeleteProduct;
