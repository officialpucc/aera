// src/ui/PorteInterface.ts
import { PendingAction } from "../dendrites/Dendrite";

/**
 * PorteInterface: Simulates the restricted UI for the Human at a physical Porte.
 */
export class PorteHumanInterface {
    constructor(public porte_id: string) {}

    /**
     * Renders the restricted view. The "Order" button ONLY appears 
     * if Aera has sent a RESTOCK_PUCC action for this specific Porte.
     */
    render(actions: PendingAction[]) {
        console.log(`\n=== PORTE INTERFACE [${this.porte_id}] ===`);
        
        const myActions = actions.filter(a => a.porte_id === this.porte_id || a.porte_id === "ALL");

        if (myActions.length === 0) {
            console.log("Status: Green. Aera says no restock is needed. (Order Button: Hidden)");
            return;
        }

        myActions.forEach(action => {
            console.log(`[MESSAGE FROM AERA]: ${action.message}`);
            
            if (action.type === "RESTOCK_PUCC") {
                console.log(`[ACTION REQUIRED]: Press [APPROVE] to order ${action.metadata.units} PUCCs for $${action.metadata.cost}.`);
            }
        });
    }
}
