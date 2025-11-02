import React from 'react';
import { api } from '../../../utils/api';
import './addCategory.css';
const AddCategory = ({ setAddCategory, categoryName, setCategoryName, refreshTable }) => {
    const handleAddCategory = async () => {
        try {
            const response = await api.post('/category', { name: categoryName });
            console.log('Response:', response.data);
            setAddCategory(false);
            setCategoryName('');
            refreshTable()
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    const handleCancel = () => {
        setAddCategory(false);
        setCategoryName('');
    };

    return (
        <div className="add-category-container" onClick={handleCancel}>
            <div className="add-category-wrapper" onClick={(e) => e.stopPropagation()}>
                <label htmlFor="">Category Name:</label>
                <input
                    type="text"
                    name="category-name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <div className="button-wrapper">
                    <div className="add-category-submit" onClick={handleAddCategory}>Add</div>
                    <div className="add-category-cancel" onClick={handleCancel}>Cancel</div>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;
