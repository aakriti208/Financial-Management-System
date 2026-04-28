package com.fms.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class OpenAIClient {

    private static final String CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper  = new ObjectMapper();

    @Value("${grok.api.key}")
    private String apiKey;

    @Value("${grok.model.chat:grok-3-mini}")
    private String chatModel;

    /**
     * Calls the Grok Chat Completions API with a system prompt and user message.
     * Returns the assistant's reply text.
     */
    public String chat(String systemPrompt, String userMessage) {
        try {
            Map<String, Object> body = Map.of(
                    "model", chatModel,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user",   "content", userMessage)
                    ),
                    "max_tokens", 800,
                    "temperature", 0.7
            );
            ResponseEntity<String> response = restTemplate.exchange(
                    CHAT_URL, HttpMethod.POST,
                    new HttpEntity<>(body, buildHeaders()), String.class);

            return objectMapper.readTree(response.getBody())
                    .get("choices").get(0).get("message").get("content").asText();
        } catch (Exception e) {
            throw new RuntimeException("OpenAI chat request failed: " + e.getMessage(), e);
        }
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        return headers;
    }
}
