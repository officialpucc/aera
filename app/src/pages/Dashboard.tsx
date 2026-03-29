import { Shield } from 'lucide-react';

export default function Dashboard() {
    const { state, actions, approveAction } = useAeraContext();

    return (
        <div className="page-container">
            <h1 className="title">Operational Cortex Sync</h1>
            <p className="subtitle">Real-time telemetry across all 10 dendrites.</p>

            {actions.length > 0 && (
                <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--warning)' }}>
                    <h2 style={{ marginTop: 0, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Shield size={20} /> Founder Interventions Required
                    </h2>
                    {actions.map(action => (
                        <div key={action.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px', marginBottom: '8px' }}>
                            <div>
                                <strong>[{action.department}]</strong> {action.message}
                            </div>
                            <button onClick={() => approveAction(action.id)}>Approve</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="metric-grid">
                <div className="glass-panel">
                    <div className="metric-label">Finance & Ops</div>
                    <div className="metric-value">${state.finances.cash_reserve.toLocaleString()}</div>
                    <div className="status-indicator negative">Burn: ${state.finances.burn_rate_monthly.toLocaleString()}/mo</div>
                    <div style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>Runway: {state.finances.runway_months.toFixed(1)} months</div>
                </div>

                <div className="glass-panel">
                    <div className="metric-label">Product Economics (Porte)</div>
                    <div className="metric-value">${state.product.products["porte-v1"]?.selling_price.toLocaleString() || 0}</div>
                    <div className="status-indicator">COGS: ${state.product.products["porte-v1"]?.cogs.toLocaleString() || 0}</div>
                    <div style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>Units Sold: {state.product.products["porte-v1"]?.units_sold || 0}</div>
                </div>

                <div className="glass-panel">
                    <div className="metric-label">People & Culture</div>
                    <div className="metric-value">{state.people.headcount} Team</div>
                    <div className="status-indicator positive">Sentiment: {state.people.employee_sentiment}/10</div>
                </div>

                <div className="glass-panel">
                    <div className="metric-label">Engineering</div>
                    <div className="metric-value">v{state.engineering.deployment_velocity}.0</div>
                    <div className="status-indicator">Tech Debt: {state.engineering.tech_debt_level}</div>
                </div>
            </div>

            <div className="metric-grid">
                <div className="glass-panel">
                    <div className="metric-label">Sales & Revenue</div>
                    Pipeline: ${state.sales.pipeline_value.toLocaleString()} | Conversion: {state.sales.conversion_rate * 100}%
                </div>
                <div className="glass-panel">
                    <div className="metric-label">Marketing & Growth</div>
                    Ad Spend: ${state.marketing.monthly_ad_spend.toLocaleString()} | CAC: ${state.marketing.cac}
                </div>
                <div className="glass-panel">
                    <div className="metric-label">Legal & Compliance</div>
                    Open Cases: {state.legal.open_litigations} | Risk: {state.legal.compliance_risk_score}
                </div>
            </div>
            
            <div className="glass-panel" style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Aera Entity Dendrite Sync: {state.entity.aera_cpu_usage}% CPU Active</p>
            </div>
        </div>
    );
}
