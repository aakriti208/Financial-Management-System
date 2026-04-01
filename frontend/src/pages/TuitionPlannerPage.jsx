// TODO: Render TuitionForm for user input
// TODO: On form submit, call tuitionService.calculate() and display result
// TODO: Show breakdown card: gross tuition, scholarship deduction, net tuition
// TODO: Optionally save result and show calculation history

import Navbar from '../components/Navbar'
import TuitionForm from '../components/TuitionForm'

function TuitionPlannerPage() {
  // TODO: const [result, setResult] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Tuition Planner</h1>

        <TuitionForm onResult={(data) => { /* TODO: setResult(data) */ }} />

        {/* TODO: Render result breakdown when result is not null */}
      </main>
    </div>
  )
}

export default TuitionPlannerPage
