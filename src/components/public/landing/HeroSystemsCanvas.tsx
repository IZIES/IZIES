"use client";

import { useEffect, useRef } from "react";

type MeshNode = {
  x: number;
  y: number;
  drift: number;
  phase: number;
  speed: number;
  radius: number;
  hue: "indigo" | "cyan" | "violet";
};

type Stream = {
  y: number;
  phase: number;
  speed: number;
  color: string;
  amplitude: number;
};

type Star = {
  x: number;
  y: number;
  size: number;
  phase: number;
  color: string;
};

type Comet = {
  startX: number;
  startY: number;
  length: number;
  phase: number;
  speed: number;
  color: string;
};

const NODE_COLORS: Record<MeshNode["hue"], string> = {
  indigo: "99, 102, 241",
  cyan: "34, 211, 238",
  violet: "168, 85, 247",
};

function createNodes(count: number): MeshNode[] {
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / 6);
    const col = index % 6;
    const spreadX = 0.1 + col * 0.16 + Math.sin(index * 1.7) * 0.035;
    const spreadY = 0.12 + row * 0.15 + Math.cos(index * 1.3) * 0.04;

    return {
      x: Math.min(0.92, Math.max(0.08, spreadX)),
      y: Math.min(0.9, Math.max(0.08, spreadY)),
      drift: 10 + (index % 5) * 3,
      phase: index * 0.73,
      speed: 0.00022 + (index % 4) * 0.000045,
      radius: 1.2 + (index % 3) * 0.35,
      hue: index % 3 === 0 ? "cyan" : index % 3 === 1 ? "indigo" : "violet",
    };
  });
}

function createStreams(): Stream[] {
  return [
    { y: 0.24, phase: 0.1, speed: 0.00034, color: "34, 211, 238", amplitude: 34 },
    { y: 0.38, phase: 1.6, speed: 0.00027, color: "129, 140, 248", amplitude: 48 },
    { y: 0.55, phase: 2.4, speed: 0.00031, color: "168, 85, 247", amplitude: 42 },
    { y: 0.72, phase: 3.2, speed: 0.00024, color: "16, 185, 129", amplitude: 30 },
  ];
}

function createStars(count: number): Star[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = Math.sin(index * 91.7) * 10000;
    const seedTwo = Math.sin(index * 37.3 + 4.2) * 10000;
    const x = seed - Math.floor(seed);
    const y = seedTwo - Math.floor(seedTwo);
    const palette = ["226, 232, 240", "125, 211, 252", "196, 181, 253", "167, 243, 208"];

    return {
      x,
      y: y * 0.9 + 0.04,
      size: 0.7 + (index % 5) * 0.32,
      phase: index * 0.67,
      color: palette[index % palette.length],
    };
  });
}

function createComets(): Comet[] {
  return [
    { startX: 0.08, startY: 0.18, length: 190, phase: 0, speed: 0.00013, color: "125, 211, 252" },
    { startX: 0.52, startY: 0.08, length: 230, phase: 0.42, speed: 0.0001, color: "196, 181, 253" },
    { startX: 0.82, startY: 0.28, length: 165, phase: 0.72, speed: 0.00012, color: "34, 211, 238" },
  ];
}

