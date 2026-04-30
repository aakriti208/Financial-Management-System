# Prompt 01 — Project Setup & Scaffolding
**Phase:** Initial Setup

---

## Context
Starting a new full-stack project for CS 5394. Need a Spring Boot backend and React frontend for a financial management app targeting international students.

---

## Prompt

```
I'm building a full-stack financial management web application for international students.

Backend: Java 17, Spring Boot 3.2, Maven, Spring Data JPA, Spring Security, PostgreSQL
Frontend: React 18, Vite 5, Tailwind CSS 3, Axios, React Router v6

Generate the following to scaffold the project:

1. A pom.xml with these exact dependencies:
   - spring-boot-starter-web
   - spring-boot-starter-data-jpa
   - spring-boot-starter-security
   - spring-boot-starter-validation
   - org.postgresql:postgresql (runtime)
   - io.jsonwebtoken:jjwt-api:0.11.5
   - io.jsonwebtoken:jjwt-impl:0.11.5 (runtime)
   - io.jsonwebtoken:jjwt-jackson:0.11.5 (runtime)
   - spring-boot-starter-test (test scope)
   - lombok

   groupId: com.fms, artifactId: fms-backend, Java version: 17, Spring Boot: 3.2.0

2. application.properties with:
   - Server port 8080
   - PostgreSQL datasource: jdbc:postgresql://localhost:5432/fms_db
   - JPA: ddl-auto=update, show-sql=true
   - JWT placeholders: jwt.secret=REPLACE_ME, jwt.expiration-ms=86400000
   - OpenAI placeholder: openai.api.key=YOUR_KEY_HERE, openai.model=gpt-4o-mini
   - Logging: DEBUG for com.fms and Spring Security

3. A minimal Vite + React scaffold:
   - package.json with dev/build/preview scripts
   - Dependencies: react, react-dom, react-router-dom@6, axios, recharts
   - DevDeps: vite@5, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer
   - vite.config.js with react() plugin, server port 5173
   - tailwind.config.js with content paths set
   - src/index.css with @tailwind base/components/utilities
   - src/main.jsx rendering <App />

DO NOT add TypeScript, do not use CRA, do not add unnecessary dependencies.
Use placeholder values for all secrets — never hardcode real credentials.
```
