// TODO: On mount, fetch predictions via predictionService.getExpensePrediction()
// TODO: Display predicted expenses for next month in a BarChart (recharts)
// TODO: Show comparison table: predicted vs. historical average per category

import Navbar from '../components/Navbar'

function PredictionPage() {
  // TODO: const [predictions, setPredictions] = useState([])
  // TODO: useEffect(() => { predictionService.getExpensePrediction().then(setPredictions) }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Expense Prediction</h1>

        {/* TODO: Add recharts BarChart showing predicted expenses by category */}
        {/* TODO: Add comparison table */}
      </main>
    </div>
  )
}

export default PredictionPage
