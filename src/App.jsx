import React from "react";
import Mandelbrot from "./components/Mandelbrot";
import JuliaSet from "./components/JuliaSet";
import ConfigPanel from "./components/ConfigPanel";
import "./App.css";

const App = () => {
  const canvasRef = React.useRef(null);
  const [config, setConfig] = React.useState({
    colorPaletteIndex: 0,
    julia_c: [-0.624, 0.435],
  });

  return (
    <>
      <ConfigPanel config={config} setConfig={setConfig} />
      <div ref={canvasRef} className="full">
        <JuliaSet
          config={config}
          width={canvasRef.current?.clientWidth || window.innerWidth}
          height={canvasRef.current?.clientHeight || window.innerHeight}
        />
      </div>
    </>
  );
};

export default App;
