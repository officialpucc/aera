// src/index.ts
import { AeraBrain } from "./core/Brain";
import { StrategyVisionDendrite } from "./dendrites/StrategyVision";
import { FinanceOpsDendrite } from "./dendrites/FinanceOps";
import { ProductDesignDendrite } from "./dendrites/ProductDesign";
import { EngineeringDendrite } from "./dendrites/Engineering";
import { SalesRevenueDendrite } from "./dendrites/SalesRevenue";
import { PeopleCultureDendrite } from "./dendrites/PeopleCulture";
import { MarketingGrowthDendrite } from "./dendrites/MarketingGrowth";
import { LegalComplianceDendrite } from "./dendrites/LegalCompliance";
import { DataIntelligenceDendrite } from "./dendrites/DataIntelligence";
import { StartupEntityDendrite } from "./dendrites/StartupEntity";

async function runStartupSimulation() {
    console.log("=================================================");
    console.log("🚀 INITIALIZING AERA 10-DENDRITE STARTUP MAPPING");
    console.log("=================================================");
    
    const aera = new AeraBrain();
    
    // Connect all 10 operational dendrites
    aera.connectDendrite(new StrategyVisionDendrite());
    aera.connectDendrite(new FinanceOpsDendrite());
    aera.connectDendrite(new ProductDesignDendrite());
    aera.connectDendrite(new EngineeringDendrite());
    aera.connectDendrite(new SalesRevenueDendrite());
    aera.connectDendrite(new PeopleCultureDendrite());
    aera.connectDendrite(new MarketingGrowthDendrite());
    aera.connectDendrite(new LegalComplianceDendrite());
    aera.connectDendrite(new DataIntelligenceDendrite());
    aera.connectDendrite(new StartupEntityDendrite());

    console.log("\n[SIMULATION] Month 1: Initial Cognitive Sweep");
    let pendingActions = await aera.process();

    console.log("\n-------------------------------------------------");
    console.log("🔔 ALERTS REQUIRING FOUNDER INTERVENTION:");
    
    if (pendingActions.length === 0) {
        console.log("   No critical interventions required.");
    }

    for (const action of pendingActions) {
        console.log(`\n=> [${action.type}] from ${action.department}:`);
        console.log(`   ${action.message}`);
        
        // Simulating the Founder approving actions that relate to product margin or runway
        if (action.type === "PRICE_ADJUSTMENT" || action.type === "BUDGET_CUT") {
            aera.approveAction(action.id);
        }
    }

    // After approval, lets do another cycle to see the state changes
    console.log("\n=================================================");
    console.log("[SIMULATION] Month 2: Post-Intervention Sweep");
    pendingActions = await aera.process();
    
    console.log("\n-------------------------------------------------");
    console.log("🔔 ALERTS REQUIRING FOUNDER INTERVENTION (Month 2):");
    
    if (pendingActions.length === 0) {
        console.log("   No critical interventions required. Operations stable.");
    }
}

runStartupSimulation();
