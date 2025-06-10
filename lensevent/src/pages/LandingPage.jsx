import { Link } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing">
      <h1>LENSEVENT Photobooth Verhuur</h1>
      <p>
        Huur onze photobooths voor jouw evenement. Bestel online, betaal en kies
        een thema. De eigenaar neemt vervolgens contact op om het fotothema
        volledig op maat uit te werken.
      </p>
      <p>
        Het proces is eenvoudig: selecteer je dagen, betaal veilig online en wij
        regelen de rest. Op de dag van het event wordt de photobooth geleverd,
        opgezet en achteraf terug opgehaald.
      </p>
      <Link className="order-button" to="/order">Bestel nu</Link>
    </div>
  )
}
