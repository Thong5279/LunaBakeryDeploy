import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import CartContents from '../Cart/CartContents';
import { useNavigate } from 'react-router-dom';
const CartDrawer = ({drawerOpen, toggleCartDrawer}) => {
 const navigate = useNavigate();
    const handleCheckout = () => {
        navigate('/checkout');
    };
return (
    <div
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-[#fdf4f9] shadow-lg transform 
        transition-transform duration-300 flex flex-col z-50 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
        {/* Close Button */}
        <div className='flex justify-end p-4'>
            <button onClick={ toggleCartDrawer}>
             <IoMdClose className='h-6 w-6 text-gray-600' />
            </button>
        </div>
        {/* Cart Content with scrollable arena */}    
        <div className='flex-grow p-4 overflow-y-auto'>
            <h2 className='text-xl text-[#a37ba3] font-bold mb-4'>Giỏ hàng</h2>
            {/* Add your cart items here */}
            <CartContents />
        </div>   
        {/* checkout button fixed at the bottom */}
        <div className='pg-4 bg-white sticky bottom-0'>
            <button onClick={handleCheckout} className='w-full bg-[#f5c396] text-[#3c3c3c] py-3 rounded-lg font font-semibold hover:bg-[#f4b07d]
            transition '>
                Thanh toán</button> 
            <p className='text-sm tracking-tighter text-gray-500 mt-2 texxt-center  '>
            Vận chuyển, thuế và mã giảm giá được tính tại thanh toán.
            </p>
        </div>
     
        {/* <div className='p-4 border-t'>
            <button className='w-full bg-[#a37ba3] text-white py-2 rounded-lg hover:bg-[#8f6b8f] transition-colors'>
                Thanh toán
            </button>
        </div>     */}
    </div>
);
}

export default CartDrawer