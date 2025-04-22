import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Index.scss";

import { clsCombine, clsWrite } from "../../../utils/cls";

interface Props {
  wrapperClassName?: string;
  delay?: number;
  color?: string;
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: "top" | "bottom" | "right" | "left";
}

export default function ToolTips({
  wrapperClassName,
  delay = 300,
  color = "#000",
  children,
  content,
  position = "bottom",
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetDataRef = useRef<{
    rect: DOMRect;
    scrollX: number;
    scrollY: number;
  } | null>(null);

  const calculatePosition = (
    rect: DOMRect,
    scrollX: number,
    scrollY: number,
    tooltipWidth: number,
    tooltipHeight: number
  ) => {
    const spacing = 10; // 与目标元素的间距
    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = rect.top + scrollY - tooltipHeight - spacing;
        left = rect.left + scrollX + rect.width / 2 - tooltipWidth / 2;
        break;
      case "bottom":
        top = rect.top + scrollY + rect.height + spacing;
        left = rect.left + scrollX + rect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2;
        left = rect.left + scrollX - tooltipWidth - spacing;
        break;
      case "right":
        top = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2;
        left = rect.left + scrollX + rect.width + spacing;
        break;
    }

    return { top, left };
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    targetDataRef.current = {
      rect,
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset,
    };

    // 首次预估定位
    const estimatedSize =
      position === "left" || position === "right"
        ? { width: 200, height: 40 }
        : { width: 150, height: 60 };

    setPos(
      calculatePosition(
        rect,
        targetDataRef.current.scrollX,
        targetDataRef.current.scrollY,
        estimatedSize.width,
        estimatedSize.height
      )
    );

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  useEffect(() => {
    if (isVisible && tooltipRef.current && targetDataRef.current) {
      // 根据实际尺寸重新计算
      const { rect, scrollX, scrollY } = targetDataRef.current;
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;

      setPos(
        calculatePosition(rect, scrollX, scrollY, tooltipWidth, tooltipHeight)
      );
    }
  }, [isVisible]);

  const handleMouseLeave = () => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  return (
    <div
      ref={containerRef}
      className={clsCombine(wrapperClassName, "tooltip-container")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="tooltip-content">{children}</div>

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`tooltip-bubble ${position}`}
            style={{
              top: pos.top,
              left: pos.left,
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
