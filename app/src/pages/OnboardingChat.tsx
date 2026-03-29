import { useState } from 'react';
import { useAeraContext } from '../contexts/useAeraBrain';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight } from 'lucide-react';

export default function OnboardingChat() {
    const { setState } = useAeraContext();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{sender: 'aera'|'user', text: string}[]>([
        { sender: 'aera', text: "I am Aera. I am your startup's digital personification. To configure my 10 functional dendrites, I need to map your company. Let's start with Finance: What is your current Cash on Hand?" }
    ]);

    const handleSend = () => {
        if (!input.trim()) return;
        
        setMessages(prev => [...prev, { sender: 'user', text: input }]);
        const val = parseInt(input.replace(/[^0-9]/g, '')) || 0;
        
        if (step === 0) {
            setState(prev => ({ ...prev, finances: { ...prev.finances, cash_reserve: val } }));
            setTimeout(() => setMessages(prev => [...prev, { sender: 'aera', text: `Mapped. What is your estimated monthly Burn Rate?` }]), 500);
        } else if (step === 1) {
            setState(prev => ({ ...prev, finances: { ...prev.finances, burn_rate_monthly: val } }));
            setTimeout(() => setMessages(prev => [...prev, { sender: 'aera', text: `Got it. How many people are on the team right now?` }]), 500);
        } else if (step === 2) {
            setState(prev => ({ ...prev, people: { ...prev.people, headcount: val } }));
            setTimeout(() => setMessages(prev => [...prev, { sender: 'aera', text: `Excellent. Initialization complete. I have spawned all 10 dendrites. We are ready to view your operational Dashboard.` }]), 500);
        }
        
        setInput('');
        setStep(prev => prev + 1);
    };

    return (
        <div className="page-container glass-panel" style={{ maxWidth: '800px', marginTop: '4rem' }}>
            <h1 className="title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Brain size={32} color="#6366f1" /> Neural Initialization
            </h1>
            <p className="subtitle">Configuring your digital operational cortex...</p>
            
            <div className="chat-container">
                {messages.map((m, i) => (
                    <div key={i} className={`chat-message ${m.sender === 'aera' ? 'chat-aera' : 'chat-user'}`}>
                        {m.text}
                    </div>
                ))}
            </div>

            {step > 2 ? (
                <button onClick={() => navigate('/dashboard')} style={{ width: '100%', justifyContent: 'center' }}>
                    Access Aera Dashboard <ArrowRight size={18}/>
                </button>
            ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                        type="text" 
                        value={input} 
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Type your answer..."
                        style={{ marginBottom: 0 }}
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            )}
        </div>
    );
}
