// TODO: Controlled form with fields: amount (number), source (text), date, description (textarea)
// TODO: Validate: amount > 0, source not empty, date not empty
// TODO: On submit, call incomeService.add(formData) and invoke onSuccess callback
// TODO: Reset form fields after successful submission
// TODO: Show inline error messages for validation failures

function IncomeForm({ onSuccess }) {
  // TODO: const [form, setForm] = useState({ amount: '', source: '', date: '', description: '' })
  // TODO: const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Validate form fields
    // TODO: Call incomeService.add(form)
    // TODO: On success: reset form, call onSuccess()
    // TODO: On error: setError(message)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Add Income</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TODO: Amount input */}
        {/* TODO: Source input */}
        {/* TODO: Date input */}
        {/* TODO: Description textarea */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Income
        </button>
      </form>
    </div>
  )
}

export default IncomeForm
