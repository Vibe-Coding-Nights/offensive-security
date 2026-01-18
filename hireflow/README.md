# HireFlow

AI-powered resume screening.

## Setup

```bash
npm install
cp .env.example .env          # add your GEMINI_API_KEY
docker-compose up -d
npm run db:push && npm run db:seed
npm run dev
```

Open http://localhost:5173

Login: `recruiter@acme.com` / `password123`

## Workshop

See [`workshop/`](./workshop/)

## Reading

- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [Indirect Prompt Injection](https://arxiv.org/abs/2302.12173)
- [Not What You've Signed Up For](https://arxiv.org/abs/2302.12173)
- [Securing Agentic AI](https://developer.nvidia.com/blog/securing-agentic-ai-how-semantic-prompt-injections-bypass-ai-guardrails/)
