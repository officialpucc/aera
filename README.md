# Aera: The Autonomous Startup Neural Hivemind

## 1. Overview
Aera is a singular cognitive entity designed to manage the entire back-office and physical operations of a startup. Unlike traditional management tools, Aera operates as a "Super-Agent" that perceives the world through specialized **Dendrites** (Neural Pathways).

### The Core Loop: Sense -> Predict -> Propose -> Act
Aera continuously monitors real-world presence infrastructure (**Portes**) and financial ledgers to ensure the startup's survival and growth.

---

## 2. The Architecture

### 2.1 The Central Cortex (AeraBrain)
The "Brain" integrates high-dimensional data from disparate departments:
*   **Finance:** Fixed/Variable costs, burn rates, and cash-on-hand.
*   **Operations:** Hardware health (NFC Taps, Jam Detection) and Porte session status.
*   **Supply Chain:** Inventory velocity, PUCC depletion, and bulk order negotiation.
*   **Sales:** Dynamic pricing tiers and revenue projections.

### 2.2 The "Porte" & "PUCC" (Physical Gateway)
The **Porte** is a bi-directional storage unit for digital detox:
1.  **Phone Cubby:** User locks their phone ($5 session fee via Tap-to-Pay).
2.  **PUCC Cubby:** Unlocks once the phone is secured. The user takes the **PUCC** (Digital Detox Device) to remain present in the space.
3.  **The Handshake:** Returning the PUCC (NFC-verified) unlocks the phone cubby and ends the session.

---

## 3. Technical Sophistication
*   **Autonomous Negotiation:** Aera senses low inventory across multiple Portes and automatically negotiates bulk discounts with virtual manufacturers.
*   **Predictive Stock-Out Prevention:** Aera cross-references sales velocity with vendor lead times to ensure a 0% stock-out rate.
*   **Stripe & NFC Integration:** Real-world payment gateways tied directly to hardware events.
*   **Prisma/PostgreSQL Persistence:** All business states, transactions, and sessions are stored in a hardened production database.

---

## 4. Setup & Deployment

### 4.1 Prerequisites
*   Node.js v20+
*   PostgreSQL Database
*   Stripe API Key (Optional for mock mode)

### 4.2 Installation
```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run build
```

### 4.3 Running Aera
1.  **Start the Neural Bridge (WebSocket/HTTP):** `npm run server`
2.  **Start the UI Dashboard:** `cd app && npm run dev`
3.  **Simulate Physical Taps:** `npm run test:gateway`

---
*Aera is the living manifestation of a startup that manages itself.*
