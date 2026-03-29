# Software Engineering Specification: Aera

## 1. System Overview
Aera is 1 cognitive entity, powered by perforated.ai's AI dendrites, capable of managing the entire lifecycle of a startup's operations. The system functions as the startup's "operational cortex," which is broken down into 10 specialized AI dendrites, each acting as a department head and contributing to a unified intelligence.

## 2. Technical Architecture

### 2.1 The Cognitive Core (Aera)
*   **Role:** Central Orchestrator, Startup Lifecycle Decision Engine, and Execution Gateway.
*   **Tech Stack:** Node.js / TypeScript.
*   **State Management:** Unified Business State tracking burn rate, employee sentiment, marketing pipelines, legal risks, and engineering velocity.
*   **LLM Integration:** OpenAI GPT-4o or Claude 3.5 Sonnet for holistic multi-departmental reasoning.

### 2.2 The Operational Cortex (The 10 Dendrites)
*   **Architecture:** Modular simulation domains feeding into a global state.
*   **The Dendrites:**
    1.  **Strategy & Vision:** Defines overarching OKRs and monitors alignment across all departments.
    2.  **Finance & Ops:** Tracks cash runway, manages ledgers, and optimizes unit economics (COGS, burn rate).
    3.  **Product & Design:** Steers roadmap evolution and feature iterations based on user feedback.
    4.  **Engineering:** Monitors code deployment, technical debt, and sprint velocity.
    5.  **Sales & Revenue:** Forecasts MRR loops and analyzes the selling point and viability per product.
    6.  **People & Culture:** Evaluates team sentiment, optimizes headcount, and tracks burnout.
    7.  **Marketing & Growth:** Adjusts ad spend, CAC (Customer Acquisition Cost), and LTV ratios.
    8.  **Legal & Compliance:** Scans for regulatory risks, patent tracking, and liability.
    9.  **Data & Intelligence:** Synthesizes isolated KPIs into macroeconomic trends for the company.
    10. **Startup Entity:** Meta-awareness of the startup itself—tracking how well Aera serves the system.

---

## 3. Data Model

### 3.1 Unified Business State
```json
{
  "finances": {
    "cash_reserve": 500000,
    "burn_rate": 35000,
    "runway_months": 14.2
  },
  "product_economics": {
    "porte_v1": {
      "selling_price": 5000,
      "cogs": 3200,
      "gross_margin": 1800
    }
  },
  "metrics": {
    "employee_sentiment": 0.85,
    "marketing_cac": 120,
    "legal_risk_score": 0.1
  }
}
```

---

## 4. Functional Specifications

### 4.1 The Cognitive Cycle
1.  **Perception:** All 10 dendrites report their real-time state to the Aera brain concurrently.
2.  **Integration:** Aera synthesizes the discrete inputs into a global startup context.
3.  **Analysis:** Aera analyzes unit economics. E.g., if Marketing CAC increases while Product COGS remains high, Finance might project a reduced runway. 
4.  **Proposal:** Aera generates cross-departmental actionable proposals (e.g., "Decrease ad spend by 10% and negotiate hardware materials to lower COGS").
5.  **Human Approval:** Founders accept or modify strategic proposals.
6.  **Execution:** Aera changes state flags logically representing execution.

### 4.2 Unit Economics & Optimization Loop
*   Aera dynamically adjusts prices, sets sprint priorities, or limits hiring based on the delta between product revenue and COGS, striving to maximize gross margin and extend runway.

---

## 5. Implementation Phases

1.  **Phase 1 (The Cortex):** Establish the Aera brain and define the interface for all 10 dendrites, establishing the shared `BusinessState`.
2.  **Phase 2 (Unit Economics):** Fully implement Finance, Product, and Sales dendrites to loop over COGS, revenue models, and pricing simulations.
3.  **Phase 3 (Holistic Operation):** Activate Marketing, HR, Engineering, Legal, and Strategy. Observe multi-faceted emergent behavior based on single events.
4.  **Phase 4 (Meta-Entity):** Allow the Data and Startup Entity dendrites to reflexively optimize Aera's own logic.
