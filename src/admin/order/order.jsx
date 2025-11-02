import { useState } from 'react'
import axios from 'axios'
import './order.css'
import Table from './data-table/table'
import UpdateOrder from './modals/updateOrder';
// import AddCategory from './modals/addCategory';
// import DeleteCategory from './modals/deleteCategory';
function Order() {
    // const [addCategory, setAddCategory] = useState(false);
    // const [categoryName, setCategoryName] = useState('');

    const [updateOrder, setUpdateOrder] = useState(false);
    const [updateOrderId, setUpdateOrderId] = useState('');
    const [updateOrderData, setUpdateOrderData] = useState([]);

    // const [deleteCategory, setDeleteCategory] = useState(false);
    // const [deleteCategoryId, setDeleteCategoryId] = useState('');

    const [refresh, setRefresh] = useState(false);
    const refreshTable = () => setRefresh(prev => !prev);
    return (
        <>
            {/* {addCategory && (
                <AddCategory
                    setAddCategory={setAddCategory}
                    categoryName={categoryName}
                    setCategoryName={setCategoryName}
                    refreshTable={refreshTable}
                />
            )} */}

            {updateOrder && (
                <UpdateOrder
                    setUpdateOrder={setUpdateOrder}
                    updateOrderId={updateOrderId}
                    updateOrderData={updateOrderData}
                    setUpdateOrderData={setUpdateOrderData}
                    refreshTable={refreshTable}
                />
            )}

            {/* {deleteCategory && (
                <DeleteCategory
                    setDeleteCategory={setDeleteCategory}
                    deleteCategoryId={deleteCategoryId}
                    refreshTable={refreshTable}
                />
            )} */}

            {/* <div className="add-category-btn" onClick={() => setAddCategory(true)}>
                Add Category
            </div> */}

            <Table
                setUpdateOrder={setUpdateOrder}
                setUpdateOrderData={setUpdateOrderData}
                setUpdateOrderId={setUpdateOrderId}
                // setDeleteCategory={setDeleteCategory}
                // setDeleteCategoryId={setDeleteCategoryId}
                refresh={refresh}
            />
        </>
    )
}

export default Order;