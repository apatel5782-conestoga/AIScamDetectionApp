import type { CSSProperties } from "react";

export default function LiveAiRobot({
  size = "2.8rem",
  className = "",
  talking = false,
}: {
  size?: string;
  className?: string;
  talking?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`ai-bug ${talking ? "ai-bug--talking" : ""} ${className}`.trim()}
      style={{ "--bug-size": size } as CSSProperties}
    >
      <span className="ai-bug__halo" />
      <span className="ai-bug__spark ai-bug__spark--left" />
      <span className="ai-bug__spark ai-bug__spark--right" />
      <span className="ai-bug__leg ai-bug__leg--1" />
      <span className="ai-bug__leg ai-bug__leg--2" />
      <span className="ai-bug__leg ai-bug__leg--3" />
      <span className="ai-bug__leg ai-bug__leg--4" />
      <span className="ai-bug__leg ai-bug__leg--5" />
      <span className="ai-bug__leg ai-bug__leg--6" />
      <span className="ai-bug__leg ai-bug__leg--7" />
      <span className="ai-bug__leg ai-bug__leg--8" />
      <span className="ai-bug__head">
        <span className="ai-bug__eye ai-bug__eye--left" />
        <span className="ai-bug__eye ai-bug__eye--right" />
      </span>
      <span className="ai-bug__body" />
      <span className="ai-bug__mark" />
    </span>
  );
}
