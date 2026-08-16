import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';
import './Dashboard.css';

const center = [20, 0]; // Global Center

// Country Color Definitions for Edges
const regionColors = {
    'India': '#00ff66',
    'USA': '#00f0ff',
    'Europe': '#b500ff',
    'EastAsia': '#ff003c',
    'MiddleEast': '#ffb800',
    'SouthAmerica': '#ff00a0',
    'Africa': '#ff6600',
    'Australia': '#ff00ff',
    'Russia': '#0099ff',
    'Canada': '#00f0ff',
    'Global': '#ffffff' // For intercontinental
};

const nodes = [
    // India (Green)
    { id: 1, pos: [28.7041, 77.1025], centrality: 0.95, name: 'Delhi', region: 'India' },
    { id: 2, pos: [19.0760, 72.8777], centrality: 0.98, name: 'Mumbai', region: 'India' },
    { id: 3, pos: [12.9716, 77.5946], centrality: 0.92, name: 'Bangalore', region: 'India' },
    { id: 4, pos: [22.5726, 88.3639], centrality: 0.85, name: 'Kolkata', region: 'India' },
    { id: 5, pos: [13.0827, 80.2707], centrality: 0.88, name: 'Chennai', region: 'India' },
    { id: 6, pos: [17.3850, 78.4867], centrality: 0.83, name: 'Hyderabad', region: 'India' },

    // USA (Blue)
    { id: 7, pos: [40.7128, -74.0060], centrality: 0.97, name: 'New York', region: 'USA' },
    { id: 8, pos: [34.0522, -118.2437], centrality: 0.92, name: 'Los Angeles', region: 'USA' },
    { id: 9, pos: [41.8781, -87.6298], centrality: 0.89, name: 'Chicago', region: 'USA' },
    { id: 10, pos: [29.7604, -95.3698], centrality: 0.85, name: 'Houston', region: 'USA' },
    { id: 40, pos: [37.7749, -122.4194], centrality: 0.90, name: 'San Francisco', region: 'USA' },

    // Europe (Purple)
    { id: 11, pos: [51.5074, -0.1278], centrality: 0.96, name: 'London', region: 'Europe' },
    { id: 12, pos: [48.8566, 2.3522], centrality: 0.94, name: 'Paris', region: 'Europe' },
    { id: 13, pos: [52.5200, 13.4050], centrality: 0.91, name: 'Berlin', region: 'Europe' },
    { id: 14, pos: [41.9028, 12.4964], centrality: 0.82, name: 'Rome', region: 'Europe' },
    { id: 15, pos: [40.4168, -3.7038], centrality: 0.84, name: 'Madrid', region: 'Europe' },

    // East Asia (Red)
    { id: 16, pos: [39.9042, 116.4074], centrality: 0.96, name: 'Beijing', region: 'EastAsia' },
    { id: 17, pos: [31.2304, 121.4737], centrality: 0.98, name: 'Shanghai', region: 'EastAsia' },
    { id: 18, pos: [35.6762, 139.6503], centrality: 0.95, name: 'Tokyo', region: 'EastAsia' },
    { id: 19, pos: [37.5665, 126.9780], centrality: 0.88, name: 'Seoul', region: 'EastAsia' },
    { id: 20, pos: [22.3193, 114.1694], centrality: 0.93, name: 'Hong Kong', region: 'EastAsia' },

    // Middle East (Gold)
    { id: 21, pos: [25.2048, 55.2708], centrality: 0.90, name: 'Dubai', region: 'MiddleEast' },
    { id: 22, pos: [24.7136, 46.6753], centrality: 0.85, name: 'Riyadh', region: 'MiddleEast' },
    { id: 23, pos: [32.0853, 34.7818], centrality: 0.80, name: 'Tel Aviv', region: 'MiddleEast' },
    { id: 24, pos: [35.6892, 51.3890], centrality: 0.75, name: 'Tehran', region: 'MiddleEast' },

    // South America (Pink)
    { id: 25, pos: [-23.5505, -46.6333], centrality: 0.91, name: 'Sao Paulo', region: 'SouthAmerica' },
    { id: 26, pos: [-34.6037, -58.3816], centrality: 0.87, name: 'Buenos Aires', region: 'SouthAmerica' },
    { id: 27, pos: [-22.9068, -43.1729], centrality: 0.85, name: 'Rio de Janeiro', region: 'SouthAmerica' },
    { id: 28, pos: [-12.0464, -77.0428], centrality: 0.78, name: 'Lima', region: 'SouthAmerica' },

    // Africa (Orange)
    { id: 29, pos: [-26.2041, 28.0473], centrality: 0.86, name: 'Johannesburg', region: 'Africa' },
    { id: 30, pos: [6.5244, 3.3792], centrality: 0.83, name: 'Lagos', region: 'Africa' },
    { id: 31, pos: [30.0444, 31.2357], centrality: 0.89, name: 'Cairo', region: 'Africa' },
    { id: 32, pos: [-1.2921, 36.8219], centrality: 0.77, name: 'Nairobi', region: 'Africa' },

    // Australia (Pink/Magenta)
    { id: 33, pos: [-33.8688, 151.2093], centrality: 0.88, name: 'Sydney', region: 'Australia' },
    { id: 34, pos: [-37.8136, 144.9631], centrality: 0.85, name: 'Melbourne', region: 'Australia' },

    // Russia (Ice Blue)
    { id: 35, pos: [55.7558, 37.6173], centrality: 0.92, name: 'Moscow', region: 'Russia' },
    { id: 36, pos: [59.9311, 30.3609], centrality: 0.82, name: 'St. Petersburg', region: 'Russia' },

    // Canada (Cyan)
    { id: 37, pos: [43.6510, -79.3470], centrality: 0.89, name: 'Toronto', region: 'Canada' },
    { id: 38, pos: [49.2827, -123.1207], centrality: 0.81, name: 'Vancouver', region: 'Canada' }
];

