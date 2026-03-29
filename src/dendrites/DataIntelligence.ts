// src/dendrites/DataIntelligence.ts
import { Dendrite, Department, BusinessState } from "./Dendrite";

export class DataIntelligenceDendrite extends Dendrite {
    constructor() { super(Department.DATA_INTELLIGENCE); }
    async perceive(state: BusinessState): Promise<Partial<BusinessState>> {
        return {
            data: { ...state.data }
        };
    }
}
