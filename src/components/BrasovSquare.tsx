'use client'

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

const BrasovSquare: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedObjectRef = useRef<THREE.Object3D | null>(null);

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

        mtlLoader.load('models/obj/piatasfatului.mtl', (materials) => {
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load('models/obj/piatasfatului.obj', (object) => {
                object.position.y = -0.95;
                object.scale.setScalar(0.1);
                scene.add(object);
            });
        });

        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
        composer.addPass(outlinePass);

        const effectFXAA = new ShaderPass(FXAAShader);
        effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        composer.addPass(effectFXAA);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseClick = (event: MouseEvent) => {
            if (!container) return;

            mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                const selectedObject = intersects[0].object;
                outlinePass.selectedObjects = [selectedObject];
                selectedObjectRef.current = selectedObject;
            } else {
                outlinePass.selectedObjects = [];
                selectedObjectRef.current = null;
            }
        };

        container?.addEventListener('click', onMouseClick);

        const fetchPins = async () => {
            try {
                const response = await fetch('/api/pins');
                const pins = await response.json();
                pins.forEach((pin: { x: number, y: number, z: number }) => {
                    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
                    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                    const sphere = new THREE.Mesh(geometry, material);
                    sphere.position.set(pin.x, pin.y, pin.z); 
                    scene.add(sphere);
                });
            } catch (error) {
                console.error('Error fetching pins:', error);
            }
        };

        fetchPins();

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('textures\skybox.png', () => {
            const shader = THREE.ShaderLib['cube'];
            shader.uniforms['tCube'].value = texture;

            const material = new THREE.ShaderMaterial({
                fragmentShader: shader.fragmentShader,
                vertexShader: shader.vertexShader,
                uniforms: shader.uniforms,
                depthWrite: false,
                side: THREE.BackSide
            });

            const skybox = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), material);
            scene.add(skybox);
        });

        const renderScene = () => {
            composer.render();
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

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

export default BrasovSquare;