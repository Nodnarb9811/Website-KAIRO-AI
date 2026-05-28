import { NOISE_GLSL } from './noise'

export const particleVertex = NOISE_GLSL + /* glsl */ `
  attribute float aSpeed;
  attribute float aSeed;
  uniform float uTime, uWarp, uFlow, uGoldMix, uSeize, uSeizeT;
  uniform float uSize, uPixelRatio, uDepth;
  uniform vec3 uLightPos;
  varying float vGold;
  varying float vGlow;

  void main(){
    vec3 pos = position;

    // streaming down the river (relative motion toward camera)
    float z = mod(pos.z + uTime * aSpeed * 9.0 + uDepth*0.5, uDepth) - uDepth*0.5;
    pos.z = z;

    // ACT II warp: lines begin to bend toward the light
    vec3 warp = curlNoise(pos*0.045 + vec3(0.0,0.0,uTime*0.04));
    pos += warp * uWarp * 6.0 * (0.6 + aSeed);

    // ACT III-V flow field: reorganize into intelligent curves
    vec3 flow = curlNoise(pos*0.07 + vec3(uTime*0.05, 0.0, 0.0));
    pos = mix(pos, pos + flow * 9.0, uFlow);

    // pull the flow toward the figure/light as gold takes over
    vec3 toLight = uLightPos - pos;
    pos += normalize(toLight) * uFlow * uGoldMix * 1.4 * aSeed;

    // ACT IV seize shockwave: radial ignition burst
    float shock = sin(uSeizeT*6.0 - length(pos.xy)*0.25);
    pos += normalize(vec3(pos.xy, 0.001)) * uSeize * shock * 3.2 * (1.0 - smoothstep(0.0,2.0,uSeizeT));

    // gold assignment
    float distLight = length(uLightPos - pos);
    float prox = 1.0 - smoothstep(2.0, 34.0, distLight);
    vGold = clamp(uGoldMix * (0.35 + prox) + aSeed*0.18*uGoldMix + uSeize*0.6, 0.0, 1.0);
    vGlow = prox * (0.4 + uGoldMix) + uSeize*0.5;

    vec4 mv = modelViewMatrix * vec4(pos,1.0);
    gl_Position = projectionMatrix * mv;
    float sz = uSize * (0.7 + aSeed*0.6) * (1.0 + vGold*0.8);
    gl_PointSize = sz * uPixelRatio * (40.0 / -mv.z);
  }
`

export const particleFragment = /* glsl */ `
  uniform vec3 uColChronos, uColGold, uColGoldHi;
  varying float vGold;
  varying float vGlow;
  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    alpha *= alpha;
    vec3 col = mix(uColChronos*0.5, uColGold, vGold);
    col = mix(col, uColGoldHi, vGold*vGlow);
    float bright = 0.5 + vGlow*1.4 + vGold*0.6;
    gl_FragColor = vec4(col*bright, alpha*(0.5 + vGold*0.5));
  }
`
