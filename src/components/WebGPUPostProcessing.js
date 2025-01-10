import * as THREE from "three/webgpu";
import {
  pass,
  mrt,
  output,
  transformedNormalView,
  metalness,
  blendColor,
  depth,
} from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { ssr } from "three/addons/tsl/display/SSRNode.js";
import { smaa } from "three/addons/tsl/display/SMAANode.js";
import { ao } from "three/addons/tsl/display/GTAONode.js";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export function WebGPUPostProcessing({ strength = 2.5, radius = 0.5 }) {
  const { gl: renderer, scene, camera, size } = useThree();
  const postProcessingRef = useRef(null);

  useEffect(() => {
    if (!renderer || !scene || !camera) return;

    // Create post-processing setup with specific filters
    const scenePass = pass(scene, camera, {
      magFilter: THREE.NearestFilter,
      minFilter: THREE.NearestFilter,
    });

    // Setup Multiple Render Targets (MRT)
    scenePass.setMRT(
      mrt({
        output: output,
        normal: transformedNormalView,
        metalness: metalness,
        depth: depth,
      })
    );

    // Get texture nodes
    const scenePassColor = scenePass.getTextureNode("output");
    const scenePassNormal = scenePass.getTextureNode("normal");
    const scenePassDepth = scenePass.getTextureNode("depth");
    const scenePassMetalness = scenePass.getTextureNode("metalness");

    // Create SSR pass
    const ssrPass = ssr(
      scenePassColor,
      scenePassDepth,
      scenePassNormal,
      scenePassMetalness,
      camera
    );
    ssrPass.resolutionScale = 0.5;
    ssrPass.maxDistance.value = 2;
    ssrPass.opacity.value = 0.6;
    ssrPass.thickness.value = 0.025;

    // Create bloom pass
    const bloomPass = bloom(scenePassColor, strength, radius);

    // Create AO pass
    const aoPass = ao(scenePassDepth, scenePassNormal, camera);
    aoPass.resolutionScale = 1;
    const blendPassAO = aoPass.getTextureNode().mul(scenePassColor);

    aoPass.distanceExponent.value = 1;
    aoPass.distanceFallOff.value = 0.2;
    aoPass.radius.value = 0.4;
    aoPass.scale.value = 15;
    aoPass.resolutionScale = 1;
    aoPass.thickness.value = 0.5;

    // Blend SSR over beauty with SMAA
    const outputNode = smaa(blendColor(scenePassColor, ssrPass))
      .add(blendPassAO)
      .add(bloomPass);

    // Setup post-processing
    const postProcessing = new THREE.PostProcessing(renderer);
    postProcessing.outputNode = outputNode;
    postProcessingRef.current = postProcessing;

    // Handle window resize

    if (postProcessingRef.current.setSize) {
      postProcessingRef.current.setSize(size.width, size.height);
      postProcessingRef.current.needsUpdate = true;
    }

    return () => {
      postProcessingRef.current = null;
    };
  }, [renderer, scene, camera, size, strength, radius]);

  useFrame(({ gl, scene, camera }) => {
    if (postProcessingRef.current) {
      gl.clear();
      postProcessingRef.current.render();
    }
  }, 1);

  return null;
}
