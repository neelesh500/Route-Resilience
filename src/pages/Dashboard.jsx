import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';
import './Dashboard.css';

// Mock Bengaluru Data
const center = [12.9716, 77.5946];

// Criticality Worth simulated (Betweenness Centrality)
const nodes = [
    { id: 1, pos: [12.9716, 77.5946], centrality: 0.9, name: 'MG Road Junction' },
    { id: 2, pos: [12.9650, 77.6000], centrality: 0.6, name: 'Residency Road' },
    { id: 3, pos: [12.9800, 77.6050], centrality: 0.8, name: 'Indiranagar Path' },
    { id: 4, pos: [12.9600, 77.5900], centrality: 0.4, name: 'Koramangala Link' },
    { id: 5, pos: [12.9850, 77.5850], centrality: 0.7, name: 'Vidhana Soudha' },
];

const initialEdges = [
    { id: 'e1', source: 1, target: 2, weight: 1 },
    { id: 'e2', source: 1, target: 3, weight: 2 },
    { id: 'e3', source: 1, target: 4, weight: 1.5 },
    { id: 'e4', source: 1, target: 5, weight: 1.2 },
    { id: 'e5', source: 2, target: 4, weight: 3 },
    { id: 'e6', source: 3, target: 5, weight: 2.5 }
];

const Dashboard = () => {
    const [disabledNodes, setDisabledNodes] = useState([]);

    const toggleNode = (nodeId) => {
        if (disabledNodes.includes(nodeId)) {
            setDisabledNodes(disabledNodes.filter(id => id !== nodeId));
        } else {
            setDisabledNodes([...disabledNodes, nodeId]);
        }
    };

    const getActiveEdges = () => {
        return initialEdges.map(edge => {
            const isDisabled = disabledNodes.includes(edge.source) || disabledNodes.includes(edge.target);
            return { ...edge, isDisabled };
        });
    };

    const activeEdges = getActiveEdges();

    const resilienceIndex = (1 - (disabledNodes.length * 0.15)).toFixed(2);

    return (
        <div className="dashboard-container">
            <div className="dashboard-sidebar glass-panel" style={{ borderTop: '4px solid #00f0ff' }}>
                <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    <Zap size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
                    Command Center
                </h2>

                <div className="stat-card" style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', letterSpacing: '1px' }}>RESILIENCE INDEX (R)</h4>
                    <div className="stat-value" style={{
                        color: resilienceIndex < 0.6 ? '#ff003c' : '#00ff66',
                        fontSize: '3rem',
                        fontWeight: '800',
                        lineHeight: '1',
                        textShadow: `0 0 20px ${resilienceIndex < 0.6 ? '#ff003c55' : '#00ff6655'}`
                    }}>
                        {Math.max(0, resilienceIndex)}
                    </div>
                    <p className="stat-desc" style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '12px' }}>Ratio of average shortest path length (Baseline vs Perturbed). Critical integrity warning below 0.60.</p>
                </div>

                <div className="simulation-panel" style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: '#fff', fontSize: '1rem', letterSpacing: '1px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={18} color="#ff003c" />
                        Ablation Simulation
                    </h4>
                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: '1.4' }}>
                        Sys-Override: Manually toggle network nodes to simulate occlusion or structural failure (e.g., flooding, drone strike).
                    </p>
                    <ul className="node-list">
                        {nodes.map(node => (
                            <li
                                key={node.id}
                                className={`node-item ${disabledNodes.includes(node.id) ? 'disabled' : ''}`}
                                onClick={() => toggleNode(node.id)}
                            >
                                <span>{node.name}</span>
                                <span className="badge">Worth: {node.centrality}</span>
                            </li>
                        ))}
                    </ul>

                    <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={() => setDisabledNodes([])}>
                        <RefreshCw size={18} /> Reset Topology
                    </button>
                </div>
            </div>

            <div className="dashboard-map">
                <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%', borderRadius: '16px', background: '#0b0e14' }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://carto.com/">CART</a>'
                    />

                    {/* Edges */}
                    {activeEdges.map(edge => {
                        const sourceNode = nodes.find(n => n.id === edge.source);
                        const targetNode = nodes.find(n => n.id === edge.target);
                        return (
                            <Polyline
                                key={edge.id}
                                positions={[sourceNode.pos, targetNode.pos]}
                                color={edge.isDisabled ? '#ff003c' : '#00f0ff'}
                                weight={edge.isDisabled ? 2 : 4}
                                opacity={edge.isDisabled ? 0.3 : 0.8}
                                dashArray={edge.isDisabled ? '5, 10' : 'none'}
                            />
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map(node => {
                        const isDisabled = disabledNodes.includes(node.id);
                        const color = isDisabled ? '#ff003c' : `rgba(0, 255, 102, ${node.centrality})`;
                        return (
                            <CircleMarker
                                key={node.id}
                                center={node.pos}
                                radius={isDisabled ? 6 : node.centrality * 15}
                                color={isDisabled ? '#ff003c' : '#00ff66'}
                                fillColor={color}
                                fillOpacity={0.8}
                                eventHandlers={{
                                    click: () => toggleNode(node.id)
                                }}
                            >
                                <Popup>
                                    <div style={{ color: '#000', fontFamily: 'Inter' }}>
                                        <strong>{node.name}</strong><br />
                                        Centrality: {node.centrality}<br />
                                        Status: {isDisabled ? 'OFFLINE' : 'ACTIVE'}
                                    </div>
                                </Popup>
                            </CircleMarker>
                        )
                    })}
                </MapContainer>

                {/* Criticality Legend */}
                <div className="map-legend glass-panel" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000, padding: '1rem', width: '200px' }}>
                    <h5 style={{ margin: 0, marginBottom: '0.5rem', color: '#fff' }}>Criticality</h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#aaa', marginBottom: '4px' }}>
                        <span>High</span>
                        <span>Low</span>
                    </div>
                    <div style={{
                        height: '12px',
                        background: 'linear-gradient(90deg, #ff003c 0%, #ffff00 50%, #00ff66 100%)',
                        borderRadius: '6px'
                    }}></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
