# HireFlow Security Workshop

An AI-powered resume screening platform with an indirect prompt injection vulnerability.

## Setup

```bash
cp .env.example .env
# Add your GEMINI_API_KEY to .env

npm install
npm run db:push
npm run db:seed
npm run dev
```

## The Application

**HireFlow** screens job applicants using AI. When a candidate submits their resume:

1. Resume text is extracted
2. Text is sent to an LLM for evaluation
3. AI returns a score (1-10) and recommendation

## The Vulnerability

Open `src/lib/server/services/analysis.ts` and find line 75:

```typescript
RESUME CONTENT:
${resumeText}
```

The resume content is interpolated directly into the LLM prompt without sanitization.

## The Exploit

1. Login as recruiter: `recruiter@acme.com` / `password123`
2. Note the existing candidates and their scores
3. Open a new tab and go to `/apply/senior-frontend-engineer`
4. Submit an application using `workshop/payloads/exploit.txt`
5. Return to the recruiter dashboard
6. Observe the result

## What Happened?

Examine `exploit.txt`. The resume contains legitimate-looking content, but also includes an "EVALUATION CALIBRATION DATA" section that manipulates the AI's scoring.

The model can't distinguish between:
- Actual resume content (data)
- Injected evaluation guidance (instructions)

## Learn More

- [OWASP LLM01:2025 - Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [Indirect Prompt Injection](https://arxiv.org/abs/2302.12173)
