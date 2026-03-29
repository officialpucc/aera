// src/dendrites/MarketingGrowth.ts
import { Dendrite, Department, BusinessState } from "./Dendrite";

export class MarketingGrowthDendrite extends Dendrite {
    constructor() { super(Department.MARKETING_GROWTH); }
    async perceive(state: BusinessState): Promise<Partial<BusinessState>> {
        return {
            marketing: {
                ...state.marketing,
                cac: state.marketing.cac * 1.02 // Ad saturation increasing CAC slightly
            }
        };
    }
}
