import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const PayPalButton = ({amount, onSuccess , onError}) => {
  return (
    <div> 
    <PayPalScriptProvider 
    options={{"client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID}}>

        <PayPalButtons style={{layout: "vertical"}}
        createOrder={(data, actions) => {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount // Replace with the actual amount
                    }
                }]
            });
        }}
        onApprove={async (data, actions) => {
            console.log('💰 PayPal onApprove called:', data);
            return actions.order.capture().then((details) => {
                console.log('💰 PayPal capture success:', details);
                onSuccess(details);
            });
        }}
        onError={onError}
        />
    </PayPalScriptProvider>
     </div>
  )
}

export default PayPalButton