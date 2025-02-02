'use client'

import * as THREE from "three";

import React, { useRef, useEffect, useState } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { gsap } from "gsap";

const BrasovSquare: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const infoContainerRef = useRef<HTMLDivElement>(null);
    const modelRef = useRef<THREE.Object3D | null>(null);
    const selectedObjectRef = useRef<THREE.Object3D | null>(null);
    const buildingDetailsRef = useRef<HTMLDivElement>(null);
    const [buildingDetails, setBuildingDetails] = useState<{ name: string, description: string, imageUrl: string } | null>(null);

    useEffect(() => {

        if (typeof window === 'undefined') {
            return;
        }

        const bloomLayer = new THREE.Layers();
        bloomLayer.set(1);

        const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
        const materials: { [key: string]: THREE.Material } = {};

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ReinhardToneMapping;

        const container = containerRef.current;
        if (container) {
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.overflow = 'hidden';
            container.appendChild(renderer.domElement);
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2b3036);
        scene.fog = new THREE.Fog(0x2b3036, 30, 100);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(8.0, 10.0, -20.0);
        camera.lookAt(0, 0, 0);

        const ambient = new THREE.AmbientLight(0xf3f4f2, 1);
        scene.add(ambient);

        const light = new THREE.DirectionalLight(0xf0f0f0, 0.05);
        light.castShadow = true;
        scene.add(light);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 5;
        controls.maxDistance = 50;
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.enableDamping = true;

        const gltfLoader = new GLTFLoader();
        gltfLoader.load('models/gltf/piata_sfatului.glb', (gltf) => {
            const model = gltf.scene;
            modelRef.current = model;
            model.position.set(0, -0.95, 0);
            model.scale.set(0.2, 0.2, 0.2);
            scene.add(model);
        });

        const renderPass = new RenderPass(scene, camera);

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0;
        bloomPass.strength = 0.001;
        bloomPass.radius = 0.001;

        const bloomComposer = new EffectComposer(renderer);
        bloomComposer.renderToScreen = false;
        bloomComposer.addPass(renderPass);
        bloomComposer.addPass(bloomPass);

        const vs = `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `;

        const fs = `
                    uniform sampler2D baseTexture;
                    uniform sampler2D bloomTexture;
                    varying vec2 vUv;
                    void main() {
                        gl_FragColor = texture2D(baseTexture, vUv) + texture2D(bloomTexture, vUv);
                    }
                `;

        const finalPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }
                },
                vertexShader: vs,
                fragmentShader: fs,
                defines: {}
            }), 'baseTexture'
        );
        finalPass.needsSwap = true;

        const outputPass = new OutputPass();

        const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
        outlinePass.edgeStrength = 10.0;
        outlinePass.edgeGlow = 0.5;
        outlinePass.edgeThickness = 1.0;
        outlinePass.pulsePeriod = 0;
        outlinePass.visibleEdgeColor.set('#ff0000');
        outlinePass.hiddenEdgeColor.set('#ff0f05');

        const finalComposer = new EffectComposer(renderer);
        finalComposer.addPass(renderPass);
        finalComposer.addPass(finalPass);
        finalComposer.addPass(outlinePass);
        finalComposer.addPass(outputPass);

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        const checkIntersection = () => {
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                selectedObjectRef.current = intersects[0].object.parent;

                if (selectedObjectRef.current?.name.startsWith('Building_')) {
                    outlinePass.selectedObjects = [selectedObjectRef.current];
                    selectedObjectRef.current?.layers.enable(1);
                } else {
                    outlinePass.selectedObjects = [];
                    selectedObjectRef.current?.layers.disable(1);
                }
            }
        }

        const onPointerMove = (event: MouseEvent) => {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

            checkIntersection();
        }


        const onClick = () => {
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                const target = intersects[0].object;

                if (target.name.startsWith("Building_Casa_Sfatului")) {

                    setBuildingDetails({
                        name: "Casa Sfatului",
                        description: `Short description about Casa Sfatului. This building is located in Brasov, Romania.`,
                        imageUrl: "/images/casa_sfatului.jpg"
                    });

                    gsap.to(controls.target, {
                        x: -9.24, y: 0.73, z: 5.99,
                        duration: 2,
                        ease: "power3.inOut"
                    });

                    gsap.to(camera.position, {
                        x: -11.43, y: 2.81, z: 19.88,
                        duration: 2,
                        ease: "power3.inOut",
                        onUpdate: () => {
                            controls.update()
                        },
                    });
                } else if (target.name.startsWith("Building_Biserica_N")) {

                    setBuildingDetails({
                        name: "Biserica Neagra",
                        description: `Short description about Biserica Neagra. This building is located in Brasov, Romania.`,
                        imageUrl: "/images/biserica_neagra.jpeg"
                    });

                    gsap.to(controls.target, {
                        x: -26.42, y: 5.08, z: 24.34,
                        duration: 2,
                        ease: "power3.inOut"
                    });

                    gsap.to(camera.position, {
                        x: -38.66, y: 9.37, z: 18.51,
                        duration: 2,
                        ease: "power3.inOut",
                        onUpdate: () => {
                            controls.update()
                        },
                    });
                }
            }
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'd') {
            }
        }

        renderer.domElement.addEventListener('keydown', onKeyDown);
        renderer.domElement.addEventListener('pointermove', onPointerMove);
        renderer.domElement.addEventListener('click', onClick);

        const darkenNonBloomed = (obj: THREE.Object3D) => {
            if (obj instanceof THREE.Mesh && bloomLayer.test(obj.layers) === false) {
                materials[obj.uuid] = obj.material;
                obj.material = darkMaterial;
            }
        }

        const restoreMaterial = (obj: THREE.Object3D) => {
            if (materials[obj.uuid]) {
                (obj as THREE.Mesh).material = materials[obj.uuid];
                delete materials[obj.uuid];
            }
        }

        const renderScene = (): void => {

            const time = Date.now() * 0.001;

            if (modelRef.current) {
                modelRef.current.rotation.y = time * 0.15 * 0;
            }

            if (camera.position.y < 0) {
                camera.position.y = 0;
            }

            light.position.set(camera.position.x, camera.position.y, camera.position.z);

            modelRef.current?.traverse(darkenNonBloomed);
            bloomComposer.render(time);
            modelRef.current?.traverse(restoreMaterial);

            finalComposer.render();

            if (infoContainerRef.current) {
                infoContainerRef.current.innerText = `Position: x: ${camera.position.x.toFixed(2)}, y: ${camera.position.y.toFixed(2)}, z: ${camera.position.z.toFixed(2)}
                Target: x: ${controls.target.x.toFixed(2)}, y: ${controls.target.y.toFixed(2)}, z: ${controls.target.z.toFixed(2)}
                Mouse: x: ${pointer.x.toFixed(2)}, y: ${pointer.y.toFixed(2)}
                Intersect: ${selectedObjectRef.current?.name}
                `;
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
            renderer.domElement.removeEventListener('click', onClick);

            if (container) {
                container.removeChild(renderer.domElement);
            }
        };

    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

            {/* Card with details about the selected building */}
            {buildingDetails && (
                <div ref={buildingDetailsRef} style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    width: '30%',
                    zIndex: 10
                }}>
                    <h2 style={{ color: 'black' }}>{buildingDetails.name}</h2>
                    <img src={buildingDetails.imageUrl} alt={buildingDetails.name} style={{ width: '100%', height: 'auto', borderRadius: '5px' }} />
                    <p style={{ color: 'black', marginTop: '10px' }}>{buildingDetails.description}</p>
                </div>
            )}

            {/* <div ref={infoContainerRef} style={{ position: 'absolute', top: '700px', left: '10px', color: 'black', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }} /> */}
        </div>
    );
}

export default BrasovSquare;