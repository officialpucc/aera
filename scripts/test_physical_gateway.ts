/**
 * test_physical_gateway.ts
 * Simulates a full NFC session: Tap -> Payment -> Write -> Return -> Verify.
 */
async function testGateway() {
    console.log("--- STARTING SECURE NFC SESSION ---");
    
    // 1. NFC Tap (Start)
    const tapResponse = await fetch('http://localhost:8080/api/porte/tap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ porte_id: 'PORTE-BAR-01' })
    });
    
    const tapResult = await tapResponse.json();
    console.log("Tap Result:", tapResult);

    if (tapResult.status === "success") {
        const payload = tapResult.nfc_write_data;
        console.log("\n[SIMULATION] Human uses PUCC for 2 seconds...");
        
        await new Promise(r => setTimeout(r, 2000));

        // 2. PUCC Return (Verify Payload)
        console.log("--- RETURNING PUCC ---");
        const returnResponse = await fetch('http://localhost:8080/api/porte/return', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                porte_id: 'PORTE-BAR-01',
                nfc_payload: payload // The secure signature
            })
        });

        const returnResult = await returnResponse.json();
        console.log("Return Result:", returnResult);
    }
}

testGateway();
