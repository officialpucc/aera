// src/dendrites/PeopleCulture.ts
import { Dendrite, Department, BusinessState } from "./Dendrite";

export class PeopleCultureDendrite extends Dendrite {
    constructor() { super(Department.PEOPLE_CULTURE); }
    async perceive(state: BusinessState): Promise<Partial<BusinessState>> {
        return {
            people: {
                ...state.people,
                employee_sentiment: state.people.employee_sentiment - 0.1 // Slight decrease over time naturally
            }
        };
    }
}
