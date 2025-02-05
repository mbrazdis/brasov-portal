'use client'
import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import Stats from 'three/addons/libs/stats.module.js';
import Image  from "next/image";
import debounce from "lodash.debounce";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { gsap } from "gsap";

const GrayscaleShader = {
    uniforms: {
        "tDiffuse": { value: null },
        "amount": { value: 1.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float amount;
        varying vec2 vUv;
        
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            float orange = dot(color.rgb, vec3(0.8, 0.34, 0.2)); 
            gl_FragColor = mix(color, vec4(vec3(orange), color.a), amount);
        }
    `
};

const BrasovSquare: React.FC = () => {
    const modelRef = useRef<THREE.Object3D | null>(null);
    const selectedObjectRef = useRef<THREE.Object3D | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const infoContainerRef = useRef<HTMLDivElement>(null);
    const buildingDetailsRef = useRef<HTMLDivElement>(null);
    const [buildingDetails, setBuildingDetails] = useState<{ name: string, description: string, imageUrl: string } | null>(null);

    useEffect(() => {

        if (typeof window === 'undefined') {
            return;
        }

        const stats = new Stats();
        stats.dom.style.opacity = "0";

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ReinhardToneMapping;

        const container = containerRef.current;
        if (container) {
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.overflow = 'hidden';
            container.append(stats.dom);
            container.appendChild(renderer.domElement);
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xeaeaea);
        scene.fog = new THREE.Fog(0xeaeaea, 20, 100);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(8.0, 10.0, -20.0);

        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambient);

        const directional = new THREE.DirectionalLight(0xffffff, 1);
        directional.castShadow = true;
        scene.add(directional);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 5;
        controls.maxDistance = 50;
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.panSpeed = 4;
        controls.enableDamping = true;

        const gltfLoader = new GLTFLoader();
        gltfLoader.load('models/gltf/piata_sfatului.glb', (gltf) => {
            const model = gltf.scene;
            modelRef.current = model;
            model.position.set(0, -0.95, 0);
            model.scale.set(0.19, 0.19, 0.19);
            scene.add(model);
        });

        const renderPass = new RenderPass(scene, camera);
        const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
        outlinePass.edgeStrength = 10.0;
        outlinePass.edgeGlow = 1.5;
        outlinePass.edgeThickness = 5.0;
        outlinePass.pulsePeriod = 1;
        outlinePass.visibleEdgeColor.set('#ff0000');
        outlinePass.hiddenEdgeColor.set('#ff0f05');

        const grayscalePass = new ShaderPass(GrayscaleShader);

        const outputComposer = new EffectComposer(renderer);
        outputComposer.addPass(renderPass);
        outputComposer.addPass(outlinePass);
        outputComposer.addPass(grayscalePass);

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        const highlightOnIntersection = debounce(() => {
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
            selectedObjectRef.current = intersects.length > 0 ? intersects[0].object.parent : null;
            outlinePass.selectedObjects = selectedObjectRef.current?.name.startsWith('Building_') ? [selectedObjectRef.current] : [];
        }, 50);

        const onPointerMove = (event: MouseEvent) => {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
            highlightOnIntersection();
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
                        x: -8.57, y: 0.84, z: 6.08,
                        duration: 2,
                        ease: "power3.inOut"
                    });

                    gsap.to(camera.position, {
                        x: -10.43, y: 2.63, z: 18.04,
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
                        x: -26.29, y: 5.42, z: 24.31,
                        duration: 2,
                        ease: "power3.inOut"
                    });

                    gsap.to(camera.position, {
                        x: -51.11, y: 10.72, z: 14.32,
                        duration: 2,
                        ease: "power3.inOut",
                        onUpdate: () => {
                            controls.update()
                        },
                    });
                }
            }
        };


        const onKeyUp = (event: KeyboardEvent) => {
            if (event.key === '1') {
                stats.dom.style.opacity = stats.dom.style.opacity === "0" ? "0.9" : "0";
            }

            if (event.key === '2') {
                grayscalePass.uniforms.amount.value = grayscalePass.uniforms.amount.value === 1.0 ? 0.0 : 1.0;
            }

            if (event.key === '3') {
                infoContainerRef.current!.style.opacity = infoContainerRef.current!.style.opacity === "0" ? "1" : "0";
            }
        }

        const renderScene = (): void => {

            if (camera.position.y < 0) {
                camera.position.y = 0;
            }

            directional.position.set(camera.position.x, camera.position.y, camera.position.z);

            outputComposer.render();

            stats.update();

            infoContainerRef.current!.innerText = `Position: x: ${camera.position.x.toFixed(2)}, y: ${camera.position.y.toFixed(2)}, z: ${camera.position.z.toFixed(2)}
                Target: x: ${controls.target.x.toFixed(2)}, y: ${controls.target.y.toFixed(2)}, z: ${controls.target.z.toFixed(2)}
                Mouse: x: ${pointer.x.toFixed(2)}, y: ${pointer.y.toFixed(2)}
                Intersect: ${selectedObjectRef.current?.name}
                `;
        };

        renderer.setAnimationLoop(renderScene);
        window.addEventListener('keyup', onKeyUp);
        renderer.domElement.addEventListener('pointermove', onPointerMove);
        renderer.domElement.addEventListener('click', onClick);

        const onWindowResize = () => {
            if (container) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        }

        window.addEventListener('resize', onWindowResize);

        return () => {
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener('resize', onWindowResize);
            renderer.dispose();
            controls.dispose();
            renderer.domElement.removeEventListener('pointermove', onPointerMove);
            renderer.domElement.removeEventListener('click', onClick);

            container!.removeChild(renderer.domElement);
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
                    width: '45%',
                    maxWidth: '800px',
                    zIndex: 10
                }}>
                    <h2 style={{ color: 'black' }}>{buildingDetails.name}</h2>
                    <Image src={buildingDetails.imageUrl} alt={buildingDetails.name} width={800} height={450} style={{ borderRadius: '5px' }} />
                    <p style={{ color: 'black', marginTop: '10px' }}>{buildingDetails.description}</p>
                </div>
            )}

            <div ref={infoContainerRef} style={{ position: 'absolute', top: '600px', left: '10px', color: 'black', backgroundColor: 'white', padding: '5px', borderRadius: '5px', opacity: "0" }} />
        </div>
    );
}

export default BrasovSquare;