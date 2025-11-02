import React from "react";
import "./category.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import Header from '../header/header';
import { Link } from 'react-router-dom';
const ProductPage = () => {
    const { name } = useParams();
    const [products, setProducts] = useState([]);
    const [selectedSize, setSelectedSize] = useState('');
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${name}`);
                const data = await response.data;
                setProducts(data);
                setSelectedSize(data.sizes?.find(size => Number(size.stock) > 0) || '');
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        }
        fetchProduct();
    }, [name]);
    const handleAddToCart = (product, selectedSize) => {
        if (!selectedSize) {
            alert("Please select a size before adding to cart.");
            return;
        }

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
            <div className="product-label">Home/{name}</div>
            <div className="product-wrapper">
                {products.map(product => (
                    <div className="product" key={product.id}>
                        <Link to={`/product/${product.id}`}>
                            <img src={`http://localhost:8080${product.images[0]}`} alt="" />
                        </Link>
                        <Link to={`/product/${product.id}`}>
                            <div className="product-name">{product.name}</div>
                        </Link>
                        <div className="product-price">TK {product.price}</div>
                        {product.sizes?.some(size => Number(size.stock) > 0) ?
                            <div className="cart-button" onClick={() => handleAddToCart(product, selectedSize)}>Add to cart</div>
                            :
                            <div className="out-of-stock-button">Out of stock</div>
                        }
                    </div>
                ))}
            </div>
            <div className="main"></div>
            <div className="footer"></div>
        </>
    );
};

export default ProductPage;
