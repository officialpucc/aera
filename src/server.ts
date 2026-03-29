// src/server.ts
import { WebSocketServer, WebSocket } from 'ws';
import { AeraBrain } from './core/Brain';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });
const brain = new AeraBrain();

console.log(`Aera Neural WebSocket Bridge active on port ${PORT}`);

// Global Tick Loop: Aera's autonomous neural cycle
setInterval(() => {
    brain.process();
}, 5000);

wss.on('connection', (ws: WebSocket) => {
    console.log('Frontend Synapse connected.');

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
            const message = JSON.parse(data);
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
                case 'TELEMETRY': {
                    console.log(`[SYNAPSE] Manual Telemetry Pulse requested.`);
                    ws.send(JSON.stringify({
                        type: 'STATE_UPDATE',
                        state: brain.getState()
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

    ws.on('close', () => {
        console.log('Frontend Synapse disconnected.');
        brain.removeOnStateUpdate(stateUpdateListener);
    });
});
