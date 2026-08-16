import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

const BackgroundGlobe = () => {
    const globeEl = useRef();
    const containerRef = useRef();
    const [arcsData, setArcsData] = useState([]);
    const [ringsData, setRingsData] = useState([]);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    const targetPos = useRef({ x: 0, y: 0 });
    const currentPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);

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

        const handleMouseMove = (e) => {
            // Map cursor position to pixel offset (max offset 40px)
            const x = (e.clientX / window.innerWidth - 0.5) * 80;
            const y = (e.clientY / window.innerHeight - 0.5) * 80;
            targetPos.current = { x, y };
        };
        window.addEventListener('mousemove', handleMouseMove);

        let animationFrameId;
        const animate = () => {
            // LERP for buttery smooth follow
            currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.08;
            currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.08;

            if (containerRef.current) {
                containerRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
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
        <div ref={containerRef} style={{ position: 'fixed', top: -50, left: -50, width: 'calc(100vw + 100px)', height: 'calc(100vh + 100px)', zIndex: -1, opacity: 0.5, overflow: 'hidden', pointerEvents: 'none' }}>
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
                width={dimensions.width + 100}
                height={dimensions.height + 100}
                atmosphereColor="#00f0ff"
                atmosphereAltitude={0.15}
            />
        </div>
    );
};

export default BackgroundGlobe;
