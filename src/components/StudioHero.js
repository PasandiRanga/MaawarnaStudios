'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

/* ─── Material palette ─────────────────────────────────────────────── */
const C_BODY   = '#141d2e';   /* slightly lighter so light catches it */
const C_METAL  = '#202840';
const C_ACCENT = '#18223a';
const C_LENS   = '#080d1a';
const C_DARK   = '#050810';

const CAM_X       = 4.2;
const CAM_Y       = 1.1;   /* raised so camera sits ON the tripod (not floating) */
const FLOOR_Y     = -1.82;

/*
 * Three framings of the same scene. restYaw is the resting head rotation that
 * points the lens back at the viewer — atan2(viewerX - CAM_X, viewerZ).
 *
 *  · desktop — viewer far LEFT looking left-of-centre, so the rig lands in the
 *    right quarter and the hero copy owns the left half. Needs a wide viewport:
 *    the rig sits ~30° off the view axis, outside the frame once the horizontal
 *    fov narrows.
 *  · overlayTall — same left-copy / right-rig composition for md+ viewports that
 *    are portrait or squarish (tablets). Viewer pulled back and aimed nearer the
 *    rig so it stays in frame at narrow aspect ratios.
 *  · mobile — viewer straight in front of the rig (x = CAM_X), pulled back with
 *    a tighter fov, so the model is centred in the stacked top panel. restYaw is
 *    a deliberate 3/4 turn: dead-on reads flat, and touch devices have no cursor
 *    to rotate it away from rest.
 */
const VIEW = {
  desktop:     { position: [-3.0, 2.2, 8.5], target: [-1.5, 0.8, 0],  fov: 62, restYaw: -0.65 },
  overlayTall: { position: [1.0, 2.3, 11.0], target: [1.4, 0.85, 0],  fov: 62, restYaw: -0.28 },
  mobile:      { position: [CAM_X, 1.9, 8.4], target: [CAM_X, 0.85, 0], fov: 44, restYaw: -0.45 },
};

/* Layout is stacked below Tailwind's `md`; above it the copy overlays the rig. */
function pickView() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < 768) return VIEW.mobile;
  return w / h < 1.35 ? VIEW.overlayTall : VIEW.desktop;
}

/* ─── Applies the active framing (and re-applies it on breakpoint change) ── */
function CameraSetup({ view }) {
  const { camera } = useThree();
  const applied = useRef('');
  useFrame(() => {
    const key = [...view.position, ...view.target, view.fov].join(',');
    if (applied.current === key) return;
    camera.position.set(...view.position);
    camera.fov = view.fov;
    camera.updateProjectionMatrix();
    camera.lookAt(...view.target);
    applied.current = key;
  });
  return null;
}

