'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HouseConfig {
  position: { x: number; y: number; z: number };
  phaseOffset: number;
}

const ALL_HOUSES: HouseConfig[] = [
  { position: { x: -600, y: 180, z: -400 }, phaseOffset: 0 },
  { position: { x: 500, y: 120, z: -300 }, phaseOffset: 1.5 },
  { position: { x: -300, y: 240, z: 400 }, phaseOffset: 3.0 },
  { position: { x: 700, y: 150, z: 200 }, phaseOffset: 4.5 },
];

type Props = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurfaceWithHouses({ className, ...props }: Props) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const isMobile = window.innerWidth < 768;
    const SEPARATION = 150;
    const AMOUNTX = isMobile ? 20 : 40;
    const AMOUNTY = isMobile ? 30 : 60;
    const houses = isMobile ? ALL_HOUSES.slice(0, 2) : ALL_HOUSES;

    const isDark = theme === 'dark';
    const particleColor = isDark ? 0xc8c8c8 : 0x000000;
    const houseColor = isDark ? 0x8fa8cc : 0x1a3a5c;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Terrain de particules
    const positions: number[] = [];
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
        );
      }
    }
    const terrainGeo = new THREE.BufferGeometry();
    terrainGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const terrainMat = new THREE.PointsMaterial({ size: 8, color: particleColor, transparent: true, opacity: 0.8, sizeAttenuation: true });
    const terrain = new THREE.Points(terrainGeo, terrainMat);
    scene.add(terrain);

    // Maisons 3D
    const houseGroups: THREE.Group[] = houses.map(({ position }) => {
      const group = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ color: houseColor, wireframe: true });
      const body = new THREE.Mesh(new THREE.BoxGeometry(80, 80, 80), mat);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(55, 70, 4), mat);
      roof.position.y = 75;
      roof.rotation.y = Math.PI / 4;
      group.add(body, roof);
      group.position.set(position.x, position.y, position.z);
      scene.add(group);
      return group;
    });

    let count = 0;
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const posArr = terrainGeo.attributes.position.array as Float32Array;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          posArr[i * 3 + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      terrainGeo.attributes.position.needsUpdate = true;

      houseGroups.forEach((group, idx) => {
        group.rotation.y += 0.005;
        group.position.y = ALL_HOUSES[idx].position.y + Math.sin(count * 0.5 + ALL_HOUSES[idx].phaseOffset) * 20;
      });

      renderer.render(scene, camera);
      count += 0.1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', handleResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Points || obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute inset-0',
        prefersReducedMotion && 'bg-gradient-to-br from-construction-primaire/20 to-transparent',
        className
      )}
      {...props}
    />
  );
}

