# TODO

## Scope: Node startup + Semantic Scholar-based hallucination rate + local host info

1. Validate how the current app is started (sentinentalrun.bat vs Docker) and what local host/ports are used.
2. Implement/ensure a real “hallucination rate” that is computed using Semantic Scholar evidence (paper/author/year checks, plus reference heuristics).
3. Wire the hallucination rate into the existing frontend output JSON so the UI shows it.
4. Ensure Semantic Scholar API usage is correct and gracefully degrades when API key is missing.
5. Provide a local-host URL statement (Frontend: http://localhost:3000, Backend: http://localhost:8000, API docs: http://localhost:8000/docs or Gradio if applicable).
6. Test by running the bat script and verifying the returned score fields.

