'use client'
import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import debounce from "lodash.debounce";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
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

interface Attraction {
    id: string;
    name: string;
    map_name: string;
    description: string;
    location: string;
    camera_x: number;
    camera_y: number;
    camera_z: number;
    target_x: number;
    target_y: number;
    target_z: number;
    imagePath: string;
    isActive: boolean;
}

let interactibleAttractions: Attraction[] = [];

const BrasovSquare: React.FC = () => {
    const modelRef = useRef<THREE.Group | null>(null);
    const selectedObjectRef = useRef<THREE.Object3D | null>(null);
    const hoveredObjectRef = useRef<THREE.Object3D | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const buildingDetailsRef = useRef<HTMLDivElement>(null);
    const [buildingDetails, setBuildingDetails] = useState<{ name: string, description: string, imageUrl: string } | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    let atractionIndex: number = 0;
    let shouldRotate: boolean = true;

    useEffect(() => {

        if (typeof window === 'undefined') {
            return;
        }

        async function fetchAttractions() {
            try {
                const response = await fetch("/api/attractions");
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                interactibleAttractions = data;
                console.log("Interactible attractions:", interactibleAttractions);
            } catch (error) {
                console.log(error);
            }
        }

        fetchAttractions();

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);

        const container = containerRef.current;
        if (container) {
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.overflow = 'hidden';
            container.appendChild(renderer.domElement);
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xeaeaea, 50, 200);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(80, 30.0, -62.0);

        const ambient = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambient);

        const directional = new THREE.DirectionalLight(0xffffff, 0.8);
        scene.add(directional);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 0.1;
        controls.maxDistance = 100;
        controls.panSpeed = 3.5;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;

        const cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.setPath('textures/skybox/');
        const skyboxTexture = cubeTextureLoader.load([
            'right.png', 'left.png', 'top.png',
            'bottom.png', 'front.png', 'back.png']);
        scene.background = skyboxTexture;

        const onProgress = (xhr: ProgressEvent) => {
            if (xhr.lengthComputable) {
                const percentComplete = (xhr.loaded / xhr.total) * 100;
                setLoadingProgress(percentComplete);
            }
        };

        new MTLLoader()
            .setPath('models/')
            .load('brasov.mtl', (mtl) => {
                mtl.preload();

                new OBJLoader()
                    .setMaterials(mtl)
                    .setPath('models/')
                    .load('brasov.obj', (obj) => {
                        modelRef.current = obj;
                        obj.position.set(0, -0.95, 0);
                        obj.scale.set(0.2, 0.2, 0.2);
                        scene.add(obj);

                        setIsLoading(false);
                    },
                        onProgress,
                        (error) => {
                            console.error("Error loading OBJ model:", error);
                        }
                    );
            });

        const renderPass = new RenderPass(scene, camera);
        const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
        outlinePass.edgeStrength = 10.0;
        outlinePass.edgeGlow = 1.5;
        outlinePass.edgeThickness = 5.0;
        outlinePass.pulsePeriod = 1;
        outlinePass.visibleEdgeColor.set('#ffffff');
        outlinePass.hiddenEdgeColor.set('#ffffff');

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
            if (intersects.length > 0) {
                const target = intersects[0].object;

                hoveredObjectRef.current = target;

                const isSurface = target.name.startsWith("Surface");

                if (!isSurface) {
                    outlinePass.selectedObjects = target ? [hoveredObjectRef.current] : [];
                }
            }
        }, 1000);

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
                const attraction = interactibleAttractions.find(a => a.map_name === target.name);
                selectedObjectRef.current = attraction ? target : null;

                if (attraction) {
                    setBuildingDetails({
                        name: attraction.name,
                        description: attraction.description,
                        imageUrl: attraction.imagePath,
                    });

                    gsap.to(controls.target, {
                        x: attraction.target_x, y: attraction.target_y, z: attraction.target_z,
                        duration: 2, ease: "power3.inOut"
                    });

                    gsap.to(camera.position, {
                        x: attraction.camera_x, y: attraction.camera_y, z: attraction.camera_z,
                        duration: 2, ease: "power3.inOut",
                        onUpdate: () => {
                            controls.update()
                        },
                    });
                }
                else {
                    setBuildingDetails(null);
                }

                if (outlinePass.selectedObjects.length === 0) {
                    gsap.to(camera.position, {
                        z: camera.position.z + 2,
                        duration: 1,
                        ease: "power2.out",
                        onUpdate: () => { controls.update() },
                    });
                }
            }
        };

        const onKeyDown = (event: KeyboardEvent) => {

            if (event.key === 's') {

                const targetObject = scene.getObjectByName(interactibleAttractions[atractionIndex].name);

                if (targetObject) {
                    selectedObjectRef.current = targetObject;
                    outlinePass.selectedObjects = [targetObject]; 
                }

                setBuildingDetails({
                    name: interactibleAttractions[atractionIndex].name,
                    description: interactibleAttractions[atractionIndex].description,
                    imageUrl: interactibleAttractions[atractionIndex].imagePath,
                });

                gsap.to(controls.target, {
                    x: interactibleAttractions[atractionIndex].target_x, y: interactibleAttractions[atractionIndex].target_y, z: interactibleAttractions[atractionIndex].target_z,
                    duration: 2, ease: "power3.inOut"
                });

                gsap.to(camera.position, {
                    x: interactibleAttractions[atractionIndex].camera_x, y: interactibleAttractions[atractionIndex].camera_y, z: interactibleAttractions[atractionIndex].camera_z,
                    duration: 2, ease: "power3.inOut",
                    onUpdate: () => {
                        controls.update()
                    },
                });

                atractionIndex++;

                if (atractionIndex >= interactibleAttractions.length) {
                    atractionIndex = 0;
                }
            }
        }

        const renderScene = (): void => {

            if (shouldRotate) {
                camera.rotateY(0.01);
                controls.update();
            }

            outputComposer.render();
        };

        renderer.setAnimationLoop(renderScene);
        window.addEventListener('keydown', onKeyDown);
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
            window.removeEventListener('keydown', onKeyDown);
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
                    width: '45%',
                    maxWidth: '800px',
                    zIndex: 10,
                    opacity: 1,
                }}>
                    <h2 style={{ color: 'black' }}>{buildingDetails.name}</h2>
                    <Image src={buildingDetails.imageUrl} alt={buildingDetails.name} width={800} height={450} style={{ borderRadius: '5px' }} />
                    <p style={{ color: 'black', marginTop: '10px' }}>{buildingDetails.description}</p>
                </div>
            )}

            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'black', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', fontSize: '20px', zIndex: 1000
                }}>
                    <p>Loading... {loadingProgress.toFixed(0)}%</p>
                </div>
            )}

        </div>
    );
}

export default BrasovSquare;