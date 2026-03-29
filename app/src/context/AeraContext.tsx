// app/src/context/AeraContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

/**
 * AeraContext: The React Bridge to the Aera Neural Brain.
 */

export interface Action {
    id: string;
    porte_id: string;
    type: string;
    message: string;
    status: 'pending' | 'approved' | 'rejected';
    deadline?: string;
}

export interface AeraState {
    inventory: Record<string, any>;
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
        recent_transactions: any[];
        peak_hours: number[];
        conversion_rate: number;
        total_session_fees: number;
    };
    operations: {
        portes: Record<string, any>;
    };
    lifestyle: {
        presence_score: number;
        automation_level: number;
        founder_focus_score: number;
        mission_impact: string;
    };
    strategy: {
        current_stage: string;
        next_milestones: any[];
        market_readiness_score: number;
    };
    pending_actions: Action[];
    customer_alerts: any[];
    predictions: {
        out_of_stock_dates: Record<string, any>;
        runway_months: number;
        projected_revenue_30d: number;
        best_performing_establishment: string | null;
    };
}

interface ChatMessage {
    sender: 'aera' | 'user';
    text: string;
}

interface AeraContextType {
    state: AeraState;
    actions: Action[];
    messages: ChatMessage[];
    approveAction: (id: string) => void;
    sendMessage: (text: string) => void;
}

const AeraContext = createContext<AeraContextType | undefined>(undefined);

export const AeraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AeraState>({
        inventory: {},
        finances: { 
            cash_on_hand: 0, 
            fixed_costs: { rent: 0, payroll: 0, software_subscriptions: 0 },
            variable_costs: { marketing_per_month: 0, logistics_per_restock: 0 },
            unit_economics: { pucc_cogs: 0, session_fee: 0 },
            calculated_burn_rate: 0
        },
        sales: { recent_transactions: [], peak_hours: [], conversion_rate: 0, total_session_fees: 0 },
        operations: { portes: {} },
        lifestyle: { presence_score: 85, automation_level: 60, founder_focus_score: 0, mission_impact: "" },
        strategy: { current_stage: "Ideation", next_milestones: [], market_readiness_score: 0 },
        pending_actions: [],
        customer_alerts: [],
        predictions: { out_of_stock_dates: {}, runway_months: 0, projected_revenue_30d: 0, best_performing_establishment: null }
    });

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [actions, setActions] = useState<Action[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Connect to WebSocket server
        const socket = new WebSocket('ws://localhost:8080');
        ws.current = socket;

        socket.onopen = () => {
            console.log('Connected to Aera Neural Bridge');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'STATE_UPDATE') {
                setState(data.state);
                if (data.state.pending_actions) {
                    setActions(data.state.pending_actions);
                }
            } else if (data.type === 'AERA_PROMPT' || data.type === 'AERA_RESPONSE') {
                setMessages(prev => [...prev, { sender: 'aera', text: data.text }]);
            }
        };

        socket.onclose = () => {
            console.log('Disconnected from Aera Neural Bridge. Reconnecting in 3s...');
            setTimeout(() => {
                // Simplistic reconnect logic
            }, 3000);
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = useCallback((text: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'USER_INPUT', text }));
            setMessages(prev => [...prev, { sender: 'user', text }]);
        }
    }, []);

    const approveAction = (id: string) => {
        setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    };

    return (
        <AeraContext.Provider value={{ state, actions, messages, approveAction, sendMessage }}>
            {children}
        </AeraContext.Provider>
    );
};

export const useAeraContext = () => {
    const context = useContext(AeraContext);
    if (!context) throw new Error("useAeraContext must be used within an AeraProvider");
    return context;
};
