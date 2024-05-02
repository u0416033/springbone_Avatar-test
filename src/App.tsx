import "./App.css";
import Experience from "./components/Experience";
import { Canvas, useFrame } from "@react-three/fiber";
function App() {
  return (
    <Canvas camera={{ fov: 64, position: [2.3, 1.5, 2.3] }}>
      <Experience />
    </Canvas>
  );
}

export default App;
