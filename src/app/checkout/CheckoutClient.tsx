'use client'
import React from 'react'
import Checkout from './Checkout'
import CheckoutProtection from './CheckoutProtection'

const CheckoutClient = () => {
  return (
    <CheckoutProtection>
      <Checkout />
    </CheckoutProtection>
  )
}

export default CheckoutClient