## ✨ Overview

MADAR is designed to replace fragmented tutor workflows such as:

- Paper attendance sheets
- Manual payment tracking
- WhatsApp-based quiz sharing
- Separate spreadsheets for groups and expenses
- Unstructured student records
- Manual reporting

The frontend focuses on a fast, Arabic-first, responsive experience for teachers while keeping the dashboard practical and easy to use during real teaching sessions.

---

## 🚀 Core Features

### Authentication

- Login
- Sign up
- Auth initialization
- Access token + refresh token flow
- Protected dashboard routes
- Guest route protection
- Prevent authenticated users from returning to login/register/landing
- Automatic redirect on expired authentication

### Students

- Create, edit, view, and deactivate students
- Search and pagination
- Student profile
- Financial history
- Quiz performance history
- Multi-tenant teacher isolation

### Groups

- Create and manage teaching groups
- Per-session or monthly billing models
- Weekly schedules
- Student enrollment
- Remove and re-activate enrollment
- Group sessions
- Group financial performance
- Group quiz performance

### Sessions

- Create sessions from group schedules
- Schedule validation
- Session status management
- Scheduled / completed / cancelled states
- Attendance workspace integration

### Attendance

- Bulk attendance sheet
- Default-present workflow
- Present / late / absent statuses
- Dirty-state protection
- Save attendance before charging payments
- Session-based attendance summaries

### Payments

- Per-session payments
- Monthly billing
- Partial payments
- Payment ledger
- Outstanding balances
- Student financial history
- Collection statistics

### Expenses

- Expense CRUD
- Categories
- Monthly filtering
- Expense summary
- Payment methods
- Dashboard integration

### Dashboard & Analytics

- Active students
- Active groups
- Today's sessions
- Attendance overview
- Expected revenue
- Collected revenue
- Outstanding balance
- Expenses
- Net income
- Financial trends
- Attendance trends
- Group performance
- Recent payments

### Reports

- Financial reporting
- Attendance reporting
- Session activity
- Group statistics
- Monthly period filters
- Shared backend analytics data

### Quizzes — Pro

- Create quizzes
- Draft / published / archived states
- Bulk grading
- Absent students
- Quiz statistics
- Student performance trends
- Group performance
- Advanced analytics

### Subscription & Billing

- Paid Basic and Pro plans
- 14-day Pro trial
- Subscription status handling
- Feature gating
- Trial expiry protection
- Paymob checkout integration
- Billing history
- Upgrade / downgrade flows
- Cancel at period end
- Reactivation
- Past-due architecture
- Grace period support

> Paymob recurring subscription automation and MOTO-based renewals depend on final provider activation and webhook completion.

### Notifications

- In-app notifications
- Unread counter
- Notification dropdown
- Mark one as read
- Mark all as read
- Delete notifications
- Billing and trial event notifications

### Global Search

The topbar provides a global search experience across:

- Students
- Groups
- Sessions

The search uses a dedicated backend endpoint and debounced RTK Query requests.

### Settings

- Profile settings
- Password change
- Preferences
- Subscription management
- Language
- Timezone
- Currency
- Attendance defaults

---

## 🧱 Tech Stack

### Core

- **Next.js**
- **React**
- **TypeScript**
- **App Router**

### Styling

- **Tailwind CSS**
- Responsive RTL-first UI
- Reusable design system components

### State Management

- **Redux Toolkit**
- **RTK Query**

RTK Query is used for server state such as:

- Students
- Groups
- Sessions
- Attendance
- Payments
- Expenses
- Dashboard
- Reports
- Quizzes
- Subscription
- Billing
- Notifications
- Search

Redux slices are reserved for global client state such as authentication and application-level UI state.

### UI / UX

- **Lucide React**
- **Sonner**
- **Recharts**

---