const initialEdges = [
    // India Internal
    { id: 'i1', source: 1, target: 2, region: 'India' },
    { id: 'i2', source: 2, target: 3, region: 'India' },
    { id: 'i3', source: 3, target: 5, region: 'India' },
    { id: 'i4', source: 5, target: 4, region: 'India' },
    { id: 'i5', source: 4, target: 1, region: 'India' },
    { id: 'i6', source: 2, target: 6, region: 'India' },

    // USA Internal
    { id: 'u1', source: 7, target: 9, region: 'USA' },
    { id: 'u2', source: 9, target: 8, region: 'USA' },
    { id: 'u3', source: 8, target: 40, region: 'USA' },
    { id: 'u4', source: 7, target: 10, region: 'USA' },

    // Europe Internal
    { id: 'e1', source: 11, target: 12, region: 'Europe' },
    { id: 'e2', source: 12, target: 13, region: 'Europe' },
    { id: 'e3', source: 12, target: 15, region: 'Europe' },
    { id: 'e4', source: 12, target: 14, region: 'Europe' },
    { id: 'e5', source: 13, target: 35, region: 'Europe' },

    // East Asia Internal
    { id: 'a1', source: 16, target: 17, region: 'EastAsia' },
    { id: 'a2', source: 17, target: 20, region: 'EastAsia' },
    { id: 'a3', source: 16, target: 19, region: 'EastAsia' },
    { id: 'a4', source: 18, target: 19, region: 'EastAsia' },

    // Middle East Internal
    { id: 'm1', source: 21, target: 22, region: 'MiddleEast' },
    { id: 'm2', source: 21, target: 24, region: 'MiddleEast' },
    { id: 'm3', source: 31, target: 23, region: 'MiddleEast' },

    // South America
    { id: 'sa1', source: 25, target: 27, region: 'SouthAmerica' },
    { id: 'sa2', source: 25, target: 26, region: 'SouthAmerica' },
    { id: 'sa3', source: 26, target: 28, region: 'SouthAmerica' },

    // Africa
    { id: 'af1', source: 30, target: 29, region: 'Africa' },
    { id: 'af2', source: 31, target: 32, region: 'Africa' },
    { id: 'af3', source: 32, target: 29, region: 'Africa' },

    // Australia
    { id: 'au1', source: 33, target: 34, region: 'Australia' },

    // Canada
    { id: 'ca1', source: 37, target: 7, region: 'Canada' },
    { id: 'ca2', source: 38, target: 40, region: 'Canada' },

    // Russia
    { id: 'ru1', source: 35, target: 36, region: 'Russia' },

    // Global Interconnections (Transatlantic / Transpacific etc)
    { id: 'g1', source: 7, target: 11, region: 'Global', weight: 4 }, // NY - London
    { id: 'g2', source: 21, target: 2, region: 'Global', weight: 3 },  // Dubai - Mumbai
    { id: 'g3', source: 2, target: 11, region: 'Global', weight: 3 },  // Mumbai - London
    { id: 'g4', source: 40, target: 18, region: 'Global', weight: 4 }, // SF - Tokyo
    { id: 'g5', source: 18, target: 33, region: 'Global', weight: 2 }, // Tokyo - Sydney
    { id: 'g6', source: 21, target: 11, region: 'Global', weight: 2 }, // Dubai - London
    { id: 'g7', source: 21, target: 29, region: 'Global', weight: 2 }, // Dubai - Joburg
    { id: 'g8', source: 25, target: 7, region: 'Global', weight: 3 },  // Sao Paulo - NY
    { id: 'g9', source: 17, target: 2, region: 'Global', weight: 2 }   // Shanghai - Mumbai
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

    const resilienceIndex = (1 - (disabledNodes.length * 0.05)).toFixed(2);

    return (
        <div className="dashboard-container">
            <div className="dashboard-sidebar glass-panel" style={{ borderTop: '4px solid #00f0ff', width: '350px' }}>
                <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    <Zap size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
                    Command Center
                </h2>

                <div className="stat-card" style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', letterSpacing: '1px' }}>GLOBAL RESILIENCE INDEX</h4>
                    <div className="stat-value" style={{
                        color: resilienceIndex < 0.7 ? '#ff003c' : '#00ff66',
                        fontSize: '3rem',
                        fontWeight: '800',
                        lineHeight: '1',
                        textShadow: `0 0 20px ${resilienceIndex < 0.7 ? '#ff003c55' : '#00ff6655'}`
                    }}>
                        {Math.max(0, resilienceIndex)}
                    </div>
                </div>

                <div className="simulation-panel" style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '400px', overflowY: 'auto' }}>
                    <h4 style={{ color: '#fff', fontSize: '1rem', letterSpacing: '1px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={18} color="#ff003c" />
                        Global Network Nodes
                    </h4>
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
                        Toggle cities to simulate total blackout or structural destruction in that region.
                    </p>
                    <ul className="node-list">
                        {nodes.sort((a, b) => b.centrality - a.centrality).map(node => (
                            <li
                                key={node.id}
                                className={`node-item ${disabledNodes.includes(node.id) ? 'disabled' : ''}`}
                                onClick={() => toggleNode(node.id)}
                                style={{ borderLeft: `4px solid ${regionColors[node.region]}` }}
                            >
                                <span>{node.name} <small style={{ color: '#777' }}>({node.region})</small></span>
                                <span className="badge">{node.centrality.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={() => setDisabledNodes([])}>
                    <RefreshCw size={18} /> Rebuild Network
                </button>
            </div>

            <div className="dashboard-map">
                <MapContainer center={center} zoom={3} style={{ height: '100%', width: '100%', borderRadius: '16px', background: '#0b0e14' }}>
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

                        const edgeColor = regionColors[edge.region] || '#ffffff';

                        return (
                            <Polyline
                                key={edge.id}
                                positions={[sourceNode.pos, targetNode.pos]}
                                color={edge.isDisabled ? '#333' : edgeColor}
                                weight={edge.isDisabled ? 1 : (edge.weight || 2)}
                                opacity={edge.isDisabled ? 0.1 : (edge.region === 'Global' ? 0.4 : 0.8)}
                                dashArray={edge.isDisabled ? '5, 10' : (edge.region === 'Global' ? '4, 8' : 'none')}
                            />
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map(node => {
                        const isDisabled = disabledNodes.includes(node.id);
                        const baseColor = regionColors[node.region];
                        return (
                            <CircleMarker
                                key={node.id}
                                center={node.pos}
                                radius={isDisabled ? 4 : node.centrality * 10}
                                color={isDisabled ? '#ff003c' : baseColor}
                                fillColor={isDisabled ? '#ff003c' : baseColor}
                                fillOpacity={isDisabled ? 0.5 : 0.8}
                                eventHandlers={{
                                    click: () => toggleNode(node.id)
                                }}
                            >
                                <Popup>
                                    <div style={{ color: '#000', fontFamily: 'Inter' }}>
                                        <strong>{node.name}</strong> ({node.region})<br />
                                        Centrality: {node.centrality}<br />
                                        Status: {isDisabled ? 'OFFLINE / DESTROYED' : 'ACTIVE'}
                                    </div>
                                </Popup>
                            </CircleMarker>
                        )
                    })}
                </MapContainer>
            </div>
        </div>
    );
};

export default Dashboard;
