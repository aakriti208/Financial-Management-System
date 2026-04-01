// TODO: On mount, fetch income list via incomeService.getAll()
// TODO: Render IncomeForm for adding new entries
// TODO: Display income records in a sortable table
// TODO: Implement edit (open form pre-filled) and delete with confirmation

import Navbar from '../components/Navbar'
import IncomeForm from '../components/IncomeForm'

function IncomePage() {
  // TODO: const [incomes, setIncomes] = useState([])
  // TODO: useEffect(() => { incomeService.getAll().then(setIncomes) }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Income</h1>

        <IncomeForm onSuccess={() => { /* TODO: Refresh income list */ }} />

        {/* TODO: Add income table with columns: Date, Source, Amount, Description, Actions */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <p className="p-6 text-gray-400">
            {/* TODO: Render income rows */}
            No income records yet.
          </p>
        </div>
      </main>
    </div>
  )
}

export default IncomePage
