'use client'

import * as THREE from "three";

import React, { useRef, useEffect } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const BrasovSquare: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const infoContainerRef = useRef<HTMLDivElement>(null);
    const modelRef = useRef<THREE.Object3D | null>(null);
    const selectedObjectRef = useRef<THREE.Object3D | null>(null);

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

        const animateCamera = () => {

        }

        const onClick = () => {
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {

            }
            console.log(camera);
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

            animateCamera();

            if (camera.position.y < 0) {
                camera.position.y = 0;
            }

            light.position.set(camera.position.x, camera.position.y, camera.position.z);

            selectedObjectRef.current?.traverse(darkenNonBloomed);
            bloomComposer.render(time);
            selectedObjectRef.current?.traverse(restoreMaterial);

            finalComposer.render();

            if (infoContainerRef.current) {
                infoContainerRef.current.innerText = `Position: x: ${camera.position.x.toFixed(2)}, y: ${camera.position.y.toFixed(2)}, z: ${camera.position.z.toFixed(2)}
                Quaternion: x: ${camera.quaternion.x.toFixed(2)}, y: ${camera.quaternion.y.toFixed(2)}, z: ${camera.quaternion.z.toFixed(2)}, w: ${camera.quaternion.w.toFixed(2)};
                Rotation: x: ${camera.rotation.x.toFixed(2)}, y: ${camera.rotation.y.toFixed(2)}, z: ${camera.rotation.z.toFixed(2)}
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
            <div ref={infoContainerRef} style={{ position: 'absolute', top: '10px', left: '10px', color: 'black', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }} />
        </div>
    );
}

export default BrasovSquare;