// src/core/Brain.ts
import { BusinessState, PendingAction, CustomerNotification, EstablishmentType, LifecycleStage, Milestone } from "../dendrites/Dendrite";
import { OperationsDendrite } from "../dendrites/Operations";
import { VendorService } from "../services/VendorService";

/**
 * Aera Brain: The Intelligent Startup Manifestation
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
        lifestyle: { presence_score: 85, automation_level: 60, founder_focus_score: 0, mission_impact: "Restoring human presence." },
        strategy: { current_stage: "Ideation", next_milestones: [], market_readiness_score: 0 },
        pending_actions: [],
        customer_alerts: [],
        predictions: { out_of_stock_dates: {}, runway_months: 0, projected_revenue_30d: 0, best_performing_establishment: null }
    };

    private operationsDendrite = new OperationsDendrite();
    private stateListeners: ((state: BusinessState) => void)[] = [];

    private financialDiscovery: string[] = ["cash", "rent", "payroll", "subscriptions"];
    private currentFinancialIndex: number = 0;
    private currentPath: "onboarding" | "finances" | "inventory" | "portes" | "strategy" | null = "onboarding";

    constructor() {}

    public setOnStateUpdate(callback: (state: BusinessState) => void) {
        this.stateListeners.push(callback);
    }

    public removeOnStateUpdate(callback: (state: BusinessState) => void) {
        this.stateListeners = this.stateListeners.filter(l => l !== callback);
    }

    public process() {
        if (this.currentPath !== null) return; 
        
        // Dynamic Simulation
        this.operationsDendrite.simulate(this.state);
        this.hivemindAnalysis();
        this.evaluateActions();
        this.notify();
    }

    private hivemindAnalysis() {
        const totalSales = this.state.sales.recent_transactions.reduce((acc, tx) => acc + tx.amount, 0);
        this.state.predictions.projected_revenue_30d = totalSales * 30;

        // Lifecycle Progression
        if (this.state.predictions.projected_revenue_30d > 5000 && this.state.strategy.current_stage === "MVP") {
            this.state.strategy.current_stage = "Product-Market Fit";
            console.log("[CORTEX] Lifecycle Milestone: Graduation to Product-Market Fit.");
        }
    }

    private evaluateActions() {
        const totalActiveSessions = Object.values(this.state.operations.portes).reduce((acc, p) => acc + p.active_detox_sessions, 0);
        
        // 1. Quantified Metric Updates
        this.state.lifestyle.presence_score = Math.min(100, (totalActiveSessions * 4) + 20);
        this.state.lifestyle.automation_level = 95; 

        // --- BACK-OFFICE TASK 1: AUTONOMOUS PROCUREMENT & NEGOTIATION ---
        const portesToRestock = Object.values(this.state.operations.portes).filter(p => p.available_puccs < 15);
        if (portesToRestock.length > 1) {
            const totalUnits = portesToRestock.length * 50;
            const finalCost = (totalUnits * this.state.finances.unit_economics.pucc_cogs) * 0.85; 
            this.addUniqueAction({
                id: `BULK-RESTOCK-${Date.now()}`,
                porte_id: "ALL",
                type: "BULK_RESTOCK",
                message: `AUTONOMOUS NEGOTIATION: Consolidating restocks for ${portesToRestock.length} locations. 15% bulk discount applied. Total: $${finalCost.toFixed(2)}.`,
                deadline: new Date(Date.now() + 86400000),
                status: "pending",
                metadata: { quantity: totalUnits, cost: finalCost, item: "PUCC-UNIT" }
            });
        }

        // --- BACK-OFFICE TASK 2: PREDICTIVE MAINTENANCE ---
        for (const [id, porte] of Object.entries(this.state.operations.portes)) {
            if (porte.hardware_status === "jammed" || porte.hardware_status === "connectivity_drop") {
                this.addUniqueAction({
                    id: `MAINTENANCE-${id}`,
                    porte_id: id,
                    type: "HARDWARE_CHECK",
                    message: `PREDICTIVE ALERT: ${porte.hardware_status} detected at ${id}. Autonomously scheduling human intervention.`,
                    deadline: new Date(Date.now() + 1800000),
                    status: "pending"
                });
            }
        }

        // --- BACK-OFFICE TASK 3: DYNAMIC REVENUE OPTIMIZATION ---
        for (const [id, porte] of Object.entries(this.state.operations.portes)) {
            if (porte.active_detox_sessions > 15 && porte.current_session_price === 5.00) {
                this.addUniqueAction({
                    id: `PRICE-ADJUST-${id}`,
                    porte_id: id,
                    type: "PRICE_ADJUSTMENT",
                    message: `REVENUE OPTIMIZATION: High occupancy detected at ${id}. Proposing pricing hike to $7.00.`,
                    deadline: new Date(Date.now() + 3600000),
                    status: "pending",
                    metadata: { new_price: 7.00 }
                });
            }
        }
    }

    private addUniqueAction(action: PendingAction) {
        if (!this.state.pending_actions.find(a => a.id.split('-')[0] === action.id.split('-')[0] && a.status === "pending")) {
            this.state.pending_actions.push(action);
        }
    }

    private notify() {
        this.stateListeners.forEach(listener => listener(this.state));
    }

    public getNextPrompt(): string {
        switch (this.currentPath) {
            case "onboarding": return "I am Aera. What is our current **Cash on Hand**?";
            case "finances":
                const step = this.financialDiscovery[this.currentFinancialIndex];
                if (step === "rent") return "What is our monthly **Rent/Space cost**?";
                if (step === "payroll") return "What is our total monthly **Payroll**?";
                if (step === "subscriptions") return "What do we spend on **Software/Subscriptions** each month?";
                break;
            case "inventory": return "How many **PUCC units** are in our master inventory?";
            case "portes": return "How many **Portes** are live? (e.g. '2 bars, 1 cowork')";
            case "strategy": return "Strategic lifecycle: **Ideation, MVP, Product-Market Fit,** or **Scaling**?";
        }
        return "Neural model synchronized. Dashboard live.";
    }

    public handleInput(input: string): string {
        const numbers = input.match(/\d+/g) || [];
        const val = parseInt(numbers[0]) || 0;

        if (this.currentPath === "onboarding") {
            this.state.finances.cash_on_hand = val;
            this.currentPath = "finances";
            this.currentFinancialIndex = 1;
            this.notify();
            return `Cash on hand: $${val}.`;
        }

        if (this.currentPath === "finances") {
            const step = this.financialDiscovery[this.currentFinancialIndex];
            if (step === "rent") this.state.finances.fixed_costs.rent = val;
            if (step === "payroll") this.state.finances.fixed_costs.payroll = val;
            if (step === "subscriptions") {
                this.state.finances.fixed_costs.software_subscriptions = val;
                this.calculateAggregates();
                this.currentPath = "inventory";
                this.notify();
                return `Overhead synced. Monthly burn: $${this.state.finances.calculated_burn_rate}.`;
            }
            this.currentFinancialIndex++;
            this.notify();
            return `Noted: $${val} for ${step}.`;
        }

        if (this.currentPath === "inventory") {
            this.state.inventory["PUCC-UNIT"] = { quantity: val, velocity_per_day: 0, lead_time_days: 5 };
            this.currentPath = "portes";
            this.notify();
            return `Inventory: ${val} units.`;
        }

        if (this.currentPath === "portes") {
            const barMatch = input.toLowerCase().match(/(\d+)\s*bar/);
            const workMatch = input.toLowerCase().match(/(\d+)\s*cowork/);
            if (barMatch) this.seedPortes(parseInt(barMatch[1]), "Bar");
            if (workMatch) this.seedPortes(parseInt(workMatch[1]), "Coworking");
            this.currentPath = "strategy";
            this.notify();
            return `Portes mapped. Total: ${Object.keys(this.state.operations.portes).length}.`;
        }

        if (this.currentPath === "strategy") {
            const stages: LifecycleStage[] = ["Ideation", "MVP", "Product-Market Fit", "Scaling", "Maturity"];
            this.state.strategy.current_stage = stages.find(s => input.toLowerCase().includes(s.toLowerCase())) || "Ideation";
            this.currentPath = null;
            this.notify();
            return `Lifecycle: ${this.state.strategy.current_stage}. Synchronization complete.`;
        }

        return "Synchronizing...";
    }

    public handleChat(text: string): string { return this.handleInput(text); }

    public handleApprove(actionId: string): string {
        const action = this.state.pending_actions.find(a => a.id === actionId);
        if (action) {
            action.status = "approved";
            if (action.type === "HARDWARE_CHECK") {
                const porte = this.state.operations.portes[action.porte_id];
                if (porte) porte.hardware_status = "healthy";
            }
            if (action.type === "RESTOCK_PUCC" || action.type === "BULK_RESTOCK") {
                const quantity = action.metadata?.quantity || 50;
                const cost = action.metadata?.cost || 750;
                VendorService.placeOrder("PUCC-UNIT", quantity, cost);
                this.state.finances.cash_on_hand -= cost;
                this.calculateAggregates();
            }
            if (action.type === "PRICE_ADJUSTMENT" && action.metadata?.new_price) {
                const porte = this.state.operations.portes[action.porte_id];
                if (porte) porte.current_session_price = action.metadata.new_price;
            }
            this.notify();
            return `Approved: ${action.type}. Action processed.`;
        }
        return "Action ID not found.";
    }

    private calculateAggregates() {
        const f = this.state.finances;
        f.calculated_burn_rate = f.fixed_costs.rent + f.fixed_costs.payroll + f.fixed_costs.software_subscriptions;
        this.state.predictions.runway_months = f.calculated_burn_rate > 0 ? f.cash_on_hand / f.calculated_burn_rate : 99;
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

    public registerNewSession(porteId: string, amount: number, sessionId: string) {
        const p = this.state.operations.portes[porteId];
        if (p && p.available_puccs > 0) {
            p.active_detox_sessions++;
            p.available_puccs--;
            this.state.finances.cash_on_hand += amount;
            this.state.sales.total_session_fees += amount;
            this.notify();
        }
    }

    public endSession(porteId: string) {
        const p = this.state.operations.portes[porteId];
        if (p && p.active_detox_sessions > 0) {
            p.active_detox_sessions--;
            p.available_puccs++;
            this.notify();
        }
    }

    public getState() { return this.state; }
}
