// TODO: Render SimulationForm for what-if scenario inputs
// TODO: On submit, call simulationService.runSimulation() and display results
// TODO: Show projected monthly balance as a LineChart (recharts)
// TODO: Display final projected balance and total savings summary

import Navbar from '../components/Navbar'
import SimulationForm from '../components/SimulationForm'

function SimulationPage() {
  // TODO: const [result, setResult] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">What-If Simulation</h1>
        <p className="text-gray-500 mb-4">
          Adjust your income and expenses to see how your finances would change over time.
        </p>

        <SimulationForm onResult={(data) => { /* TODO: setResult(data) */ }} />

        {/* TODO: Render LineChart with monthlyBalances when result is available */}
        {/* TODO: Render summary cards: projected final balance, total savings */}
      </main>
    </div>
  )
}

export default SimulationPage
