// src/core/Brain.ts
import { BusinessState, PendingAction, CustomerNotification, EstablishmentType, LifecycleStage, Milestone } from "../dendrites/Dendrite";

/**
 * Aera Brain: The Intelligent Startup Manifestation
 * She determines what data points she needs to calculate high-level metrics.
 */
export class AeraBrain {
    private state: BusinessState = {
        inventory: {},
        finances: {
            cash_on_hand: 0,
            fixed_costs: { rent: 0, payroll: 0, software_subscriptions: 0 },
            variable_costs: { marketing_per_month: 0, logistics_per_restock: 0 },
            unit_economics: { pucc_cogs: 15.00, session_fee: 5.00 },
            calculated_burn_rate: 0
        },
        sales: { recent_transactions: [], peak_hours: [], conversion_rate: 0, total_session_fees: 0 },
        operations: { portes: {} },
        lifestyle: { presence_score: 0, automation_level: 0, founder_focus_score: 0, mission_impact: "" },
        strategy: { current_stage: "Ideation", next_milestones: [], market_readiness_score: 0 },
        pending_actions: [],
        customer_alerts: [],
        predictions: { out_of_stock_dates: {}, runway_months: 0, projected_revenue_30d: 0, best_performing_establishment: null }
    };

    // Sequential Interview Discovery: Aera targets specific inputs to build her model
    private financialDiscovery: string[] = ["cash", "rent", "payroll", "subscriptions"];
    private currentFinancialIndex: number = 0;
    private currentPath: "onboarding" | "finances" | "inventory" | "portes" | "strategy" = "onboarding";

    public getNextPrompt(): string {
        switch (this.currentPath) {
            case "onboarding":
                return "I am Aera. I am your startup's digital personification. To truly understand our current state, I need to map our neural financial pathways. What is our current **Cash on Hand**?";
            case "finances":
                const step = this.financialDiscovery[this.currentFinancialIndex];
                if (step === "rent") return "Understood. To calculate our burn, I need to know our overhead. What is our monthly **Rent/Space cost** for the Portes and back-office?";
                if (step === "payroll") return "And for the team? What is our total monthly **Payroll** including contractors?";
                if (step === "subscriptions") return "Finally for overhead, what do we spend on **Software/Subscriptions** each month?";
                break;
            case "inventory":
                return "Our finances are mapped. Now, for physical presence: How many **PUCC units** do we have in our master inventory?";
            case "portes":
                return "Operational state: How many **Portes** are live? Tell me the count and venue types (e.g. '2 bars, 1 coworking').";
            case "strategy":
                return "Strategic lifecycle: Where are we? **Ideation, MVP, Product-Market Fit,** or **Scaling**?";
        }
        return "Synchronization complete. I am now monitoring our survival runway. Type 'dashboard' for analysis.";
    }

    public handleInput(input: string): string {
        const numbers = input.match(/\d+/g) || [];
        const val = parseInt(numbers[0]) || 0;

        if (this.currentPath === "onboarding") {
            this.state.finances.cash_on_hand = val;
            this.currentPath = "finances";
            this.currentFinancialIndex = 1; // Start with 'rent'
            return `Cash on hand synchronized: $${val}.`;
        }

        if (this.currentPath === "finances") {
            const step = this.financialDiscovery[this.currentFinancialIndex];
            if (step === "rent") this.state.finances.fixed_costs.rent = val;
            if (step === "payroll") this.state.finances.fixed_costs.payroll = val;
            if (step === "subscriptions") {
                this.state.finances.fixed_costs.software_subscriptions = val;
                this.calculateAggregates();
                this.currentPath = "inventory";
                return `Overhead synchronized. Total monthly burn calculated at $${this.state.finances.calculated_burn_rate}.`;
            }
            this.currentFinancialIndex++;
            return `Deducted $${val} monthly for ${step}.`;
        }

        if (this.currentPath === "inventory") {
            this.state.inventory["PUCC-UNIT"] = { quantity: val, velocity_per_day: 0, lead_time_days: 5 };
            this.currentPath = "portes";
            return `Inventory mapped: ${val} units.`;
        }

        if (this.currentPath === "portes") {
            const barMatch = input.toLowerCase().match(/(\d+)\s*bar/);
            const workMatch = input.toLowerCase().match(/(\d+)\s*cowork/);
            if (barMatch) this.seedPortes(parseInt(barMatch[1]), "Bar");
            if (workMatch) this.seedPortes(parseInt(workMatch[1]), "Coworking");
            this.currentPath = "strategy";
            return `Portes mapped: ${Object.keys(this.state.operations.portes).length} units active.`;
        }

        if (this.currentPath === "strategy") {
            const stages: LifecycleStage[] = ["Ideation", "MVP", "Product-Market Fit", "Scaling", "Maturity"];
            this.state.strategy.current_stage = stages.find(s => input.toLowerCase().includes(s.toLowerCase())) || "Ideation";
            this.currentPath = null as any;
            return `Lifecycle stage set: ${this.state.strategy.current_stage}. All neural pathways are now live.`;
        }

        return "Synchronizing...";
    }

    private calculateAggregates() {
        const fixed = this.state.finances.fixed_costs;
        const variable = this.state.finances.variable_costs;
        
        this.state.finances.calculated_burn_rate = 
            fixed.rent + fixed.payroll + fixed.software_subscriptions + variable.marketing_per_month;

        this.state.predictions.runway_months = 
            this.state.finances.calculated_burn_rate > 0 
                ? this.state.finances.cash_on_hand / this.state.finances.calculated_burn_rate 
                : 99; // Infinite runway if no burn
    }

    private seedPortes(count: number, type: EstablishmentType) {
        for (let i = 0; i < count; i++) {
            const id = `PORTE-${type.toUpperCase()}-${i+1}`;
            this.state.operations.portes[id] = {
                id, establishment_type: type, active_detox_sessions: 0, available_puccs: 20, 
                phone_cubbies_occupied: 0, hardware_status: "healthy", current_session_price: 5.00
            };
        }
    }

    public getState() { return this.state; }
}
