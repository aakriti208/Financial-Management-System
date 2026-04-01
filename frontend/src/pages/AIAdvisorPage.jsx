// TODO: Render AIChat component for financial question-and-answer
// TODO: Allow user to type a question and display streaming or full AI response
// TODO: Persist chat history in component state across the session

import Navbar from '../components/Navbar'
import AIChat from '../components/AIChat'

function AIAdvisorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">AI Financial Advisor</h1>
        <p className="text-gray-500 mb-4">
          Ask questions about your finances and get personalized advice.
        </p>
        <AIChat />
      </main>
    </div>
  )
}

export default AIAdvisorPage
