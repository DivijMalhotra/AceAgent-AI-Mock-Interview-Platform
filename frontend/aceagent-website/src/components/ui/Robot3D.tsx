'use client';

import { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Clone, useGLTF, useAnimations, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useLoadingStore } from '@/lib/loadingStore';

function fixVisibility(root: THREE.Object3D) {
  root.traverse((o) => {
    o.visible = true;
    if (!(o as THREE.Mesh).isMesh) return;
    const mesh = o as THREE.Mesh;
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.visible = true;
    const mats = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];
    mats.forEach((mat) => {
      if (!mat) return;
      mat.transparent = false;
      mat.opacity = 1;
      mat.visible = true;
      mat.depthWrite = true;
      mat.depthTest = true;
      mat.side = THREE.FrontSide;
      if (mat instanceof THREE.MeshStandardMaterial) {
        mat.envMapIntensity = 2.5;
        mat.needsUpdate = true;
      }
    });
  });
}

function OrbitRing({
  radius,
  speed,
  color,
  tilt,
}: {
  radius: number;
  speed: number;
  color: string;
  tilt: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.012, 16, 120]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

function GlowRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z += 0.005;
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      1.0 + Math.sin(s.clock.elapsedTime * 2) * 0.4;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
      <ringGeometry args={[0.8, 1.05, 64]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#7c3aed"
        emissiveIntensity={1.2}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function PlatformDisc() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.12, 0]}>
      <circleGeometry args={[1.5, 64]} />
      <meshStandardMaterial
        color="#5b21b6"
        emissive="#7c3aed"
        emissiveIntensity={0.3}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const N = 40;
  const pos = useMemo(() => {
    const p = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = 1.2 + (i % 4) * 0.2;
      p[i * 3] = Math.cos(a) * r;
      p[i * 3 + 1] = -1.0 + (i % 5) * 0.35;
      p[i * 3 + 2] = Math.sin(a) * r;
    }
    return p;
  }, []);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.07;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#a855f7"
        size={0.04}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function CursorRotator({
  children,
  mouseX,
  mouseY,
}: {
  children: React.ReactNode;
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Group>(null);
  const rotX = useRef(0);
  const rotY = useRef(0);
  useFrame(() => {
    if (!ref.current) return;
    rotY.current += (mouseX.current * 0.7 - rotY.current) * 0.08;
    rotX.current += (-mouseY.current * 0.35 - rotX.current) * 0.08;
    ref.current.rotation.y = rotY.current;
    ref.current.rotation.x = rotX.current;
  });
  return <group ref={ref}>{children}</group>;
}

/* ── Robot model — signals store when loaded ── */
function RobotModel({
  scale,
  mouseX,
  mouseY,
}: {
  scale: number;
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/robot.glb');
  const { actions, names } = useAnimations(animations, group);
  const setRobotLoaded = useLoadingStore((s) => s.setRobotLoaded);

  useMemo(() => {
    fixVisibility(scene);
  }, [scene]);

  /* Signal that the robot is fully loaded */
  useEffect(() => {
    setRobotLoaded();
  }, [setRobotLoaded]);

  useEffect(() => {
    if (names.length > 0) {
      const a = actions[names[0]];
      if (a) {
        a.reset().fadeIn(0.4).play();
        a.setLoop(THREE.LoopRepeat, Infinity);
      }
    }
    return () => {
      names.forEach((n) => {
        try {
          actions[n]?.stop();
        } catch (_) {}
      });
    };
  }, [actions, names]);

  return (
    <CursorRotator mouseX={mouseX} mouseY={mouseY}>
      <group ref={group} scale={scale} position={[0, 0, 0]}>
        <Clone object={scene} />
      </group>
    </CursorRotator>
  );
}

function Scene({
  scale,
  showRings,
  mouseX,
  mouseY,
}: {
  scale: number;
  showRings: boolean;
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
}) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 4, 5]} intensity={3} castShadow />
      <directionalLight position={[-3, 2, 3]} intensity={1.5} />
      <directionalLight position={[0, 3, -3]} intensity={1} />
      <pointLight
        position={[0, 2, 4]}
        color="#ffffff"
        intensity={4}
        distance={20}
      />
      <pointLight
        position={[2, 1, 3]}
        color="#c4b5fd"
        intensity={2}
        distance={12}
      />
      <pointLight
        position={[-2, 1, 3]}
        color="#67e8f9"
        intensity={2}
        distance={12}
      />
      <Environment preset="city" />
      <RobotModel scale={scale} mouseX={mouseX} mouseY={mouseY} />
      {showRings && (
        <>
          <OrbitRing
            radius={1.5}
            speed={0.008}
            color="#7c3aed"
            tilt={Math.PI / 6}
          />
          <OrbitRing
            radius={1.9}
            speed={-0.005}
            color="#06b6d4"
            tilt={Math.PI / 3}
          />
          <OrbitRing
            radius={2.3}
            speed={0.004}
            color="#ec4899"
            tilt={Math.PI / 2.5}
          />
        </>
      )}
      <GlowRing />
      <PlatformDisc />
      <Particles />
    </>
  );
}

export interface Robot3DProps {
  height?: number;
  scale?: number;
  autoRotate?: boolean;
  showRings?: boolean;
  className?: string;
  fov?: number;
  fillParent?: boolean;
  offsetX?: number;
}

export default function Robot3D({
  height = 500,
  scale = 1.2,
  showRings = true,
  className = '',
  fov = 50,
  fillParent = false,
}: Robot3DProps) {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <div
      className={className}
      style={
        fillParent
          ? { position: 'absolute', inset: 0 }
          : { width: '100%', height, position: 'relative' }
      }
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: 'transparent',
        }}
      >
        <Suspense fallback={null}>
          <Scene
            scale={scale}
            showRings={showRings}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/robot.glb');