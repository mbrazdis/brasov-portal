'use client'

import * as THREE from "three";

import React, { useRef, useEffect } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

const BrasovSquare: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const coordinatesRef = useRef<HTMLDivElement>(null);
    const mousePositionRef = useRef<HTMLDivElement>(null);
    const infoContainerRef = useRef<HTMLDivElement>(null);
    const modelRef = useRef<THREE.Object3D | null>(null);
    const selectedObjectRef = useRef<THREE.Object3D | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        scene.fog = new THREE.Fog(0xf0f0f0, 1, 100);
        scene.add(new THREE.AmbientLight(0x000000));

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(2.20, 3.61, -7.50);

        const renderer = new THREE.WebGLRenderer({ antialias: true });

        const directionalLight = new THREE.DirectionalLight(0x1f2428, 1);
        directionalLight.position.set(30, 10, -25);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const container = containerRef.current;
        if (container) {
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.overflow = 'hidden';
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 5;
        controls.maxDistance = 50;

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        const gltfLoader = new GLTFLoader();
        gltfLoader.load('models/gltf/piata_sfatului.glb', (gltf) => {
            const model = gltf.scene;
            modelRef.current = model;
            model.position.set(0, -0.95, 0);
            model.scale.set(0.1, 0.1, 0.1);
            scene.add(model);

            model.traverse((node) => {
                if (node instanceof THREE.Mesh && node.name === 'Building_Casa_Sfatului') {
                    console.log(node);
                }
            });
        });

        const onPointerMove = (event: MouseEvent) => {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
        }

        const onClick = () => {
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                selectedObjectRef.current = intersects[0].object.parent;
            }
        }

        renderer.domElement.addEventListener('pointermove', onPointerMove);
        renderer.domElement.addEventListener('click', onClick);

        const renderScene = (): void => {

            const time = Date.now() * 0.001;

            if (modelRef.current) {
                modelRef.current.rotation.y = time * 0.15 * 0;
            }

            renderer.render(scene, camera);

            if (coordinatesRef.current) {
                coordinatesRef.current.innerText = `x: ${camera.position.x.toFixed(2)}, y: ${camera.position.y.toFixed(2)}, z: ${camera.position.z.toFixed(2)}`;
            }

            if (mousePositionRef.current) {
                mousePositionRef.current.innerText = `x: ${pointer.x.toFixed(2)}, y: ${pointer.y.toFixed(2)}`;
            }

            if (infoContainerRef.current) {
                infoContainerRef.current.innerText = `Intersect: ${selectedObjectRef.current?.name}`;
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
            renderer.domElement.removeEventListener('pointermove', onPointerMove);

            if (container) {
                container.removeChild(renderer.domElement);
            }
        };

    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            <div ref={coordinatesRef} style={{ position: 'absolute', top: '10px', left: '10px', color: 'black', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }} />
            <div ref={mousePositionRef} style={{ position: 'absolute', top: '50px', left: '10px', color: 'black', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }} />
            <div ref={infoContainerRef} style={{ position: 'absolute', top: '90px', left: '10px', color: 'black', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }} />
        </div>
    );
}

export default BrasovSquare;