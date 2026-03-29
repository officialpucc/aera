// src/dendrites/SalesRevenue.ts
import { Dendrite, Department, BusinessState } from "./Dendrite";

export class SalesRevenueDendrite extends Dendrite {
    constructor() { super(Department.SALES_REVENUE); }
    async perceive(state: BusinessState): Promise<Partial<BusinessState>> {
        return {
            sales: {
                ...state.sales,
                pipeline_value: state.sales.pipeline_value + 15000 // Inbound lead increase
            }
        };
    }
}
