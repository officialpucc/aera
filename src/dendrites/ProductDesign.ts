// src/dendrites/ProductDesign.ts
import { Dendrite, Department, BusinessState } from "./Dendrite";

export class ProductDesignDendrite extends Dendrite {
    constructor() { super(Department.PRODUCT_DESIGN); }
    async perceive(state: BusinessState): Promise<Partial<BusinessState>> {
        const porte = state.product.products["porte-v1"];
        // Simulate global supply chain constraints making materials more expensive
        const newCogs = porte ? porte.cogs * 1.05 : 0; 
        
        return {
            product: {
                ...state.product,
                products: {
                    ...state.product.products,
                    "porte-v1": {
                        ...porte,
                        cogs: newCogs
                    }
                }
            }
        };
    }
}
