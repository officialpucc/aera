// src/server.ts
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { AeraBrain } from './core/Brain';
import { PorteGateway } from './api/PorteGateway';

const PORT = 8080;
const app = express();
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });
const brain = new AeraBrain();
const gateway = new PorteGateway(brain);

console.log(`Aera Neural WebSocket Bridge & HTTP Gateway active on port ${PORT}`);

// --- Real-World Physical Gateway API ---
app.post('/api/porte/tap', async (req, res) => {
    try {
        const { porte_id } = req.body;
        if (!porte_id) return res.status(400).json({ error: "Missing porte_id" });
        
        const result = await gateway.handleNFCTap(porte_id);
        res.json(result);
    } catch (error) {
        console.error("Gateway Tap Error:", error);
        res.status(500).json({ error: "Internal Gateway Error" });
    }
});

app.post('/api/porte/return', async (req, res) => {
    try {
        const { porte_id, nfc_payload } = req.body;
        if (!porte_id) return res.status(400).json({ error: "Missing porte_id" });

        const result = await gateway.handlePUCCReturn(porte_id, nfc_payload);
        res.json(result);
    } catch (error) {
        console.error("Gateway Return Error:", error);
        res.status(500).json({ error: "Internal Gateway Error" });
    }
});

// Global Tick Loop: Aera's autonomous neural cycle
setInterval(() => {
    brain.process();
}, 5000);

wss.on('connection', (ws: WebSocket) => {
    console.log('Frontend Synapse connected.');

    // Set up state update listener for this connection
    const stateUpdateListener = (state: any) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'STATE_UPDATE',
                state: state
            }));
        }
    };

    brain.setOnStateUpdate(stateUpdateListener);

    // Initial Sync
    ws.send(JSON.stringify({
        type: 'STATE_UPDATE',
        state: brain.getState()
    }));

    ws.send(JSON.stringify({
        type: 'AERA_PROMPT',
        text: brain.getNextPrompt()
    }));

    // Listen for messages from frontend
    ws.on('message', (data: string) => {
        try {
            const message = JSON.parse(data.toString());
            console.log(`Received ${message.type} from synapse.`);

            switch (message.type) {
                case 'CHAT':
                case 'USER_INPUT': {
                    console.log(`[SYNAPSE] Chat received: "${message.text}"`);
                    const response = brain.handleChat(message.text);
                    ws.send(JSON.stringify({
                        type: 'AERA_RESPONSE',
                        text: response
                    }));
                    ws.send(JSON.stringify({
                        type: 'AERA_PROMPT',
                        text: brain.getNextPrompt()
                    }));
                    break;
                }
                case 'APPROVE': {
                    console.log(`[SYNAPSE] Approval received for action: ${message.actionId}`);
                    const result = brain.handleApprove(message.actionId);
                    ws.send(JSON.stringify({
                        type: 'AERA_RESPONSE',
                        text: result
                    }));
                    break;
                }
                default:
                    console.warn(`Unknown message type: ${message.type}`);
            }
        } catch (e) {
            console.error('Error processing message:', e);
        }
    });

    ws.on('close', () => {
        console.log('Frontend Synapse disconnected.');
        brain.removeOnStateUpdate(stateUpdateListener);
    });
});

server.listen(PORT);
