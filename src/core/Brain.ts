// src/core/Brain.ts
import { BusinessState, PendingAction, CustomerNotification, EstablishmentType, LifecycleStage, Milestone } from "../dendrites/Dendrite";
import { OperationsDendrite } from "../dendrites/Operations";
import { VendorService } from "../services/VendorService";

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
        lifestyle: { presence_score: 85, automation_level: 60, founder_focus_score: 0, mission_impact: "Restoring human presence." },
        strategy: { current_stage: "Ideation", next_milestones: [], market_readiness_score: 0 },
        pending_actions: [],
        customer_alerts: [],
        predictions: { out_of_stock_dates: {}, runway_months: 0, projected_revenue_30d: 0, best_performing_establishment: null }
    };

    private operationsDendrite = new OperationsDendrite();
    private stateListeners: ((state: BusinessState) => void)[] = [];

    // Sequential Interview Discovery: Aera targets specific inputs to build her model
    private financialDiscovery: string[] = ["cash", "rent", "payroll", "subscriptions"];
    private currentFinancialIndex: number = 0;
    private currentPath: "onboarding" | "finances" | "inventory" | "portes" | "strategy" | null = "onboarding";

    constructor() {
    }

    public setOnStateUpdate(callback: (state: BusinessState) => void) {
        this.stateListeners.push(callback);
    }

    public removeOnStateUpdate(callback: (state: BusinessState) => void) {
        this.stateListeners = this.stateListeners.filter(l => l !== callback);
    }

    public process() {
        if (this.currentPath !== null) return; // Don't simulate until onboarding is done

        const operationalUpdate = this.operationsDendrite.simulate(this.state);
        
        // Merge updates
        this.state = {
            ...this.state,
            ...operationalUpdate,
            finances: {
                ...this.state.finances,
                cash_on_hand: this.state.finances.cash_on_hand - (this.state.finances.calculated_burn_rate / (30 * 24 * 60 * 12)) // Rough per-5-sec burn
            },
            lifestyle: {
                ...this.state.lifestyle,
                presence_score: Math.min(100, this.state.lifestyle.presence_score + (Math.random() > 0.5 ? 0.1 : -0.1))
            }
        };

        // Lifecycle Progression: Auto-advance if revenue targets met
        if (this.state.predictions.projected_revenue_30d > 5000 && this.state.strategy.current_stage === "MVP") {
            this.state.strategy.current_stage = "Product-Market Fit";
            console.log("NEURAL ALERT: Lifecycle advanced to Product-Market Fit based on revenue projection.");
        }

        this.detectIssues();
        this.calculateAggregates();
        this.notify();
    }

    private detectIssues() {
        // Aera detects anomalies and creates pending actions
        const portes = this.state.operations.portes;
        let totalActiveSessions = 0;

        for (const id in portes) {
            const porte = portes[id];
            totalActiveSessions += porte.active_detox_sessions;

            if (porte.hardware_status === "jammed") {
                this.addUniqueAction({
                    id: `HARDWARE-CHECK-${id}`,
                    porte_id: id,
                    type: "HARDWARE_CHECK",
                    message: `CRITICAL: Hardware jam detected at ${id}. System requires physical manual override.`,
                    deadline: new Date(Date.now() + 3600000), // 1 hour
                    status: "pending"
                });
            } else if (porte.hardware_status === "connectivity_drop") {
                this.addUniqueAction({
                    id: `CONNECTIVITY-CHECK-${id}`,
                    porte_id: id,
                    type: "HARDWARE_CHECK",
                    message: `WARNING: Connectivity drop at ${id}. Data sync is delayed. Attempting remote reboot.`,
                    deadline: new Date(Date.now() + 1800000), // 30 min
                    status: "pending"
                });
            }

            // Generate restock actions if needed
            if (porte.available_puccs < 5) {
                this.addUniqueAction({
                    id: `RESTOCK-${id}`,
                    porte_id: id,
                    type: "RESTOCK_PUCC",
                    message: `LOW INVENTORY: ${id} has only ${porte.available_puccs} PUCCs left. Restock recommended.`,
                    deadline: new Date(Date.now() + 86400000),
                    status: "pending",
                    metadata: { quantity: 20, item: "PUCC-UNIT", cost: 300 }
                });
            }
        }

        // Advanced Anomaly Detection: Marketing/Conversion Anomaly
        if (totalActiveSessions > 20 && this.state.sales.total_session_fees < 50) {
            this.addUniqueAction({
                id: `ANOMALY-CONVERSION`,
                porte_id: "ALL",
                type: "REVENUE_INSIGHT",
                message: `NEURAL ANOMALY: High engagement (${totalActiveSessions} sessions) but low revenue ($${this.state.sales.total_session_fees}). Potential Marketing/Conversion Anomaly.`,
                deadline: new Date(Date.now() + 3600000),
                status: "pending"
            });
        }
    }

    private addUniqueAction(action: PendingAction) {
        if (!this.state.pending_actions.find(a => a.id === action.id && a.status === "pending")) {
            this.state.pending_actions.push(action);
        }
    }

    private notify() {
        this.stateListeners.forEach(listener => listener(this.state));
    }

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
            this.notify();
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
                this.notify();
                return `Overhead synchronized. Total monthly burn calculated at $${this.state.finances.calculated_burn_rate}.`;
            }
            this.currentFinancialIndex++;
            this.notify();
            return `Deducted $${val} monthly for ${step}.`;
        }

        if (this.currentPath === "inventory") {
            this.state.inventory["PUCC-UNIT"] = { quantity: val, velocity_per_day: 0, lead_time_days: 5 };
            this.currentPath = "portes";
            this.notify();
            return `Inventory mapped: ${val} units.`;
        }

        if (this.currentPath === "portes") {
            const barMatch = input.toLowerCase().match(/(\d+)\s*bar/);
            const workMatch = input.toLowerCase().match(/(\d+)\s*cowork/);
            if (barMatch) this.seedPortes(parseInt(barMatch[1]), "Bar");
            if (workMatch) this.seedPortes(parseInt(workMatch[1]), "Coworking");
            this.currentPath = "strategy";
            this.notify();
            return `Portes mapped: ${Object.keys(this.state.operations.portes).length} units active.`;
        }

        if (this.currentPath === "strategy") {
            const stages: LifecycleStage[] = ["Ideation", "MVP", "Product-Market Fit", "Scaling", "Maturity"];
            this.state.strategy.current_stage = stages.find(s => input.toLowerCase().includes(s.toLowerCase())) || "Ideation";
            this.currentPath = null;
            this.notify();
            return `Lifecycle stage set: ${this.state.strategy.current_stage}. All neural pathways are now live.`;
        }

        this.notify();
        return "Synchronizing...";
    }

    public handleChat(text: string): string {
        return this.handleInput(text);
    }

    public handleApprove(actionId: string): string {
        const action = this.state.pending_actions.find(a => a.id === actionId);
        if (action) {
            action.status = "approved";
            
            if (action.type === "HARDWARE_CHECK") {
                const porte = this.state.operations.portes[action.porte_id];
                if (porte) {
                    porte.hardware_status = "healthy";
                }
                this.notify();
                return `Aera: I've initiated the resolution for ${actionId}. Hardware calibration complete.`;
            }

            if (action.type === "RESTOCK_PUCC" || action.type === "BULK_RESTOCK") {
                const quantity = action.metadata?.quantity || 10;
                const item = action.metadata?.item || "PUCC-UNIT";
                const cost = action.metadata?.cost || 150;
                
                VendorService.placeOrder(item, quantity, cost);
                
                const porte = this.state.operations.portes[action.porte_id];
                if (porte) {
                    porte.available_puccs += quantity;
                }
                
                this.state.finances.cash_on_hand -= cost;
                this.calculateAggregates();
                this.notify();
                return `Aera: Restock order approved. ${quantity} ${item}s have been ordered for ${action.porte_id}.`;
            }

            this.notify();
            return `Aera: Action ${actionId} has been approved and processed.`;
        }
        return "Aera: Action ID not recognized in current neural context.";
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
        
        // Simple projection: Current fees extrapolated to 30 days
        // Assuming the current fees represent activity over the last 10 ticks (50 seconds)
        // 30 days = 30 * 24 * 60 * 60 seconds. Ticks are every 5 seconds.
        // So 30 days is (30 * 24 * 60 * 12) ticks.
        // Let's just do a simplified: total_session_fees * 1000 for simulation purposes
        this.state.predictions.projected_revenue_30d = this.state.sales.total_session_fees * 200;
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
