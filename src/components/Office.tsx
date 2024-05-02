import {
  VRMSpringBoneJoint,
  VRMSpringBoneJointHelper,
  VRMSpringBoneManager,
} from "@pixiv/three-vrm";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

export const FLOOR_HEIGHT = 2.3;
export const NB_FLOORS = 3;

export function Office() {
  const GLTF = useGLTF("./models/woman.gltf");
  const three = useThree();
  const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
  const cgeometry = new THREE.SphereGeometry(0.05, 10);

  const material = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
  const { actions, names } = useAnimations(GLTF.animations, GLTF.scene);

  const cubeA = new THREE.Mesh(geometry, material);
  const cubeB = new THREE.Mesh(cgeometry, material);
  const cubeC = new THREE.Mesh(cgeometry, material);
  const cubeD = new THREE.Mesh(cgeometry, material);

  const [shouldReset, setShouldReset] = useState(true);
  // spring bones
  const springBoneManager = new VRMSpringBoneManager();

  useEffect(() => {
    three.scene.add(GLTF.scene);
    const scene = three.scene;
    const center = new THREE.Vector3();
    console.log(
      actions,
      names,
      GLTF,
      GLTF.nodes["Mesh019_2"],
      GLTF.nodes["Mesh019_2"].geometry.boundingBox.getCenter(center),
      center
    );
    actions[names[1]]?.reset().fadeIn(0.5).play();

    // objects
    // cubeA.name = "cubeA";
    // cubeA.position.set(0.0, 0.5, 0.0);
    // scene.add(cubeA);

    cubeB.name = "cubeB";
    cubeB.position.set(center.x, center.y, center.z);
    GLTF.scene.add(cubeB);

    cubeC.name = "cubeC";
    cubeC.position.set(0, -0.4, 0);
    cubeB.add(cubeC);

    cubeD.name = "cubeD";
    cubeD.position.set(0, -0.4, 0);
    cubeC.add(cubeD);
    // helpers
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const springBone = new VRMSpringBoneJoint(cubeB, cubeC, { hitRadius: 0.1 });
    springBoneManager.addSpringBone(springBone);
    const springBone2 = new VRMSpringBoneJoint(cubeC, cubeD, { hitRadius: 0.1 });
    springBoneManager.addSpringBone(springBone2);

    // helper
    const springBoneHelper = new VRMSpringBoneJointHelper(springBone);
    const springBoneHelper2 = new VRMSpringBoneJointHelper(springBone2);

    scene.add(springBoneHelper);
    scene.add(springBoneHelper2);

    // init spring bones
    springBoneManager.setInitState();

    // console.log(three, GLTF);
    return () => {
      scene.remove(cubeA);

      cubeA.remove(cubeB);

      cubeB.remove(cubeC);

      scene.remove(gridHelper);

      scene.remove(axesHelper);

      scene.remove(springBoneHelper);
    };
  }, [shouldReset]);
  useFrame((_, delta) => {
    // console.log(cubeA);
    // cubeA.position.x = Math.sin(Math.PI * _.clock.elapsedTime);
    // console.log(_, delta);
    if (shouldReset) {
      setShouldReset(false);
      springBoneManager.reset();
    }

    springBoneManager.update(delta);
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "a": // 按下 'A' 键
          GLTF.scene.position.x -= 0.1; // x 坐标减 1
          break;
        case "d": // 按下 'D' 键
          GLTF.scene.position.x += 0.1; // x 坐标加 1
          break;
        default:
          break;
      }
    };

    // 添加键盘按下事件监听器
    window.addEventListener("keydown", handleKeyDown);

    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldReset]);

  return <></>;
}

useGLTF.preload("./models/WawaOffice.glb");
