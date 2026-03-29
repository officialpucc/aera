// src/dendrites/Operations.ts
import { Dendrite, Department, BusinessState, PorteState } from "./Dendrite";

export class OperationsDendrite extends Dendrite {
    constructor() {
        super(Department.OPERATIONS);
    }

    async perceive(): Promise<Partial<BusinessState>> {
        // Dynamic Simulation Pulse: Random hardware shifts or inventory changes
        const update: any = { operations: { portes: {} } };
        const roll = Math.random();
        
        if (roll > 0.9) {
            console.log("[OPERATIONS] Dynamic event detected during perception.");
        }
        
        return update;
    }

    public simulate(state: BusinessState): Partial<BusinessState> {
        const updatedPortes: Record<string, PorteState> = { ...state.operations.portes };
        let totalFees = 0;

        for (const id in updatedPortes) {
            const porte = { ...updatedPortes[id] };
            
            // Randomly start/end sessions
            if (Math.random() > 0.7 && porte.available_puccs > 0) {
                porte.active_detox_sessions++;
                porte.available_puccs--;
                porte.phone_cubbies_occupied++;
            } else if (Math.random() > 0.8 && porte.active_detox_sessions > 0) {
                porte.active_detox_sessions--;
                porte.available_puccs++;
                porte.phone_cubbies_occupied--;
                totalFees += porte.current_session_price;
            }

            // Dynamic Simulation: Hardware Jams & PUCC Depletion
            if (Math.random() > 0.95) {
                const eventRoll = Math.random();
                if (eventRoll > 0.8) {
                    porte.hardware_status = "jammed";
                } else if (eventRoll > 0.5 && porte.available_puccs > 0) {
                    // Simulate a lost or damaged PUCC
                    porte.available_puccs -= 1;
                }
            }

            // Random hardware health recovery
            if (porte.hardware_status !== "healthy" && Math.random() > 0.9) {
                porte.hardware_status = "healthy";
            }

            updatedPortes[id] = porte;
        }

        return {
            operations: {
                portes: updatedPortes
            },
            sales: {
                ...state.sales,
                total_session_fees: state.sales.total_session_fees + totalFees
            }
        };
    }
}
