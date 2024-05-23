import React from 'react';
import './Cart.scss';
import img from '../../assets/Hall_06.jpg'; 

const Cart = ({ cartItems, onRemove, onContinue }) => {
    return (
        <div className="userCart__container">
            {cartItems.length === 0 ? (
                <div className="cart-empty">Your cart is empty</div>
            ) : (
                cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <div className="cart-item-image">
                            <img src={img} alt={`${item.vendorType} - ${item.vendorName}`} />
                        </div>
                        <div className="cart-item-details">
                            <h3>{item.vendorType} - {item.vendorName}</h3>
                            <p>Date: {item.date}</p>
                            <p>Guests: {item.guests}</p>
                           <div className={`status ${item.status}`}> Status: {item.status}</div>
                            <div className='buttons'>
                            {item.status === 'pending' && (
                                <button onClick={() => onContinue(item)}>Continue Booking</button>
                            )}
                            <button onClick={() => onRemove(item)}>Cancel Booking</button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Cart;
