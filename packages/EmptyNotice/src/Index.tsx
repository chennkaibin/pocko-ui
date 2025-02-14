import React from "react";
import "./EmptyNotice.scss";

import { clsWrite, clsCombine } from "../../../utils/cls";

interface Props {
  wrapperClassName?: string;
  image?: React.ReactNode | string; // 支持 ReactNode 或 string
  imageStyle?: React.CSSProperties;
  description: React.ReactNode | string; // 支持 ReactNode 或 string
  descriptionWrapperClassName?: string;
}

export default function EmptyNotice({
  wrapperClassName,
  description,
  image,
  imageStyle,
  descriptionWrapperClassName = "mt-4",
}: Props) {
  return (
    <div
      className={clsWrite(
        wrapperClassName,
        "card-body d-flex flex-column align-items-center"
      )}
    >
      {/* 图片部分 */}
      {image ? (
        typeof image === "string" ? ( // 如果是字符串，渲染为 img 标签
          <img src={image} alt="Custom Image" style={{ ...imageStyle }} />
        ) : (
          image // 如果是 ReactNode，直接渲染
        )
      ) : (
        // 如果未提供 image，使用默认的 SVG
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 384 512"
            style={{
              fill: "#ff8746",
              width: "70px",
              height: "70px",
              padding: "10px",
              background: "rgb(255,229,207)",
              borderRadius: "40px",
            }}
          >
            <path d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2l0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4l0 0c19.8 27.1 39.7 54.4 49.2 86.2H272zM192 512c44.2 0 80-35.8 80-80V416H112v16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z" />
          </svg>
        </div>
      )}

      {/* 描述部分 */}
      <div className={`${descriptionWrapperClassName}`}>{description}</div>
    </div>
  );
}
