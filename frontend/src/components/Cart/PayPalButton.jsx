import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const PayPalButton = ({amount, onSuccess , onError}) => {
  return (
    <div> 
    <PayPalScriptProvider 
    options={{"client-id": "AdPjzilRxWkM_jZ_Y-h5ysZbWAS5QbSnEn4q7F_jXiNVjehOFHJin3FpcsC58HtWu1Kq0517CD4I1-Om"}}>

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
            return actions.order.capture().then(onSuccess)
            }}
        onError={onError}
        />
    </PayPalScriptProvider>
     </div>
  )
}

export default PayPalButton