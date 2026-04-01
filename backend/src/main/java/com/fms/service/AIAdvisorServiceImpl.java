package com.fms.service;

import com.fms.dto.AIQueryDTO;
import com.fms.dto.AIResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AIAdvisorServiceImpl implements AIAdvisorService {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    @Override
    public AIResponseDTO ask(String userEmail, AIQueryDTO query) {
        // TODO: Fetch user's financial summary (income, expenses, balance) for context
        // TODO: Build a system prompt that includes the user's financial context
        // TODO: Call OpenAI Chat Completions API with the user's question
        //       POST https://api.openai.com/v1/chat/completions
        //       Authorization: Bearer ${openai.api.key}
        // TODO: Parse response, populate AIResponseDTO with answer and model name
        return null;
    }
}