/* ─── Realistic Tripod ───────────────────────────────────────────── */
function Tripod() {
  /* Wider splay makes the tripod look stable & substantial */
  const splayAngle = 0.50;
  /*
   * hubOffset = 1.23 is chosen so that:
   *   tripod pan-head top  ≈  camera QR-plate bottom
   *   (CAM_Y − 0.632×1.48 = CAM_Y − 0.935 ≈ hubY + 0.30)
   * This eliminates the floating-camera gap.
   */
  const hubY     = CAM_Y - 1.23;
  const legStart = hubY - 0.20;

  const legAngles = [
    Math.PI / 6,
    Math.PI / 6 + (2 * Math.PI) / 3,
    Math.PI / 6 - (2 * Math.PI) / 3,
  ];

  /* Leg lengths tuned so feet land on FLOOR_Y with the new hubY */
  const L1 = 0.70, L2 = 0.58, L3 = 0.42;
  const totalLen = L1 + L2 + L3;

  const legData = legAngles.map((angle) => ({
    dx: Math.sin(angle) * Math.sin(splayAngle),
    dz: Math.cos(angle) * Math.sin(splayAngle),
    dy: -Math.cos(splayAngle),
    angle,
  }));

  return (
    <group>
      {/* ── Pan-head tilt platform ── */}
      <mesh position={[CAM_X, hubY + 0.20, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.10, 24]} />
        <meshStandardMaterial color={C_METAL} roughness={0.26} metalness={0.92} />
      </mesh>
      <mesh position={[CAM_X, hubY + 0.27, 0]}>
        <boxGeometry args={[0.42, 0.055, 0.36]} />
        <meshStandardMaterial color="#141e30" roughness={0.30} metalness={0.88} />
      </mesh>
      {[-1, 1].map((s, i) => (
        <mesh key={i} position={[CAM_X + s * 0.26, hubY + 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.032, 0.032, 0.062, 12]} />
          <meshStandardMaterial color="#090d18" roughness={0.65} metalness={0.68} />
        </mesh>
      ))}

      {/* ── Spider hub ── */}
      <mesh position={[CAM_X, hubY - 0.04, 0]}>
        <cylinderGeometry args={[0.130, 0.168, 0.34, 20]} />
        <meshStandardMaterial color={C_METAL} roughness={0.28} metalness={0.90} />
      </mesh>
      <mesh position={[CAM_X, hubY + 0.04, 0]}>
        <cylinderGeometry args={[0.145, 0.145, 0.075, 22]} />
        <meshStandardMaterial color="#0e1730" roughness={0.22} metalness={0.94} />
      </mesh>

      {/* ── Three legs ── */}
      {legData.map(({ dx, dy, dz, angle }, i) => {
        const ox1 = dx * L1,              oy1 = dy * L1,              oz1 = dz * L1;
        const ox2 = dx * (L1+L2),         oy2 = dy * (L1+L2),         oz2 = dz * (L1+L2);
        const ox3 = dx * totalLen,         oy3 = dy * totalLen,         oz3 = dz * totalLen;

        const s  = [CAM_X, legStart, 0];
        const m1 = [s[0]+ox1*0.5,               s[1]+oy1*0.5,               oz1*0.5];
        const m2 = [s[0]+ox1+(ox2-ox1)*0.5,     s[1]+oy1+(oy2-oy1)*0.5,     oz1+(oz2-oz1)*0.5];
        const m3 = [s[0]+ox2+(ox3-ox2)*0.5,     s[1]+oy2+(oy3-oy2)*0.5,     oz2+(oz3-oz2)*0.5];
        const j1 = [s[0]+ox1, s[1]+oy1, oz1];
        const j2 = [s[0]+ox2, s[1]+oy2, oz2];
        const ft = [s[0]+ox3, s[1]+oy3, oz3];

        const legVec = new THREE.Vector3(dx, dy, dz).normalize();
        const eu     = new THREE.Euler().setFromQuaternion(
          new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), legVec)
        );
        const rot = [eu.x, eu.y, eu.z];
        const kx  = Math.cos(angle) * 0.052;
        const kz  = Math.sin(angle) * 0.052;

        return (
          <group key={i}>
            {/* hub joint */}
            <mesh position={[s[0]+dx*0.01, s[1], dz*0.01]}>
              <sphereGeometry args={[0.058, 14, 14]} />
              <meshStandardMaterial color={C_METAL} roughness={0.26} metalness={0.92} />
            </mesh>

            {/* Sec 1 — thick */}
            <mesh position={m1} rotation={rot}>
              <cylinderGeometry args={[0.040, 0.046, L1, 12]} />
              <meshStandardMaterial color={C_METAL} roughness={0.28} metalness={0.88} />
            </mesh>
            {/* Collar clamp 1→2 */}
            <mesh position={j1}>
              <cylinderGeometry args={[0.052, 0.052, 0.090, 16]} />
              <meshStandardMaterial color="#0b1222" roughness={0.34} metalness={0.82} />
            </mesh>
            <mesh position={[j1[0]+kx, j1[1], j1[2]+kz]}>
              <cylinderGeometry args={[0.015, 0.015, 0.075, 10]} />
              <meshStandardMaterial color="#090d18" roughness={0.60} metalness={0.68} />
            </mesh>

            {/* Sec 2 — medium */}
            <mesh position={m2} rotation={rot}>
              <cylinderGeometry args={[0.030, 0.036, L2, 12]} />
              <meshStandardMaterial color="#121a2e" roughness={0.30} metalness={0.86} />
            </mesh>
            {/* Collar clamp 2→3 */}
            <mesh position={j2}>
              <cylinderGeometry args={[0.042, 0.042, 0.080, 16]} />
              <meshStandardMaterial color="#0b1222" roughness={0.34} metalness={0.82} />
            </mesh>
            <mesh position={[j2[0]+kx, j2[1], j2[2]+kz]}>
              <cylinderGeometry args={[0.013, 0.013, 0.065, 10]} />
              <meshStandardMaterial color="#090d18" roughness={0.60} metalness={0.68} />
            </mesh>

            {/* Sec 3 — thin */}
            <mesh position={m3} rotation={rot}>
              <cylinderGeometry args={[0.020, 0.028, L3, 12]} />
              <meshStandardMaterial color="#0f1828" roughness={0.32} metalness={0.84} />
            </mesh>

            {/* Rubber foot */}
            <mesh position={[ft[0], ft[1]+0.028, ft[2]]}>
              <cylinderGeometry args={[0.032, 0.026, 0.072, 12]} />
              <meshStandardMaterial color="#070910" roughness={0.95} metalness={0.04} />
            </mesh>
            <mesh position={[ft[0], ft[1]-0.010, ft[2]]}>
              <coneGeometry args={[0.022, 0.044, 10]} />
              <meshStandardMaterial color="#05070e" roughness={0.80} metalness={0.12} />
            </mesh>
          </group>
        );
      })}

      {/* ── Spreader bars (one per leg pair) ── */}
      {legData.map(({ dx, dy, dz }, i) => {
        const next = legData[(i + 1) % 3];
        const t    = 0.50;
        const ax = CAM_X+dx*totalLen*t, ay = legStart+dy*totalLen*t, az = dz*totalLen*t;
        const bx = CAM_X+next.dx*totalLen*t, by = legStart+next.dy*totalLen*t, bz = next.dz*totalLen*t;
        const len = Math.sqrt((bx-ax)**2+(by-ay)**2+(bz-az)**2);
        const dir = new THREE.Vector3(bx-ax, by-ay, bz-az).normalize();
        const eu  = new THREE.Euler().setFromQuaternion(
          new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir)
        );
        return (
          <mesh key={`sp${i}`}
            position={[(ax+bx)/2,(ay+by)/2,(az+bz)/2]}
            rotation={[eu.x, eu.y, eu.z]}>
            <cylinderGeometry args={[0.013, 0.013, len, 10]} />
            <meshStandardMaterial color={C_METAL} roughness={0.32} metalness={0.84} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── DSLR Camera Head ───────────────────────────────────────────────
 * Built to DSLR anatomy rather than a cine body:
 *   top    — pentaprism hump + hot shoe, mode dial on the left shoulder,
 *            shutter and command dial on the right
 *   right  — grip moulded into the body, bulging FORWARD where a hand
 *            actually wraps it (not a slab hung off the side)
 *   front  — leatherette panel, lens throat, release button, AF lamp
 *   lens   — zoom barrel whose front element is a shallow DOME: a flat
 *            disc plus concentric rings reads as a bullseye, a curved
 *            surface slides the studio spots across it and reads as glass
 * Flat details (circle/ring/plane) already face +Z, so they are rotated
 * only to face elsewhere — up is [-PI/2,0,0], back is [0,PI,0]. Cylinders
 * need [PI/2,0,0] to swing their axis onto the lens axis.
 */
function CameraHead({ headRef, focusRef, restYaw }) {
  return (
    <group ref={headRef} position={[CAM_X, CAM_Y, 0]} scale={[1.48, 1.48, 1.48]}
      rotation={[0, restYaw, 0]}>

      {/* ══ BODY — wide, shallow and matte; the grip carries the depth ══ */}
      <RoundedBox args={[1.52, 1.05, 0.56]} radius={0.090} smoothness={7} castShadow receiveShadow>
        <meshStandardMaterial color={C_BODY} roughness={0.72} metalness={0.30} />
      </RoundedBox>
      {/* Leatherette front panel */}
      <mesh position={[0, 0, 0.286]}>
        <boxGeometry args={[1.32, 0.86, 0.030]} />
        <meshStandardMaterial color="#0b1220" roughness={0.95} metalness={0.05} />
      </mesh>
      <mesh position={[-0.42, 0.30, 0.305]}>
        <boxGeometry args={[0.26, 0.045, 0.010]} />
        <meshStandardMaterial color="#8ea6c8" roughness={0.30} metalness={0.85} />
      </mesh>
      {/* Lens release button + AF-assist lamp */}
      <mesh position={[-0.52, -0.02, 0.300]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.050, 18]} />
        <meshStandardMaterial color="#18223a" roughness={0.60} metalness={0.45} />
      </mesh>
      <mesh position={[0.58, 0.30, 0.482]}>
        <circleGeometry args={[0.052, 20]} />
        <meshBasicMaterial color="#2a1c09" />
      </mesh>

      {/* ══ GRIP — moulded into the body, bulging forward ══ */}
      <RoundedBox args={[0.34, 1.00, 0.64]} radius={0.155} smoothness={6}
        position={[0.60, -0.015, 0.18]} castShadow>
        <meshStandardMaterial color="#0a0f1a" roughness={0.96} metalness={0.04} />
      </RoundedBox>
      {[-0.26, -0.09, 0.08].map((y, i) => (
        <mesh key={`gf${i}`} position={[0.612, y, 0.492]}>
          <boxGeometry args={[0.24, 0.030, 0.020]} />
          <meshBasicMaterial color="#05080f" />
        </mesh>
      ))}

      {/* ══ TOP DECK — shoulder plates either side of the prism ══ */}
      <RoundedBox args={[0.58, 0.10, 0.46]} radius={0.038} smoothness={4}
        position={[-0.45, 0.560, -0.02]} castShadow>
        <meshStandardMaterial color={C_ACCENT} roughness={0.62} metalness={0.42} />
      </RoundedBox>
      <RoundedBox args={[0.54, 0.10, 0.58]} radius={0.038} smoothness={4}
        position={[0.48, 0.560, 0.06]} castShadow>
        <meshStandardMaterial color={C_ACCENT} roughness={0.62} metalness={0.42} />
      </RoundedBox>

      {/* ══ PENTAPRISM HUMP ══ */}
      <RoundedBox args={[0.58, 0.14, 0.50]} radius={0.045} smoothness={5}
        position={[0, 0.572, -0.01]} castShadow>
        <meshStandardMaterial color={C_BODY} roughness={0.70} metalness={0.32} />
      </RoundedBox>
      {/* Tapered cap — a 4-sided frustum. The stretch lives on the parent so
          it lands AFTER the 45° spin that squares the frustum up. */}
      <group position={[0, 0.685, -0.01]} scale={[1.414, 1, 1.30]}>
        <mesh rotation={[0, Math.PI/4, 0]} castShadow>
          <cylinderGeometry args={[0.180, 0.250, 0.200, 4, 1]} />
          <meshStandardMaterial color={C_BODY} roughness={0.70} metalness={0.32} />
        </mesh>
      </group>
      {/* Pop-up flash window on the prism front */}
      <mesh position={[0, 0.580, 0.236]}>
        <boxGeometry args={[0.34, 0.11, 0.020]} />
        <meshStandardMaterial color="#0a1424" roughness={0.30} metalness={0.55} />
      </mesh>

      {/* ══ HOT SHOE ══ */}
      <mesh position={[0, 0.796, -0.01]}>
        <boxGeometry args={[0.27, 0.024, 0.25]} />
        <meshStandardMaterial color={C_METAL} roughness={0.42} metalness={0.80} />
      </mesh>
      {[-0.115, 0.115].map((x, i) => (
        <mesh key={`hs${i}`} position={[x, 0.824, -0.01]}>
          <boxGeometry args={[0.036, 0.050, 0.23]} />
          <meshStandardMaterial color={C_METAL} roughness={0.38} metalness={0.86} />
        </mesh>
      ))}
      <mesh position={[0, 0.824, -0.115]}>
        <boxGeometry args={[0.25, 0.050, 0.036]} />
        <meshStandardMaterial color={C_METAL} roughness={0.38} metalness={0.86} />
      </mesh>
      <mesh position={[0, 0.810, 0.02]}>
        <boxGeometry args={[0.11, 0.014, 0.09]} />
        <meshBasicMaterial color="#05080f" />
      </mesh>

      {/* ══ MODE DIAL — left shoulder ══ */}
      <mesh position={[-0.45, 0.645, -0.02]} castShadow>
        <cylinderGeometry args={[0.185, 0.185, 0.130, 32]} />
        <meshStandardMaterial color="#131c2c" roughness={0.66} metalness={0.36} />
      </mesh>
      {Array.from({length:20}).map((_, i) => {
        const a = (i/20)*Math.PI*2;
        return <mesh key={`md${i}`}
          position={[-0.45 + Math.sin(a)*0.188, 0.645, -0.02 + Math.cos(a)*0.188]}>
          <boxGeometry args={[0.016, 0.115, 0.016]} />
          <meshBasicMaterial color="#060b14" />
        </mesh>;
      })}
      <mesh position={[-0.45, 0.7115, -0.02]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.150, 32]} />
        <meshBasicMaterial color="#0a1220" />
      </mesh>
      <mesh position={[-0.45, 0.7125, 0.10]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[0.030, 0.055]} />
        <meshBasicMaterial color="#cbd8ec" />
      </mesh>

      {/* ══ COMMAND DIAL + SHUTTER — right shoulder ══ */}
      <mesh position={[0.50, 0.628, -0.06]} castShadow>
        <cylinderGeometry args={[0.140, 0.140, 0.105, 28]} />
        <meshStandardMaterial color="#131c2c" roughness={0.66} metalness={0.36} />
      </mesh>
      {Array.from({length:16}).map((_, i) => {
        const a = (i/16)*Math.PI*2;
        return <mesh key={`cd${i}`}
          position={[0.50 + Math.sin(a)*0.143, 0.628, -0.06 + Math.cos(a)*0.143]}>
          <boxGeometry args={[0.014, 0.090, 0.014]} />
          <meshBasicMaterial color="#060b14" />
        </mesh>;
      })}
      <group position={[0.585, 0.612, 0.215]} rotation={[0.26, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.118, 0.118, 0.040, 26]} />
          <meshStandardMaterial color={C_ACCENT} roughness={0.58} metalness={0.50} />
        </mesh>
        <mesh position={[0, 0.038, 0]}>
          <cylinderGeometry args={[0.072, 0.072, 0.048, 22]} />
          <meshStandardMaterial color="#1b2740" roughness={0.52} metalness={0.44} />
        </mesh>
      </group>

      {/* ══ VIEWFINDER EYEPIECE (back) ══ */}
      <mesh position={[0, 0.430, -0.318]}>
        <boxGeometry args={[0.34, 0.22, 0.085]} />
        <meshStandardMaterial color={C_ACCENT} roughness={0.58} metalness={0.44} />
      </mesh>
      <RoundedBox args={[0.32, 0.19, 0.075]} radius={0.032} smoothness={4}
        position={[0, 0.430, -0.382]}>
        <meshStandardMaterial color="#080c14" roughness={0.96} metalness={0.03} />
      </RoundedBox>
      <mesh position={[0, 0.430, -0.421]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.20, 0.115]} />
        <meshBasicMaterial color="#0a1424" />
      </mesh>
      {/* Diopter wheel */}
      <mesh position={[0.205, 0.470, -0.345]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.042, 0.042, 0.035, 14]} />
        <meshStandardMaterial color={C_ACCENT} roughness={0.55} metalness={0.55} />
      </mesh>

      {/* ══ REAR LCD ══ */}
      <mesh position={[-0.10, -0.10, -0.292]}>
        <boxGeometry args={[0.82, 0.60, 0.020]} />
        <meshStandardMaterial color="#0a1120" roughness={0.40} metalness={0.35} />
      </mesh>
      <mesh position={[-0.10, -0.10, -0.303]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.74, 0.52]} />
        <meshBasicMaterial color="#06111f" />
      </mesh>
      {[0.20, 0.04, -0.12].map((y, i) => (
        <mesh key={`rb${i}`} position={[0.50, y, -0.295]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.028, 14]} />
          <meshStandardMaterial color="#141d2e" roughness={0.62} metalness={0.38} />
        </mesh>
      ))}

      {/* ══ LEFT SIDE — rubber port door ══ */}
      <mesh position={[-0.768, -0.04, 0.02]}>
        <boxGeometry args={[0.020, 0.56, 0.30]} />
        <meshStandardMaterial color="#0b1220" roughness={0.92} metalness={0.08} />
      </mesh>
      {[-0.09, 0.09].map((z, i) => (
        <mesh key={`pd${i}`} position={[-0.780, -0.04, z]}>
          <boxGeometry args={[0.006, 0.50, 0.012]} />
          <meshBasicMaterial color="#04070e" />
        </mesh>
      ))}

      {/* ══ LENS — zoom barrel ══ */}
      {/* Throat collar + chrome bayonet ring */}
      <mesh position={[0, 0, 0.298]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.455, 0.455, 0.050, 48]} />
        <meshStandardMaterial color="#0a1018" roughness={0.55} metalness={0.50} />
      </mesh>
      <mesh position={[0, 0, 0.336]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.404, 0.412, 0.055, 48]} />
        <meshStandardMaterial color="#9fb2cc" roughness={0.28} metalness={0.92} />
      </mesh>

      {/* Rear fixed barrel + red mount index */}
      <mesh position={[0, 0, 0.435]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.394, 0.400, 0.150, 48]} />
        <meshStandardMaterial color={C_LENS} roughness={0.52} metalness={0.42} />
      </mesh>
      <mesh position={[0, 0.398, 0.400]}>
        <boxGeometry args={[0.030, 0.014, 0.055]} />
        <meshBasicMaterial color="#d94a4a" />
      </mesh>

      {/* Zoom ring — widest section, ribbed rubber */}
      <mesh position={[0, 0, 0.660]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.420, 0.420, 0.300, 48]} />
        <meshStandardMaterial color="#090d15" roughness={0.94} metalness={0.05} />
      </mesh>
      {Array.from({length:34}).map((_, i) => {
        const a = (i/34)*Math.PI*2;
        return <mesh key={`zr${i}`}
          position={[Math.sin(a)*0.424, Math.cos(a)*0.424, 0.660]} rotation={[0, 0, -a]}>
          <boxGeometry args={[0.014, 0.014, 0.255]} />
          <meshBasicMaterial color="#04070d" />
        </mesh>;
      })}

      {/* Focal-length scale band */}
      <mesh position={[0, 0, 0.845]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.396, 0.396, 0.075, 48]} />
        <meshStandardMaterial color="#101828" roughness={0.48} metalness={0.46} />
      </mesh>
      {[-0.42, -0.20, 0.02, 0.24].map((a, i) => (
        <mesh key={`fs${i}`}
          position={[Math.sin(a)*0.400, Math.cos(a)*0.400, 0.845]} rotation={[0, 0, -a]}>
          <boxGeometry args={[0.010, 0.010, 0.040]} />
          <meshBasicMaterial color="#a9bcd8" />
        </mesh>
      ))}

      {/* Focus ring — ribs are children so the slow turn actually reads */}
      <group ref={focusRef} position={[0, 0, 0.960]} rotation={[Math.PI/2, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.410, 0.410, 0.155, 48]} />
          <meshStandardMaterial color="#0b1019" roughness={0.90} metalness={0.08} />
        </mesh>
        {Array.from({length:28}).map((_, i) => {
          const a = (i/28)*Math.PI*2;
          return <mesh key={`fr${i}`}
            position={[Math.sin(a)*0.414, 0, Math.cos(a)*0.414]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.013, 0.120, 0.013]} />
            <meshBasicMaterial color="#04070d" />
          </mesh>;
        })}
      </group>

      {/* Front ring carrying the filter thread */}
      <mesh position={[0, 0, 1.075]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.404, 0.396, 0.075, 48]} />
        <meshStandardMaterial color="#131b29" roughness={0.42} metalness={0.60} />
      </mesh>
      {/* Inner barrel wall — open tube the glass sits down inside */}
      <mesh position={[0, 0, 1.050]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.362, 0.362, 0.140, 48, 1, true]} />
        <meshStandardMaterial color={C_DARK} roughness={0.85} metalness={0.10}
          side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 1.1125]}>
        <ringGeometry args={[0.356, 0.404, 48]} />
        <meshStandardMaterial color="#161f2e" roughness={0.32} metalness={0.72}
          side={THREE.DoubleSide} />
      </mesh>
      {/* Barrel floor, so nothing shows through around the glass */}
      <mesh position={[0, 0, 0.985]}>
        <circleGeometry args={[0.362, 44]} />
        <meshBasicMaterial color="#010208" />
      </mesh>

      {/* Front element — a shallow DOME. A hemisphere squashed by the parent
          group: the curvature is what lets the three studio spots travel
          across the glass instead of flat-filling a disc. */}
      <group position={[0, 0, 1.028]} scale={[1, 1, 0.158]}>
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <sphereGeometry args={[0.352, 56, 22, 0, Math.PI*2, 0, Math.PI/2]} />
          <meshStandardMaterial color="#071a16" roughness={0.045} metalness={0.95}
            emissive="#0a2b22" emissiveIntensity={0.22} />
        </mesh>
      </group>
      {/* Catchlight + a secondary coating flare — deliberately off-centre and
          elliptical, so they never stack into concentric rings */}
      <mesh position={[-0.112, 0.112, 1.088]} scale={[1, 0.58, 1]}>
        <circleGeometry args={[0.098, 32]} />
        <meshBasicMaterial color="#cfe2ff" transparent opacity={0.26}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0.130, -0.125, 1.087]} scale={[1, 0.55, 1]}>
        <circleGeometry args={[0.055, 24]} />
        <meshBasicMaterial color="#6fdcae" transparent opacity={0.16}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* ══ QR PLATE ══ */}
      <mesh position={[0,-0.578,0]} castShadow>
        <boxGeometry args={[0.58,0.100,0.46]} />
        <meshStandardMaterial color={C_ACCENT} roughness={0.44} metalness={0.80} />
      </mesh>
      <mesh position={[0,-0.632,0]}>
        <boxGeometry args={[0.46,0.040,0.16]} />
        <meshStandardMaterial color={C_METAL} roughness={0.40} metalness={0.84} />
      </mesh>
    </group>
  );
}

