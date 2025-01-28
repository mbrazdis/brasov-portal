'use client'

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const BrasovSquare: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const container = containerRef.current;
        if (container) {
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.overflow = 'hidden';
            container.appendChild(renderer.domElement);
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        camera.add(pointLight);
        scene.add(camera);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 1;
        controls.maxDistance = 10;

        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();

        mtlLoader.load('models/obj/map.obj.mtl', (materials) => {
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load('models/obj/map.obj', (object) => {
                object.position.y = -0.95;
                object.scale.setScalar(0.01);
                scene.add(object);
            });
        });

        const fetchPins = async () => {
            try {
                const response = await fetch('/api/pins');
                const pins = await response.json();
                pins.forEach((pin: { x: number, y: number, z: number }) => {
                    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
                    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                    const sphere = new THREE.Mesh(geometry, material);
                    sphere.position.set(pin.x, pin.y, pin.z); // Asumând că pin-urile au coordonate x, y, z
                    scene.add(sphere);
                });
            } catch (error) {
                console.error('Error fetching pins:', error);
            }
        };

        fetchPins();

        const renderScene = () => {
            renderer.render(scene, camera);
        }

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

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

export default BrasovSquare;