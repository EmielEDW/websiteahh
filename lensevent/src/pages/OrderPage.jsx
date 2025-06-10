import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OrderPage.css'

const TEMPLATE_COUNT = 50

export default function OrderPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    companyNumber: '',
    dates: '',
    template: '',
    indoor: 'inside',
    guests: 0,
    address: '',
    setupTime: '',
    breakdownTime: '',
    wifi: 'yes',
    code: '',
    extraPrints: false,
    remarks: '',
  })
  const [distance, setDistance] = useState(0)
  const [price, setPrice] = useState(0)

  async function calculateDistance(address) {
    if (!address) return
    const encoded = encodeURIComponent(address)
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=Gent+Brabantdam+101&destinations=${encoded}&key=AIzaSyADPLhq5iTi--6wFEefDhnVw-0k-KAnO-g`
    try {
      const res = await fetch(url)
      const data = await res.json()
      const meters = data.rows[0].elements[0].distance.value
      const km = meters / 1000
      setDistance(km * 2) // heen en terug
      return km * 2
    } catch (e) {
      console.error(e)
    }
  }

  async function updatePrice(updated) {
    const dist = await calculateDistance(updated.address)
    const days = updated.dates ? updated.dates.split(',').length : 0
    const base = days * 399
    const extraKm = Math.max(0, (dist || 0) - 100) * 0.45
    const extraPrint = updated.extraPrints ? 70 : 0
    setPrice(base + extraKm + extraPrint)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    const updated = { ...form, [name]: type === 'checkbox' ? checked : value }
    setForm(updated)
    if (name === 'address' || name === 'dates' || name === 'extraPrints') {
      updatePrice(updated)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/checkout', { state: { form, price, distance } })
  }

  const templateOptions = Array.from({ length: TEMPLATE_COUNT }, (_, i) => (
    <option key={i} value={`template${i + 1}`}>{`Template ${i + 1}`}</option>
  ))

  return (
    <form className="order" onSubmit={handleSubmit}>
      <h2>Bestel photobooth</h2>
      <label>
        Naam en info
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Datums (gescheiden door comma)
        <input name="dates" value={form.dates} onChange={handleChange} required />
      </label>
      <label>
        Template
        <select name="template" value={form.template} onChange={handleChange} required>
          <option value="">Selecteer template</option>
          {templateOptions}
        </select>
      </label>
      <label>
        Ondernemingsnummer
        <input name="companyNumber" value={form.companyNumber} onChange={handleChange} />
      </label>
      <label>
        Event binnen/buiten
        <select name="indoor" value={form.indoor} onChange={handleChange}>
          <option value="inside">Binnen</option>
          <option value="outside">Buiten</option>
        </select>
      </label>
      <label>
        Aantal gasten
        <input type="number" name="guests" value={form.guests} onChange={handleChange} />
      </label>
      <label>
        Adres van event
        <input name="address" value={form.address} onChange={handleChange} required />
      </label>
      <label>
        Uur opzetten
        <input name="setupTime" value={form.setupTime} onChange={handleChange} required />
      </label>
      <label>
        Uur afbreken
        <input name="breakdownTime" value={form.breakdownTime} onChange={handleChange} required />
      </label>
      <label>
        Wifi voorzien?
        <select name="wifi" value={form.wifi} onChange={handleChange}>
          <option value="yes">Ja</option>
          <option value="no">Nee</option>
        </select>
      </label>
      <label>
        Kortingscode
        <input name="code" value={form.code} onChange={handleChange} />
      </label>
      <label className="checkbox">
        <input type="checkbox" name="extraPrints" checked={form.extraPrints} onChange={handleChange} />
        Extra prints (+€70)
      </label>
      <label>
        Opmerkingen
        <textarea name="remarks" value={form.remarks} onChange={handleChange} />
      </label>
      <div className="summary">
        <p>Afstand: {distance.toFixed(1)} km</p>
        <p>Totaalprijs: €{price.toFixed(2)}</p>
      </div>
      <button type="submit">Ga naar betaling</button>
    </form>
  )
}
