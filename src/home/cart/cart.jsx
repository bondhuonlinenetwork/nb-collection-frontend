import React, { useEffect, useState } from 'react';
import './cart.css';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

const ShoppingCart = ({ cartOpen, setCartOpen }) => {
    const stateName = 'products';
    const [products, setProducts] = useState([]);
    const [checkoutButtonDisabled, setCheckoutButtonDisabled] = useState(false);
    const [cartItems, setCartItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    });

    // 🧩 Fetch products from backend
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products`);
                const data = await response.data;
                setProducts(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, []);

    // 🧠 Validate cart stock without infinite loop
    const checkStock = (cartList) => {
        if (!Array.isArray(cartList) || cartList.length === 0) return;

        let updated = [...cartList];
        let hasChanged = false;

        updated = updated.map((c) => {
            const dbProduct = products.find((item) => String(item.id) === String(c.id));
            if (!dbProduct) return c;

            const sizes = Array.isArray(dbProduct.sizes) ? dbProduct.sizes : [];
            let sizeObj = sizes.find((s) => String(s.name) === String(c.size));
            if (!sizeObj && sizes.length === 1) sizeObj = sizes[0];

            const currentStock = Number(sizeObj?.stock ?? 0);
            const requestedQty = Number(c.quantity ?? 0);
            const isStock = requestedQty <= currentStock;

            // normalize previous currentStock to number before comparing to avoid
            // type-mismatch causing spurious updates (e.g. '3' !== 3)
            const prevCurrentStock = Number(c.currentStock ?? 0);

            if (c.isStock !== isStock || prevCurrentStock !== currentStock) {
                hasChanged = true;
                return { ...c, isStock, currentStock };
            }
            return c;
        });

        // ✅ Only update if something really changed
        if (hasChanged) {
            setCartItems(updated);
        }

        // 🔒 Disable checkout if any item is out of stock
        const disableCheckout = updated.some((item) => item.isStock === false);
        setCheckoutButtonDisabled(disableCheckout);
    };

    // 🔄 Check stock once products are loaded
    useEffect(() => {
        if (products.length > 0) checkStock(cartItems);
    }, [products]);

    // 💾 Sync localStorage and update checkout-disabled when cart or products change
    // Note: don't call checkStock here to avoid a state-update loop. checkStock
    // runs when `products` change (see the products effect) and we keep cartItems
    // updates minimal inside checkStock only. Here we persist cart and compute
    // whether checkout should be disabled without mutating cartItems.
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));

        if (products.length === 0) return;

        const disableCheckout = cartItems.some((item) => {
            const dbProduct = products.find((p) => String(p.id) === String(item.id));
            if (!dbProduct) return true; // treat missing product as non-stock
            const sizes = Array.isArray(dbProduct.sizes) ? dbProduct.sizes : [];
            let sizeObj = sizes.find((s) => String(s.name) === String(item.size));
            if (!sizeObj && sizes.length === 1) sizeObj = sizes[0];
            const currentStock = Number(sizeObj?.stock ?? 0);
            return Number(item.quantity ?? 0) > currentStock;
        });

        setCheckoutButtonDisabled(disableCheckout);
    }, [cartItems, products]);

    // ➕➖ Quantity updates
    const increaseQty = (id) => {
        const updated = cartItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updated);
    };

    const decreaseQty = (id) => {
        const updated = cartItems.map((item) =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        );
        setCartItems(updated);
    };

    // ❌ Remove item
    const removeItem = (productId, sizeName) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = cart.filter(
            (item) => !(item.id === productId && item.size === sizeName)
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="cart-container" onClick={() => setCartOpen(false)}>
            <div className="cart-wrapper" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>Shopping Cart</h2>
                    <button className="cart-close" onClick={() => setCartOpen(!cartOpen)}>✕</button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p className="empty-cart">Your cart is empty</p>
                    ) : (
                        cartItems.map((item) => (
                            <div className="cart-item" key={`${item.id}-${item.size || ''}`}>
                                {!item.isStock && (
                                    <div className="out-of-stock">
                                        <span>⚠️ Only {item.currentStock} items in stock!</span>
                                    </div>
                                )}
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                                    alt={item.name}
                                    className="cart-image"
                                />
                                <div className="cart-info">
                                    <h4>{item.name}</h4>
                                    <span>Tk {item.price.toLocaleString()}</span>
                                    {item.size && <span>size: {item.size}</span>}

                                    <div className="cart-controls">
                                        <button onClick={() => decreaseQty(item.id)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => increaseQty(item.id)}>+</button>
                                        <span
                                            className="remove"
                                            onClick={() => removeItem(item.id, item.size)}
                                        >
                                            Remove
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="subtotal">
                            <span>Subtotal</span>
                            <strong>Tk {subtotal.toLocaleString()}</strong>
                        </div>
                        {checkoutButtonDisabled ? (
                            <button className="pay-online" disabled>
                                Checkout
                            </button>
                        ) : (
                            <Link to="/checkout" state={{ [stateName]: cartItems }}>
                                <button className="pay-online">Checkout</button>
                            </Link>
                        )}
                        <button className="pay-cod">🛒 ক্যাশ অন ডেলিভারিতে অর্ডার করুন</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart;
