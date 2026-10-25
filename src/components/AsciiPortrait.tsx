import { useEffect, useRef } from 'react';

// The portrait redrawn as ASCII on dark ink, for the hero's alternate layer.
// Brighter parts of the photo get denser characters. Drawn with WebGL once on
// load and again on resize; it sits under a plain <img> spacer that sizes it.

const SRC = '/lakshya.png';
const IMG_W = 1024;
const IMG_H = 1536;
const OBJECT_POSITION_Y = 0.18; // matches `object-position: 50% 18%` on the photo
const GLYPHS = ' .:-=+*#%@';
const CELL_CSS_PX = 9;

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAGMENT = `
// Pixel-space maths needs more than fp16 on large canvases; use highp if the GPU has it.
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uImage;
uniform sampler2D uGlyphs;
uniform vec2 uCells; // canvas size in glyph cells
uniform vec2 uImgOffset; // photo placement, in canvas UV units
uniform vec2 uImgSize;
uniform float uGlyphCount;
varying vec2 vUv;

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  // Work in cell units so the numbers stay small enough for any precision.
  vec2 grid = uv * uCells;
  vec2 cell = floor(grid);
  vec2 center = (cell + 0.5) / uCells;
  vec3 photo = texture2D(uImage, clamp((center - uImgOffset) / uImgSize, 0.0, 1.0)).rgb;
  float lum = dot(photo, vec3(0.299, 0.587, 0.114));
  lum = clamp((lum - 0.12) * 1.7, 0.0, 1.0);
  lum = pow(lum, 0.8);
  float index = floor(lum * (uGlyphCount - 0.001));
  vec2 local = fract(grid);
  float glyph = texture2D(uGlyphs, vec2((index + local.x) / uGlyphCount, local.y)).a;

  vec3 ink = vec3(0.125, 0.118, 0.114);
  vec3 paper = vec3(0.953, 0.949, 0.949);
  vec3 color = mix(ink, paper, glyph);
  gl_FragColor = vec4(color, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function texture(gl: WebGLRenderingContext, unit: number) {
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return tex;
}

function glyphAtlas(cellPx: number) {
  const atlas = document.createElement('canvas');
  atlas.width = cellPx * GLYPHS.length;
  atlas.height = cellPx;
  const ctx = atlas.getContext('2d');
  if (!ctx) return atlas;
  ctx.fillStyle = '#fff';
  ctx.font = `700 ${Math.round(cellPx * 1.2)}px ui-monospace, Consolas, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  Array.from(GLYPHS).forEach((char, i) => ctx.fillText(char, (i + 0.5) * cellPx, cellPx * 0.55));
  return atlas;
}

export default function AsciiPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = canvas?.parentElement;
    if (!canvas || !frame) return;

    const gl = canvas.getContext('webgl', { antialias: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uCells = u('uCells');
    const uImgOffset = u('uImgOffset');
    const uImgSize = u('uImgSize');
    gl.uniform1i(u('uImage'), 0);
    gl.uniform1i(u('uGlyphs'), 2);
    gl.uniform1f(u('uGlyphCount'), GLYPHS.length);

    const imageTex = texture(gl, 0);
    const glyphTex = texture(gl, 2);
    let imageReady = false;
    const draw = () => {
      if (!imageReady) return;
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const image = new Image();
    image.src = SRC;
    image.onload = () => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      imageReady = true;
      draw();
    };


    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(frame.clientWidth * dpr);
      canvas.height = Math.round(frame.clientHeight * dpr);
      if (canvas.width === 0 || canvas.height === 0) return;
      gl.viewport(0, 0, canvas.width, canvas.height);

      const scale = Math.max(canvas.width / IMG_W, canvas.height / IMG_H);
      const drawW = IMG_W * scale;
      const drawH = IMG_H * scale;
      gl.uniform2f(uImgSize, drawW / canvas.width, drawH / canvas.height);
      gl.uniform2f(
        uImgOffset,
        (canvas.width - drawW) / 2 / canvas.width,
        ((canvas.height - drawH) * OBJECT_POSITION_Y) / canvas.height,
      );

      const cell = Math.round(CELL_CSS_PX * dpr);
      gl.uniform2f(uCells, canvas.width / cell, canvas.height / cell);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, glyphTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glyphAtlas(cell));
      draw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(frame);

    return () => ro.disconnect();
  }, []);

  return <canvas ref={canvasRef} className="hero-ascii" aria-hidden="true" />;
}
