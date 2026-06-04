# Shravan

Shravan is a React + Vite + Firebase agent portal for recurring deposit operations.

## What is implemented

- Agent login with fixed `agentId`, password, and app captcha
- No public registration flow
- OTP-based password reset flow for agent accounts
- Home dashboard with agent details, current date and time, weather, active-user count, and users nearing maturity
- Searchable user directory with filters for account ID, first name, mobile, email, and nominee name
- Daily schedule page that saves daily payment entries and updates monthly summaries automatically
- Per-user detail page with payment history and monthly summary history

## Firestore collections expected

### `agents`
Each document should contain:

- `agentId`
- `agentName`
- `role`
- `adminPhone`
- `passwordHash` or legacy `password`
- `isActive`

### `users`
Each document should contain:

- `agentId`
- `firstName`
- `lastName`
- `nomineeName`
- `accountNumber`
- `accountOpeningDate`
- `address`
- `mobileNumber`
- `email`
- `denomination`
- `accountType`
- `totalDepositedAmountSoFar`
- `monthPaidUpTo`
- `dateOfLastDeposit`
- `isActive`

### `dailyPayments`
Saved from the daily schedule page.

### `userMonthlySummary`
Upserted automatically from daily payment entries.

### `otpResets`
Stores OTP reset requests for password updates.

## Local run

```bash
npm install
npm run dev
```

## Notes

- OTP currently uses a development preview inside the UI. Wire it to your SMS provider for production.
- Weather is fetched client-side from Open-Meteo for Kolkata.
- If Firestore asks for a composite index, create the suggested index from the Firebase console for the query shown in the error message.
