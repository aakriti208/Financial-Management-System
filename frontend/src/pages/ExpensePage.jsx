// TODO: On mount, fetch expense list via expenseService.getAll()
// TODO: Render ExpenseForm for adding new entries
// TODO: Display expenses in a table grouped or filtered by category
// TODO: Implement edit (open form pre-filled) and delete with confirmation

import Navbar from '../components/Navbar'
import ExpenseForm from '../components/ExpenseForm'

function ExpensePage() {
  // TODO: const [expenses, setExpenses] = useState([])
  // TODO: useEffect(() => { expenseService.getAll().then(setExpenses) }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Expenses</h1>

        <ExpenseForm onSuccess={() => { /* TODO: Refresh expense list */ }} />

        {/* TODO: Add expense table with columns: Date, Category, Amount, Description, Actions */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <p className="p-6 text-gray-400">
            {/* TODO: Render expense rows */}
            No expense records yet.
          </p>
        </div>
      </main>
    </div>
  )
}

export default ExpensePage
