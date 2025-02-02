'use client'

import * as THREE from "three";

import React, { useRef, useEffect } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

const BrasovSquare: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const coordinatesRef = useRef<HTMLDivElement>(null);
    const modelRef = useRef<THREE.Object3D | null>(null);
    
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(2.20, 3.61, -7.50);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        scene.fog = new THREE.Fog(0xffffff, 0.02, 50);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        const container = containerRef.current;
        if (container) {
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.overflow = 'hidden';
            container.appendChild(renderer.domElement);
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 1;
        controls.maxDistance = 550;

        const gltfLoader = new GLTFLoader();

        gltfLoader.load('models/gltf/piata_sfatului.glb', (gltf) => {
            const model = gltf.scene;
            modelRef.current = model;
            model.position.set(0, -0.95, 0);
            model.scale.set(0.1, 0.1, 0.1);
            scene.add(model);
        });

        const renderScene = () => {
            renderer.render(scene, camera);
            if (coordinatesRef.current) {
                coordinatesRef.current.innerText = `x: ${camera.position.x.toFixed(2)}, y: ${camera.position.y.toFixed(2)}, z: ${camera.position.z.toFixed(2)}`;
            }
        };

        renderer.setAnimationLoop(renderScene);

        const onWindowResize = () => {
            if (container) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        }

        window.addEventListener('resize', onWindowResize);

        return () => {
            window.removeEventListener('resize', onWindowResize);
            renderer.dispose();
            controls.dispose();
            if (container) {
                container.removeChild(renderer.domElement);
            }
        };

    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            <div ref={coordinatesRef} style={{ position: 'absolute', top: '10px', left: '10px', color: 'black', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }} />
        </div>
    );
}

export default BrasovSquare;