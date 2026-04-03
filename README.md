# Copiloto de Crédito - Frontend (Workstream A)

**Project**: agent_analizer_copilot (Copiloto de Crédito para Asesores de Campo)
**Phase**: DEVELOPING
**Status**: Frontend components and pages initialized
**Last Updated**: 2026-03-30

## Overview

This is Workstream A (Frontend Components & UI) of the Copiloto de Crédito MVP. This workstream includes:

- Landing page with value proposition
- Authentication pages (login, signup)
- Advisor dashboard with application list
- 5-step multi-step form with validation
- Responsive mobile-first design
- Offline mode indicators
- Form state persistence
- Clean, distinctive design aesthetic

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **IA/ML**: Anthropic Claude 3.5 Sonnet API
- **Validation**: Zod (shared schemas client + server)
- **Authentication**: Supabase Auth (JWT)
- **Offline Storage**: IndexedDB via Dexie.js (implemented by Workstream C)
- **Styling**: Tailwind CSS

## Project Structure

```
/agent-analizer-copilot-ai
├── app/
│   ├── api/
│   │   ├── applications/
│   │   │   ├── route.ts              # GET/POST applications
│   │   │   ├── [id]/route.ts         # GET/PUT single app
│   │   │   └── submit/route.ts       # POST submit + trigger analysis
│   │   ├── decisions/
│   │   │   ├── approve/route.ts      # POST approve + generate credit
│   │   │   └── reject/route.ts       # POST reject application
│   │   ├── health/route.ts           # GET health check
│   │   └── (other routes TBD)
│   ├── globals.css                   # Global Tailwind styles
│   └── layout.tsx                    # Root layout (TBD: frontend)
│
├── lib/
│   ├── validation/
│   │   └── schemas.ts                # Zod schemas (all form validations)
│   ├── supabase/
│   │   └── client.ts                 # Supabase client (anon + admin)
│   ├── ai/
│   │   ├── prompts.ts                # Claude API prompts (commercial + agro)
│   │   └── credit-analyzer.ts        # IA analysis functions
│   └── utils/
│       └── (auth, calculations, etc)
│
├── supabase/
│   └── migrations/
│       └── 20260330000000_init_schema.sql  # Complete database schema
│
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.js                    # Next.js config (PWA)
├── tailwind.config.ts                # Tailwind config
├── .eslintrc.json                    # ESLint config
├── .env.example                      # Environment variables template
├── CHANGELOG.md                      # Development log
├── ISSUES.md                         # Known issues & solutions
└── README.md                         # This file
```

## Database Schema

### 8 Core Tables

1. **institutions** - Multi-tenant configuration
   - Credit product config (commercial, agricultural)
   - Risk rules (debt-to-income thresholds)
   - Default rates and terms

2. **users** - Advisors, Comité members, Admins
   - Role-based access control
   - Institution assignment
   - Approval limits for comité members

3. **clients** - Loan applicants
   - Personal info (ID, contact, address)
   - Marital status, dependents
   - Unique per institution + ID combination

4. **applications** - Credit applications
   - Applicant + co-applicants
   - Business info (type, sector, sales)
   - Income/expenses
   - IA analysis results
   - Comité decision tracking

5. **analysis_results** - IA analysis audit trail
   - Financial metrics (DTI, payment capacity)
   - Risk assessment
   - Claude recommendations
   - Full response stored as JSON for audit

6. **credits** - Generated after approval
   - Principal, interest rate, monthly payment
   - Disbursement dates, maturity date
   - Status tracking (active, paid_off, default)

7. **sync_queue** - Offline sync tracking
   - Pending operations from field advisors
   - Conflict resolution status
   - Retry logic for failed syncs

8. **notifications** - User notifications
   - Application status updates
   - Sync error alerts
   - Read/unread tracking

### RLS Policies