export function HeroSystemsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let lastFrame = 0;
    let isVisible = document.visibilityState === "visible";
    let nodes = createNodes(window.innerWidth < 768 ? 10 : 22);
    const streams = createStreams();
    const stars = createStars(window.innerWidth < 768 ? 22 : 42);
    const comets = createComets();
    const pointer = { x: 0.62, y: 0.42, px: -1000, py: -1000, active: false, ripple: 0 };
    const trail: { x: number; y: number; life: number }[] = [];
    const scroll = { y: window.scrollY || 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.15);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = createNodes(width < 768 ? 10 : 22);
    };

    const getNodePosition = (node: MeshNode, time: number) => {
      const motionScale = reducedMotion.matches ? 0 : 1;
      const parallaxX = pointer.active ? (pointer.x - 0.5) * 18 : 0;
      const parallaxY = pointer.active ? (pointer.y - 0.5) * 12 : 0;
      const driftX = Math.sin(time * node.speed + node.phase) * node.drift * motionScale;
      const driftY = Math.cos(time * node.speed * 0.8 + node.phase) * node.drift * 0.65 * motionScale;

      return {
        x: node.x * width + driftX + parallaxX * (node.x - 0.5),
        y: node.y * height + driftY + parallaxY * (node.y - 0.5),
      };
    };



    const drawAurora = (time: number) => {
      context.save();
      context.globalCompositeOperation = "lighter";

      streams.forEach((stream, streamIndex) => {
        const baseY = height * stream.y;
        const offset =
          Math.sin(time * stream.speed + stream.phase + scroll.y * 0.0012) * 34 +
          Math.sin(scroll.y * 0.006 + stream.phase) * 18;
        const gradient = context.createLinearGradient(0, baseY - 90, width, baseY + 90);
        gradient.addColorStop(0, `rgba(${stream.color}, 0)`);
        gradient.addColorStop(0.28, `rgba(${stream.color}, 0.025)`);
        gradient.addColorStop(0.52, `rgba(${stream.color}, 0.045)`);
        gradient.addColorStop(0.76, `rgba(${stream.color}, 0.032)`);
        gradient.addColorStop(1, `rgba(${stream.color}, 0)`);

        context.beginPath();
        context.moveTo(-80, baseY + offset);

        for (let x = -80; x <= width + 80; x += 70) {
          const y =
            baseY +
            offset +
            Math.sin(x * 0.003 + time * stream.speed * 3 + stream.phase + scroll.y * 0.001) * (stream.amplitude * 0.6) +
            Math.cos(x * 0.002 + streamIndex) * 15;
          context.lineTo(x, y);
        }

        context.lineTo(width + 80, baseY + offset + 130);
        context.lineTo(-80, baseY + offset + 130);
        context.closePath();
        context.fillStyle = gradient;
        context.filter = "blur(24px)";
        context.fill();
        context.filter = "none";
      });

      context.restore();
    };

    const drawCoreGlow = (time: number) => {
      context.save();
      context.globalCompositeOperation = "lighter";

      const pulse = reducedMotion.matches ? 0.8 : 0.72 + Math.sin(time * 0.001) * 0.18;
      const core = context.createRadialGradient(
        width * 0.64,
        height * 0.46,
        10,
        width * 0.64,
        height * 0.46,
        Math.min(width, height) * 0.44,
      );
      core.addColorStop(0, `rgba(34, 211, 238, ${0.035 * pulse})`);
      core.addColorStop(0.32, `rgba(129, 140, 248, ${0.03 * pulse})`);
      core.addColorStop(0.62, `rgba(168, 85, 247, ${0.018 * pulse})`);
      core.addColorStop(1, "rgba(2, 6, 23, 0)");
      context.fillStyle = core;
      context.fillRect(0, 0, width, height);

      context.restore();
    };

    const drawStar = (x: number, y: number, radius: number, color: string, alpha: number) => {
      context.save();
      context.translate(x, y);
      context.strokeStyle = `rgba(${color}, ${alpha})`;
      context.lineWidth = Math.max(0.7, radius * 0.45);

      context.beginPath();
      context.moveTo(-radius * 2.6, 0);
      context.lineTo(radius * 2.6, 0);
      context.moveTo(0, -radius * 2.6);
      context.lineTo(0, radius * 2.6);
      context.moveTo(-radius * 1.5, -radius * 1.5);
      context.lineTo(radius * 1.5, radius * 1.5);
      context.moveTo(radius * 1.5, -radius * 1.5);
      context.lineTo(-radius * 1.5, radius * 1.5);
      context.stroke();
      context.restore();
    };

    const drawStarfield = (time: number) => {
      context.save();
      context.globalCompositeOperation = "lighter";

      stars.forEach((star, index) => {
        const shimmerBase = (Math.sin(time * 0.002 + star.phase) + 1) / 2;
        const shimmer = reducedMotion.matches ? 0.58 : Math.pow(shimmerBase, 6) * 1.5;
        const x = star.x * width;
        const y = star.y * height;

        if (index % 10 === 0) {
          drawStar(x, y, star.size * 2, star.color, Math.min(1, shimmer));
        } else {
          context.beginPath();
          context.fillStyle = `rgba(${star.color}, ${Math.min(0.8, shimmer + 0.1)})`;
          context.arc(x, y, star.size, 0, Math.PI * 2);
          context.fill();
        }
      });

      context.restore();
    };

    const drawCosmicSigils = (time: number) => {
      const sigils = [
        { x: 0.2, y: 0.34, r: 92, color: "125, 211, 252", phase: 0 },
        { x: 0.62, y: 0.46, r: 128, color: "168, 85, 247", phase: 1.8 },
        { x: 0.82, y: 0.3, r: 78, color: "34, 211, 238", phase: 3.1 },
      ];

      context.save();
      context.globalCompositeOperation = "lighter";

      sigils.forEach((sigil, index) => {
        const x = sigil.x * width + Math.sin(time * 0.00018 + sigil.phase) * 14;
        const y = sigil.y * height + Math.cos(time * 0.00016 + sigil.phase) * 10;
        const radius = width < 768 ? sigil.r * 0.58 : sigil.r;
        const pulse = reducedMotion.matches ? 0.58 : 0.42 + Math.sin(time * 0.001 + sigil.phase) * 0.18;

        context.strokeStyle = `rgba(${sigil.color}, ${0.045 + pulse * 0.05})`;
        context.lineWidth = 1;
        context.setLineDash([6, 12]);
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.stroke();

        context.setLineDash([]);
        for (let point = 0; point < 6; point += 1) {
          const angle = (Math.PI * 2 * point) / 6 + time * 0.00008 * (index + 1);
          const sx = x + Math.cos(angle) * radius * 0.66;
          const sy = y + Math.sin(angle) * radius * 0.66;
          const tx = x + Math.cos(angle + Math.PI * 0.66) * radius * 0.38;
          const ty = y + Math.sin(angle + Math.PI * 0.66) * radius * 0.38;

          context.strokeStyle = `rgba(${sigil.color}, ${0.032 + pulse * 0.04})`;
          context.beginPath();
          context.moveTo(sx, sy);
          context.lineTo(tx, ty);
          context.stroke();

          drawStar(sx, sy, 1.25, sigil.color, 0.16 + pulse * 0.16);
        }
      });

      context.restore();
    };

    const drawComets = (time: number) => {
      context.save();
      context.globalCompositeOperation = "lighter";

      comets.forEach((comet) => {
        const progress = reducedMotion.matches ? comet.phase : (time * comet.speed + comet.phase) % 1;
        const eased = progress < 0.82 ? progress / 0.82 : 1;
        const fade = progress < 0.82 ? Math.sin(eased * Math.PI) : 0;
        const x = (comet.startX + eased * 0.42) * width;
        const y = (comet.startY + eased * 0.24) * height;
        const tailX = x - comet.length;
        const tailY = y - comet.length * 0.55;

        const gradient = context.createLinearGradient(tailX, tailY, x, y);
        gradient.addColorStop(0, `rgba(${comet.color}, 0)`);
        gradient.addColorStop(0.72, `rgba(${comet.color}, ${0.14 * fade})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${0.8 * fade})`);

        context.strokeStyle = gradient;
        context.lineWidth = 1.45;
        context.beginPath();
        context.moveTo(tailX, tailY);
        context.lineTo(x, y);
        context.stroke();

        drawStar(x, y, 2.5, comet.color, 0.8 * fade);
      });

      context.restore();
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      drawStarfield(time);
      drawAurora(time);
      drawCoreGlow(time);
      drawCosmicSigils(time);

      const positions = nodes.map((node) => getNodePosition(node, time));
      const connectDistance = width < 768 ? 115 : 165;

      for (let i = 0; i < positions.length; i += 1) {
        for (let j = i + 1; j < positions.length; j += 1) {
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectDistance) {
            const alpha = (1 - distance / connectDistance) * 0.21;
            const baseColor = NODE_COLORS[nodes[i].hue];
            let strokeStyle: string | CanvasGradient = `rgba(${baseColor}, ${alpha})`;
            let isGlowing = false;
            let sparkPoint: { x: number; y: number; color: string; alpha: number } | null = null;

            const distToMouse = Math.hypot(positions[i].x - pointer.px, positions[i].y - pointer.py);
            let mouseGlowFactor = 0;
            if (pointer.active && distToMouse < 220) {
              mouseGlowFactor = Math.pow(1 - distToMouse / 220, 2);
            }

            const hasSlowSpark = (i * 19 + j * 11) % 23 === 0;
            if (hasSlowSpark) {
              const sparkProgress = (time * 0.000055 + ((i * 7 + j * 5) % 5) * 0.035) % 1;
              const edgeFade = Math.sin(sparkProgress * Math.PI);
              const sparkAlpha = 0.24 + edgeFade * 0.34;
              const startNode = positions[i].y < positions[j].y ? positions[i] : positions[j];
              const endNode = positions[i].y < positions[j].y ? positions[j] : positions[i];
              const sparkX = startNode.x + (endNode.x - startNode.x) * sparkProgress;
              const sparkY = startNode.y + (endNode.y - startNode.y) * sparkProgress;

              const grad = context.createLinearGradient(startNode.x, startNode.y, endNode.x, endNode.y);
              const stops: [number, string][] = [
                [0, `rgba(${baseColor}, ${alpha})`],
                [Math.max(0, sparkProgress - 0.16), `rgba(${baseColor}, ${alpha})`],
                [Math.max(0, sparkProgress - 0.1), `rgba(34, 211, 238, ${sparkAlpha * 0.42})`],
                [sparkProgress, `rgba(226, 232, 240, ${sparkAlpha})`],
                [Math.min(1, sparkProgress + 0.1), `rgba(34, 211, 238, ${sparkAlpha * 0.42})`],
                [Math.min(1, sparkProgress + 0.16), `rgba(${baseColor}, ${alpha})`],
                [1, `rgba(${baseColor}, ${alpha})`],
              ];

              stops
                .sort((a, b) => a[0] - b[0])
                .forEach(([stop, color]) => grad.addColorStop(stop, color));

              isGlowing = true;
              strokeStyle = grad;
              sparkPoint = { x: sparkX, y: sparkY, color: "125, 211, 252", alpha: sparkAlpha };
            }

            if (mouseGlowFactor > 0) {
              isGlowing = true;
              const injectionAlpha = Math.min(0.62, alpha + mouseGlowFactor * 0.72);
              strokeStyle = `rgba(34, 211, 238, ${injectionAlpha})`;
            }

            context.strokeStyle = strokeStyle;
            context.lineWidth = mouseGlowFactor > 0 ? 1.25 + mouseGlowFactor : hasSlowSpark ? 1.35 : 1.12;
            
            if (isGlowing) {
              context.shadowColor = mouseGlowFactor > 0 ? "rgba(34, 211, 238, 0.72)" : "rgba(125, 211, 252, 0.78)";
              context.shadowBlur = mouseGlowFactor > 0 ? 8 : 6;
            }

            context.beginPath();
            context.moveTo(positions[i].x, positions[i].y);
            context.lineTo(positions[j].x, positions[j].y);
            context.stroke();

            if (sparkPoint && !mouseGlowFactor) {
              drawStar(sparkPoint.x, sparkPoint.y, 2.1, sparkPoint.color, sparkPoint.alpha);
            }

            if (isGlowing) {
              context.shadowBlur = 0;
            }
          }
        }
      }

      positions.forEach((position, index) => {
        const node = nodes[index];
        const color = NODE_COLORS[node.hue];
        const pulse = reducedMotion.matches
          ? 0.25
          : 0.32 + Math.sin(time * 0.0014 + node.phase) * 0.16;

        context.beginPath();
        context.fillStyle = `rgba(${color}, ${0.22 + pulse * 0.48})`;
        context.arc(position.x, position.y, node.radius + 0.8, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.strokeStyle = `rgba(${color}, ${0.05 + pulse * 0.08})`;
        context.lineWidth = 1;
        context.arc(position.x, position.y, node.radius + 11 + pulse * 16, 0, Math.PI * 2);
        context.stroke();
      });

      const sweep = (time * 0.00005 + scroll.y * 0.00022) % 1;
      const gradient = context.createLinearGradient(width * (sweep - 0.26), 0, width * (sweep + 0.26), height);
      gradient.addColorStop(0, "rgba(34, 211, 238, 0)");
      gradient.addColorStop(0.5, "rgba(99, 102, 241, 0.038)");
      gradient.addColorStop(1, "rgba(168, 85, 247, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      drawComets(time);
      
      // --- DRAW MOUSE EFFECTS ---
      
      // 1. Plasma Trail
      if (trail.length > 0) {
        context.lineCap = "round";
        context.lineJoin = "round";
        
        for (let i = 0; i < trail.length - 1; i++) {
          const p = trail[i];
          const nextP = trail[i + 1];
          
          p.life -= 0.08;
          
          if (p.life <= 0) continue;
          
          const trailAlpha = Math.pow(p.life, 2);
          const trailWidth = p.life * 3.2;
          
          context.beginPath();
          context.moveTo(p.x, p.y);
          context.lineTo(nextP.x, nextP.y);
          
          context.strokeStyle = `rgba(34, 211, 238, ${trailAlpha * 0.55})`;
          context.lineWidth = trailWidth;
          context.shadowColor = "rgba(34, 211, 238, 0.7)";
          context.shadowBlur = 9;
          context.stroke();
          
          // Inner White Core
          context.strokeStyle = `rgba(255, 255, 255, ${trailAlpha})`;
          context.lineWidth = trailWidth * 0.4;
          context.shadowBlur = 4;
          context.stroke();
        }
        
        // Remove dead points
        while (trail.length > 0 && trail[0].life <= 0) {
          trail.shift();
        }
      }

      // 2. Click Shockwave Ripple
      if (pointer.ripple > 0) {
        context.beginPath();
        const rippleRadius = (1 - pointer.ripple) * 220;
        context.arc(pointer.px, pointer.py, rippleRadius, 0, Math.PI * 2);
        
        context.strokeStyle = `rgba(34, 211, 238, ${pointer.ripple * 0.34})`;
        context.lineWidth = pointer.ripple * 3.5;
        context.shadowColor = "rgba(34, 211, 238, 1)";
        context.shadowBlur = 8;
        context.stroke();
        
        context.shadowBlur = 0;
        pointer.ripple -= 0.05;
        if (pointer.ripple < 0) pointer.ripple = 0;
      }
    };

    const animate = (time: number) => {
      if (!isVisible) {
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }

      if (reducedMotion.matches) {
        draw(0);
        return;
      }

      const targetFrameMs = pointer.active || pointer.ripple > 0 ? 34 : 42;
      if (time - lastFrame >= targetFrameMs) {
        draw(time);
        lastFrame = time;
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
      pointer.px = event.clientX - rect.left;
      pointer.py = event.clientY - rect.top;
      pointer.active = true;

      const lastTrailPoint = trail[trail.length - 1];
      if (!lastTrailPoint || Math.hypot(pointer.px - lastTrailPoint.x, pointer.py - lastTrailPoint.y) > 18) {
        trail.push({ x: pointer.px, y: pointer.py, life: 0.75 });
      }
      while (trail.length > 12) {
        trail.shift();
      }
    };

    const handlePointerDown = () => {
      pointer.ripple = 1.0; // Trigger shockwave
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleScroll = () => {
      scroll.y = window.scrollY || 0;
      if (reducedMotion.matches) {
        draw(0);
      }
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
      if (isVisible && !animationFrame) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    resize();
    draw(0);
    animationFrame = window.requestAnimationFrame(animate);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-100"
    />
  );
}
