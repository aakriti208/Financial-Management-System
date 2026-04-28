import Navbar from '../components/Navbar'
import AIChat from '../components/AIChat'

function AIAdvisorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">AI Financial Advisor</h1>
          <p className="text-sm text-slate-400 mt-0.5 font-medium">
            Personalized advice grounded in your actual financial records
          </p>
        </div>
        <AIChat />
        <p className="text-xs text-slate-300 text-center mt-3">
          Responses are based on your expense and income history via RAG retrieval.
        </p>
      </main>
    </div>
  )
}

export default AIAdvisorPage
