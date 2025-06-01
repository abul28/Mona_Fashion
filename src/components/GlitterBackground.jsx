import React from "react";
import "./GlitterBackground.css"; // ✅ this is essential

const createDots = (count = 100) => {
  const dots = [];
  for (let i = 0; i < count; i++) {
    const style = {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${5 + Math.random() * 3}s`,
      animationDelay: `${Math.random() * 5}s`,
      transform: `scale(${0.5 + Math.random()})`,
    };
    dots.push(<span className="glitter-dot" key={i} style={style} />);
  }
  return dots;
};

export default function GlitterBackground() {
  return <div className="glitter-container">{createDots(100)}</div>;
}
