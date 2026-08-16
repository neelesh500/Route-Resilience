import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';
import './Dashboard.css';

// Mock Global & Regional Data
const center = [20, 0]; // Global center

// Criticality Worth simulated (Betweenness Centrality)
const nodes = [
    // India
    { id: 1, pos: [19.0760, 72.8777], centrality: 0.9, name: 'Mumbai Hub', region: 'Asia' },
    { id: 2, pos: [28.7041, 77.1025], centrality: 0.7, name: 'Delhi Core', region: 'Asia' },
    { id: 3, pos: [12.9716, 77.5946], centrality: 0.8, name: 'Bangalore Tech Park', region: 'Asia' },

    // Europe
    { id: 4, pos: [51.5074, -0.1278], centrality: 0.95, name: 'London Node', region: 'Europe' },
    { id: 5, pos: [48.8566, 2.3522], centrality: 0.85, name: 'Paris Core', region: 'Europe' },
    { id: 6, pos: [52.5200, 13.4050], centrality: 0.6, name: 'Berlin Grid', region: 'Europe' },

    // America
    { id: 7, pos: [40.7128, -74.0060], centrality: 0.9, name: 'NY Exchange', region: 'America' },
    { id: 8, pos: [34.0522, -118.2437], centrality: 0.75, name: 'LA Transit', region: 'America' },
    { id: 9, pos: [37.7749, -122.4194], centrality: 0.88, name: 'SF Valley', region: 'America' },

    // Asia
    { id: 10, pos: [35.6762, 139.6503], centrality: 0.92, name: 'Tokyo Core', region: 'Asia' },
    { id: 11, pos: [1.3521, 103.8198], centrality: 0.8, name: 'Singapore Port', region: 'Asia' },
    { id: 12, pos: [31.2304, 121.4737], centrality: 0.77, name: 'Shanghai Hub', region: 'Asia' },
];

const initialEdges = [
    // Asia links
    { id: 'e1', source: 1, target: 2, weight: 1.5, type: 'high' },
    { id: 'e2', source: 1, target: 3, weight: 1.2, type: 'mid' },
    { id: 'e3', source: 2, target: 3, weight: 1.0, type: 'low' },
    { id: 'e4', source: 10, target: 12, weight: 2.0, type: 'high' },
    { id: 'e5', source: 11, target: 12, weight: 1.3, type: 'mid' },
    { id: 'e6', source: 3, target: 11, weight: 2.5, type: 'high' },

    // Europe links
    { id: 'e7', source: 4, target: 5, weight: 1.1, type: 'high' },
    { id: 'e8', source: 5, target: 6, weight: 1.3, type: 'mid' },
    { id: 'e9', source: 4, target: 6, weight: 1.8, type: 'low' },

    // America links
    { id: 'e10', source: 7, target: 8, weight: 2.2, type: 'mid' },
    { id: 'e11', source: 8, target: 9, weight: 1.0, type: 'low' },
    { id: 'e12', source: 7, target: 9, weight: 2.5, type: 'high' },

    // Inter-continental
    { id: 'e13', source: 4, target: 7, weight: 4.5, type: 'high' },
    { id: 'e14', source: 1, target: 4, weight: 3.5, type: 'mid' },
    { id: 'e15', source: 10, target: 9, weight: 5.0, type: 'high' }
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
                <MapContainer center={center} zoom={2} style={{ height: '100%', width: '100%', borderRadius: '16px', background: '#0b0e14' }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://carto.com/">CART</a>'
                        noWrap={true}
                    />

                    {/* Edges */}
                    {activeEdges.map(edge => {
                        const sourceNode = nodes.find(n => n.id === edge.source);
                        const targetNode = nodes.find(n => n.id === edge.target);
                        if (!sourceNode || !targetNode) return null;

                        let baseColor = '#00ff66'; // low
                        if (edge.type === 'mid') baseColor = '#ffff00';
                        if (edge.type === 'high') baseColor = '#ff003c';

                        return (
                            <Polyline
                                key={edge.id}
                                positions={[sourceNode.pos, targetNode.pos]}
                                color={edge.isDisabled ? '#444' : baseColor}
                                weight={edge.isDisabled ? 1 : (edge.weight || 2)}
                                opacity={edge.isDisabled ? 0.2 : 0.8}
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
