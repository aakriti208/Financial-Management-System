# Prompt 10 — AI Financial Advisor (Initial OpenAI Integration)
**Phase:** AI Feature

---

## Context
All core features are done and tested. Now integrating the AI financial advisor. The idea is to pass the user's real financial data as context to the LLM so it gives personalized advice rather than generic responses. Using OpenAI gpt-4o-mini for now.

---

## Prompt

```
Add an AI Financial Advisor feature to the FMS backend.
The advisor answers the user's financial questions using their actual data as context.
Model: gpt-4o-mini via OpenAI Chat Completions API.

---

### com.fms.config.OpenAIClient (@Component)
Inject:
  @Value("${openai.api.key}") String apiKey
  @Value("${openai.model.chat:gpt-4o-mini}") String chatModel

Use RestTemplate (not WebClient) for HTTP calls.

Method: String chat(String systemPrompt, String userMessage)
  - POST https://api.openai.com/v1/chat/completions
  - Headers: Content-Type: application/json, Authorization: Bearer {apiKey}
  - Body:
    {
      "model": chatModel,
      "messages": [
        { "role": "system", "content": systemPrompt },
        { "role": "user",   "content": userMessage  }
      ],
      "max_tokens": 800,
      "temperature": 0.7
    }
  - Parse response: choices[0].message.content
  - On any exception: throw RuntimeException("OpenAI chat request failed: " + e.getMessage())

---

### com.fms.dto.AIQueryDTO
String question   @NotBlank @Size(max=500)

### com.fms.dto.AIResponseDTO
String answer
String model

---

### com.fms.service.AIAdvisorServiceImpl
Inject: OpenAIClient, UserRepository, ExpenseRepository, IncomeRepository, DashboardService

ask(String userEmail, AIQueryDTO query):
1. Resolve user from userEmail
2. Fetch 10 most recent expenses: expenseRepository.findByUserOrderByDateDesc(user), limit 10
3. Fetch 10 most recent incomes: incomeRepository.findByUserOrderByDateDesc(user), limit 10
4. Get dashboard summary: dashboardService.getSummary(userEmail)
5. Build system prompt:
   "You are a personal financial advisor for an international student.
    Answer based only on the user's actual financial data provided below.
    Be concise, empathetic, and specific. Use dollar amounts when referring to records.

    === FINANCIAL SUMMARY ===
    Total Income  (all-time): ${summary.totalIncome}
    Total Expenses (all-time): ${summary.totalExpenses}
    Net Balance:              ${summary.netBalance}

    === RECENT EXPENSE RECORDS ===
    [for each expense: - {category}: ${amount} | {expenseType} | {necessity} | {date}]

    === RECENT INCOME RECORDS ===
    [for each income: - {source}: ${amount} | {sourceType} | {date}]"

6. Call openAIClient.chat(systemPrompt, query.getQuestion())
7. Return AIResponseDTO(answer, chatModel)

---

### com.fms.controller.AIAdvisorController
POST /api/ai/ask
- @AuthenticationPrincipal String email  (principal is the email string set by JwtAuthFilter)
- @Valid @RequestBody AIQueryDTO query
- Return ResponseEntity<AIResponseDTO> 200

---

### IMPORTANT
The @AuthenticationPrincipal must be typed as String, NOT UserDetails.
The JwtAuthFilter sets a plain String (email) as the principal, not a UserDetails object.
Using UserDetails here will cause a null principal and 403 errors.
```
