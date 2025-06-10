import { useLocation } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import './CheckoutPage.css'

const stripePromise = loadStripe('pk_test_TODO_REPLACE')

function CheckoutForm({ price }) {
  const stripe = useStripe()
  const elements = useElements()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    // Placeholder: normally you would create paymentIntent on server
    alert(`Simulated betaling van €${price.toFixed(2)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <CardElement />
      <button type="submit" disabled={!stripe}>Betaal nu</button>
    </form>
  )
}

export default function CheckoutPage() {
  const { state } = useLocation()
  const price = state?.price || 0

  return (
    <div className="checkout">
      <h2>Betaal totaalprijs van €{price.toFixed(2)}</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm price={price} />
      </Elements>
    </div>
  )
}
