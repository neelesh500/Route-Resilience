import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';
import './Dashboard.css';

// Mock High-Density Indian Data
const center = [22.9734, 78.6569]; // Center of India

// Criticality Worth simulated (Betweenness Centrality)
const nodes = [
    { id: 1, pos: [28.7041, 77.1025], centrality: 0.95, name: 'Delhi NCR Hub', region: 'North' },
    { id: 2, pos: [19.0760, 72.8777], centrality: 0.98, name: 'Mumbai Transit', region: 'West' },
    { id: 3, pos: [12.9716, 77.5946], centrality: 0.92, name: 'BLR Tech Center', region: 'South' },
    { id: 4, pos: [13.0827, 80.2707], centrality: 0.88, name: 'Chennai Port', region: 'South' },
    { id: 5, pos: [22.5726, 88.3639], centrality: 0.85, name: 'Kolkata Gateway', region: 'East' },
    { id: 6, pos: [17.3850, 78.4867], centrality: 0.83, name: 'Hyderabad Grid', region: 'South' },
    { id: 7, pos: [18.5204, 73.8567], centrality: 0.78, name: 'Pune Sub-hub', region: 'West' },
    { id: 8, pos: [23.0225, 72.5714], centrality: 0.81, name: 'Ahmedabad Base', region: 'West' },
    { id: 9, pos: [26.9124, 75.7873], centrality: 0.75, name: 'Jaipur Route', region: 'North' },
    { id: 10, pos: [26.8467, 80.9462], centrality: 0.7, name: 'Lucknow Node', region: 'North' },
    { id: 11, pos: [26.4499, 80.3319], centrality: 0.65, name: 'Kanpur Industrial', region: 'North' },
    { id: 12, pos: [21.1458, 79.0882], centrality: 0.72, name: 'Nagpur Central', region: 'Central' },
    { id: 13, pos: [22.7196, 75.8577], centrality: 0.68, name: 'Indore Link', region: 'Central' },
    { id: 14, pos: [23.2599, 77.4126], centrality: 0.66, name: 'Bhopal Data', region: 'Central' },
    { id: 15, pos: [17.6868, 83.2185], centrality: 0.74, name: 'Vizag Port', region: 'East' },
    { id: 16, pos: [25.5941, 85.1376], centrality: 0.6, name: 'Patna Bridge', region: 'East' },
    { id: 17, pos: [30.9010, 75.8573], centrality: 0.71, name: 'Ludhiana Trade', region: 'North' },
    { id: 18, pos: [27.1767, 78.0081], centrality: 0.62, name: 'Agra Tourism', region: 'North' },
    { id: 19, pos: [23.3441, 85.3096], centrality: 0.58, name: 'Ranchi Mining', region: 'East' },
    { id: 20, pos: [26.1445, 91.7362], centrality: 0.8, name: 'Guwahati Northeast Link', region: 'East' },
    { id: 21, pos: [30.7333, 76.7794], centrality: 0.75, name: 'Chandigarh Base', region: 'North' },
    { id: 22, pos: [9.9312, 76.2673], centrality: 0.82, name: 'Kochi Terminal', region: 'South' },
    { id: 23, pos: [21.1702, 72.8311], centrality: 0.76, name: 'Surat Commercial', region: 'West' }
];

const initialEdges = [
    // Golden Quadrilateral & Major Highways
    { id: 'e1', source: 1, target: 2, weight: 4.5, type: 'high' }, // Delhi-Mumbai
    { id: 'e2', source: 2, target: 3, weight: 3.5, type: 'high' }, // Mumbai-BLR
    { id: 'e3', source: 3, target: 4, weight: 2.8, type: 'mid' },  // BLR-Chennai
    { id: 'e4', source: 4, target: 5, weight: 3.2, type: 'high' }, // Chennai-Kolkata
    { id: 'e5', source: 5, target: 1, weight: 4.0, type: 'high' }, // Kolkata-Delhi

    // North Network
    { id: 'e6', source: 1, target: 9, weight: 2.0, type: 'mid' }, // Delhi-Jaipur
    { id: 'e7', source: 9, target: 8, weight: 1.8, type: 'low' }, // Jaipur-Ahmedabad
    { id: 'e8', source: 1, target: 21, weight: 1.5, type: 'low' }, // Delhi-Chandigarh
    { id: 'e9', source: 21, target: 17, weight: 1.2, type: 'low' }, // Chd-Ludhiana
    { id: 'e10', source: 1, target: 18, weight: 1.6, type: 'mid' }, // Delhi-Agra
    { id: 'e11', source: 18, target: 11, weight: 1.4, type: 'low' }, // Agra-Kanpur
    { id: 'e12', source: 11, target: 10, weight: 1.8, type: 'mid' }, // Kanpur-Lucknow

    // Central & West Network
    { id: 'e13', source: 2, target: 7, weight: 2.5, type: 'high' }, // Mumbai-Pune
    { id: 'e14', source: 2, target: 23, weight: 2.2, type: 'mid' }, // Mumbai-Surat
    { id: 'e15', source: 23, target: 8, weight: 2.0, type: 'mid' }, // Surat-Ahmedabad
    { id: 'e16', source: 2, target: 13, weight: 1.9, type: 'low' }, // Mumbai-Indore
    { id: 'e17', source: 13, target: 14, weight: 1.5, type: 'low' }, // Indore-Bhopal
    { id: 'e18', source: 14, target: 12, weight: 2.8, type: 'mid' }, // Bhopal-Nagpur
    { id: 'e19', source: 12, target: 6, weight: 3.0, type: 'high' }, // Nagpur-HYD
    { id: 'e20', source: 12, target: 5, weight: 2.6, type: 'mid' }, // Nagpur-Kolkata

    // South Network
    { id: 'e21', source: 6, target: 3, weight: 2.9, type: 'high' }, // HYD-BLR
    { id: 'e22', source: 6, target: 4, weight: 2.7, type: 'mid' },  // HYD-Chennai
    { id: 'e23', source: 3, target: 22, weight: 2.1, type: 'mid' }, // BLR-Kochi
    { id: 'e24', source: 4, target: 15, weight: 1.8, type: 'low' }, // Chennai-Vizag
    { id: 'e25', source: 15, target: 5, weight: 2.4, type: 'high' },// Vizag-Kolkata

    // East / Northeast Network
    { id: 'e26', source: 5, target: 16, weight: 2.2, type: 'mid' }, // Kolkata-Patna
    { id: 'e27', source: 5, target: 19, weight: 1.7, type: 'low' }, // Kolkata-Ranchi
    { id: 'e28', source: 16, target: 10, weight: 2.0, type: 'mid' }, // Patna-Lucknow
    { id: 'e29', source: 5, target: 20, weight: 3.8, type: 'high' }, // Kolkata-Guwahati (Chicken's neck)
    { id: 'e30', source: 20, target: 16, weight: 1.5, type: 'low' }  // Guwahati bypass
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
                <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%', borderRadius: '16px', background: '#0b0e14' }}>
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
