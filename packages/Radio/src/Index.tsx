import React from "react";
import "./Index.scss";

import { clsWrite, clsCombine } from "../../../utils/cls";

interface RadioProps {
  wrapperClassName?: string; // 最外层的样式名字
  label?: string | React.ReactNode; // 添加了 label 支持
  wrapperContentCalssName?: string; // radio外层样式
  radioList: any[]; // 传入的 radio数据
  controlClassName?: string; // input样式
  groupName: string; // radio的组名字
  defaultValue?: string; // 选中的值
  value?: string; // input的value
  name?: string; // lable应该展示的值
  radioChange: (value: any) => void; // 选择的回调函数
  type?: "inline" | "block"; // 行还是列
}

export default function Radio({
  wrapperClassName,
  label, // 标题
  wrapperContentCalssName,
  radioList,
  controlClassName,
  groupName, // radio的组名字
  defaultValue, // 选中的值
  value = "value",
  name,
  radioChange, // 选择的回调
  type = "block", // 行还是列
}: RadioProps) {
  return (
    <div
      className={clsCombine(
        "radio-group__wrapper",
        clsWrite(wrapperClassName, "mb-2 position-relative")
      )}
    >
      {label ? (
        <>{typeof label === "string" ? <label>{label}</label> : label}</>
      ) : null}

      <div
        className={clsWrite(wrapperContentCalssName, "radio-group__content")}
      >
        {radioList.map((item: any, index: any) => (
          <div
            className={
              type === "inline"
                ? "form-check form-check-inline mb-0"
                : "form-check mb-0"
            }
            key={index}
          >
            <input
              className={clsWrite(controlClassName, "form-check-input")}
              type="radio"
              id={`radio-group-${groupName}-${index}`}
              name={groupName}
              value={item[value]}
              checked={defaultValue == item[value]}
              onChange={() => {
                radioChange(item);
              }}
            />
            <label
              className="form-check-label"
              htmlFor={`radio-group-${groupName}-${index}`}
            >
              {name ? item[name] : item.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
