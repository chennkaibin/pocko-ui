import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import "./Index.scss";

interface Props {
  delay?: number;
  color?: string;
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom"; // 新增的 position 参数
}

export default function ToolTips({
  delay = 300,
  color = "#000",
  children,
  content,
  position = "bottom", // 默认为 bottom
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const timeoutHoverIdRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const { top, left, height, width } =
      event.currentTarget.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // 获取 `tooltip-container-content` 的高度
    const contentHeight = contentRef.current?.offsetHeight || 0;

    const tooltipTop =
      position === "top"
        ? top + scrollY - contentHeight // 在上方显示
        : top + height + scrollY + 10; // 在下方显示

    setPos({
      top: tooltipTop,
      left: left + width / 2 + scrollX,
    });

    timeoutHoverIdRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutHoverIdRef.current) {
      clearTimeout(timeoutHoverIdRef.current);
    }
    setIsVisible(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={tooltipRef}
      className="tooltip-container"
    >
      <div className="tooltip-container-content" ref={contentRef}>
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            className={`my-tooltip badge pos-absolute p-1 rounded text-white text-wrap ${position}`}
            style={{
              top: pos.top,
              left: pos.left,
              backgroundColor: color,
              transform: "translateX(-50%)",
              // 设置CSS变量 --tooltip-color
              ["--tooltip-color" as any]: color,
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </div>
  );
}
