import React from 'react';
import { Layers, GitMerge, Activity, Server } from 'lucide-react';
import './Methodology.css';

const Methodology = () => {
    const steps = [
        {
            phase: "Phase I: Occlusion-Robust Segmentation",
            icon: <Layers size={40} color="#00f0ff" />,
            desc: "Train a context-aware U-Net/DeepLabV3+ model with Transformer logic to 'see through' trees, shadows, and urban clutter, producing connected road masks.",
        },
        {
            phase: "Phase II: Graph Skeletonization & Healing",
            icon: <GitMerge size={40} color="#00ff66" />,
            desc: "Apply morphological skeletonization and use a Minimum Spanning Tree (MST) + Disjoint Set algorithm to logically bridge gaps based on Euclidean distance.",
        },
        {
            phase: "Phase III: Network Analysis & Stress Testing",
            icon: <Activity size={40} color="#ff003c" />,
            desc: "Calculate Betweenness Centrality to find Gatekeeper Nodes. Perform Node Ablation Simulation to quantify vulnerability (Resilience Index).",
        },
        {
            phase: "Phase IV: Interactive Dashboard",
            icon: <Server size={40} color="#fff" />,
            desc: "Deploy a web-based visualization tool (Vite/React) with Heatmap Overlay and Simulation Toggle for immediate actionable intelligence.",
        }
    ];

    return (
        <div className="methodology-container section">
            <h2 className="section-title text-gradient">Methodology Workflow</h2>

            <div className="timeline">
                {steps.map((step, idx) => (
                    <div key={idx} className="timeline-item">
                        <div className="timeline-icon">
                            {step.icon}
                        </div>
                        <div className="timeline-content glass-panel">
                            <h3>{step.phase}</h3>
                            <p>{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Methodology;
