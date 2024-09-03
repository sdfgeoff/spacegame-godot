import React from "react";
import * as THREE from "three";
import { Materials } from "./Materials";

export const WorldPlane = ({
  materials,
  scale,
}: {
  materials: Materials;
  scale: number;
}) => {
  const plane = React.useRef<THREE.Mesh>(null);
  const ring = React.useRef<THREE.Mesh>(null);

  React.useEffect(() => {
    if (plane.current && ring.current) {
      const width = scale;
      plane.current.scale.set(width, width, width);
      ring.current.scale.set(width, width, width);
    }
  }, [scale]);

  return (
    <>
      <mesh
        ref={plane}
        scale={1}
        rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
        material={materials.worldPlane}
      >
        <planeGeometry args={[2, 2]} />
      </mesh>
      <mesh ref={ring} scale={1} material={materials.worldCylinder}>
        <cylinderGeometry args={[1, 1, 0.1, 64]} />
      </mesh>
    </>
  );
};
