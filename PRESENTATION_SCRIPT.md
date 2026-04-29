# Numo — Presentation Script

---

## Slide 1 — Title Slide
*"Numo: Financial Management System"*

> "Hi everyone. Today I'm presenting Numo — a financial management web application built specifically for international students. The idea came from a very real problem: managing money across multiple income sources like scholarships, stipends, and family support, while also keeping track of rent, tuition, and daily expenses. Numo brings all of that into one place, and adds an AI advisor on top of it. Let me walk you through how it was built."

---

## Slide 2 — Tech Stack

> "Starting with the tech stack. The application is split into two main parts — a React frontend and a Spring Boot backend.

> On the frontend, we used React 18 with Vite as the build tool, Tailwind CSS for styling, Recharts for financial visualizations, and Axios for HTTP communication with the backend.

> On the backend, we used Java 17 with Spring Boot 3.2, Spring Security for authentication, and Spring Data JPA with Hibernate to talk to a PostgreSQL database.

> For authentication, we implemented stateless JWT — no server-side sessions, just a token that travels with every request.

> And for the AI component, we integrated the Groq API, running the Llama 3.3 70B model through an OpenAI-compatible endpoint — which brings fast, free inference without any OpenAI bill.

> All of this was tested using JUnit 5 and Mockito on the backend, and Vitest with React Testing Library on the frontend."

---

## Slide 3 — Development Cycle

> "Now let me briefly walk through how the project was developed.

> We started with planning — defining what an international student actually needs: tracking scholarships, planning for tuition, understanding where their money is going.

> From there we designed the architecture — a RESTful Spring Boot API with a React single-page application on the frontend, connected via JWT-authenticated HTTP calls.

> The core build followed a logical order: authentication first, then income and expense CRUD, then the dashboard, prediction engine, and finally the AI advisor and tuition planner.

> AI integration came next — we engineered the system prompt to inject the user's real financial data into every query so the model gives personalized, grounded advice.

> We then wrote unit and controller tests across both layers.

> And finally, iterative debugging — fixing issues like a pgvector startup failure that was silently killing the backend, a JWT principal binding bug causing 403 errors, and a CORS misconfiguration. Real-world development never goes perfectly, and debugging these taught us a lot about how Spring Security works under the hood."

---

## Slide 4 — MVC Architecture

> "Let's look at the architecture. We followed a classic MVC pattern, but adapted for a REST API backend.

> At the top is the View layer — our React frontend. Users interact with pages like the Dashboard, Expense Tracker, Income Logger, Tuition Planner, and the AI Advisor.

> Those pages communicate with the backend through eight REST controllers — each handling a specific domain. AuthController for login and registration, DashboardController for financial summaries, and so on.

> The controllers delegate all business logic to the Service layer. This is where the real work happens — calculations, data transformation, AI prompt construction, and affordability analysis.

> And at the bottom, the Service layer talks to JPA Repositories which query PostgreSQL. Our core models are User, Expense, Income, and TuitionPlan.

> One important piece sitting across all of this is the JWT Authentication Filter — it intercepts every request, validates the Bearer token, and injects the user's email as the security principal. This is what keeps each user's data completely isolated."

---

## Slide 5 — Core Features

> "So what can Numo actually do?

> First, users register and log in securely. Every piece of data is scoped to their account via JWT.

> They can log income with source types specific to students — scholarships, assistantships, part-time work, and family support.

> Expenses can be logged with a dual classification: is it Fixed or Variable? And is it Essential or Discretionary? This gives us richer data for both analysis and the AI.

> The Dashboard gives a real-time overview — all-time totals, the five most recent transactions, and a six-month income versus expense bar chart so you can spot trends at a glance.

> The Prediction page uses a moving average algorithm to forecast what you'll spend next month, broken down by category.

> The Tuition Planner takes your tuition cost, number of courses, and any scholarship — and tells you whether you can afford it now, or how many months it will take to save up.

> And finally, the AI Financial Advisor — a chat widget that sits on every page of the app. You can ask it anything about your finances, and it answers using your actual data."

---

## Slide 6 — Key Algorithms

> "Let me highlight the three core algorithms powering the analytical features.

