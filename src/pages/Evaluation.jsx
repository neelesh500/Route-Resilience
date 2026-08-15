import React from 'react';
import './Evaluation.css';

const Evaluation = () => {
    const metrics = [
        { name: "IoU & Dice Score", desc: "Segmentation accuracy focusing on Occlusion-Recall (recovery under shadows)." },
        { name: "Generalisation", desc: "Success rate across diverse terrains (urban, forested, rural)." },
        { name: "Connectivity Ratio", desc: "Percentage increase in largest connected component post-MST healing." },
        { name: "Topological Accuracy", desc: "Comparison vs OSM benchmarks (Average Path Length error)." },
        { name: "Relaxed IoU", desc: "Introduces 3-5px tolerance buffer to prevent penalizing minor alignment shifts." }
    ];

    return (
        <div className="section" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className="section-title text-gradient-secondary">Evaluation Parameters</h2>
            <div className="metrics-grid">
                {metrics.map((m, i) => (
                    <div key={i} className="glass-panel metric-card">
                        <h3>{m.name}</h3>
                        <p>{m.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Evaluation;
