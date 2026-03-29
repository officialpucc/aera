// src/dendrites/Operations.ts
import { BusinessState, PorteState } from "./Dendrite";

/**
 * Operations Dendrite: Living simulation of the physical Porte network.
 */
export class OperationsDendrite {
    /**
     * Injects dynamic changes into the Porte state to simulate real-world activity.
     */
    public simulate(state: BusinessState) {
        for (const [id, porte] of Object.entries(state.operations.portes)) {
            // 1. Randomly trigger hardware anomalies (1% chance)
            const roll = Math.random();
            if (roll < 0.01 && porte.hardware_status === "healthy") {
                porte.hardware_status = "jammed";
                console.log(`[SIM] Hardware Jam at ${id}`);
            } else if (roll < 0.02 && porte.hardware_status === "healthy") {
                porte.hardware_status = "connectivity_drop";
                console.log(`[SIM] Connectivity Drop at ${id}`);
            }

            // 2. Randomly end sessions (5% chance if sessions > 0)
            if (porte.active_detox_sessions > 0 && Math.random() < 0.05) {
                porte.active_detox_sessions--;
                porte.available_puccs++;
                console.log(`[SIM] Session naturally ended at ${id}`);
            }

            // 3. Randomly start sessions (2% chance if puccs > 0)
            if (porte.available_puccs > 0 && Math.random() < 0.02) {
                porte.active_detox_sessions++;
                porte.available_puccs--;
                state.finances.cash_on_hand += porte.current_session_price;
                state.sales.total_session_fees += porte.current_session_price;
                console.log(`[SIM] Session naturally started at ${id}`);
            }
        }
    }

    async perceive(): Promise<Partial<BusinessState>> {
        // In a real build, this would fetch from the physical IoT API
        return {}; 
    }
}
