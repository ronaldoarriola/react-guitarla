import {useEffect, useState, useMemo} from "react";
import {db} from "../data/db.js";

export const useCart = () => {
    const MIN_ITEMS = 1;
    const MAX_ITEMS = 5;
    const CART_NAME = 'cart';

    const initialCart = JSON.parse(localStorage.getItem(CART_NAME)) || [];

    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);

    useEffect(() => {
        localStorage.setItem(CART_NAME, JSON.stringify(cart));
    }, [cart]);

    const addToCart = item => {
        const itemExists = cart.findIndex(guitar => guitar.id === item.id);
        if (itemExists >= 0) {
            if (cart[itemExists].quantity >= MAX_ITEMS)
                return;
            const updatedCart = [...cart];
            updatedCart[itemExists].quantity++;
            setCart(updatedCart);
        } else {
            item.quantity = 1;
            setCart([...cart, item]);
        }
    }

    const removeFromCart = id => setCart(prevState => prevState.filter(guitar => guitar.id !== id));

    const increaseQuantity = id => {
        const updatedCart = cart.map(guitar => {
            if (guitar.id === id && guitar.quantity < MAX_ITEMS) {
                return {
                    ...guitar,
                    quantity: guitar.quantity + 1
                };
            }
            return guitar;
        });
        setCart(updatedCart);
    }

    const decreaseQuantity = id => {
        const updatedCart = cart.map(guitar => {
            if (guitar.id === id && guitar.quantity > MIN_ITEMS) {
                return {
                    ...guitar,
                    quantity: guitar.quantity - 1
                };
            }
            return guitar;
        });
        setCart(updatedCart);
    }

    const clearCart = () => setCart([]);

    // State Derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart]);

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}