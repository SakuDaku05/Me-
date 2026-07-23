"use client";

import { useEffect, useRef, useState } from "react";

interface DitherShaderProps {
  imageSrc?: string;
  className?: string;
  colors?: [number, number, number][];
  pixelSize?: number;
}

const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_texCoord;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform vec2 u_resolution;
  uniform float u_pixelSize;
  varying vec2 v_texCoord;

  float bayer8[64];

  float getBayer(int x, int y) {
    bayer8[0]  = 0.0;  bayer8[1]  = 32.0; bayer8[2]  = 8.0;  bayer8[3]  = 40.0;
    bayer8[4]  = 2.0;  bayer8[5]  = 34.0; bayer8[6]  = 10.0; bayer8[7]  = 42.0;
    bayer8[8]  = 48.0; bayer8[9]  = 16.0; bayer8[10] = 56.0; bayer8[11] = 24.0;
    bayer8[12] = 50.0; bayer8[13] = 18.0; bayer8[14] = 58.0; bayer8[15] = 26.0;
    bayer8[16] = 12.0; bayer8[17] = 44.0; bayer8[18] = 4.0;  bayer8[19] = 36.0;
    bayer8[20] = 14.0; bayer8[21] = 46.0; bayer8[22] = 6.0;  bayer8[23] = 38.0;
    bayer8[24] = 60.0; bayer8[25] = 28.0; bayer8[26] = 52.0; bayer8[27] = 20.0;
    bayer8[28] = 62.0; bayer8[29] = 30.0; bayer8[30] = 54.0; bayer8[31] = 22.0;
    bayer8[32] = 3.0;  bayer8[33] = 35.0; bayer8[34] = 11.0; bayer8[35] = 43.0;
    bayer8[36] = 1.0;  bayer8[37] = 33.0; bayer8[38] = 9.0;  bayer8[39] = 41.0;
    bayer8[40] = 51.0; bayer8[41] = 19.0; bayer8[42] = 59.0; bayer8[43] = 27.0;
    bayer8[44] = 49.0; bayer8[45] = 17.0; bayer8[46] = 57.0; bayer8[47] = 25.0;
    bayer8[48] = 15.0; bayer8[49] = 47.0; bayer8[50] = 7.0;  bayer8[51] = 39.0;
    bayer8[52] = 13.0; bayer8[53] = 45.0; bayer8[54] = 5.0;  bayer8[55] = 37.0;
    bayer8[56] = 63.0; bayer8[57] = 31.0; bayer8[58] = 55.0; bayer8[59] = 23.0;
    bayer8[60] = 61.0; bayer8[61] = 29.0; bayer8[62] = 53.0; bayer8[63] = 21.0;
    int idx = (y * 8 + x);
    for (int i = 0; i < 64; i++) {
      if (i == idx) return bayer8[i] / 64.0;
    }
    return 0.0;
  }

  void main() {
    vec2 pixelated = floor(v_texCoord * u_resolution / u_pixelSize) * u_pixelSize / u_resolution;
    vec4 color = texture2D(u_image, pixelated);
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    
    int bx = int(mod(gl_FragCoord.x / u_pixelSize, 8.0));
    int by = int(mod(gl_FragCoord.y / u_pixelSize, 8.0));
    float threshold = getBayer(bx, by);
    
    float dithered = gray > threshold ? 1.0 : 0.0;
    gl_FragColor = vec4(vec3(dithered), 1.0);
  }
`;

export function DitherShader({ imageSrc, className = "", pixelSize = 4 }: DitherShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;
    glRef.current = gl;

    function createShader(type: number, source: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positions = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
    const texCoords = new Float32Array([0,1, 1,1, 0,0, 1,0]);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    const texLoc = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const pixLoc = gl.getUniformLocation(program, "u_pixelSize");
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform1f(pixLoc, pixelSize);

    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
      img.src = imageSrc;
    } else {
      // Draw gradient as default
      const w = canvas.width, h = canvas.height;
      const d = new Uint8Array(w * h * 4);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const t = (x / w + y / h) / 2;
          d[i] = d[i+1] = d[i+2] = Math.floor(t * 255);
          d[i+3] = 255;
        }
      }
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, d);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }, [imageSrc, pixelSize]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className={className}
    />
  );
}
