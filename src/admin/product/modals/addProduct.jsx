import React, { useState } from "react";
import { api } from "../../../utils/api";
import "./addProduct.css";

const AddProduct = ({ setAddProduct, category, refreshTable }) => {
    const [productData, setProductData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        images: [],
        sizes: [{ name: "", stock: "" }],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setProductData((prev) => ({
            ...prev,
            images: [...prev.images, ...previews],
        }));
    };

    const handleRemoveImage = (index) => {
        const updated = [...productData.images];
        updated.splice(index, 1);
        setProductData({ ...productData, images: updated });
    };

    // Sizes management
    const handleSizeChange = (index, field, value) => {
        const sizes = [...productData.sizes];
        sizes[index][field] = value;
        setProductData((prev) => ({ ...prev, sizes }));
    };

    const handleAddSize = () => {
        setProductData((prev) => ({
            ...prev,
            sizes: [...prev.sizes, { name: "", stock: "" }],
        }));
    };

    const handleRemoveSize = (index) => {
        const sizes = [...productData.sizes];
        sizes.splice(index, 1);
        setProductData((prev) => ({ ...prev, sizes }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("price", productData.price);
        formData.append("description", productData.description);
        formData.append("category", productData.category);
        formData.append("sizes", JSON.stringify(productData.sizes));

        productData.images.forEach((img) => formData.append("images", img.file));

        try {
            await api.post("/product", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setAddProduct(false);
            refreshTable();
        } catch (err) {
            console.error("Error adding product:", err);
        }
    };

    return (
        <div className="add-product-container" onClick={() => setAddProduct(false)}>
            <div className="add-product-wrapper" onClick={(e) => e.stopPropagation()}>
                <label>Product Name:</label>
                <input type="text" name="name" value={productData.name} onChange={handleInputChange} />

                <label>Price:</label>
                <input type="number" name="price" value={productData.price} onChange={handleInputChange} />

                <label>Category:</label>
                <select name="category" value={productData.category} onChange={handleInputChange}>
                    <option value="">Select category</option>
                    {category.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <label>Description:</label>
                <input type="text" name="description" value={productData.description} onChange={handleInputChange} />

                <label>Images:</label>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                <div className="image-wrapper">
                    {productData.images.map((img, index) => (
                        <div key={index} className="image">
                            <img src={img.preview} alt={`preview-${index}`} />
                            <button type="button" onClick={() => handleRemoveImage(index)}>✕</button>
                        </div>
                    ))}
                </div>

                {/* Sizes Section */}
                <label>Sizes:</label>
                <div className="sizes-wrapper">
                    {productData.sizes.map((size, index) => (
                        <div key={index} className="size-item">
                            <input
                                type="text"
                                placeholder="Size Name"
                                value={size.name}
                                onChange={(e) => handleSizeChange(index, "name", e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                value={size.stock}
                                onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
                            />
                            <button type="button" onClick={() => handleRemoveSize(index)}>✕</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddSize}>Add Size</button>
                </div>

                <div className="button-wrapper">
                    <div className="add-product-submit" onClick={handleAdd}>Add Product</div>
                    <div className="add-product-cancel" onClick={() => setAddProduct(false)}>Cancel</div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
