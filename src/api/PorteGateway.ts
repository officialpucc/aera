// src/api/PorteGateway.ts
import { PaymentService } from "../services/PaymentService";
import { AeraBrain } from "../core/Brain";
import { NFCHelper } from "../services/NFCHelper";

/**
 * PorteGateway: The physical entry point for NFC/Tap events.
 */
export class PorteGateway {
    constructor(private brain: AeraBrain) {}

    /**
     * Triggered on NFC tap (Start Detox).
     */
    public async handleNFCTap(porteId: string) {
        console.log(`\n[HARDWARE] NFC Tap at ${porteId}. Processing Payment...`);

        const paymentSuccess = await PaymentService.processSessionFee(5.00);

        if (paymentSuccess) {
            const sessionId = `SESS-${Math.random().toString(36).substr(2, 9)}`;
            
            // Prepare the payload that WOULD be written to the PUCC via NFC
            const nfcPayload = NFCHelper.preparePUCCPayload(porteId, sessionId);
            
            console.log(`[HARDWARE] Payment Success. Writing secure session payload to PUCC: ${nfcPayload}`);
            console.log(`[HARDWARE] Unlocking PUCC Cubby...`);
            
            this.brain.registerNewSession(porteId, 5.00, sessionId);
            
            return { 
                status: "success", 
                message: "Session Started.",
                nfc_write_data: nfcPayload 
            };
        } else {
            return { status: "error", message: "Payment Failed." };
        }
    }

    /**
     * Triggered on PUCC return (End Detox).
     */
    public async handlePUCCReturn(porteId: string, nfcPayload?: string) {
        console.log(`\n[HARDWARE] PUCC Return at ${porteId}. Verifying payload...`);

        // Real-world verification check
        if (nfcPayload && !NFCHelper.verifyPUCCPayload(nfcPayload)) {
            console.log(`[SECURITY] Invalid PUCC payload detected at ${porteId}. Alarm triggered.`);
            return { status: "error", message: "Invalid PUCC verification. Cubby Locked." };
        }

        console.log(`[HARDWARE] Verification Success. Unlocking Phone Cubby...`);
        this.brain.endSession(porteId);
        
        return { status: "success", message: "Session Ended. Phone Released." };
    }
}
