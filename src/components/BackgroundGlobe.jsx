import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

const BackgroundGlobe = () => {
    const globeEl = useRef();
    const [arcsData, setArcsData] = useState([]);
    const [ringsData, setRingsData] = useState([]);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Target rotation based on mouse
    const targetRotation = useRef({ x: 0, y: 0 });
    // Current rotation for smooth interpolation
    const currentRotation = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);

        // Data generation
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
            globeEl.current.pointOfView({ altitude: 2.2, lat: 20, lng: 77 });
        }

        // Mouse tracker
        const handleMouseMove = (e) => {
            // Map cursor position to a slight rotation angle (max 0.2 radians)
            const x = (e.clientX / window.innerWidth - 0.5) * 0.2;
            const y = (e.clientY / window.innerHeight - 0.5) * 0.2;
            targetRotation.current = { x, y };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Smooth animation loop using LERP
        let animationFrameId;
        const animate = () => {
            currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05;
            currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05;

            if (globeEl.current) {
                const scene = globeEl.current.scene();
                if (scene) {
                    scene.rotation.x = currentRotation.current.y;
                    // Note: We don't override scene.rotation.y completely because autoRotate uses it.
                    // Instead, we let autoRotate happen, and we just add a slight offset.
                    // But to avoid fighting OrbitControls, adjusting the camera or just X/Z tilt is safest.
                    scene.rotation.z = -currentRotation.current.x;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, opacity: 0.5, overflow: 'hidden', pointerEvents: 'none' }}>
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
                width={dimensions.width}
                height={dimensions.height}
                atmosphereColor="#00f0ff"
                atmosphereAltitude={0.15}
            />
        </div>
    );
};

export default BackgroundGlobe;
