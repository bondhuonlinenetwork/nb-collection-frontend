import React, { useState } from "react";
import { api } from "../../../utils/api";
import "./updateProduct.css";

const UpdateProduct = ({ setUpdateProduct, updateProductData, category, refreshTable }) => {
    const [productData, setProductData] = useState({
        name: updateProductData.name || "",
        price: updateProductData.price || "",
        description: updateProductData.description || "",
        category: updateProductData.category || "",
        variants: updateProductData.variants?.map(v => ({
            size: v.size || "",
            color: v.color || "",
            stock: v.stock || 0,
            images: Array.isArray(v.images) ? v.images : [],
            newImages: [], // files to upload
        })) || [],
    });

    // Product input handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    // Variant handler
    const handleVariantChange = (vIndex, field, value) => {
        const variants = [...productData.variants];
        variants[vIndex][field] = value;
        setProductData(prev => ({ ...prev, variants }));
    };

    // Add/remove variant
    const handleAddVariant = () => {
        setProductData(prev => ({
            ...prev,
            variants: [...prev.variants, { size: "", color: "", stock: 0, images: [], newImages: [] }],
        }));
    };

    const handleRemoveVariant = (vIndex) => {
        const variants = [...productData.variants];
        variants.splice(vIndex, 1);
        setProductData(prev => ({ ...prev, variants }));
    };

    // Variant images
    const handleVariantImageChange = (vIndex, e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
        const variants = [...productData.variants];
        variants[vIndex].newImages = [...variants[vIndex].newImages, ...previews];
        setProductData(prev => ({ ...prev, variants }));
    };

    const handleRemoveExistingVariantImage = (vIndex, iIndex) => {
        const variants = [...productData.variants];
        variants[vIndex].images.splice(iIndex, 1);
        setProductData(prev => ({ ...prev, variants }));
    };

    const handleRemoveNewVariantImage = (vIndex, iIndex) => {
        const variants = [...productData.variants];
        variants[vIndex].newImages.splice(iIndex, 1);
        setProductData(prev => ({ ...prev, variants }));
    };

    // Submit update
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("price", productData.price);
        formData.append("description", productData.description);
        formData.append("category", productData.category);

        productData.variants.forEach((variant, index) => {
            formData.append(`variants[${index}][size]`, variant.size);
            formData.append(`variants[${index}][color]`, variant.color);
            formData.append(`variants[${index}][stock]`, variant.stock);

            // Append existing images as strings
            (variant.images || []).forEach(imgUrl => {
                formData.append(`variants[${index}][images]`, imgUrl);
            });

            // Append new image files
            (variant.newImages || []).forEach(img => {
                formData.append(`variants[${index}][images]`, img.file);
            });
        });

        try {
            await api.put(`/product/${updateProductData.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUpdateProduct(false);
            refreshTable();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleCancel = () => setUpdateProduct(false);

    return (
        <div className="update-product-container" onClick={handleCancel}>
            <div className="update-product-wrapper" onClick={e => e.stopPropagation()}>
                <label>Product Name:</label>
                <input type="text" name="name" value={productData.name} onChange={handleInputChange} />

                <label>Price:</label>
                <input type="number" name="price" value={productData.price} onChange={handleInputChange} />

                <label>Category:</label>
                <select name="category" value={productData.category} onChange={handleInputChange}>
                    <option value="">Select category</option>
                    {category.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>

                <label>Description:</label>
                <input type="text" name="description" value={productData.description} onChange={handleInputChange} />

                {/* Variants */}
                <label>Variants:</label>
                <div className="variants-wrapper">
                    {productData.variants.map((variant, vIndex) => (
                        <div key={vIndex} className="variant-item">
                            <input
                                type="text"
                                placeholder="Size"
                                value={variant.size}
                                onChange={e => handleVariantChange(vIndex, "size", e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Color"
                                value={variant.color}
                                onChange={e => handleVariantChange(vIndex, "color", e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                value={variant.stock}
                                onChange={e => handleVariantChange(vIndex, "stock", e.target.value)}
                            />
                            <button type="button" onClick={() => handleRemoveVariant(vIndex)}>Remove Variant</button>

                            {/* Existing images */}
                            <div className="image-wrapper">
                                {(variant.images || []).map((img, iIndex) => (
                                    <div key={iIndex} className="image">
                                        <img src={`http://localhost:8080${img}`} alt={`variant-${vIndex}-${iIndex}`} />
                                        <button type="button" onClick={() => handleRemoveExistingVariantImage(vIndex, iIndex)}>✕</button>
                                    </div>
                                ))}
                            </div>

                            {/* New images */}
                            <input type="file" multiple onChange={e => handleVariantImageChange(vIndex, e)} />
                            <div className="image-wrapper">
                                {(variant.newImages || []).map((img, iIndex) => (
                                    <div key={iIndex} className="image">
                                        <img src={img.preview} alt={`variant-new-${vIndex}-${iIndex}`} />
                                        <button type="button" onClick={() => handleRemoveNewVariantImage(vIndex, iIndex)}>✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddVariant}>Add Variant</button>
                </div>

                <div className="button-wrapper">
                    <div className="update-product-submit" onClick={handleUpdateProduct}>Update</div>
                    <div className="update-product-cancel" onClick={handleCancel}>Cancel</div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;