## 🗂️ Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── groups/
│   │   ├── sessions/
│   │   ├── attendance/
│   │   ├── payments/
│   │   ├── expenses/
│   │   ├── reports/
│   │   ├── quizzes/
│   │   └── settings/
│   │
│   ├── billing/
│   │   └── result/
│   │
│   ├── pricing/
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── auth/
│   ├── attendance/
│   ├── dashboard/
│   ├── expenses/
│   ├── groups/
│   ├── layout/
│   ├── marketing/
│   ├── payments/
│   ├── quizzes/
│   ├── settings/
│   ├── students/
│   ├── subscription/
│   └── ui/
│
├── constants/
│   ├── design.ts
│   └── expenses.ts
│
├── hooks/
│
├── lib/
│   ├── api/
│   │   ├── authApi.ts
│   │   ├── studentsApi.ts
│   │   ├── groupsApi.ts
│   │   ├── sessionsApi.ts
│   │   ├── attendanceApi.ts
│   │   ├── paymentsApi.ts
│   │   ├── expensesApi.ts
│   │   ├── dashboardApi.ts
│   │   ├── reportsApi.ts
│   │   ├── quizzesApi.ts
│   │   ├── subscriptionApi.ts
│   │   ├── billingApi.ts
│   │   ├── notificationsApi.ts
│   │   └── searchApi.ts
│   │
│   ├── auth/
│   ├── errors/
│   ├── formatters/
│   ├── date/
│   └── store/
│
└── types/
```

---

## 🔐 Authentication Flow

MADAR uses a protected application shell.

### Guest routes

Authenticated users should not remain on:

```text
/
/login
/register
```

They are redirected to:

```text
/dashboard
```

### Protected routes

Unauthenticated users attempting to access dashboard routes are redirected to:

```text
/login
```

### Route guard order

```text
AuthInitializer
      ↓
ProtectedGuard
      ↓
SubscriptionGuard
      ↓
FeatureGuard
      ↓
