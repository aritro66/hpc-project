/* eslint-disable react/prop-types */
import { Form, Card } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

const ConfigPanel = ({ config, setConfig }) => {
  return (
    //use react bootstrap to create controlled form for all config options
    <Card className="z-3 position-absolute p-1 m-2">
      <Card.Body>
        <Form>
          <Form.Group controlId="formBasicRange">
            <Form.Label>Color Palette</Form.Label>
            <Form.Control
              type="range"
              min="0"
              max="6"
              step="1"
              value={config.colorPaletteIndex}
              onChange={(e) =>
                setConfig({ ...config, colorPaletteIndex: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formBasicRange">
            <Form.Label>Julia Set C Value X</Form.Label>
            <Form.Control
              type="range"
              min="-1"
              max="1"
              step="0.001"
              value={config.julia_c[0]}
              onChange={(e) =>
                setConfig({
                  ...config,
                  julia_c: [parseFloat(e.target.value), config.julia_c[1]],
                })
              }
            />
          </Form.Group>
          <Form.Group controlId="formBasicRange">
            <Form.Label>Julia Set C Value Y</Form.Label>
            <Form.Control
              type="range"
              min="-1"
              max="1"
              step="0.001"
              value={config.julia_c[1]}
              onChange={(e) =>
                setConfig({
                  ...config,
                  julia_c: [config.julia_c[0], parseFloat(e.target.value)],
                })
              }
            />
          </Form.Group>
        </Form>
      </Card.Body>
      <NavLink
        to="/mandelbrot"
        style={(isActive) => ({
          color: isActive ? "green" : "blue",
        })}
      >
        Mandelbrot
      </NavLink>
      <NavLink
        to="/juliaset"
        style={(isActive) => ({
          color: isActive ? "green" : "blue",
        })}
      >
        JuliaSet
      </NavLink>
    </Card>
  );
};

export default ConfigPanel;
