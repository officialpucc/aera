// src/dendrites/StartupEntity.ts
import { Dendrite, Department, BusinessState } from "./Dendrite";

export class StartupEntityDendrite extends Dendrite {
    constructor() { super(Department.STARTUP_ENTITY); }
    async perceive(state: BusinessState): Promise<Partial<BusinessState>> {
        return {
            entity: { ...state.entity }
        };
    }
}
