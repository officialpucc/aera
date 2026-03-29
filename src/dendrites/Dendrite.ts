// src/dendrites/Dendrite.ts
/**
 * Aera Dendrite SDK: The Neural Gateway for Portes and PUCCs.
 */

export enum Department {
    SUPPLY_CHAIN = "Supply Chain",
    FINANCE = "Finance",
    SALES = "Sales & Rentals",
    OPERATIONS = "Operations"
}

export interface InventoryItem {
    quantity: number;
    velocity_per_day: number;
    lead_time_days: number;
}

export interface Transaction {
    id: string;
    item_id: string;
    type: "sale" | "rental";
    timestamp: Date;
    amount: number;
}

export type EstablishmentType = "Bar" | "Coworking" | "Gym" | "Cafe";
export type HardwareStatus = "healthy" | "jammed" | "unreturned_pucc_timeout" | "connectivity_drop";

export interface PorteState {
    id: string;
    establishment_type: EstablishmentType;
    active_detox_sessions: number;
    available_puccs: number;
    phone_cubbies_occupied: number;
    hardware_status: HardwareStatus;
    current_session_price: number;
}

export interface CustomerNotification {
    id: string;
    porte_id: string;
    customer_id: string;
    message: string;
    timestamp: Date;
}

export interface PendingAction {
    id: string;
    porte_id: string;
    type: "RESTOCK_PUCC" | "HARDWARE_CHECK" | "REVENUE_INSIGHT" | "BULK_RESTOCK" | "PRICE_ADJUSTMENT" | "CUSTOMER_ALERT";
    message: string;
    deadline: Date;
    status: "pending" | "approved" | "rejected";
    metadata?: any;
}

export interface LifestyleState {
    presence_score: number;      // 0-100 (Digital Detox impact)
    automation_level: number;    // 0-100 (Aera's autonomous control)
    founder_focus_score: number; // 0-100 (How much Aera has freed up your time)
    mission_impact: string;      // Qualitative impact of the detox
}

export type LifecycleStage = "Ideation" | "MVP" | "Product-Market Fit" | "Scaling" | "Maturity";

export interface Milestone {
    id: string;
    task: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "doing" | "done";
}

export interface StrategyState {
    current_stage: LifecycleStage;
    next_milestones: Milestone[];
    market_readiness_score: number; // 0-100
}

export interface BusinessState {
    inventory: Record<string, InventoryItem>;
    finances: {
        cash_on_hand: number;
        fixed_costs: {
            rent: number;
            payroll: number;
            software_subscriptions: number;
        };
        variable_costs: {
            marketing_per_month: number;
            logistics_per_restock: number;
        };
        unit_economics: {
            pucc_cogs: number;
            session_fee: number;
        };
        calculated_burn_rate: number;
    };
    sales: {
        recent_transactions: Transaction[];
        peak_hours: number[];
        conversion_rate: number;
        total_session_fees: number;
    };
    operations: {
        portes: Record<string, PorteState>;
    };
    lifestyle: LifestyleState;
    strategy: StrategyState; // The new "Strategy" neural pathway
    pending_actions: PendingAction[];
    customer_alerts: CustomerNotification[];
    predictions: {
        out_of_stock_dates: Record<string, Date>;
        runway_months: number;
        projected_revenue_30d: number;
        best_performing_establishment: EstablishmentType | null;
    };
}

export abstract class Dendrite {
    constructor(public readonly department: Department) {}
    abstract perceive(): Promise<Partial<BusinessState>>;
}
