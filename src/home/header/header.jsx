
import { useState } from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import ShoppingCart from '../cart/cart';
import './header.css'
import { useEffect } from 'react';
import { api } from '../../utils/api';
import { Link } from 'react-router-dom'
function Header() {
    const [cartOpen, setCartOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [category, setCategory] = useState([]);
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await api.get('/categories');
                const data = await response.data;
                setCategory(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchCategory();
    }, []);

    return (
        <>
            {cartOpen && <ShoppingCart cartOpen={cartOpen} setCartOpen={setCartOpen} />}
            <div className="header-tag">আমাদের যে কোন পণ্য অর্ডার করতে কল বা WhatsApp করুন:  +8801321208940 |  হট লাইন: 09642-922922</div>
            {searchOpen &&
                <div className="search-container" onClick={() => { setSearchOpen(false) }}>
                    <div className="search-wrapper" onClick={(e) => e.stopPropagation()}>
                        <div className="logo"><img src="/logo.png" alt="" /></div>
                        <input type="text" name="search" id="" placeholder='Search' />
                        <div className="cart-profile">
                            <div onClick={() => setCartOpen(!cartOpen)}>
                                <FaShoppingCart />
                            </div>
                            <CgProfile />
                        </div>
                    </div>
                </div>
            }
            <div className='home-header'>
                <div className="search" onClick={() => setSearchOpen(true)}><IoSearchSharp /></div>
                <Link to={'/'}>
                    <div className="logo"><img src="/logo.png" alt="" /></div>
                </Link>
                <div className="cart-profile">
                    <div onClick={() => setCartOpen(!cartOpen)}>
                        <FaShoppingCart />
                    </div>
                    <CgProfile />
                </div>
            </div>
            <div className="category-wrapper">
                {category.map(cat => (
                    <Link to={`/category/${cat?.name}`} key={cat.id}>
                        <div className="category">{cat?.name}</div>
                    </Link>
                ))}
            </div>
        </>
    )
}
export default Header;