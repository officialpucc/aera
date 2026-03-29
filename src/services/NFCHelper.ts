// src/services/NFCHelper.ts
import crypto from 'crypto';

/**
 * NFCHelper: Logic for preparing data to be written to the PUCC hardware.
 * In production, this data would be written via CoreNFC on a mobile device.
 */
export class NFCHelper {
    /**
     * Prepares an NDEF record payload for a new session.
     * Contains: Porte ID, Session ID, and a secure signature.
     */
    public static preparePUCCPayload(porteId: string, sessionId: string): string {
        const payload = {
            p: porteId,
            s: sessionId,
            ts: Date.now(),
            sig: this.generateSignature(porteId, sessionId)
        };
        
        return JSON.stringify(payload);
    }

    /**
     * Verifies if the returned PUCC belongs to the session that started.
     */
    public static verifyPUCCPayload(payloadStr: string): boolean {
        try {
            const payload = JSON.parse(payloadStr);
            const expectedSig = this.generateSignature(payload.p, payload.s);
            return payload.sig === expectedSig;
        } catch (e) {
            return false;
        }
    }

    private static generateSignature(porteId: string, sessionId: string): string {
        const secret = process.env.NFC_SECRET || 'aera_detox_secret_2026';
        return crypto.createHmac('sha256', secret)
                     .update(`${porteId}:${sessionId}`)
                     .digest('hex')
                     .substring(0, 16);
    }
}
