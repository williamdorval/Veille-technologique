'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EscalierMesh } from './EscalierMesh';
import { ResultatCalcul, EntreeFormulaire } from '@/lib/escaliers/types';

interface Props {
  resultat: ResultatCalcul;
  entree: EntreeFormulaire;
}

export function EscalierScene({ resultat, entree }: Props) {
  return (
    <Canvas
      camera={{ position: [3, 2, 4], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <Environment preset="city" />
      <EscalierMesh
        nombreMarches={resultat.nombreMarches}
        hauteurContremarche={resultat.hauteurContremarche}
        giron={resultat.giron}
        largeur={entree.largeur}
        materiauLimon={entree.materiauLimon}
        typeMarche={entree.typeMarche}
        avecContremarches={entree.contremargesFermees}
      />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <gridHelper args={[10, 10, '#888888', '#cccccc']} />
    </Canvas>
  );
}
