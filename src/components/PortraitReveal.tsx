import { useEffect, useRef } from 'react';
import { hasFinePointer, onFrame, pointer, prefersReducedMotion } from '../lib/motion';

// Two layers: the greyscale photo underneath (a plain <img>, outside this
// component) and, on top, the same photo redrawn as ASCII on dark ink. The top
// layer only shows through a mask the cursor paints as it moves. The mask fades
// every frame, and animated noise warps its edge so the reveal looks liquid.

const SRC = '/lakshya.png';
const IMG_W = 1024;
const IMG_H = 1536;
const OBJECT_POSITION_Y = 0.18; // matches `object-position: 50% 18%` on the photo
const GLYPHS = ' .:-=+*#%@';
const CELL_CSS_PX = 9;
const MASK_W = 96;
const MASK_H = 120;
const IDLE_AFTER_MS = 2200;

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAGMENT = `
precision mediump float;
uniform sampler2D uImage;
uniform sampler2D uMask;
uniform sampler2D uGlyphs;
uniform vec2 uRes;
uniform vec2 uImgOffset;
uniform vec2 uImgSize;
uniform float uCell;
uniform float uGlyphCount;
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec2 px = uv * uRes;

  float mask = texture2D(uMask, uv).r;
  float n1 = noise(uv * vec2(5.0, 6.0) + vec2(uTime * 0.25, -uTime * 0.2));
  float n2 = noise(uv * 14.0 - uTime * 0.45);
  float v = mask + (n1 - 0.5) * 0.38 + (n2 - 0.5) * 0.14;
  float alpha = smoothstep(0.3, 0.38, v);
  if (alpha < 0.002) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec2 cell = floor(px / uCell);
  vec2 center = (cell + 0.5) * uCell;
  vec3 photo = texture2D(uImage, clamp((center - uImgOffset) / uImgSize, 0.0, 1.0)).rgb;
  float lum = dot(photo, vec3(0.299, 0.587, 0.114));
  lum = clamp((lum - 0.12) * 1.7, 0.0, 1.0);
  lum = pow(lum, 0.8);
  float index = floor(lum * (uGlyphCount - 0.001));
  vec2 local = fract(px / uCell);
  float glyph = texture2D(uGlyphs, vec2((index + local.x) / uGlyphCount, local.y)).a;

  vec3 ink = vec3(0.125, 0.118, 0.114);
  vec3 paper = vec3(0.953, 0.949, 0.949);
  vec3 color = mix(ink, paper, glyph);
  gl_FragColor = vec4(color * alpha, alpha);
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

export default function PortraitReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = canvas?.parentElement;
    if (!canvas || !frame || prefersReducedMotion()) return;

    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false });
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
    const uRes = u('uRes');
    const uImgOffset = u('uImgOffset');
    const uImgSize = u('uImgSize');
    const uCell = u('uCell');
    const uTime = u('uTime');
    gl.uniform1i(u('uImage'), 0);
    gl.uniform1i(u('uMask'), 1);
    gl.uniform1i(u('uGlyphs'), 2);
    gl.uniform1f(u('uGlyphCount'), GLYPHS.length);

    const imageTex = texture(gl, 0);
    const maskTex = texture(gl, 1);
    const glyphTex = texture(gl, 2);
    let imageReady = false;

    const image = new Image();
    image.src = SRC;
    image.onload = () => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      imageReady = true;
    };

    // The mask the cursor paints into. White shows the ASCII layer.
    const mask = document.createElement('canvas');
    mask.width = MASK_W;
    mask.height = MASK_H;
    const mctx = mask.getContext('2d');
    if (!mctx) return;
    mctx.fillStyle = '#000';
    mctx.fillRect(0, 0, MASK_W, MASK_H);

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = frame.clientWidth;
      height = frame.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);

      const scale = Math.max(canvas.width / IMG_W, canvas.height / IMG_H);
      const drawW = IMG_W * scale;
      const drawH = IMG_H * scale;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uImgSize, drawW, drawH);
      gl.uniform2f(uImgOffset, (canvas.width - drawW) / 2, (canvas.height - drawH) * OBJECT_POSITION_Y);

      const cell = Math.round(CELL_CSS_PX * dpr);
      gl.uniform1f(uCell, cell);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, glyphTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glyphAtlas(cell));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(frame);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(frame);

    const fine = hasFinePointer();
    let last: { x: number; y: number } | null = null;

    const paint = (x: number, y: number, dt: number) => {
      // x, y in mask pixels
      if (!last) last = { x, y };
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      const speed = dist / Math.max(dt, 1);
      const radius = MASK_W * (0.12 + Math.min(speed * 0.05, 0.1));
      const steps = Math.max(1, Math.ceil(dist / (radius * 0.3)));
      mctx.globalCompositeOperation = 'lighter';
      for (let i = 1; i <= steps; i++) {
        const px = last.x + (dx * i) / steps;
        const py = last.y + (dy * i) / steps;
        const g = mctx.createRadialGradient(px, py, 0, px, py, radius);
        g.addColorStop(0, 'rgba(255,255,255,0.35)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        mctx.fillStyle = g;
        mctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);
      }
      last = { x, y };
    };

    const stop = onFrame((time, dt) => {
      if (!visible || !imageReady || width === 0) return;

      // Fade the whole mask a little every frame so the reveal melts away.
      mctx.globalCompositeOperation = 'source-over';
      mctx.fillStyle = `rgba(0,0,0,${(1 - Math.pow(1 - 0.045, dt / 16.67)).toFixed(4)})`;
      mctx.fillRect(0, 0, MASK_W, MASK_H);

      const rect = frame.getBoundingClientRect();
      const live = fine && time - pointer.movedAt < IDLE_AFTER_MS;
      const over =
        pointer.x > rect.left - 24 &&
        pointer.x < rect.right + 24 &&
        pointer.y > rect.top - 24 &&
        pointer.y < rect.bottom + 24;

      if (live && over) {
        paint(((pointer.x - rect.left) / rect.width) * MASK_W, ((pointer.y - rect.top) / rect.height) * MASK_H, dt);
      } else if (!live) {
        // No cursor: a slow path wanders over the face so the effect still plays.
        const wx = 0.5 + 0.3 * Math.sin(time * 0.00072) + 0.08 * Math.sin(time * 0.0019);
        const wy = 0.4 + 0.24 * Math.sin(time * 0.00103 + 1.1) + 0.06 * Math.cos(time * 0.0023);
        paint(wx * MASK_W, wy * MASK_H, dt);
      } else {
        last = null;
      }

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, maskTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
      gl.uniform1f(uTime, time / 1000);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-reveal" aria-hidden="true" />;
}
