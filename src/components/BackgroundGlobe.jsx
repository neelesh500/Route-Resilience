import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

const BackgroundGlobe = () => {
    const globeEl = useRef();
    const [arcsData, setArcsData] = useState([]);
    const [ringsData, setRingsData] = useState([]);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);

        // Generate random arcs and rings to simulate data processing across the globe
        const N_ARCS = 20;
        const arcs = [...Array(N_ARCS).keys()].map(() => ({
            startLat: (Math.random() - 0.5) * 180,
            startLng: (Math.random() - 0.5) * 360,
            endLat: (Math.random() - 0.5) * 180,
            endLng: (Math.random() - 0.5) * 360,
            color: [['#00f0ff', '#00ff66', '#ff003c'][Math.round(Math.random() * 2)], ['#00f0ff', '#00ff66', '#ff003c'][Math.round(Math.random() * 2)]]
        }));

        const N_RINGS = 15;
        const rings = [...Array(N_RINGS).keys()].map(() => ({
            lat: (Math.random() - 0.5) * 180,
            lng: (Math.random() - 0.5) * 360,
            maxR: Math.random() * 20 + 10,
            propagationSpeed: (Math.random() - 0.5) * 20 + 2,
            repeatPeriod: Math.random() * 2000 + 400,
            color: ['#00f0ff', '#00ff66', '#ff003c'][Math.round(Math.random() * 2)]
        }));

        setArcsData(arcs);
        setRingsData(rings);

        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            globeEl.current.controls().enableZoom = false;
            globeEl.current.pointOfView({ altitude: 2.2, lat: 20, lng: 77 }); // focus around India
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        let animationFrameId;
        const handleMouseMove = (e) => {
            // Calculate offset based on cursor position relative to center
            const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

            // Smoothen the movement with requestAnimationFrame
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                setMousePos({ x, y });
                // We could also adjust the scene rotation for a 3D feel
                if (globeEl.current) {
                    const scene = globeEl.current.scene();
                    if (scene) {
                        // Very subtle 3D tilt based on mouse
                        scene.rotation.x = y * 0.1;
                        scene.rotation.y = x * 0.1;
                    }
                }
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            opacity: 0.5,
            overflow: 'hidden',
            pointerEvents: 'none',
            transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
            transition: 'transform 0.1s ease-out'
        }}>
            <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                arcsData={arcsData}
                arcColor="color"
                arcDashLength={0.4}
                arcDashGap={4}
                arcDashInitialGap={() => Math.random() * 5}
                arcDashAnimateTime={2000}
                ringsData={ringsData}
                ringColor="color"
                ringMaxRadius="maxR"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"
                backgroundColor="rgba(0,0,0,0)"
                width={dimensions.width + 40} /* Add buffer so movement doesn't show edges */
                height={dimensions.height + 40}
                atmosphereColor="#00f0ff"
                atmosphereAltitude={0.15}
            />
        </div>
    );
};

export default BackgroundGlobe;
