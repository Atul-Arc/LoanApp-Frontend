# Loan Eligibility Frontend

Modern React + TypeScript frontend for assessing loan eligibility, chatting with the assistant, and managing loan-related workflows. The app ships with a responsive layout, toast notifications, and a domain-specific API client layer.

## Functional Overview

- **Home dashboard** with quick actions for chat, eligibility checks, and application flows.
- **Loan Eligibility experience** that:
  - Fetches loan types and enforces employment-type constraints.
  - Captures income, EMI, credit score, request amount, tenure, and DOB.
  - Calls the eligibility API and renders results (status, remarks, EMI metrics).
  - Provides client-side validation and friendly error states.
- **Chat assistant** for conversational help, session persistence, and bot responses.
- **Global toast system** for success/error feedback.
- **Sidebar navigation** with disabled work-in-progress entries clearly labeled.

## Technical Architecture

- **Framework**: React 18 + TypeScript, bundled by Vite.
- **State management**: Local hooks (`useState`, `useEffect`, `useMemo`) per page; no global store required yet.
- **Routing**: `react-router-dom` with routes declared in `src/App.tsx` and wrapped by `AppShell` layout.
- **API client**: `src/api/loan.ts` centralizes HTTP calls for loan types and eligibility checks, enforcing env-driven configuration and consistent JSON/Error handling.
- **UI shell**: Shared header, sidebar, and footer components ensure consistent layout. Sidebar highlights active routes and shows WIP badges for disabled links.
- **Styling**: Global styles in `src/App.css`; layout uses CSS grid/flexbox with utility classes for cards, forms, and result panels.
- **Toast notifications**: Context-based provider at `src/components/ToastProvider.tsx` with an imperative `showToast` hook.
- **Form ergonomics**: Numeric parsing helpers, range clamping (e.g., credit score 0-900), and disabled states until prerequisites load.

## Environment Configuration

Place required variables in `.env` (Vite exposes them as `import.meta.env`):

```
# Legacy API URL - Still available and can be switched back 
# VITE_CHAT_API_URL=http://localhost:5250/api/Chat
# New API URL (With RAG support)
VITE_CHAT_API_URL=http://localhost:5250/api/v2/chat
VITE_CHAT_DEFAULT_USER=atul
VITE_LOAN_TYPES_URL=http://localhost:5250/api/Loan/loantypes
VITE_CHECK_ELIGIBILITY_URL=http://localhost:5250/api/Loan/check-eligibility
```

- All API calls rely on these values. Missing variables throw descriptive errors at runtime to avoid silently hitting the wrong origin.
- Restart the dev server after any `.env` change.

## Local Development

1. Install dependencies: `npm install`
2. Run the app: `npm run dev`
3. Open the URL printed by Vite (default `http://localhost:5173`).
4. For production builds: `npm run build` followed by `npm run preview` to smoke test the output.

## Testing the Loan Eligibility Flow

1. Verify the Loan Eligibility route loads loan types (check network tab or API logs).
2. Ensure a loan type requiring `(Salaried)` enforces the Salaried employment option, and likewise for `(Self Employed)`.
3. Submit valid data and confirm the result panel renders status, remarks, and EMI metrics when available.
4. Simulate network failures (stop backend or tweak env URLs) to verify toast-based error reporting and form disabling.

## Deployment Notes

- Build artifacts sit in `dist/` and can be hosted on any static server.
- Configure reverse proxies or Vite dev server proxies if backend APIs are not on the same origin.
- Keep `.env` out of version control if it contains environment-specific secrets; share sanitized values via deployment pipelines or secret stores.

## Future Enhancements

- Add integration tests around the eligibility form using Playwright or Cypress.
- Expand API client to cover application submission and status checks once backend endpoints are ready.
- Introduce analytics or logging hooks to capture eligibility attempts and failure reasons.
