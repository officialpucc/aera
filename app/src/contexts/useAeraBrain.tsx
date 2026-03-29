import { createContext, useContext, useState, type ReactNode } from 'react';

export type ProductEconomics = { id: string; name: string; selling_price: number; cogs: number; units_sold: number; };

export interface BusinessState {
    finances: { cash_reserve: number; burn_rate_monthly: number; revenue_monthly: number; runway_months: number; };
    product: { products: Record<string, ProductEconomics>; customer_satisfaction_score: number; };
    sales: { pipeline_value: number; conversion_rate: number; churn_rate: number; };
    engineering: { deployment_velocity: number; tech_debt_level: "low"|"medium"|"critical"; };
    marketing: { monthly_ad_spend: number; cac: number; };
    strategy: { market_sentiment: number; current_stage: string; };
    people: { headcount: number; employee_sentiment: number; };
    legal: { open_litigations: number; compliance_risk_score: number; };
    data: { data_freshness_hours: number; };
    entity: { aera_cpu_usage: number; };
}

interface Action { 
    id: string; type: string; message: string; department: string; financial_impact?: number; 
}

interface AeraContextType {
    state: BusinessState;
    setState: React.Dispatch<React.SetStateAction<BusinessState>>;
    actions: Action[];
    recordSale: (productId: string, units: number) => void;
    updateCOGS: (productId: string, newCogs: number) => void;
    approveAction: (actionId: string) => void;
}

const initialState: BusinessState = {
    finances: { cash_reserve: 0, burn_rate_monthly: 0, revenue_monthly: 0, runway_months: 99 },
    product: { products: { "porte-v1": { id: "porte-v1", name: "Porte Hardware Unit", selling_price: 5000, cogs: 3200, units_sold: 0 } }, customer_satisfaction_score: 100 },
    sales: { pipeline_value: 0, conversion_rate: 0.05, churn_rate: 0 },
    engineering: { deployment_velocity: 1, tech_debt_level: "low" },
    marketing: { monthly_ad_spend: 0, cac: 0 },
    strategy: { market_sentiment: 1, current_stage: "Ideation" },
    people: { headcount: 1, employee_sentiment: 10 },
    legal: { open_litigations: 0, compliance_risk_score: 0 },
    data: { data_freshness_hours: 0 },
    entity: { aera_cpu_usage: 5 }
};

const AeraContext = createContext<AeraContextType | undefined>(undefined);

export const AeraProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<BusinessState>(initialState);
    const [actions, setActions] = useState<Action[]>([]);

    const updateCalculations = (newState: BusinessState) => {
        let burn = newState.finances.burn_rate_monthly - newState.finances.revenue_monthly;
        newState.finances.runway_months = burn > 0 ? newState.finances.cash_reserve / burn : 999;

        const newActions: Action[] = [];
        const porte = newState.product.products["porte-v1"];
        if (porte) {
            const margin = (porte.selling_price - porte.cogs) / porte.selling_price;
            if (margin < 0.4) {
                newActions.push({ id: `WARN-${Date.now()}`, type: "PRICE_ADJUST", department: "Finance & Ops", message: `Porte margin strictly below 40% (${(margin*100).toFixed(1)}%). Suggest raising price.` });
            }
        }
        if (burn > 0 && newState.finances.runway_months < 6) {
            newActions.push({ id: `CUT-${Date.now()}`, type: "BUDGET_CUT", department: "Strategy", message: `Runway dropped to ${newState.finances.runway_months.toFixed(1)} months. Initiate Ad Spend cut.`, financial_impact: 5000 });
        }
        setActions(newActions);
        return newState;
    };

    const recordSale = (productId: string, units: number) => {
        setState(prev => {
            const s = { ...prev };
            const prod = s.product.products[productId];
            if (prod) {
                prod.units_sold += units;
                s.finances.revenue_monthly += (prod.selling_price * units);
                s.finances.cash_reserve += (prod.selling_price * units);
            }
            return updateCalculations(s);
        });
    };

    const updateCOGS = (productId: string, newCogs: number) => {
        setState(prev => {
            const s = { ...prev };
            if (s.product.products[productId]) {
                s.product.products[productId].cogs = newCogs;
            }
            return updateCalculations(s);
        });
    };

    const approveAction = (actionId: string) => {
        const action = actions.find(a => a.id === actionId);
        if (!action) return;
        
        setState(prev => {
            const s = { ...prev };
            if (action.type === "PRICE_ADJUST") {
                if (s.product.products["porte-v1"]) s.product.products["porte-v1"].selling_price *= 1.15;
            } else if (action.type === "BUDGET_CUT") {
                s.marketing.monthly_ad_spend *= 0.5;
                s.finances.burn_rate_monthly -= (action.financial_impact || 0);
            }
            return updateCalculations(s);
        });
        setActions(prev => prev.filter(a => a.id !== actionId));
    };

    return (
        <AeraContext.Provider value={{ state, setState, actions, recordSale, updateCOGS, approveAction }}>
            {children}
        </AeraContext.Provider>
    );
};

export const useAeraContext = () => {
    const context = useContext(AeraContext);
    if (!context) throw new Error("Must be used within AeraProvider");
    return context;
};
