import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Office } from "./Office";

function Experience() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 2, 1]} />
      <OrbitControls enableZoom={true} />
      <ScrollControls pages={3} damping={0.25}>
        <Office />
      </ScrollControls>
    </>
  );
}

export default Experience;
