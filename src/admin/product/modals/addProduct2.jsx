import React from 'react';
import { api } from '../../../utils/api';
import './addProduct.css';

const AddProduct = ({ setAddProduct, productData, setProductData, category, refreshTable }) => {

    // Text inputs for basic product info
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    // Add new variant
    const handleAddVariant = () => {
        setProductData(prev => ({
            ...prev,
            variants: [...(prev.variants || []), { size: '', color: '', stock: '', images: [] }]
        }));
    };

    // Update variant fields
    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        const updatedVariants = [...productData.variants];
        updatedVariants[index][name] = value;
        setProductData({ ...productData, variants: updatedVariants });
    };

    // Handle image uploads for each variant
    const handleVariantImageChange = (index, e) => {
        const files = Array.from(e.target.files);
        const imagePreviews = files.map(file => ({ file, preview: URL.createObjectURL(file) }));

        const updatedVariants = [...productData.variants];
        updatedVariants[index].images = [...(updatedVariants[index].images || []), ...imagePreviews];
        setProductData({ ...productData, variants: updatedVariants });
    };

    const handleRemoveVariantImage = (variantIndex, imageIndex) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[variantIndex].images.splice(imageIndex, 1);
        setProductData({ ...productData, variants: updatedVariants });
    };

    const handleRemoveVariant = (index) => {
        const updatedVariants = [...productData.variants];
        updatedVariants.splice(index, 1);
        setProductData({ ...productData, variants: updatedVariants });
    };
    const handleAddProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Basic product info
        formData.append('name', productData.name || '');
        formData.append('price', productData.price || '');
        formData.append('description', productData.description || '');
        formData.append('category', productData.category || '');

        // Variants
        (productData.variants || []).forEach((variant, index) => {
            formData.append(`variants[${index}][size]`, variant.size);
            formData.append(`variants[${index}][color]`, variant.color);
            formData.append(`variants[${index}][stock]`, variant.stock);

            // Variant images
            (variant.images || []).forEach((imgFile) => {
                formData.append(`variants[${index}][images][]`, imgFile.file);
            });
        });

        try {
            const response = await api.post('/product', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Response:', response.data);
            setAddProduct(false);
            setProductData({});
            refreshTable();
        } catch (error) {
            console.error('Error posting product:', error);
        }
    };


    return (
        <div className="add-product-container" onClick={() => setAddProduct(false)}>
            <div className="add-product-wrapper" onClick={(e) => e.stopPropagation()}>

                <label>Product Name:</label>
                <input type="text" name="name" value={productData.name || ''} onChange={handleInputChange} />

                <label>Product Price:</label>
                <input type="number" name="price" value={productData.price || ''} onChange={handleInputChange} />

                <label>Category:</label>
                <select name="category" value={productData.category || ''} onChange={handleInputChange}>
                    <option value="">Select category</option>
                    {category.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>

                <label>Description:</label>
                <input type="text" name="description" value={productData.description || ''} onChange={handleInputChange} />

                <hr />
                <h3>Variants</h3>
                {(productData.variants || []).map((variant, index) => (
                    <div key={index} className="variant-box">
                        <label>Size:</label>
                        <input type="text" name="size" value={variant.size} onChange={(e) => handleVariantChange(index, e)} />

                        <label>Color:</label>
                        <input type="text" name="color" value={variant.color} onChange={(e) => handleVariantChange(index, e)} />

                        <label>Stock:</label>
                        <input type="number" name="stock" value={variant.stock} onChange={(e) => handleVariantChange(index, e)} />

                        <label>Variant Images:</label>
                        <input type="file" accept="image/*" multiple onChange={(e) => handleVariantImageChange(index, e)} />

                        <div className="variant-images">
                            {(variant.images || []).map((img, i) => (
                                <div key={i} className="variant-image-preview">
                                    <img src={img.preview} alt={`variant-${index}-${i}`} />
                                    <button type="button" onClick={() => handleRemoveVariantImage(index, i)}>✕</button>
                                </div>
                            ))}
                        </div>

                        <button type="button" className="remove-variant-btn" onClick={() => handleRemoveVariant(index)}>
                            Remove Variant
                        </button>
                    </div>
                ))}

                <button type="button" className="add-variant-btn" onClick={handleAddVariant}>+ Add Variant</button>

                <div className="button-wrapper">
                    <button className="add-product-submit" onClick={handleAddProduct}>Add Product</button>
                    <button className="add-product-cancel" onClick={() => setAddProduct(false)}>Cancel</button>
                </div>

            </div>
        </div>
    );
};

export default AddProduct;
