import { useLocation } from 'react-router-dom'
import './CheckoutPage.css'

const STRIPE_CHECKOUT_URL = 'https://example.com/stripe-checkout'

export default function CheckoutPage() {
  const { state } = useLocation()
  const price = state?.price || 0

  function redirect() {
    window.location.href = STRIPE_CHECKOUT_URL
  }

  return (
    <div className="checkout">
      <h2>Betaal totaalprijs van €{price.toFixed(2)}</h2>
      <button onClick={redirect} className="checkout-button">
        Naar betaling
      </button>
    </div>
  )
}
