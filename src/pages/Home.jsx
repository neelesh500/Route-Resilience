import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Network, Eye, ShieldAlert, Fingerprint, Crosshair, Map, Activity, Zap } from 'lucide-react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            {/* Top Left Header / Tags */}
            <motion.div
                className="top-tagline"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                INNOVATE &nbsp;•&nbsp; IMAGINE &nbsp;•&nbsp; INSPIRE
            </motion.div>

            {/* Hero Section */}
            <section className="hero">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <h1 className="hero-title">
                        ROUTE RESILIENCE:
                        <br />
                        <span className="text-gradient">OCCLUSION-ROBUST</span> ROAD EXTRACTION & <br />
                        GRAPH-THEORETIC <span className="text-gradient-secondary">CRITICALITY</span> ANALYSIS<br />
                        FOR <span className="text-gradient-ternary">URBAN MOBILITY</span>
                    </h1>

                    <div className="hero-description-container glass-panel">
                        <div className="desc-icon">
                            <Map size={48} color="#00ff66" />
                        </div>
                        <p className="hero-subtitle">
                            Leverage space-based insights and advanced AI + Graph Theory to build resilient urban road networks for a smarter tomorrow.
                        </p>
                    </div>

                    <div className="hero-actions">
                        <Link to="/dashboard" className="btn-primary">
                            <Network size={20} />
                            Launch Dashboard
                        </Link>
                        <Link to="/methodology" className="btn-secondary">
                            View Methodology
                        </Link>
                    </div>
                </motion.div>

                {/* Right Side Info Panels mimicking the poster */}
                <motion.div
                    className="hero-right-panels"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    <div className="process-flow">
                        <div className="process-step glass-panel">
                            <div className="step-img bg-sat"></div>
                            <h5>SATELLITE IMAGE</h5>
                        </div>
                        <div className="process-arrow">➔</div>
                        <div className="process-step glass-panel">
                            <div className="step-img bg-extract"></div>
                            <h5>OCCLUSION-ROBUST<br />ROAD EXTRACTION</h5>
                        </div>
                        <div className="process-arrow">➔</div>
                        <div className="process-step glass-panel border-glow">
                            <div className="step-img bg-graph"></div>
                            <h5>ROAD GRAPH &<br />CRITICALITY ANALYSIS</h5>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Bottom Tech Stack / Tags */}
            <motion.section
                className="bottom-features"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
            >
                <div className="feature-item">
                    <Crosshair size={32} color="#94a3b8" />
                    <div>
                        <h4>SPACE DATA</h4>
                        <p>SATELLITE IMAGERY &amp; OPEN DATASETS</p>
                    </div>
                </div>
                <div className="feature-item">
                    <Zap size={32} color="#00f0ff" />
                    <div>
                        <h4>AI/ML</h4>
                        <p>DEEP LEARNING FOR ROBUST EXTRACTION</p>
                    </div>
                </div>
                <div className="feature-item">
                    <Network size={32} color="#00ff66" />
                    <div>
                        <h4>GRAPH THEORY</h4>
                        <p>NETWORK MODELING &amp; CRITICALITY ANALYSIS</p>
                    </div>
                </div>
                <div className="feature-item">
                    <Activity size={32} color="#ff003c" />
                    <div>
                        <h4>URBAN IMPACT</h4>
                        <p>RESILIENT, EFFICIENT &amp; INCLUSIVE MOBILITY</p>
                    </div>
                </div>

                <div className="mission-tag">
                    FROM SPACE INSIGHTS <br />
                    <span style={{ color: '#00ff66', fontSize: '1.2rem', fontWeight: 'bold' }}>TO STRONGER CITIES</span>
                </div>
            </motion.section>
        </div>
    );
};

export default Home;
