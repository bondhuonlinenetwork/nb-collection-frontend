import React, { useState } from "react";
import { api } from "../../../utils/api";
import "./updateProduct.css";

const UpdateProduct = ({ setUpdateProduct, updateProductData, category, refreshTable }) => {
    const [productData, setProductData] = useState({
        name: updateProductData.name || "",
        price: updateProductData.price || "",
        description: updateProductData.description || "",
        category: updateProductData.category || "",
        images: updateProductData.images || [],
        newImages: [],
        sizes: updateProductData.sizes || [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle image uploads
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
        setProductData((prev) => ({
            ...prev,
            newImages: [...prev.newImages, ...previews],
        }));
    };

    // Remove existing or new images
    const handleRemoveExistingImage = (index) => {
        const updated = [...productData.images];
        updated.splice(index, 1);
        setProductData({ ...productData, images: updated });
    };

    const handleRemoveNewImage = (index) => {
        const updated = [...productData.newImages];
        updated.splice(index, 1);
        setProductData({ ...productData, newImages: updated });
    };

    // Sizes
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

    // Submit update
    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("price", productData.price);
        formData.append("description", productData.description);
        formData.append("category", productData.category);
        formData.append("sizes", JSON.stringify(productData.sizes));

        productData.images.forEach((img) => formData.append("images", img));
        productData.newImages.forEach((img) => formData.append("images", img.file));

        try {
            await api.put(`/product/${updateProductData.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUpdateProduct(false);
            refreshTable();
        } catch (err) {
            console.error("Error updating product:", err);
        }
    };

    return (
        <div className="update-product-container" onClick={() => setUpdateProduct(false)}>
            <div className="update-product-wrapper" onClick={(e) => e.stopPropagation()}>
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

                {/* Existing images */}
                <label>Existing Images:</label>
                <div className="image-wrapper">
                    {productData.images.map((img, index) => (
                        <div key={index} className="image">
                            <img src={`http://localhost:8080${img}`} alt={`img-${index}`} />
                            <button type="button" onClick={() => handleRemoveExistingImage(index)}>✕</button>
                        </div>
                    ))}
                </div>

                {/* New images */}
                <label>New Images:</label>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                <div className="image-wrapper">
                    {productData.newImages.map((img, index) => (
                        <div key={index} className="image">
                            <img src={img.preview} alt={`new-${index}`} />
                            <button type="button" onClick={() => handleRemoveNewImage(index)}>✕</button>
                        </div>
                    ))}
                </div>

                {/* Sizes */}
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
                    <div className="update-product-submit" onClick={handleUpdate}>Update</div>
                    <div className="update-product-cancel" onClick={() => setUpdateProduct(false)}>Cancel</div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;
