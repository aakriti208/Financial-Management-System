// TODO: Controlled form with fields:
//   - tuitionPerCourse (number)
//   - numberOfCourses (number, min 1)
//   - scholarshipAmount (number, optional)
// TODO: Show a live preview of gross and net tuition as the user types
// TODO: On submit, call tuitionService.calculate(formData) and pass result to onResult callback

function TuitionForm({ onResult }) {
  // TODO: const [form, setForm] = useState({ tuitionPerCourse: '', numberOfCourses: '', scholarshipAmount: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Validate form
    // TODO: const result = await tuitionService.calculate(form)
    // TODO: onResult(result)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Calculate Tuition Cost</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TODO: Tuition per course input */}
        {/* TODO: Number of courses input */}
        {/* TODO: Scholarship amount input (optional) */}
        {/* TODO: Live preview: Gross = tuitionPerCourse * numberOfCourses */}
        {/* TODO: Live preview: Net = Gross - scholarshipAmount */}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Calculate
        </button>
      </form>
    </div>
  )
}

export default TuitionForm
