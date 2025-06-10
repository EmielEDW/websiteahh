import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './OrderPage.css'

const TEMPLATE_COUNT = 50

export default function OrderPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    companyNumber: '',
    startDate: null,
    endDate: null,
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
    if (!address) return 0
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      )
      const data = await res.json()
      if (!data[0]) return 0
      const lat2 = parseFloat(data[0].lat)
      const lon2 = parseFloat(data[0].lon)
      const lat1 = 51.049329
      const lon1 = 3.733906
      const R = 6371
      const dLat = ((lat2 - lat1) * Math.PI) / 180
      const dLon = ((lon2 - lon1) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const km = R * c
      setDistance(km * 2)
      return km * 2
    } catch (e) {
      console.error(e)
      return 0
    }
  }

  async function updatePrice(updated) {
    const dist = await calculateDistance(updated.address)
    let days = 0
    if (updated.startDate && updated.endDate) {
      days = Math.round(
        (updated.endDate.getTime() - updated.startDate.getTime()) / 86400000
      ) + 1
    }
    const base = days * 399
    const extraKm = Math.max(0, (dist || 0) - 100) * 0.45
    const extraPrint = updated.extraPrints ? 70 : 0
    setPrice(base + extraKm + extraPrint)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    const updated = { ...form, [name]: type === 'checkbox' ? checked : value }
    setForm(updated)
    if (
      name === 'address' ||
      name === 'startDate' ||
      name === 'endDate' ||
      name === 'extraPrints'
    ) {
      updatePrice(updated)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/checkout', { state: { form, price, distance } })
  }

  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    async function fetchSuggestions() {
      if (!form.address || form.address.length < 3) {
        setSuggestions([])
        return
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address)}`,
          { signal: controller.signal }
        )
        const data = await res.json()
        setSuggestions(data.slice(0, 5))
      } catch (e) {
        console.error(e)
      }
    }
    fetchSuggestions()
    return () => controller.abort()
  }, [form.address])

  const templateOptions = Array.from({ length: TEMPLATE_COUNT }, (_, i) => (
    <option key={i} value={`template${i + 1}`}>{`Template ${i + 1}`}</option>
  ))

  return (
    <form className="order" onSubmit={handleSubmit}>
      <div className="intro">
        <img
          src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=60"
          alt="Event"
        />
      </div>
      <h2>Bestel photobooth</h2>
      <label>
        Naam en info
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Begin datum
        <DatePicker
          selected={form.startDate}
          onChange={(date) => handleChange({ target: { name: 'startDate', value: date } })}
          selectsStart
          startDate={form.startDate}
          endDate={form.endDate}
          dateFormat="dd/MM/yyyy"
          required
        />
      </label>
      <label>
        Eind datum
        <DatePicker
          selected={form.endDate}
          onChange={(date) => handleChange({ target: { name: 'endDate', value: date } })}
          selectsEnd
          startDate={form.startDate}
          endDate={form.endDate}
          minDate={form.startDate}
          dateFormat="dd/MM/yyyy"
          required
        />
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
        <input list="address-list" name="address" value={form.address} onChange={handleChange} required />
        <datalist id="address-list">
          {suggestions.map((s) => (
            <option key={s.place_id} value={s.display_name} />
          ))}
        </datalist>
      </label>
      <label>
        Uur opzetten
        <input type="time" step="900" name="setupTime" value={form.setupTime} onChange={handleChange} required />
      </label>
      <label>
        Uur afbreken
        <input type="time" step="900" name="breakdownTime" value={form.breakdownTime} onChange={handleChange} required />
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
