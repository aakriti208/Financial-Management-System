// TODO: Controlled form with fields: amount (number), category (select dropdown), date, description
// TODO: Category options: Rent, Groceries, Tuition, Transport, Utilities, Entertainment, Health, Other
// TODO: Validate: amount > 0, category selected, date not empty
// TODO: On submit, call expenseService.add(formData) and invoke onSuccess callback
// TODO: Reset form after successful submission

const EXPENSE_CATEGORIES = [
  'Rent',
  'Groceries',
  'Tuition',
  'Transport',
  'Utilities',
  'Entertainment',
  'Health',
  'Other',
]

function ExpenseForm({ onSuccess }) {
  // TODO: const [form, setForm] = useState({ amount: '', category: '', date: '', description: '' })
  // TODO: const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Validate form fields
    // TODO: Call expenseService.add(form)
    // TODO: On success: reset form, call onSuccess()
    // TODO: On error: setError(message)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TODO: Amount input */}
        {/* TODO: Category select using EXPENSE_CATEGORIES */}
        {/* TODO: Date input */}
        {/* TODO: Description textarea */}
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Add Expense
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm
