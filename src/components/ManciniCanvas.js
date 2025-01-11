import { Canvas, extend } from "@react-three/fiber";
import * as THREE from "three/webgpu";

extend(THREE);

export function ManciniCanvas({
  frameloop,
  quality,
  children,
  rendererRef,
  setFrameloop,
}) {
  return (
    <Canvas
      onCreated={(state) => {
        state.setSize(window.innerWidth, window.innerHeight);
      }}
      frameloop={frameloop}
      dpr={quality === "default" ? 1 : [1, 1.5]}
      camera={{
        position: [3.6, -0.4, 0],
        near: 0.1,
        far: 100,
        fov: 56,
        zoom: 0.5,
      }}
      shadows
      gl={(canvas) => {
        const renderer = new THREE.WebGPURenderer({
          canvas,
          powerPreference: "high-performance",
          antialias: false,
          alpha: false,
          stencil: false,
        });

        // Initialize WebGPU and store renderer reference
        renderer.init().then(() => setFrameloop("always"));
        rendererRef.current = renderer;
        return renderer;
      }}
    >
      {children}
    </Canvas>
  );
}