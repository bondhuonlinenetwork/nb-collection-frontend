import React from "react";
import "./product.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import Header from '../header/header';
const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [mainImage, setMainImage] = useState({});
    const [selectedSize, setSelectedSize] = useState('');
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/product/${id}`);
                const data = await response.data;
                setProduct(data);
                setMainImage(data?.images[0])
                setSelectedSize(data.sizes?.find(size => Number(size.stock) > 0) || '');
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        }
        fetchProduct();
    }, [id]);
    const handleAddToCart = (product, selectedSize) => {

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Identify if this exact product + size combination already exists
        const existingItemIndex = cart.findIndex(
            (item) => item.id === product.id && item.size === selectedSize.name
        );

        if (existingItemIndex !== -1) {
            // If exists, increase quantity (but not beyond available stock)
            const existingItem = cart[existingItemIndex];
            if (existingItem.quantity < Number(selectedSize.stock)) {
                existingItem.quantity += 1;
            } else {
                alert("No more stock available for this size.");
            }
        } else {
            // Add a new cart item with selected size info
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                size: selectedSize.name,
                stock: selectedSize.stock,
                image: product.images?.[0] || null,
                quantity: 1,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("Cart updated:", cart);
    };

    return (
        <>
            <Header></Header>
            <div className="product-page">
                <div className="product-left">
                    <div className="main-image">
                        {product?.images && product?.images.length > 0 && (
                            <img
                                src={`${import.meta.env.VITE_API_URL}/${mainImage}`}
                                alt="Mabroom Dates"
                            />
                            // <span className="discount-badge">৳170 DISCOUNT</span>
                        )}
                    </div>

                    <div className="thumbnail-list">
                        {
                            product?.images && product?.images.map((img, index) => (
                                <img
                                    onClick={() => setMainImage(product.images[index])}
                                    key={index}
                                    src={`${import.meta.env.VITE_API_URL}/${img}`}
                                    alt={`thumb-${index}`}
                                />
                            ))
                        }
                    </div>
                </div>

                <div className="product-right">
                    <h2>{product?.name}</h2>

                    <div className="price-section">
                        <p className="current-price">Tk {product?.price}</p>
                        {/* <p className="old-price">Tk 1,700.00</p>
                    <p className="save-tag">Save Tk 170.00</p> */}
                    </div>
                    {product.sizes?.length > 1 && (
                        <div className="size-selection">
                            <label htmlFor="size-select">Select Size:</label>
                            {product.sizes?.map((size, index) => (
                                <div
                                    key={index}
                                    className={`size-option ${selectedSize?.name === size.name ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size.name}
                                </div>
                            ))}
                        </div>
                    )}
                    {product.sizes?.some(size => Number(size.stock) > 0) ?
                        <div className="buttons">
                            <button className="btn black" onClick={() => handleAddToCart(product, selectedSize)}>Add to cart</button>
                            <button className="btn orange">
                                🛒 ক্যাশ অন ডেলিভারিতে অর্ডার করুন
                            </button>
                            <button className="btn yellow">💳 Pay Online</button>
                            <button className="btn black">💬 Chat with us</button>
                            <button className="btn black">📱 WhatsApp Us</button>
                        </div>
                        :
                        <button className="btn black">Out of Stock</button>
                    }

                    <div className="description">
                        <h3>{product?.description}</h3>
                        <p>
                            আমাদের যে কোন পণ্য অর্ডার করতে কল বা WhatsApp করুন:
                            <br />
                            📞 +8801321208940
                            <br />
                            ☎️ ইট লাইন: 09642-922922
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductPage;
