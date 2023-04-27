/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Surface } from "gl-react-dom";
import { Shaders, Node, GLSL } from "gl-react";

const shaders = Shaders.create({
  mandelbrot: {
    frag: GLSL`
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_zoomCenter;
uniform float u_zoomSize;
uniform int u_maxIterations;

uniform vec3 u_p1;
uniform vec3 u_p2;
uniform vec3 u_p3;
uniform vec3 u_p4;

uniform vec2 u_julia_c;

vec2 f(vec2 x, vec2 c) {
  return mat2(x,-x.y,x.x)*x + c;
}

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 z = u_zoomCenter + (uv * 4.0 - vec2(2.0)) * (u_zoomSize / 4.0);
  vec2 c = u_julia_c;
  bool escaped = false;
  int iterations = 0;    
  for (int i = 0; i < 10000; i++) {
    if (i > u_maxIterations) break;
    iterations = i;
    z = f(z, c);
    if (length(z) > 2.0) {
      escaped = true;
      break;
    }
  }
  gl_FragColor = escaped ? vec4(palette(float(iterations)/float(u_maxIterations), u_p1,u_p2, u_p3, u_p4),1.0) : vec4(vec3(0.85, 0.99, 1.0), 1.0);
}
`,
  },
});

let colorPalettes = [
  {
    p1: [0.5, 0.5, 0.5],
    p2: [0.5, 0.5, 0.5],
    p3: [1.0, 1.0, 1.0],
    p4: [0.0, 0.33, 0.67],
  },
  {
    p1: [0.5, 0.5, 0.5],
    p2: [0.5, 0.5, 0.5],
    p3: [1.0, 1.0, 1.0],
    p4: [0.0, 0.1, 0.2],
  },
  {
    p1: [0.5, 0.5, 0.5],
    p2: [0.5, 0.5, 0.5],
    p3: [1.0, 1.0, 1.0],
    p4: [0.3, 0.2, 0.2],
  },
  {
    p1: [0.5, 0.5, 0.5],
    p2: [0.5, 0.5, 0.5],
    p3: [1.0, 0.7, 0.4],
    p4: [0.8, 0.9, 0.3],
  },
  {
    p1: [0.5, 0.5, 0.5],
    p2: [0.5, 0.5, 0.5],
    p3: [0.0, 0.15, 0.2],
    p4: [2.0, 1.0, 0.0],
  },
  {
    p1: [0.5, 0.5, 0.5],
    p2: [0.5, 0.5, 0.5],
    p3: [0.5, 0.2, 0.25],
    p4: [2.0, 1.0, 0.0],
  },
  {
    p1: [0.8, 0.5, 0.4],
    p2: [0.2, 0.4, 0.2],
    p3: [2.0, 1.0, 1.0],
    p4: [0.0, 0.25, 0.25],
  },
];

const JuliaSet = ({
  width,
  height,
  config: { colorPaletteIndex, julia_c: u_julia_c },
}) => {
  const surfaceRef = useRef(null);

  const [zoomCenter, setZoomCenter] = useState([0.0, 0.0]);
  const [targetZoomCenter, setTargetZoomCenter] = useState([0.0, 0.0]);
  const [zoomSize, setZoomSize] = useState(4.0);
  const [stopZooming, setStopZooming] = useState(true);
  const [zoomFactor, setZoomFactor] = useState(1.0);
  const [maxIterations, setMaxIterations] = useState(125);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const animateZoom = () => {
      console.log("l");
      if (!stopZooming) {
        // setMaxIterations((maxIterations) => Math.max(maxIterations - 10, 50));

        setZoomSize((zoomSize) => zoomSize * zoomFactor);

        setZoomCenter((zoomCenter) => [
          zoomCenter[0] + 0.1 * (targetZoomCenter[0] - zoomCenter[0]),
          zoomCenter[1] + 0.1 * (targetZoomCenter[1] - zoomCenter[1]),
        ]);
      }
    };
    if (!stopZooming) {
      requestAnimationFrame(animateZoom);
    }
    // } else if (maxIterations < 500) {
    //   setMaxIterations((maxIterations) => Math.min(maxIterations + 10, 500));
    //   requestAnimationFrame(animateZoom);
    // }
  }, [stopZooming]);

  const handleZoom = (event) => {
    console.log(event);
    const { x, y } = event.nativeEvent;
    setZoomFactor(event.button == 0 ? 0.9 : 1.1);
    setFrame((frame) => frame + 1);
    setTargetZoomCenter([
      zoomCenter[0] - zoomSize / 2 + (x / width) * zoomSize,
      zoomCenter[1] + zoomSize / 2 - (y / height) * zoomSize,
    ]);
    setStopZooming(false);
  };

  const handleScrollZoom = (event) => {
    console.log(event.nativeEvent);
    const { x, y } = event.nativeEvent;
    setZoomFactor(event.deltaY > 0 ? 1.1 : 0.9);
    setTargetZoomCenter([
      zoomCenter[0] - zoomSize / 2 + (x / width) * zoomSize,
      zoomCenter[1] + zoomSize / 2 - (y / height) * zoomSize,
    ]);
    setStopZooming(false);
    setTimeout(() => {
      setStopZooming(true);
    }, 100);
  };

  console.log(u_julia_c);
  return (
    <Surface
      ref={surfaceRef}
      width={width}
      height={height}
      onMouseDown={handleZoom}
      onMouseUp={() => {
        console.log("up");
        setStopZooming(true);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        return false;
      }}
      //scroll move
      onWheel={handleScrollZoom}
    >
      <Node
        shader={shaders.mandelbrot}
        uniforms={{
          u_zoomCenter: zoomCenter,
          u_zoomSize: zoomSize,
          u_maxIterations: maxIterations,
          u_resolution: [800, 800],
          u_p1: colorPalettes[colorPaletteIndex].p1,
          u_p2: colorPalettes[colorPaletteIndex].p2,
          u_p3: colorPalettes[colorPaletteIndex].p3,
          u_p4: colorPalettes[colorPaletteIndex].p4,
          u_julia_c: u_julia_c,
        }}
      />
    </Surface>
  );
};

export default JuliaSet;
