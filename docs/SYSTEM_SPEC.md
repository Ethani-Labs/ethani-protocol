# ETHANI — SYSTEM COMPATIBILITY & INTEGRATION SPEC

This document defines how Smart Contracts, Backend, and Frontend
MUST work together in the Ethani system.

Ethani is a RULE-BASED system.
There is NO AI, NO speculation, NO trading logic.

---

## CORE PRINCIPLES (NON-NEGOTIABLE)

1. Food price stability > profit maximization
2. Deterministic rules > black-box AI
3. Transparency > complexity
4. Real-world usability > crypto-native UX
5. Hackathon MVP > enterprise perfection

---

## SYSTEM ARCHITECTURE

Frontend (Next.js)
  |
Backend API (FastAPI, rule-based)
  |
Smart Contracts (Mantle testnet, Solidity)

Frontend NEVER calls smart contracts directly.
Frontend ONLY talks to backend.
Backend is the single integration layer.

---

## SINGLE SOURCE OF TRUTH

| Data | Source |
|---|---|
Region base price | Smart Contract |
Pricing formula | Smart Contract |
Supply & demand input | Backend |
Final displayed price | Backend (from contract result) |

Frontend MUST NOT calculate prices.

---

## SMART CONTRACT RESPONSIBILITIES

Contracts are READ-HEAVY and SIMPLE.

### EthaniRegion
- Store region name
- Store base food price
- Admin-only mutation
- Expose read-only getters

### EthaniPricing
- Stateless
- Pure price calculation
- Return:
  - finalPrice
  - reason string

### EthaniIncentive
- Track participation points
- No transfer
- No ERC20 logic

Smart contracts NEVER:
- Call external APIs
- Use randomness
- Use AI
- Handle UI logic

---

## BACKEND RESPONSIBILITIES

Backend is the coordinator.

Backend MUST:
- Fetch base price from EthaniRegion
- Call EthaniPricing for price calculation
- Aggregate supply & demand
- Expose simple REST endpoints
- Hide blockchain complexity from frontend

Backend MUST NOT:
- Override pricing logic
- Predict prices
- Introduce AI logic
- Modify contract state without reason

---

## FRONTEND RESPONSIBILITIES

Frontend is human-facing only.

Frontend MUST:
- Display prices from backend
- Explain pricing reason in plain language
- Provide simple role-based dashboards

Frontend MUST NOT:
- Calculate prices
- Show blockchain jargon
- Require wallet connection (for MVP)

---

## API CONTRACT (BACKEND → FRONTEND)

### GET /price

Response:
{
  "region": "Minahasa Selatan",
  "base_price": 10000,
  "supply": 120,
  "demand": 110,
  "final_price": 10800,
  "reason": "MODERATE_DEMAND",
  "method": "rule_based",
  "ai_used": false
}

This response MUST match smart contract output exactly.

---

## ERROR HANDLING RULES

- If contract call fails → backend returns base price
- If supply data missing → backend returns base price
- Frontend always shows fallback explanation

---

## HACKATHON DEMO FLOW (MANDATORY)

1. Admin sets region & base price on-chain
2. Backend fetches region data
3. Backend inputs supply & demand
4. Contract calculates price
5. Frontend displays:
   - price
   - explanation
   - region context

---

## TESTING REQUIREMENTS

Smart Contracts:
- Unit tests for pricing logic
- Edge case: supply = 0

Backend:
- Test mock contract response
- Ensure API returns deterministic output

Frontend:
- Render API response correctly
- No local calculations

---

## COPILOT INSTRUCTIONS

When generating code:
- Follow this spec strictly
- If unsure, prefer clarity over features
- Assume judges are non-technical
- Do NOT introduce AI, tokens, or speculation

END OF SPEC