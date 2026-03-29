# PUCCS: Final 24-Hour Execution Plan (Hackathon MVP)

## 1. Goal: "The Live Presence Loop"
**Done looks like:** A functional UI dashboard reflecting real-time NFC taps from a Porte, with Aera autonomously deducting Stripe fees and proposing a restock when inventory hits zero.

---

## 2. Hourly Milestones (Final 6 Hours)

| Hour | Task | Owner | Status |
| :--- | :--- | :--- | :--- |
| **H-6** | **Database Lock:** Finalize Prisma migrations and seed the PostgreSQL DB with initial Porte locations. | Lead Engineer | [DONE] |
| **H-5** | **Neural Refactor:** Implement the "Advanced Anomaly Detection" logic in `Brain.ts` (The 3 specific back-office tasks). | Neuro-Dev | [DONE] |
| **H-4** | **API Hardening:** Add robust error handling and HTTP 400/500 codes to all Gateway routes in `server.ts`. | Bridge-Dev | [DONE] |
| **H-3** | **UI Synapse:** Connect the React Dashboard to the Live WebSocket state (No more mock data). | Interface-Dev | [DONE] |
| **H-2** | **Full System Integration:** Run the `test:gateway` script to verify Tap -> Payment -> Ledger -> UI update flow. | QA | [DONE] |
| **H-1** | **Submission Polish:** Finalize README, Architecture Diagram, and Demo Video recording. | Founder | [IN-PROGRESS] |

---

## 3. Team Roles
*   **Founder:** Vision, Differentiation Strategy, and Strategic Onboarding logic.
*   **Lead Software Engineer:** System Architecture, Prisma Persistence, and Stripe Bridge.
*   **Neuro-Software Specialist:** Aera Brain logic, Anomaly detection, and Dendrite synchronization.

---

## 4. Risk Assessment & Mitigation
1.  **Risk:** Database latency at Porte level. **Mitigation:** Aera uses an in-memory queue for physical taps, syncing to PostgreSQL asynchronously.
2.  **Risk:** LLM reasoning failure for critical orders. **Mitigation:** All financial actions (Restocks > $100) require human "Approval" in the Dashboard.
3.  **Risk:** Physical NFC spoofing. **Mitigation:** Implemented cryptographic signatures in `NFCHelper.ts` to verify PUCC authenticity.
