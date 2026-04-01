// TODO: Controlled form with fields:
//   - hypotheticalMonthlyIncome (number)
//   - hypotheticalMonthlyExpenses (number)
//   - projectionMonths (number, range 1–120)
// TODO: Validate all fields before submission
// TODO: On submit, call simulationService.runSimulation(formData)
// TODO: Pass result to parent via onResult callback

function SimulationForm({ onResult }) {
  // TODO: const [form, setForm] = useState({ hypotheticalMonthlyIncome: '', hypotheticalMonthlyExpenses: '', projectionMonths: 12 })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Validate form
    // TODO: const result = await simulationService.runSimulation(form)
    // TODO: onResult(result)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Run What-If Simulation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TODO: Hypothetical monthly income input */}
        {/* TODO: Hypothetical monthly expenses input */}
        {/* TODO: Projection months input (1–120) */}
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Run Simulation
        </button>
      </form>
    </div>
  )
}

export default SimulationForm
