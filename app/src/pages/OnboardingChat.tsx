import { useState, useEffect, useRef } from 'react';
import { useAeraContext } from '../context/AeraContext';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, MessageSquare, Activity } from 'lucide-react';

export default function OnboardingChat() {
    const { state, messages, sendMessage } = useAeraContext();
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [activeTab, setActiveTab] = useState<'talk' | 'status'>('talk');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (activeTab === 'talk') {
            scrollToBottom();
        }
    }, [messages, activeTab]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    const isComplete = state.strategy.current_stage !== "Ideation" || messages.some(m => m.text.includes("Synchronization complete"));

    return (
        <div className="page-container" style={{ maxWidth: '800px', margin: '4rem auto' }}>
            <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ 
                    position: 'absolute', 
                    top: '-50px', 
                    right: '-50px', 
                    width: '200px', 
                    height: '200px', 
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 className="title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                        <Brain size={32} className="brain-icon" /> Neural Initialization
                    </h1>
                    <p className="subtitle">Configuring your digital operational cortex...</p>

                    <div className="tabs" style={{ display: 'flex', gap: '20px', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div 
                            className={`tab ${activeTab === 'talk' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('talk')}
                            style={{ 
                                padding: '10px 5px', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                borderBottom: activeTab === 'talk' ? '2px solid var(--accent-color)' : 'none',
                                color: activeTab === 'talk' ? 'white' : 'var(--text-secondary)'
                            }}
                        >
                            <MessageSquare size={16} /> Talk
                        </div>
                        <div 
                            className={`tab ${activeTab === 'status' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('status')}
                            style={{ 
                                padding: '10px 5px', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                borderBottom: activeTab === 'status' ? '2px solid var(--accent-color)' : 'none',
                                color: activeTab === 'status' ? 'white' : 'var(--text-secondary)'
                            }}
                        >
                            <Activity size={16} /> Neural Status
                        </div>
                    </div>
                    
                    {activeTab === 'talk' ? (
                        <>
                            <div className="chat-container" style={{ 
                                height: '400px', 
                                overflowY: 'auto', 
                                marginBottom: '1.5rem', 
                                padding: '1.5rem', 
                                background: 'rgba(0,0,0,0.3)', 
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {messages.map((m, i) => (
                                    <div key={i} className={`chat-message ${m.sender === 'aera' ? 'chat-aera' : 'chat-user'}`} style={{ 
                                        marginBottom: '1.2rem', 
                                        padding: '1rem', 
                                        borderRadius: '12px',
                                        maxWidth: '85%',
                                        alignSelf: m.sender === 'aera' ? 'flex-start' : 'flex-end',
                                        background: m.sender === 'aera' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                        border: m.sender === 'aera' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)',
                                        marginLeft: m.sender === 'aera' ? '0' : 'auto',
                                        animation: 'fade-in-up 0.3s ease-out forwards',
                                        boxShadow: m.sender === 'aera' ? '0 4px 15px rgba(99, 102, 241, 0.1)' : 'none'
                                    }}>
                                        <div style={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                                            {m.sender === 'aera' ? '✦ Aera Intelligence' : 'Founder'}
                                        </div>
                                        <div 
                                            style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}
                                            dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #a5b4fc">$1</strong>') }} 
                                        />
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {isComplete ? (
                                <button className="pulse-button" onClick={() => navigate('/dashboard')} style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem', background: 'var(--accent-color)' }}>
                                    Access Operational Cortex <ArrowRight size={18}/>
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input 
                                        type="text" 
                                        value={input} 
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                                        placeholder="Type your response to Aera..."
                                        style={{ marginBottom: 0, flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                    <button onClick={handleSend} style={{ padding: '0 1.5rem' }}>Send</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="status-view" style={{ height: '400px', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Pathway Mapping Progress</h3>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span>Financial Dendrites</span>
                                        <span>{state.finances.cash_on_hand > 0 ? 'Mapped' : 'Waiting...'}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                        <div style={{ width: state.finances.cash_on_hand > 0 ? '100%' : '10%', height: '100%', background: 'var(--accent-color)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span>Operational Portes</span>
                                        <span>{Object.keys(state.operations.portes).length > 0 ? 'Mapped' : 'Waiting...'}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                        <div style={{ width: Object.keys(state.operations.portes).length > 0 ? '100%' : '5%', height: '100%', background: '#f43f5e', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span>Mission Statement</span>
                                        <span>{state.lifestyle.mission_impact ? 'Defined' : 'Conceptualizing...'}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                        <div style={{ width: state.lifestyle.mission_impact ? '100%' : '20%', height: '100%', background: '#10b981', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', border: '1px dashed rgba(99, 102, 241, 0.2)' }}>
                                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem' }}>Current Strategy Stage</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{state.strategy.current_stage}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .brain-icon {
                    color: #6366f1;
                    filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
                    animation: brain-pulse 4s infinite ease-in-out;
                }
                @keyframes brain-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                .pulse-button {
                    animation: button-pulse 2s infinite;
                }
                @keyframes button-pulse {
                    0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                }
            `}</style>
        </div>
    );
}
