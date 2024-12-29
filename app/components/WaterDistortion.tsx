import { useEffect, useRef, useState } from "react";
const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 vUv;

void main() {
    vUv = vec2(a_position.x, -a_position.y);
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
 precision mediump float;

varying vec2 vUv;
uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_scale;
uniform float u_blueish;
uniform float u_illumination;
uniform float u_surface_distortion;
uniform float u_water_distortion;

void main() {
    vec2 uv = vUv * 0.5 + 0.5;
    
    float time = u_time * 0.001;
    vec2 surface = vec2(
        sin(uv.y * 30.0 + time * 2.0) * u_surface_distortion,
        sin(uv.x * 30.0 - time * 2.0) * u_surface_distortion
    );

    vec2 water = vec2(
        sin(uv.y * 50.0 + time * 8.0) * u_water_distortion,
        sin(uv.x * 50.0 - time * 8.0) * u_water_distortion
    );

    vec2 distortedUV = uv + surface + water;
    vec4 color = texture2D(u_image_texture, distortedUV);
    color.rgb += vec3(0.1, 0.2, u_blueish);
    color.rgb += surface.x * u_illumination * 2.0;

    gl_FragColor = color;
}
`;

const WaterDistortion: React.FC<{img: string}> = ({img}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let gl: WebGLRenderingContext | null;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};
    let image: HTMLImageElement;

    const initShader = () => {
        const vsSource = vertexShaderSource;
        const fsSource = fragmentShaderSource;

      if (!vsSource || !fsSource) {
        console.error("Shader source not found");
        return null;
      }

      gl = canvasRef.current?.getContext("webgl") || canvasRef.current?.getContext("experimental-webgl");

      if (!gl) {
        alert("WebGL is not supported by your browser.");
        return null;
      }

      const createShader = (gl: WebGLRenderingContext, sourceCode: string, type: number): WebGLShader | null => {
        const shader = gl.createShader(type);
        if (!shader) return null;

        gl.shaderSource(shader, sourceCode);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
      const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);

      if (!vertexShader || !fragmentShader) return null;

      const createShaderProgram = (
        gl: WebGLRenderingContext,
        vertexShader: WebGLShader,
        fragmentShader: WebGLShader
      ): WebGLProgram | null => {
        const program = gl.createProgram();
        if (!program) return null;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
          return null;
        }
        return program;
      };

      const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
      if (!shaderProgram) return null;

      const getUniforms = (program: WebGLProgram): Record<string, WebGLUniformLocation | null> => {
        const uniforms: Record<string, WebGLUniformLocation | null> = {};
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
          const uniformInfo = gl.getActiveUniform(program, i);
          if (uniformInfo) {
            uniforms[uniformInfo.name] = gl.getUniformLocation(program, uniformInfo.name);
          }
        }
        return uniforms;
      };

      uniforms = getUniforms(shaderProgram);

      const vertices = new Float32Array([
        -1.0, -1.0,  // bottom left
         1.0, -1.0,  // bottom right
        -1.0,  1.0,  // top left
         1.0,  1.0   // top right
      ]);
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      gl.useProgram(shaderProgram);

      const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
      gl.enableVertexAttribArray(positionLocation);

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      return gl;
    };

    const updateUniforms = () => {
      if (!gl) return;
      gl.uniform1f(uniforms.u_blueish, 0.4);
      gl.uniform1f(uniforms.u_scale, 5);
      gl.uniform1f(uniforms.u_illumination, 0.3);
      gl.uniform1f(uniforms.u_surface_distortion, 0.1);
      gl.uniform1f(uniforms.u_water_distortion, 0.05);
    };

    const loadImage = (src: string) => {
      image = new Image();
      image.crossOrigin = "anonymous";
      image.src = src;
      image.onload = () => {
        if (!gl) return;
        const imageTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, imageTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(uniforms.u_image_texture, 0);
        resizeCanvas();
      };
    };

    const render = () => {
      if (!gl) return;
      const currentTime = performance.now();
      gl.uniform1f(uniforms.u_time, currentTime);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };

    const resizeCanvas = () => {
      if (!gl || !image || !canvasRef.current) return;
      const imgRatio = image.naturalWidth / image.naturalHeight;
      canvasRef.current.width = canvasRef.current.clientWidth;
      canvasRef.current.height = canvasRef.current.clientHeight;
      gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
      gl.uniform1f(uniforms.u_ratio, canvasRef.current.width / canvasRef.current.height);
      gl.uniform1f(uniforms.u_img_ratio, imgRatio);
    };

    gl = initShader();
    if (!gl) return;

    updateUniforms();
    loadImage(img);
    render();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full absolute top-0 left-0"
      />
    </div>
  );
};

export default WaterDistortion;
