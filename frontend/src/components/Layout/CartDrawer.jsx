import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import CartContents from '../Cart/CartContents';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CartDrawer = ({drawerOpen, toggleCartDrawer}) => {
 const navigate = useNavigate();
 const {user, guestId} = useSelector((state) => state.auth);
const {cart} = useSelector((state) => state.cart);
const userId = user ? user._id : null;


    const handleCheckout = () => {
        toggleCartDrawer();
        if(!user){
            navigate('/login?redirect=checkout');
        }else{
            navigate('/checkout');
        }
       
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
            {cart && cart?.products?.length > 0 ? ( <CartContents  cart={cart} userId={userId} guestId={guestId}/>) :(
             <div className='text-gray-500 text-center flex flex-col items-center gap-3'>
               <img src="https://media.tenor.com/INRqDWIVZtwAAAAj/bugcat-capoo.gif" alt="Empty Cart" className="w-26 h-26" />
               <p>Giỏ hàng của bạn đang trống</p>
             </div>
            )}
            {/* Add your cart items here */}
           
        </div>   
        {/* checkout button fixed at the bottom */}
        <div className='pg-4 bg-white sticky bottom-0'>
            {cart && cart?.products?.length > 0 && (
                <>
                  <button onClick={handleCheckout} className='w-full bg-[#f5c396] text-[#3c3c3c] py-3 rounded-lg font font-semibold hover:bg-[#f4b07d]
            transition '>
                Thanh toán</button> 
            <p className='text-sm tracking-tighter text-gray-500 mt-2 texxt-center  '>
            Vận chuyển, thuế và mã giảm giá được tính tại thanh toán.
            </p>
                </>
            )}
          
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