All tables have Row-Level Security enabled:
- **Advisors**: Can read/write their own applications only
- **Comité members**: Can read all applications in their institution, approve/reject
- **Clients**: Accessible only via related applications (advisor can see clients they've created)
- **Analysis/Credits**: Same visibility as applications

## API Endpoints

### Applications
- `POST /api/applications` - Create new application (draft)
- `GET /api/applications` - List applications (paginated)
- `GET /api/applications/[id]` - Get single application
- `PUT /api/applications/[id]` - Update application (draft only)
- `POST /api/applications/submit` - Submit application + trigger IA analysis

### Decisions
- `POST /api/decisions/approve` - Approve application + auto-generate credit
- `POST /api/decisions/reject` - Reject application + notify advisor

### Health
- `GET /api/health` - System health check

### TBD (Workstream B Phase 2)
- Sync endpoints for offline-first
- Sync conflict resolution
- Batch operations
- Analytics endpoints

## IA Integration

### Claude API Analysis

**Two modes**:
1. **Commercial**: For general business credit
   - Factors: Debt-to-income ratio, payment capacity, business stability
   - Uses commercial analysis prompt

2. **Agricultural**: For farm/rural credit
   - Factors: Seasonal income, crop diversity, off-farm income
   - Uses agricultural analysis prompt

### Analysis Result Format

```json
{
  "risk_level": "low|medium|high|very_high",
  "debt_to_income_ratio": 0.35,
  "payment_capacity_percent": 45,
  "risk_factors": ["high_seasonality", "single_income_source"],
  "recommendation": "Approve with standard terms",
  "confidence_score": 0.92
}
```

## Validation Schemas (Zod)

All schemas are defined in `lib/validation/schemas.ts`:
- `clientSchema` - Personal information
- `businessSchema` - Business details
- `incomeExpensesSchema` - Financial data
- `applicationCreateSchema` - Full application (all steps combined)
- `applicationUpdateSchema` - Partial updates
- `syncRequestSchema` - Offline sync requests
- `decisionSchema` - Approval/rejection
- `analysisRequestSchema` - IA analysis request

Client and server both use the same schemas (type-safe).

## Authentication

- Supabase Auth with JWT tokens
- Magic link login for field advisors (no password)
- OAuth for office staff (future)
- All API routes check JWT in Authorization header
- RLS policies enforce row-level access control

## Environment Variables

Required (see `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
ANTHROPIC_API_KEY=sk-ant-xxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with actual Supabase + Anthropic credentials
```

### 3. Setup Supabase (Local Development)
```bash
# Install Supabase CLI if needed
npm install -g supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db push

# Seed test data
supabase db seed
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` (app TBD by Workstream A)

### 5. Test API Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Create application (requires auth JWT)
curl -X POST http://localhost:3000/api/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## Quality Gates

### Build ✅ In Progress
```bash
npm run build
```
- TypeScript compilation
- Next.js build
- No errors or warnings

### Lint ✅ In Progress
```bash
npm run lint
```
- ESLint validation
- Remove unused imports/variables
- Enforce type safety

### Type Checking ✅ In Progress
```bash
npm run type-check
```
- Full TypeScript strict mode

### Critical Path Testing ✅ To Do
- Authentication flow
- Application CRUD operations
- IA analysis integration
- Offline sync logic
- Database RLS policies

## Cost Estimation

### Backend Development (Workstream B)
- Database schema + migrations: 1-2 hours
- API routes (CRUD): 2-3 hours
- IA integration: 1-2 hours
- Validation schemas: 1 hour
- Testing + debugging: 2-3 hours

**Total Est**: 7-11 hours

### API Calls (Claude)
- Analysis per application: ~0.005 USD (Sonnet 3.5)
- Pilot batch (50 applications): ~0.25 USD
- Post-MVP monitoring: Budget for continued usage

### Deployment
- Vercel (frontend): Free tier for MVP
- Supabase (backend): Free tier for MVP (up to 500k requests/mo)
- Claude API: Pay-as-you-go ($3/1M input, $15/1M output)

## Known Issues & Limitations

### MVP Phase
- **Auth placeholder**: Currently hardcoded user IDs, need real JWT extraction
- **Frontend**: Not implemented (Workstream A in progress)
- **Offline sync**: API routes ready, client-side sync (Workstream C)
- **No image/document storage**: Currently text-only (Phase 2)
- **No signature capture**: Manual signature or biometric (Phase 2)
- **No SMS/email notifications**: Async notifications via database only (Phase 2)

### RLS Edge Cases
- Need to test concurrent updates from multiple users
- Conflict resolution (last-write-wins) needs validation
- Rate limiting not implemented

## Next Steps

### Immediate (Workstream B continuation)
1. Extract auth user from JWT in all API routes
2. Implement `POST /api/applications/sync` for offline sync
3. Complete conflict resolution logic
4. Add comprehensive error handling + logging
5. Write integration tests for critical paths

### Post-MVP (Workstream B Phase 2)
1. Batch analysis endpoint (analyze multiple apps at once)
2. Webhook notifications (Slack for comité)
3. Export functionality (PDF reports)
4. Analytics dashboard endpoints
5. Admin endpoints (institution config, user management)

### Workstream C (Client-Side Sync)
1. Dexie.js IndexedDB setup
2. Service workers + offline detection
3. Conflict resolution UI
4. Sync queue visualization

### Workstream A (Frontend)
1. Multi-step form components
2. Dashboard layouts
3. Comité review interface
4. Responsive mobile design

## References

- **Product Spec**: `proposals/agent_analizer_copilot/01-PRODUCT.md`
- **Technical Design**: `proposals/agent_analizer_copilot/02-TECHNICAL.md`
- **DB Schema Reference**: See `supabase/migrations/20260330000000_init_schema.sql`
- **Existing ETL Reference**: `/Users/qohatpretel/i-am-making-money/finazactivos/etl/sql`

## Support & Questions

For questions about backend implementation:
- Check ISSUES.md for known problems
- Review API route implementations in `app/api/`
- Check validation schemas in `lib/validation/schemas.ts`
- IA prompts in `lib/ai/prompts.ts`

---

**Development Status**: Backend infrastructure initialized, core API routes ready for testing, IA integration complete. Next: Auth integration + offline sync + frontend.
