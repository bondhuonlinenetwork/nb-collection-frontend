import React from 'react';
import { api } from '../../../utils/api';
import './updateCategory.css';
const UpdateCategory = ({
    setUpdateCategory,
    updateCategoryId,
    updateCategoryName,
    setUpdateCategoryName,
    refreshTable
}) => {

    const handleUpdateCategory = async () => {
        try {
            const response = await api.put(`/category/${updateCategoryId}`, { name: updateCategoryName });
            console.log('Response:', response.data);
            setUpdateCategory(false);
            refreshTable()
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleCancel = () => {
        setUpdateCategory(false);
    };

    return (
        <div className="update-category-container" onClick={handleCancel}>
            <div className="update-category-wrapper" onClick={(e) => e.stopPropagation()}>
                <label htmlFor="">Category Name:</label>
                <input
                    type="text"
                    name="category-name"
                    value={updateCategoryName}
                    onChange={(e) => setUpdateCategoryName(e.target.value)}
                />
                <div className="button-wrapper">
                    <div className="update-category-submit" onClick={handleUpdateCategory}>Update</div>
                    <div className="update-category-cancel" onClick={handleCancel}>Cancel</div>
                </div>
            </div>
        </div>
    );
};

export default UpdateCategory;
