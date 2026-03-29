import { Shield, Users, Zap, LayoutDashboard, Settings } from 'lucide-react';
import { useAeraContext, type Action } from '../context/AeraContext';

export default function Dashboard() {
    const { state, actions, approveAction } = useAeraContext();

    return (
        <div className="page-container">
            <h1 className="title">Aera Cognitive Dashboard</h1>
            <p className="subtitle">Real-time telemetry across physical and financial neural pathways.</p>

            {/* Founder Intervention Panel */}
            {actions.length > 0 && (
                <div className="glass-panel warning-glow" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Shield size={24} /> Neural Anomalies & Actions
                    </h2>
                    <div className="action-list">
                        {actions.filter(a => a.status === 'pending').map((action: Action) => (
                            <div key={action.id} className="action-item">
                                <div>
                                    <div className="action-type">[{action.type}]</div>
                                    <div className="action-msg">{action.message}</div>
                                </div>
                                <button className="approve-btn" onClick={() => approveAction(action.id)}>Approve</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* High-Level Impact Metrics */}
            <div className="metric-grid">
                <div className="glass-panel">
                    <div className="metric-header">
                        <Users size={20} color="var(--accent-color)" />
                        <span className="metric-label">Presence Score</span>
                    </div>
                    <div className="metric-value">{state.lifestyle.presence_score}%</div>
                    <p className="metric-sub">Real-world social engagement impact</p>
                </div>

                <div className="glass-panel">
                    <div className="metric-header">
                        <Zap size={20} color="var(--accent-color)" />
                        <span className="metric-label">Automation Level</span>
                    </div>
                    <div className="metric-value">{state.lifestyle.automation_level}%</div>
                    <p className="metric-sub">Portion of back-office run by Aera</p>
                </div>

                <div className="glass-panel">
                    <div className="metric-header">
                        <LayoutDashboard size={20} color="var(--accent-color)" />
                        <span className="metric-label">Monthly Runway</span>
                    </div>
                    <div className="metric-value">
                        {state.finances.calculated_burn_rate > 0 
                            ? (state.finances.cash_on_hand / state.finances.calculated_burn_rate).toFixed(1) 
                            : '∞'} Mo
                    </div>
                    <p className="metric-sub">Survival projection based on burn</p>
                </div>
            </div>

            {/* Deep Operations Metrics */}
            <div className="metric-grid" style={{ marginTop: '2rem' }}>
                <div className="glass-panel">
                    <div className="metric-label">Cash on Hand</div>
                    <div className="metric-value text-green">${state.finances.cash_on_hand.toLocaleString()}</div>
                </div>
                <div className="glass-panel">
                    <div className="metric-label">Active Portes</div>
                    <div className="metric-value">{Object.keys(state.operations.portes).length}</div>
                </div>
                <div className="glass-panel">
                    <div className="metric-label">Lifecycle Stage</div>
                    <div className="metric-value" style={{ fontSize: '1.2rem' }}>{state.strategy.current_stage}</div>
                </div>
            </div>
            
            <div className="footer-status">
                <Settings size={14} className="pulse" /> Neural Bridge: Connected | Latency: 42ms
            </div>
        </div>
    );
}