Page
```

This ensures that:

1. Authentication is initialized
2. The user is logged in
3. The user has subscription access
4. The selected plan allows the requested feature

---

## 💳 Subscription Model

MADAR does **not** use a permanent free plan.

New users receive:

```text
14-day Madar Pro Trial
```

During the trial, all Pro features are available.

After the trial expires, the user must select a paid plan.

### Basic

Includes core teaching operations:

- Students
- Groups
- Sessions
- Attendance
- Payments
- Expenses
- Dashboard
- Reports

### Pro

Includes everything in Basic plus:

- Quizzes
- Grades
- Student performance
- Group performance
- Advanced analytics

The frontend never decides subscription permissions on its own. Feature access is enforced by the backend and mirrored in the UI for user experience.

---

## 🔎 Global Search

The topbar search uses a dedicated API:

```http
GET /api/v1/search?q=...
```

Search results can include:

- Students
- Groups
- Sessions

Requests should be debounced and skipped when the query is too short.

Example:

```ts
const { data, isFetching } = useGlobalSearchQuery(searchTerm, {
  skip: searchTerm.length < 2,
});
```

---

## 🔔 Notifications

The notification system supports:

```text
trial_started
trial_ending
trial_expired
payment_succeeded
payment_failed
subscription_activated
subscription_upgraded
subscription_downgrade_scheduled
subscription_cancelled
subscription_reactivated
system
```

The frontend includes:

- Notification bell
- Unread badge
- Dropdown list
- Read state
- Action URLs

## 📱 Responsive Design

Important target sizes:

```text
375px
390px
768px
1024px
1440px+
```

Critical responsive screens:

- Dashboard
- Topbar search
- Students
- Group details
- Attendance workspace
- Payment ledger
- Quiz grading
- Reports
- Settings
- Subscription
- Notifications

---

## 🧪 Final QA Checklist

Before production deployment, verify:

### Authentication

- [ ] Login
- [ ] Register
- [ ] Refresh token
- [ ] Logout
- [ ] GuestGuard
- [ ] ProtectedGuard
- [ ] Deep-link refresh

### Subscription

- [ ] 14-day Pro trial
- [ ] Trial banner
- [ ] Trial expiry
- [ ] Basic feature gating
- [ ] Pro feature access
- [ ] Checkout redirect
- [ ] Billing result
- [ ] Billing history

### Core

- [ ] Students CRUD
- [ ] Groups CRUD
- [ ] Enrollment reactivation
- [ ] Sessions
- [ ] Attendance
- [ ] Per-session payments
- [ ] Monthly payments
- [ ] Partial payments
- [ ] Expenses

### Analytics

- [ ] Dashboard
- [ ] Financial trends
- [ ] Attendance trends
- [ ] Reports
- [ ] Group performance

### Pro

- [ ] Quizzes
- [ ] Grading
- [ ] Statistics
- [ ] Student performance
- [ ] Group performance

### System

- [ ] Search
- [ ] Notifications
- [ ] Settings
- [ ] Error states
- [ ] Empty states
- [ ] Mobile layouts
- [ ] RTL
- [ ] No runtime console errors

---

## ⚠️ Current Billing Notes

The current Paymob integration supports the checkout/payment flow.

The remaining production billing items depend on final provider configuration:

- MOTO integration activation
- Recurring deduction flow
- Webhook HMAC verification
- Automatic subscription renewal
- Failed renewal handling

The frontend must never activate a subscription based only on:

```text
?success=true
```

from the redirect URL.

The backend remains the source of truth for subscription state.

---

## 🛡️ Security Principles

The frontend must never be considered a security boundary.

Security-sensitive permissions are enforced by the backend.

Frontend responsibilities include:

- Hide unavailable features
- Handle expired subscriptions
- Redirect unauthenticated users
- Never expose secrets
- Never trust payment redirect parameters
- Avoid storing unnecessary sensitive information

---

## 🌐 Arabic-First UX

MADAR is designed primarily for Arabic-speaking private tutors.

The application uses RTL by default, while fields such as the following may use LTR:

- Email
- Phone number
- IDs
- Times
- Technical values

---

## 📌 Product Philosophy

MADAR is built around a simple principle:

> **A tutor should be able to manage the entire teaching workflow from one place without relying on paper, spreadsheets, or scattered messaging apps.**

The session is the center of the workflow:

```text
Group
  ↓
Session
  ↓
Attendance
  ↓
Charge
  ↓
Payment
  ↓
Reports & Analytics
```

---

## 🗺️ Roadmap

### Completed / Implemented

- Authentication
- Students
- Groups
- Enrollment
- Sessions
- Attendance
- Payments
- Expenses
- Dashboard
- Reports
- Quizzes
- Subscription system
- Settings
- Notifications
- Global search
- Billing UI
- Trial lifecycle

### Remaining / Production

- Final Paymob recurring setup
- MOTO activation
- Webhook verification
- Automatic renewal
- Production deployment
- Monitoring
- Final performance profiling

### Future

- Email notifications
- WhatsApp notifications
- Annual plans
- Advanced exports
- Parent/student portals
- More advanced analytics
- Native mobile application

---

## 🤝 Contribution Guidelines

When contributing:

1. Keep server state in RTK Query
2. Avoid unnecessary Redux slices
3. Preserve multi-tenant assumptions
4. Keep TypeScript strict
5. Reuse UI components
6. Maintain RTL support
7. Do not change business rules only from the frontend
8. Run build and lint before merging
9. Keep operational screens lightweight
10. Never expose secrets

---

## 📄 License

Add your final project license here before public distribution.

For private/commercial SaaS projects, keep the repository private unless a public release is explicitly intended.

---

## 🌀 MADAR

**كل شغلك كمدرس في مكان واحد.**

Students. Sessions. Attendance. Payments. Reports. Progress.

Built for tutors who want less paperwork and more control.
