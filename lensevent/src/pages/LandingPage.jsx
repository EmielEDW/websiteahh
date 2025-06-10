import { Link } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing">
      <img
        className="hero"
        src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=60"
        alt="Photobooth" />
      <h1>LENSEVENT Photobooth Verhuur</h1>
      <p>
        Huur onze photobooths voor jouw evenement. Bestel online, betaal en kies
        een thema. Wij nemen vervolgens contact op om het fotothema volledig op
        maat uit te werken.
      </p>
      <div className="process">
        <h2>Hoe werkt het?</h2>
        <ol>
          <li>Selecteer de gewenste dagen en een fotothema.</li>
          <li>Betaal veilig online via onze betaalpagina.</li>
          <li>Wij leveren en installeren de photobooth op je event.</li>
        </ol>
      </div>
      <Link className="order-button" to="/order">Bestel nu</Link>
    </div>
  )
}
