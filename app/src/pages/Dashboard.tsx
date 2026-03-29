import { Shield, Banknote, Smile, Activity, Target, AlertTriangle } from 'lucide-react';
import { useAeraContext, type Action } from '../context/AeraContext';

export default function Dashboard() {
    const { state, actions, approveAction } = useAeraContext();

    const pendingActions = actions.filter(a => a.status === 'pending');

    return (
        <div className="page-container">
            <h1 className="title">Operational Cortex Sync</h1>
            <p className="subtitle">Real-time telemetry across all 10 dendrites.</p>

            {pendingActions.length > 0 && (
                <div className="glass-panel intervention-panel" style={{ 
                    marginBottom: '2rem', 
                    borderLeft: '4px solid var(--warning)',
                    background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, rgba(0,0,0,0) 100%)',
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)',
                    animation: 'pulse-warning 2s infinite'
                }}>
                    <h2 style={{ marginTop: 0, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={24} className="icon-pulse" /> Founder Interventions Required
                    </h2>
                    {pendingActions.map((action: Action) => (
                        <div key={action.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '8px', marginBottom: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                            <div>
                                <strong style={{ color: 'var(--warning)' }}>[{action.type}]</strong> {action.message}
                                {action.deadline && <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Deadline: {new Date(action.deadline).toLocaleDateString()}</div>}
                            </div>
                            <button className="button-warning" onClick={() => approveAction(action.id)}>Authorize</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="metric-grid">
                {/* Finance & Ops */}
                <div className="glass-panel metric-card">
                    <div className="metric-header">
                        <Banknote size={20} color="var(--accent-color)" />
                        <div className="metric-label">Finance & Ops</div>
                    </div>
                    <div className="metric-value">${state.finances.cash_on_hand.toLocaleString()}</div>
                    <div className="status-indicator negative">Burn: ${state.finances.calculated_burn_rate.toLocaleString()}/mo</div>
                    <div style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Runway: {state.predictions.runway_months.toFixed(1)} months
                    </div>
                </div>

                {/* Lifestyle Impact */}
                <div className="glass-panel metric-card">
                    <div className="metric-header">
                        <Smile size={20} color="#10b981" />
                        <div className="metric-label">Lifestyle Impact</div>
                    </div>
                    <div className="metric-value">{state.lifestyle.presence_score}% Presence</div>
                    <div className="status-indicator positive">Automation: {state.lifestyle.automation_level}%</div>
                    <div style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Founder Focus: {state.lifestyle.founder_focus_score}%
                    </div>
                </div>

                {/* Operations */}
                <div className="glass-panel metric-card">
                    <div className="metric-header">
                        <Activity size={20} color="#f43f5e" />
                        <div className="metric-label">Operations</div>
                    </div>
                    <div className="metric-value">{Object.keys(state.operations.portes).length} Portes</div>
                    <div className="status-indicator positive">
                        {Object.values(state.operations.portes).filter((p: any) => p.hardware_status === 'healthy').length} Healthy
                    </div>
                    <div style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Revenue (30d): ${state.predictions.projected_revenue_30d.toLocaleString()}
                    </div>
                </div>

                {/* Strategy & Vision */}
                <div className="glass-panel metric-card">
                    <div className="metric-header">
                        <Target size={20} color="#8b5cf6" />
                        <div className="metric-label">Strategy & Vision</div>
                    </div>
                    <div className="metric-value">{state.strategy.current_stage}</div>
                    <div className="status-indicator positive">Readiness: {state.strategy.market_readiness_score}%</div>
                    <div style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {state.strategy.next_milestones.length} Active Milestones
                    </div>
                </div>
            </div>
            
            <div className="glass-panel" style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Shield size={16} /> Aera Entity Dendrite Sync: Active and Perceiving
                </p>
            </div>

            <style>{`
                @keyframes pulse-warning {
                    0% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.2); }
                    50% { box-shadow: 0 0 25px rgba(245, 158, 11, 0.4); }
                    100% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.2); }
                }
                .icon-pulse {
                    animation: icon-flicker 3s infinite;
                }
                @keyframes icon-flicker {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .metric-card {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    transition: transform 0.2s ease;
                }
                .metric-card:hover {
                    transform: translateY(-4px);
                }
                .metric-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 1rem;
                }
                .button-warning {
                    background: var(--warning);
                    color: black;
                    border: none;
                    font-weight: bold;
                }
                .button-warning:hover {
                    background: #d97706;
                }
            `}</style>
        </div>
    );
}
