import * as THREE from "three";

export interface Materials {
  hovered: THREE.MeshBasicMaterial;
  active: THREE.MeshBasicMaterial;
  inactive: THREE.MeshBasicMaterial;
  worldPlane: THREE.ShaderMaterial;
  worldCylinder: THREE.ShaderMaterial;
}

export const createMaterials = (): Materials => {
  const hovered = new THREE.MeshBasicMaterial({ color: "white" });
  const active = new THREE.MeshBasicMaterial({ color: "hotpink" });
  const inactive = new THREE.MeshBasicMaterial({ color: "red" });
  const worldPlane = new THREE.ShaderMaterial({
    vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying float scale;
            varying vec3 vNormal;

            void main() {
                vUv = uv;
                vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                scale = modelMatrix[0][0];
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                // Normal in camera space
                vNormal = normalize(normalMatrix * normal).rgb;
            }
        `,
    fragmentShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying float scale;
            varying vec3 vNormal;

            

            float coordToLine(float coord, float widthFactor) {
                float LINE_WIDTH = widthFactor * scale;
                float base = abs(0.5 - mod(coord, 1.0)) * 2.0;
                return clamp((base - 1.0 + LINE_WIDTH) / LINE_WIDTH, 0.0, 1.0);
            }

            void main() {
                vec2 uv = (vUv.xy - vec2(0.5, 0.5)) * 2.0;

                float lines1 = coordToLine(vPosition.x, 0.01) + coordToLine(vPosition.z, 0.01);
                float lines10 = coordToLine(vPosition.x / 10.0, 0.001) + coordToLine(vPosition.z / 10.0, 0.001);
                float radius = 1.0 - length((vUv.xy - vec2(0.5, 0.5)) * 2.0);


                vec3 viewNormal = normalize(vec3(0.0, 0.0, 1.0));
                float facing = dot(viewNormal, vNormal);

                float outBright = 0.0;
                outBright += radius * 0.25;
                outBright += (lines1 * 0.5 + lines10) * radius * 0.25;
                outBright *= pow(abs(facing), 0.5);
                
                vec4 col = uv.x > 0.0 && abs(uv.y) < 0.01 ? vec4(0.5, 0.5, 1.0, outBright * 2.0) : vec4(vec3(1), outBright);

                gl_FragColor = col;
            }
        `,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
  });
  const worldCylinder = new THREE.ShaderMaterial({
    vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying float scale;
            varying vec3 vNormal;

            void main() {
                vUv = uv;
                vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                scale = modelMatrix[1][1];
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                // Normal in camera space
                vNormal = normalize(normalMatrix * normal).rgb;
            }
        `,
    fragmentShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying float scale;
            varying vec3 vNormal;

            

            float coordToLine(float coord, float widthFactor) {
                float LINE_WIDTH = widthFactor * scale;
                float base = abs(0.5 - mod(coord, 1.0)) * 2.0;
                return clamp((base - 1.0 + LINE_WIDTH) / LINE_WIDTH, 0.0, 1.0);
            }

            void main() {
                
                vec3 viewNormal = normalize(vec3(0.0, 0.0, 1.0));
                float facing = dot(viewNormal, vNormal);
                float edge = 1.0 - abs(vPosition.y / scale * 100.0);
                float outBright = 0.0;
                outBright += edge;
                outBright *= facing > 0.0 ? 0.8 : 0.2;
                outBright *= pow(abs(facing), 2.0);

                gl_FragColor = vec4(vec3(1.0), outBright);
            }
        `,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
  });

  return { hovered, active, inactive, worldPlane, worldCylinder };
};
