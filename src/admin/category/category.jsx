import { useState } from 'react'
import axios from 'axios'
import './category.css'
import Table from './data-table/table'
import AddCategory from './modals/addCategory';
import UpdateCategory from './modals/updateCategory';
import DeleteCategory from './modals/deleteCategory';
function Category() {
    const [addCategory, setAddCategory] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    const [updateCategory, setUpdateCategory] = useState(false);
    const [updateCategoryId, setUpdateCategoryId] = useState('');
    const [updateCategoryName, setUpdateCategoryName] = useState([]);

    const [deleteCategory, setDeleteCategory] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState('');

    const [refresh, setRefresh] = useState(false);
    const refreshTable = () => setRefresh(prev => !prev);
    return (
        <>
            {addCategory && (
                <AddCategory
                    setAddCategory={setAddCategory}
                    categoryName={categoryName}
                    setCategoryName={setCategoryName}
                    refreshTable={refreshTable}
                />
            )}

            {updateCategory && (
                <UpdateCategory
                    setUpdateCategory={setUpdateCategory}
                    updateCategoryId={updateCategoryId}
                    updateCategoryName={updateCategoryName}
                    setUpdateCategoryName={setUpdateCategoryName}
                    refreshTable={refreshTable}
                />
            )}

            {deleteCategory && (
                <DeleteCategory
                    setDeleteCategory={setDeleteCategory}
                    deleteCategoryId={deleteCategoryId}
                    refreshTable={refreshTable}
                />
            )}

            <div className="add-category-btn" onClick={() => setAddCategory(true)}>
                Add Category
            </div>

            <Table
                setUpdateCategory={setUpdateCategory}
                setUpdateCategoryName={setUpdateCategoryName}
                setUpdateCategoryId={setUpdateCategoryId}
                setDeleteCategory={setDeleteCategory}
                setDeleteCategoryId={setDeleteCategoryId}
                refresh={refresh}
            />
        </>
    )
}

export default Category;