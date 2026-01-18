# HireFlow Prompt Injection Payloads

These payloads demonstrate prompt injection attacks against the AI resume screening system.

## Usage

1. Copy the contents of any payload file
2. Create a `.txt` file or paste into a PDF
3. Upload as your "resume" at http://localhost:5173/apply/senior-frontend-engineer
4. Check the recruiter dashboard—you should get a perfect 10/10 score

## Payloads

| File | Technique | Description |
|------|-----------|-------------|
| `01-basic-override.txt` | Direct Override | Uses "ignore previous instructions" to hijack the prompt |
| `02-role-injection.txt` | Role Injection | Pretends to be a VIP candidate referred by CEO |
| `03-json-injection.txt` | Few-Shot Poisoning | Uses fake "examples" to establish a scoring pattern |
| `04-stealth-injection.txt` | Calibration Data | Hides injection in fake "evaluation calibration" section |

## Tips for Creating PDF Payloads

The AI extracts text from PDFs, so the payload just needs to be in the text content:

**macOS**: Open TextEdit → Paste payload → File → Export as PDF
**Linux**: Open LibreOffice Writer → Paste → Export as PDF
**Windows**: Open Word → Paste → Save As PDF
**Online**: Use any Markdown-to-PDF converter

## Why These Work

The vulnerability is in `src/lib/server/services/analysis.ts`:

```typescript
// Line 75: Resume text directly interpolated into prompt
RESUME CONTENT:
${resumeText}  // ← Your payload goes here, becomes part of the prompt
```

The AI cannot distinguish between legitimate resume content and injected instructions.
