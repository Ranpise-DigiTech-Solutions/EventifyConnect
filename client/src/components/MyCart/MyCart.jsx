import React, { useState } from 'react';
import Cart from './Cart';
import './MyCart.scss'; // Ensure this is the correct path to your SCSS file

const MyCart = () => {
    const [cartItems, setCartItems] = useState([
        // Initial cart item as an example
        { 
            id: 1, 
            vendorType: 'Shamiyana', 
            vendorName: 'Shri krishna Shamiyana works', 
            date: '2024-06-01', 
            guests: 100, 
            status: 'pending', 
            image: 'assets/Hall_03.png' 
        },
        // Add more items as needed
    ]);

    // Remove an item from the cart
    const handleRemove = (item) => {
        setCartItems(cartItems.filter(cartItem => cartItem.id !== item.id));
    };

    // Placeholder for continuing booking
    const handleContinue = (item) => {
        console.log('Continue booking for:', item);
    };

    return (
        <div className="my-user-cart__container">
            <div className="cart-header">
                <h2>My Cart</h2>
            </div>
            <div className="cart-container">
                <Cart 
                    cartItems={cartItems} 
                    onRemove={handleRemove} 
                    onContinue={handleContinue} 
                />
            </div>
        </div>
    );
};

export default MyCart;
