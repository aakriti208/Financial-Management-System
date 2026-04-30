# Prompt 12 — Switch from OpenAI to Groq + Bug Fixes
**Phase:** AI Migration & Debugging

---

## Context
Hit the OpenAI free tier limit. Switching to Groq (groq.com) which is free, fast, and uses an OpenAI-compatible API — minimal code changes needed. Also fixing a few bugs found during testing: 403 on protected endpoints caused by wrong @AuthenticationPrincipal type, and the /error endpoint being blocked by Spring Security which was masking real exceptions.

Also dropping the RAG retrieval since Groq doesn't have an embeddings API — replacing with simple "10 most recent records" approach which works well enough for our data volumes.

---

## Prompt

```
Migrate the FMS AI advisor from OpenAI to Groq and fix two security bugs.

---

## PART A — Migrate to Groq

Groq's API is OpenAI-compatible. Only the endpoint URL and model name change.

### OpenAIClient.java changes:
1. Change CHAT_URL from "https://api.openai.com/v1/chat/completions"
                    to "https://api.groq.com/openai/v1/chat/completions"
2. Remove the embed() method entirely (Groq has no embeddings API)
3. Change @Value injection:
   - Was:  @Value("${openai.api.key}") String apiKey
   - Now:  @Value("${grok.api.key}") String apiKey
   - Was:  @Value("${openai.model.chat:gpt-4o-mini}") String chatModel
   - Now:  @Value("${grok.model.chat:llama-3.3-70b-versatile}") String chatModel

### application.properties changes:
Remove:
  openai.api.key=...
  openai.model.embedding=...
  openai.model.chat=...
Add:
  grok.api.key=YOUR_GROQ_KEY_HERE
  grok.model.chat=llama-3.3-70b-versatile

### EmbeddingServiceImpl — make both methods no-ops:
Since there's no embedding model, just log a debug message and return.
embedExpenseAsync: log.debug("Embedding skipped for expense {}", expenseId)
embedIncomeAsync:  log.debug("Embedding skipped for income {}", incomeId)
Remove OpenAIClient and VectorRepository fields from EmbeddingServiceImpl.

### AIAdvisorServiceImpl — revert to direct DB fetch (no vector search):
Replace the embedding-based retrieval with:
  List<Expense> recentExpenses = expenseRepository.findByUserOrderByDateDesc(user)
                                    .stream().limit(10).toList()
  List<Income> recentIncomes = incomeRepository.findByUserOrderByDateDesc(user)
                                    .stream().limit(10).toList()
Also update @Value to use grok.model.chat property.

---

## PART B — Fix @AuthenticationPrincipal Bug (403 on all protected endpoints)

### Problem
JwtAuthenticationFilter sets the principal as a plain String (the email):
  new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList())

But multiple controllers were using:
  @AuthenticationPrincipal UserDetails userDetails

Spring tries to cast String to UserDetails → null → Spring Security returns 403.

### Fix — change in ALL affected controllers:
AIAdvisorController, TuitionController, PredictionController, SimulationController

Before: @AuthenticationPrincipal UserDetails userDetails  ... userDetails.getUsername()
After:  @AuthenticationPrincipal String email             ... email

Remove the import: org.springframework.security.core.userdetails.UserDetails

---

## PART C — Fix /error endpoint returning 403 (masking real errors)

### Problem
When a controller throws an exception, Spring forwards internally to /error.
The /error endpoint goes back through the security filter chain.
On the internal forward, the JWT is no longer in the request headers.
Spring Security sees an unauthenticated request to a protected resource → 403.
This hides the real error (400, 500, etc.) from the client.

### Fix — add /error to permitAll in SecurityConfig:
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**", "/error").permitAll()
    .anyRequest().authenticated()
)
```
