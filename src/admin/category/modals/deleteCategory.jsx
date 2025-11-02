import React from 'react';
import { api } from '../../../utils/api';
import './deleteCategory.css';
const DeleteCategory = ({ setDeleteCategory, deleteCategoryId, refreshTable }) => {

    const handleDeleteCategory = async () => {
        try {
            const response = await api.delete(`/category/${deleteCategoryId}`);
            console.log('Response:', response.data);
            setDeleteCategory(false);
            refreshTable()
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleCancel = () => {
        setDeleteCategory(false);
    };

    return (
        <div className="delete-category-container" onClick={handleCancel}>
            <div className="delete-category-wrapper" onClick={(e) => e.stopPropagation()}>
                <h3>Are you sure you want to delete this category?</h3>
                <div className="button-wrapper">
                    <div className="delete-category-submit" onClick={handleDeleteCategory}>Delete</div>
                    <div className="delete-category-cancel" onClick={handleCancel}>Cancel</div>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategory;
