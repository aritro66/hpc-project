import React from "react";
import Mandelbrot from "./components/Mandelbrot";
import JuliaSet from "./components/JuliaSet";
import ConfigPanel from "./components/ConfigPanel";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
const App = () => {
  const canvasRef = React.useRef(null);
  const [config, setConfig] = React.useState({
    colorPaletteIndex: 0,
    julia_c: [-0.624, 0.435],
  });

  return (
    <>
      <Router>
        <ConfigPanel config={config} setConfig={setConfig} />
        <div ref={canvasRef} className="full">
          <Switch>
            <Route exact path="/mandelbrot">
              <Mandelbrot
                config={config}
                width={canvasRef.current?.clientWidth || window.innerWidth}
                height={canvasRef.current?.clientHeight || window.innerHeight}
              />
            </Route>
            <Route path="/juliaset">
              <JuliaSet
                config={config}
                width={canvasRef.current?.clientWidth || window.innerWidth}
                height={canvasRef.current?.clientHeight || window.innerHeight}
              />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
};

export default App;
