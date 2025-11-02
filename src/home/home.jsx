import { useState } from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Header from './header/header'
import './home.css'
import { useEffect } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom'


function Home() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                const data = await response.data;
                setProducts(data);
                // setSelectedSize(data.sizes?.find(size => Number(size.stock) > 0) || '');
                // console.log("sizes:", data[1].sizes);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();

    }, []);

    const handleAddToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Identify if this exact product + size combination already exists
        const existingItemIndex = cart.findIndex(
            (item) => item.id === product.id && item.size === product.sizes[0].name
        );
        if (existingItemIndex !== -1) {
            // If exists, increase quantity (but not beyond available stock)
            const existingItem = cart[existingItemIndex];
            if (existingItem.quantity < Number(product.sizes?.[0].stock)) {
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
                size: product.sizes?.[0].name,
                stock: product.sizes?.[0].stock,
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
            <div className="banner"><img src="/Banner.jpg" alt="" /></div>
            <div className="product-label">ALL PRODUCT</div>
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
                            <div className="cart-button" onClick={() => handleAddToCart(product)}>Add to cart</div>
                            :
                            <div className="out-of-stock-button">Out of stock</div>
                        }
                    </div>
                ))}
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>
                <div className="product">
                    <img src="/product/product.jpg" alt="" />
                    <div className="product-name">USDA organic beetroot</div>
                    <div className="product-price">TK 1500</div>
                    <div className="cart-button">Add to cart</div>
                </div>

            </div>
            <div className="main"></div>
            <div className="footer"></div>
        </>
    )
}

export default Home;