/* ─── Full camera assembly ────────────────────────────────────────── */
function CinemaCamera({ mouseXRef, mouseYRef, restYaw }) {
  const headRef  = useRef();
  const focusRef = useRef();

  useFrame(() => {
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        restYaw + mouseXRef.current * 0.60,
        0.92
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        mouseYRef.current * 0.25,
        0.92
      );
    }
    if (focusRef.current) focusRef.current.rotation.y += 0.0018;
  });

  return (
    <group>
      <Tripod />
      <CameraHead headRef={headRef} focusRef={focusRef} restYaw={restYaw} />
    </group>
  );
}

/* ─── Visible spot beam cone ─────────────────────────────────────── */
function SpotBeam({ lx, ly, lz, radius, color, opacity }) {
  const height = ly - FLOOR_Y;
  return (
    <mesh position={[lx, FLOOR_Y + height / 2, lz]}>
      <coneGeometry args={[radius, height, 32, 1, true]} />
      <meshBasicMaterial color={color} transparent opacity={opacity}
        side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

/* ─── Studio light fixture ───────────────────────────────────────── */
function StudioLight({ pos, target, intensity, angle, color, beamR, beamOp }) {
  const spotRef   = useRef();
  const targetRef = useRef();
  const [px, py, pz] = pos;
  const [tx, , tz] = target;

  useEffect(() => {
    if (spotRef.current && targetRef.current) {
      spotRef.current.target = targetRef.current;
      targetRef.current.updateMatrixWorld();
    }
  }, []);

  return (
    <group>
      <mesh position={[px, py+0.14, pz]} castShadow>
        <boxGeometry args={[0.36,0.26,0.34]} />
        <meshStandardMaterial color={C_METAL} roughness={0.58} metalness={0.58} />
      </mesh>
      <mesh position={[px, py-0.02, pz]}>
        <cylinderGeometry args={[0.15,0.19,0.21,18]} />
        <meshStandardMaterial color={C_BODY} roughness={0.50} metalness={0.60} />
      </mesh>
      <mesh position={[px, py-0.14, pz]}>
        <circleGeometry args={[0.12,34]} />
        <meshBasicMaterial color={color} transparent opacity={0.98} />
      </mesh>
      <spotLight ref={spotRef} position={pos} angle={angle} penumbra={0.68}
        intensity={intensity} color={color} castShadow
        shadow-mapSize={[512,512]} shadow-camera-near={0.5}
        shadow-camera-far={36} shadow-bias={-0.001} decay={1.7} />
      <group ref={targetRef} position={target} />
      <SpotBeam lx={px} ly={py-0.14} lz={pz} radius={beamR} color={color} opacity={beamOp} />
      <mesh position={[tx, FLOOR_Y+0.01, tz]} rotation={[-Math.PI/2,0,0]}>
        <circleGeometry args={[beamR*0.62,34]} />
        <meshBasicMaterial color={color} transparent opacity={0.08}
          depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* ─── Studio scene ───────────────────────────────────────────────── */
function StudioScene({ mouseXRef, mouseYRef, restYaw }) {
  const cx = CAM_X;
  return (
    <group>
      {/* Hemisphere gives base fill from sky/ground so camera is never pitch black */}
      <hemisphereLight color="#1a3060" groundColor="#08101e" intensity={0.55} />
      <ambientLight color="#0a1428" intensity={0.30} />

      {/*
       * All three lights shifted +1.5 in Z (toward viewer) so the key beam
       * falls directly on the camera body, while the diagonal fan is kept.
       * Targets set to z≈1.0 — the centre of the camera body in world-Z.
       */}

      {/* KEY — almost directly above camera, slight backward tilt */}
      <StudioLight
        pos={[cx, 7.8, -0.5]} target={[cx, 0.6, 1.0]}
        intensity={400} angle={0.34} color="#d8e8ff" beamR={2.5} beamOp={0.09} />

      {/* FILL — upper left, forward of camera → lights the visible lens face */}
      <StudioLight
        pos={[cx - 4.2, 6.8, 3.0]} target={[cx - 0.4, 0.4, 1.0]}
        intensity={220} angle={0.25} color="#b8d0ff" beamR={2.0} beamOp={0.055} />

      {/* RIM — upper right, slightly behind → edge highlight */}
      <StudioLight
        pos={[cx + 3.5, 7.2, -1.3]} target={[cx + 0.2, 0.3, 1.0]}
        intensity={160} angle={0.21} color="#9ab8ff" beamR={1.7} beamOp={0.04} />

      <CinemaCamera mouseXRef={mouseXRef} mouseYRef={mouseYRef} restYaw={restYaw} />

      {/* Floor */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,FLOOR_Y,0]} receiveShadow>
        <planeGeometry args={[44,44]} />
        <meshStandardMaterial color="#060912" roughness={0.88} metalness={0.10} />
      </mesh>
      {/* Walls */}
      <mesh position={[0,5,-10]} receiveShadow>
        <planeGeometry args={[44,20]} />
        <meshStandardMaterial color="#060912" roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[-13,5,0]} rotation={[0,Math.PI/2,0]} receiveShadow>
        <planeGeometry args={[20,20]} />
        <meshStandardMaterial color="#070a14" roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[15,5,0]} rotation={[0,-Math.PI/2,0]} receiveShadow>
        <planeGeometry args={[20,20]} />
        <meshStandardMaterial color="#070a14" roughness={0.95} metalness={0.02} />
      </mesh>
    </group>
  );
}

/* ─── Main hero ──────────────────────────────────────────────────── */
export default function StudioHero() {
  const containerRef = useRef(null);
  const [mounted, setMounted]     = useState(false);
  const [view, setView]           = useState(VIEW.desktop);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  /* Raw refs — no spring/easing at the JS layer; smoothing is in useFrame lerp */
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  /* Keeps the 3D framing in sync with the CSS layout (stacked below `md`) and
     with the viewport aspect, so the rig is never composed out of frame. */
  useEffect(() => {
    const sync = () => setView(pickView());
    sync();
    window.addEventListener('resize', sync);
    window.addEventListener('orientationchange', sync);
    return () => {
      window.removeEventListener('resize', sync);
      window.removeEventListener('orientationchange', sync);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseXRef.current = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    mouseYRef.current = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    setCursorPos({
      x: ((e.clientX - rect.left) / rect.width)  * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    // Keep mouseXRef/mouseYRef at their last values so the camera
    // stays pointing in the direction it was looking when the cursor left.
    setIsHovered(false);
  }, []);

  /*
   * Layout: stacked below `md` (3D stage on top, copy underneath); from `md` up
   * the copy overlays a full-bleed stage as before. md:min-h-140 keeps short
   * landscape viewports from clipping the CTAs — the overlaid copy is taller
   * than 100vh there, so the hero grows instead.
   */
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen overflow-hidden select-none flex flex-col md:block md:h-screen md:min-h-140"
      style={{ background: '#060b14' }}
    >
      {/*
        ── 3D STAGE ──
        Mobile: an in-flow panel at the top of the stacked layout.
        md+:    absolutely fills the hero so the copy overlays it as before.
      */}
      <div className="relative w-full h-[40vh] min-h-60 max-h-110 shrink-0 md:absolute md:inset-0 md:h-full md:min-h-0 md:max-h-none">
        {mounted && (
          <Canvas
            shadows
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.65,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
            camera={{ position: VIEW.desktop.position, fov: VIEW.desktop.fov }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <color attach="background" args={['#060b14']} />
            <fog attach="fog" args={['#060b14', 16, 34]} />
            <CameraSetup view={view} />
            <StudioScene mouseXRef={mouseXRef} mouseYRef={mouseYRef} restYaw={view.restYaw} />
          </Canvas>
        )}

        {mounted && isHovered && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5,
            background: `radial-gradient(circle 300px at ${cursorPos.x}% ${cursorPos.y}%, rgba(59,130,246,0.06) 0%, transparent 70%)` }} />
        )}

        {/* Film grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
          style={{ zIndex: 6,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 7,
          background: 'radial-gradient(ellipse at center, transparent 28%, rgba(6,11,20,0.78) 100%)' }} />

        {/* Bottom / top fades */}
        <div className="absolute bottom-0 left-0 right-0 h-[15%] pointer-events-none"
          style={{ zIndex: 8, background: 'linear-gradient(to top, #060b14 0%, transparent 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-[12%] pointer-events-none"
          style={{ zIndex: 8, background: 'linear-gradient(to bottom, #060b14 0%, transparent 100%)' }} />
      </div>

      {/* ── HERO TEXT — below the stage on mobile, left half on md+ ── */}
      <div className="relative z-10 flex flex-1 items-center pt-5 pb-12 md:absolute md:inset-0 md:py-0 md:pt-19">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-full md:max-w-[50%]">

            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-8 h-px" style={{ background: 'rgba(96,165,250,0.55)' }} />
              <span className="text-xs tracking-[0.28em] uppercase font-medium"
                style={{ color: 'rgba(96,165,250,0.85)' }}>
                Creative Production Studio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35 }}
              className="text-[clamp(2.25rem,10vw,3.5rem)] md:text-[clamp(2rem,5vw,4.4rem)] font-bold tracking-tighter leading-[0.90] mb-4 md:mb-5"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              <span className="block text-foreground">We Frame</span>
              <span className="block text-foreground">Moments</span>
              <span className="block" style={{
                background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 42%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>That Build</span>
              <span className="block text-foreground">Brands.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.75 }}
              className="text-sm md:text-base text-foreground/45 font-light leading-relaxed mb-6 md:mb-7 max-w-85"
            >
              Cinematic videography &amp; photography for product marketing,
              brand stories, and commercial campaigns.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4"
            >
              <Link href="/portfolio"
                className="relative w-full sm:w-auto text-center px-7 py-3.5 font-bold text-sm uppercase tracking-[0.14em] overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', color: '#fff' }}>
                <span className="relative z-10">View Our Work</span>
                <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link href="/contact"
                className="w-full sm:w-auto text-center px-7 py-3.5 font-bold text-sm uppercase tracking-[0.14em] transition-all duration-300"
                style={{ border: '1px solid rgba(59,130,246,0.3)', color: 'rgba(235,242,255,0.75)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.65)';
                  e.currentTarget.style.color = '#93c5fd';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
                  e.currentTarget.style.color = 'rgba(235,242,255,0.75)';
                }}>
                Start a Project
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        style={{ zIndex: 10 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}>
        <span className="text-[10px] tracking-[0.22em] uppercase" style={{ color: 'rgba(235,242,255,0.2)' }}>
          Scroll
        </span>
        <motion.div animate={{ y: [0,7,0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={14} style={{ color: 'rgba(235,242,255,0.2)' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}
