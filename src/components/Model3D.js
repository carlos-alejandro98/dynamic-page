import { render } from '@testing-library/react';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const Model3D = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentRef = mountRef.current;
        const { clientWidth: width, clientHeight: height } = currentRef;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('black');
        const camera = new THREE.PerspectiveCamera(25, width / height, 0.01, 1000);
        scene.add(camera);
        camera.position.z = 6;
        camera.position.x = 6;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        currentRef.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x0f2c64 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.lookAt(cube.position);

        //Luz
        const ambientLight = new THREE.AmbientLight('yellow', 2);
        scene.add(ambientLight);

        //Color
        const pointLight = new THREE.PointLight('yellow', 15);
        pointLight.position.set(8, 8, 8);
        scene.add(pointLight);

        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            cube.rotation.y = elapsedTime;
            cube.rotation.x = elapsedTime;
            cube.position.y = Math.sin(elapsedTime);

            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        //Ajustar a pantalla
        const resize = () => {
            const updatedWidth = currentRef.clientWidth;
            const updatedHeight = currentRef.clientHeight;
            renderer.setSize(updatedWidth, updatedHeight);
            camera.aspect = updatedWidth / updatedHeight;
            camera.updateProjectionMatrix();
        }

        window.addEventListener('resize', resize);

        animate();

        return () => {
            currentRef.removeChild(renderer.domElement);
            window.removeEventListener('resize', resize);
        }
    }, []);

    return (
        <div ref={mountRef} style={{ width: '100%', height: '100vh' }}>
        </div>
    )
}

export default Model3D;
