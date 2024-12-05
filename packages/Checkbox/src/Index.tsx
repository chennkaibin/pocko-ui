import React from "react";
import "./Index.scss";

interface CheckboxProps {
  checkboxList: Array<{ id: string | number; name: string; value: string }>; // checkbox列表
  groupName: string; // checkbox的名字
  selectedValues: string[]; // 选择的值
  onChange: (value: string[]) => void; // 选择的回调函数
  type?: "inline" | "block"; // 行还是列
  disableLastIfSelected?: boolean; // 是否禁用最后一个未选中的选项
}

export default function Checkbox({
  checkboxList,
  groupName,
  selectedValues,
  onChange,
  type = "block",
  disableLastIfSelected = false, // 默认值为 false
}: CheckboxProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let updatedValues = [...selectedValues];

    if (e.target.checked) {
      updatedValues.push(value);
    } else {
      updatedValues = updatedValues.filter((v) => v !== value);
    }

    onChange(updatedValues);
  };

  // 计算未选中的复选框数量
  const uncheckedCount = checkboxList.length - selectedValues.length;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div className={type === "inline" ? "w-100 text-nowrap" : "w-100"}>
        {checkboxList.map((item, index) => (
          <div
            className={
              type === "inline"
                ? "form-check form-check-inline mb-0"
                : "form-check mb-0"
            }
            key={String(item.id)}
          >
            <input
              className="form-check-input"
              type="checkbox"
              id={String(item.id)}
              name={groupName}
              value={item.value}
              checked={selectedValues.includes(item.value)}
              onChange={handleCheckboxChange}
              disabled={
                disableLastIfSelected &&
                uncheckedCount === 1 &&
                !selectedValues.includes(item.value)
              } // 仅剩一个未选中时禁用
            />

            <label className="form-check-label" htmlFor={String(item.id)}>
              {item.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