> The first is the Expense Prediction algorithm. It looks back at the last six months of your expense history, groups entries by category, and calculates a moving average — total spent divided by the number of distinct months that category appeared. It also predicts whether the expense will be fixed or variable, and essential or discretionary, based on the most frequent classification in the historical data. Results are sorted by predicted amount so you see your biggest upcoming costs first.

> The second is the Tuition Affordability algorithm. It starts by deducting your scholarship from the gross tuition cost. Then it looks at your current savings — all-time income minus all-time expenses. If your savings already cover the tuition, you're good to go. If not, it calculates your average monthly surplus over the last six months. If the surplus is positive, it divides the remaining gap by the surplus to tell you exactly how many months you need to save. If the surplus is zero or negative, it flags that you need to reduce your expenses before tuition is within reach.

> The third is the Dashboard Monthly Breakdown — simpler but important. For each of the last six calendar months, it sums all income and expense records and packages them for the chart. This gives users a visual trend over time."

---

## Slide 7 — Testing Strategies

> "For testing, we took a layered approach.

> On the backend, service classes were tested using JUnit 5 and Mockito. We mocked the repository layer so tests run in-memory without needing a real database. This lets us test business logic in complete isolation. We covered things like correct total calculations, limiting dashboard results to five recent items, six months of monthly data, and proper error handling when a user isn't found.

> Controllers were tested using Spring's MockMvc — this fires real HTTP requests through the full filter chain without starting a server. It verifies that endpoints return the correct status codes and JSON shapes.

> We also specifically tested JwtUtil — token generation, expiry validation, and claim extraction — since authentication is the foundation of everything else.

> On the frontend, we used Vitest with React Testing Library. Components like SummaryCard were tested to ensure they render correctly with given props. The Login page was tested for form validation behavior. And the auth service was tested with mocked Axios calls to verify the right API endpoints and payloads are used.

> The overall philosophy was: test the logic, not the framework."

---

## Slide 8 — Prompt Engineering

> "Now for one of the more interesting parts — how we engineered the AI prompts.

> The core technique is called context-augmented prompting. Instead of just forwarding the user's question to the model, we build a rich system prompt that contains the user's actual financial data before every single query.

> The system prompt starts with a role definition — we tell the model it's a personal financial advisor for an international student, and that it must answer only based on the data provided. This prevents generic advice and grounds the responses in reality.

> We then inject three structured sections: a Financial Summary with all-time income, expenses, and net balance; the ten most recent expense records with their category, amount, type, and necessity; and the ten most recent income records with their source and amount.

> The model we use is Llama 3.3 70B through Groq's API. We set the temperature to 0.7 — balanced between creativity and consistency — and cap responses at 800 tokens to keep answers concise.

> The result is that when a student asks 'Am I saving enough?' the model isn't guessing — it's looking at their actual numbers and giving a tailored answer. That's the key value of this approach."

---

## Slide 9 — Summary & Conclusion

> "To wrap up.

> Numo is a full-stack financial management platform built for the specific challenges international students face — multiple income streams, tuition planning across semesters, and the need to understand spending patterns clearly.

> Technically, it demonstrates a production-grade architecture: stateless JWT authentication, a clean MVC separation, statistical algorithms for financial forecasting, and AI integration that's actually grounded in user data rather than generic responses.

> A few key decisions I'm particularly proud of: the dual expense classification — tagging each entry as both Fixed or Variable and Essential or Discretionary — gives both the prediction engine and the AI advisor much richer context to work with. And choosing Groq over OpenAI meant we could integrate a powerful language model without any cost, which matters a lot for a student project.

> In terms of what's next — the RAG infrastructure is already in the codebase. Once connected to a free embedding API, the AI advisor would move from fetching the ten most recent records to finding the most semantically relevant ones, regardless of when they were entered. The What-If Simulation feature is also scaffolded and ready to be built out.

> Overall, Numo shows how modern web technologies, statistical modeling, and AI can be combined into something genuinely useful — not just technically impressive, but solving a real problem for a real user group.

> Thank you."

---

*Total estimated speaking time: ~12–15 minutes*
