import React from 'react';
import { motion } from 'framer-motion';
import { Database, FileText, Download, Code } from 'lucide-react';
import './Data.css';

const Data = () => {
    const datasets = [
        {
            title: "SpaceNet 7 Challenge Dataset",
            desc: "Multi-temporal urban development satellite imagery. Used for training the baseline road extraction model.",
            size: "25 GB",
            type: "Geospatial Images"
        },
        {
            title: "OpenStreetMap (OSM) Global Graph",
            desc: "Vector road definitions utilized as ground truth for topological evaluation and minimum spanning tree logic.",
            size: "62 GB",
            type: "Graph / JSON"
        },
        {
            title: "Global Urban Flood Risk Data",
            desc: "Topology and elevation maps used during the node ablation simulation to identify naturally vulnerable areas.",
            size: "12 GB",
            type: "GeoJSON / DEM"
        },
        {
            title: "Synthetic Occlusion Dataset",
            desc: "Custom generated dataset with artificial cloud, shadow, and canopy covers applied to clear satellite imagery.",
            size: "4 GB",
            type: "Augmented Images"
        }
    ];

    return (
        <motion.div
            className="data-container section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="section-title text-gradient">Data Resources & Code</h2>
            <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#94a3b8' }}>
                All datasets and model architecture code are tracked securely. Below is the primary data lakes used for training and simulations.
            </p>

            <div className="data-grid">
                {datasets.map((data, idx) => (
                    <motion.div
                        key={idx}
                        className="glass-panel data-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Database size={32} color="#00f0ff" style={{ marginBottom: '1rem' }} />
                        <h3>{data.title}</h3>
                        <p>{data.desc}</p>
                        <div className="data-meta">
                            <span className="badge-outline">{data.type}</span>
                            <span className="badge-outline">{data.size}</span>
                        </div>
                        <button className="btn-secondary data-btn">
                            <Download size={16} /> Request Access
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="code-section glass-panel" style={{ marginTop: '4rem', padding: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Code color="#00ff66" /> Architecture Notebooks</h3>
                <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
                    The complete PyTorch architecture for our U-Net + Transformer model, including the Custom Loss Function (Relaxed IoU) and Minimum Spanning Tree (MST) algorithmic implementation, will be available in the main branch post-hackathon evaluation.
                </p>
                <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => alert('Access restricted during Hackathon judging phase.')}>
                    <FileText size={16} /> View Documentation
                </button>
            </div>
        </motion.div>
    );
};

export default Data;
