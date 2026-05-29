import { NOISE_GLSL } from './noise'

export const marbleVertex = NOISE_GLSL + /* glsl */ `
  uniform float uTime, uReveal;
  varying vec3 vNormal, vWorld, vPos;
  void main(){
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec3 p = position;
    p += normal * (1.0 - uReveal) * -0.4;
    vec4 wp = modelMatrix * vec4(p,1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

export const marbleFragment = NOISE_GLSL + /* glsl */ `
  uniform float uTime, uReveal, uGoldMix;
  uniform vec3 uKeyDir, uColCool, uColWarm, uColVein, uColGold;
  varying vec3 vNormal, vWorld, vPos;
  void main(){
    vec3 N = normalize(vNormal);

    // marble veining via fbm
    float vein = fbm(vPos*1.4 + fbm(vPos*0.8)*1.2);
    vein = abs(vein);
    float veining = smoothstep(0.0,0.55, 1.0 - vein);
    vec3 base = mix(uColCool, uColWarm, 0.5 + 0.5*sin(uGoldMix*3.14));
    vec3 albedo = mix(base, uColVein, veining*0.55);

    // wrapped diffuse (fake subsurface)
    float ndl = dot(N, normalize(uKeyDir));
    float wrap = clamp((ndl + 0.6)/1.6, 0.0, 1.0);
    float fill = clamp(dot(N, normalize(vec3(-0.4,0.2,0.6)))*0.5+0.5, 0.0, 1.0);
    vec3 lit = albedo * (wrap*1.1 + fill*0.35 + 0.12);

    // fresnel rim
    vec3 V = normalize(cameraPosition - vWorld);
    float fres = pow(1.0 - clamp(dot(N,V),0.0,1.0), 3.0);
    vec3 rim = mix(vec3(0.8,0.85,0.95), uColGold, uGoldMix) * fres * (0.7+uGoldMix);

    vec3 col = lit + rim;
    col = mix(col, col*1.1 + uColGold*0.25, uGoldMix*0.6);

    gl_FragColor = vec4(col, uReveal);
  }
`
