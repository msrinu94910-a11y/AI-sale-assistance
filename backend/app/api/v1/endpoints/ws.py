import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Connected agents (dashboard)
        self.active_agents: List[WebSocket] = []
        # Connected client chats mapped by session_id
        self.active_sessions: Dict[str, List[WebSocket]] = {}

    async def connect_agent(self, websocket: WebSocket):
        await websocket.accept()
        self.active_agents.append(websocket)

    def disconnect_agent(self, websocket: WebSocket):
        if websocket in self.active_agents:
            self.active_agents.remove(websocket)

    async def connect_session(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self.active_sessions:
            self.active_sessions[session_id] = []
        self.active_sessions[session_id].append(websocket)

    def disconnect_session(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_sessions:
            if websocket in self.active_sessions[session_id]:
                self.active_sessions[session_id].remove(websocket)
            if not self.active_sessions[session_id]:
                del self.active_sessions[session_id]

    async def broadcast_to_agents(self, message: dict):
        # Broadcasts alert to all connected dashboards
        dead_connections = []
        for connection in self.active_agents:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                dead_connections.append(connection)
        for dead in dead_connections:
            self.disconnect_agent(dead)

    async def send_to_session(self, session_id: str, message: dict):
        # Sends a live agent message to the specific client session
        if session_id in self.active_sessions:
            dead_connections = []
            for connection in self.active_sessions[session_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    dead_connections.append(connection)
            for dead in dead_connections:
                self.disconnect_session(dead, session_id)

manager = ConnectionManager()

@router.websocket("/agents")
async def websocket_agents(websocket: WebSocket):
    await manager.connect_agent(websocket)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_agent(websocket)

@router.websocket("/chat/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    await manager.connect_session(websocket, session_id)
    try:
        while True:
            # Client connects to listen to agent messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_session(websocket, session_id)
