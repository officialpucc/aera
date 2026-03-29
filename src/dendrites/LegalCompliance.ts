// src/dendrites/LegalCompliance.ts
import { Dendrite, Department, BusinessState } from "./Dendrite";

export class LegalComplianceDendrite extends Dendrite {
    constructor() { super(Department.LEGAL_COMPLIANCE); }
    async perceive(state: BusinessState): Promise<Partial<BusinessState>> {
        return {
            legal: { ...state.legal }
        };
    }
}
