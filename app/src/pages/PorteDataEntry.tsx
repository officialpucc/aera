import { useState } from 'react';
import { useAeraContext } from '../contexts/useAeraBrain';

export default function PorteDataEntry() {
    const { recordSale, updateCOGS, state } = useAeraContext();
    const [units, setUnits] = useState(1);
    const [cogs, setCogs] = useState(state.product.products["porte-v1"]?.cogs || 3200);

    const handleSale = () => {
        recordSale("porte-v1", units);
        alert(`Successfully reported ${units} units sold. Telemetry updated to Aera Cortex.`);
    };

    const handleCogsUpdate = () => {
        updateCOGS("porte-v1", cogs);
        alert(`Updated COGS to $${cogs}. Aera will re-evaluate margins.`);
    };

    return (
        <div className="page-container glass-panel" style={{ maxWidth: '600px', marginTop: '4rem' }}>
            <h1 className="title">Porte Command Link</h1>
            <p className="subtitle">Input field data to update the Cognitive Operations Brain instantly.</p>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0' }}>Report New Sale</h3>
                <input 
                    type="number" 
                    value={units} 
                    onChange={e => setUnits(parseInt(e.target.value) || 0)} 
                    placeholder="Units sold" 
                />
                <button onClick={handleSale} style={{ width: '100%', justifyContent: 'center' }}>Log Sale</button>
            </div>

            <div style={{ borderTop: '1px solid var(--panel-border)', margin: '2rem 0' }}></div>

            <div>
                <h3 style={{ margin: '0 0 1rem 0' }}>Update Supply Chain COGS</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    Hardware costs fluctuating? Update this to cause Aera to re-run Runway models. If margins drop, she will alert you on the Dashboard.
                </p>
                <input 
                    type="number" 
                    value={cogs} 
                    onChange={e => setCogs(parseInt(e.target.value) || 0)} 
                    placeholder="New COGS per unit" 
                />
                <button onClick={handleCogsUpdate} style={{ width: '100%', justifyContent: 'center', background: 'var(--warning)' }}>Update COGS</button>
            </div>
        </div>
    );
}
