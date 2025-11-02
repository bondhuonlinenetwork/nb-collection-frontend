import { useEffect, useState } from 'react'
import axios from 'axios'
import { api } from '../../utils/api'
import './product.css'
import Table from './data-table/table'
import AddProduct from './modals/addProduct';
import UpdateProduct from './modals/updateProduct';
import DeleteProduct from './modals/deleteProduct';
function Product() {
    const [addProduct, setAddProduct] = useState(false);
    const [productData, setProductData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        images: [],
    });

    const [updateProduct, setUpdateProduct] = useState(false);
    const [updateProductData, setUpdateProductData] = useState([]);

    const [deleteProduct, setDeleteProduct] = useState(false);
    const [deleteProductData, setDeleteProductData] = useState([]);

    const [category, setCategory] = useState([]);

    const [refresh, setRefresh] = useState(false);
    const refreshTable = () => setRefresh(prev => !prev);

    useEffect(() => {
        // Fetch categories from backend
        const fetchCategories = async () => { api.get('/categories').then(res => setCategory(res.data)).catch(err => console.error('Error fetching categories:', err)); };
        fetchCategories();
    }, []);
    return (
        <>
            {addProduct && (
                <AddProduct
                    setAddProduct={setAddProduct}
                    productData={productData}
                    setProductData={setProductData}
                    category={category}
                    refreshTable={refreshTable}
                />
            )}

            {updateProduct && (
                <UpdateProduct
                    setUpdateProduct={setUpdateProduct}
                    updateProductData={updateProductData}
                    category={category}
                    refreshTable={refreshTable}
                />
            )}

            {deleteProduct && (
                <DeleteProduct
                    setDeleteProduct={setDeleteProduct}
                    deleteProductData={deleteProductData}
                    refreshTable={refreshTable}
                />
            )}

            <div className="add-product-btn" onClick={() => setAddProduct(true)}>
                Add Product
            </div>

            <Table
                setUpdateProduct={setUpdateProduct}
                setUpdateProductData={setUpdateProductData}
                setDeleteProduct={setDeleteProduct}
                setDeleteProductData={setDeleteProductData}
                refresh={refresh}
            />
        </>
    )
}

export default Product;