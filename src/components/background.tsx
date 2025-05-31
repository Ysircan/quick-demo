"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function Background() {
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 z-0 pointer-events-none"
      options={{
        fullScreen: { enable: false },
        background: { color: "transparent" },
        fpsLimit: 60,
        particles: {
          number: {
            value: 60,
            density: { enable: true, area: 800 },
          },
          color: { value: ["#60a5fa", "#c084fc", "#facc15"] }, // 暗色霓虹蓝紫金
          shape: { type: "circle" },
          opacity: { value: 0.15 },
          size: { value: 2, random: true },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            outModes: { default: "bounce" },
          },
          links: {
            enable: true,
            color: "#c084fc",
            distance: 100,
            opacity: 0.2,
            width: 1,
          },
        },
        interactivity: {
          events: {
            onHover: { enable: false },
            onClick: { enable: false },
            resize: true,
          },
        },
        detectRetina: true,
      }}
    />
  );
}
