import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  ChangeEvent,
  CompositionEvent,
  KeyboardEvent,
  FocusEvent,
  useImperativeHandle,
} from "react";

import "./Index.scss";
import { clsWrite, clsCombine } from "../../../utils/cls";

interface InputProps {
  id?: string | number | any; // input框的 id
  name?: string | any; // input框的 name
  inputRef?: any; // input绑定的ref

  size?: string | number; // 宽度
  label?: string | React.ReactNode; // 添加了 label 支持
  labelClassName?: string;
  wrapperClassName?: string; // 最外层的样式名字
  controlGroupWrapperClassName?: string; // input-group 样式名字
  controlGroupTextClassName?: string; // inpupt-group-text 样式名字
  iconLeft?: React.ReactNode | string; // input-group 左侧
  iconRight?: React.ReactNode | string; // input-group 右侧
  controlClassName?: string; // input 样式名字

  type?: string; // 输入类型 (如 'text', 'password', 'email')
  disabled?: any; // 是否禁用
  readonly?: any; // 是否只读
  required?: any; // 是否必填
  requiredLabel?: string | any; // 必填提示语
  defaultValue?: string | any; // 初始值
  placeholder?: string; // 占位符
  autoComplete?: "on" | "off"; // 是否自动填充，默认是 on(自动填充)
  // type == number的时候
  min?: number; // 最小值
  max?: number; // 最大值
  step?: number; // 步长

  onChange?: (value: string) => void; // 改变时回调
  onBlur?: () => void; // 失焦回调
  onFocus?: () => void; // 聚焦
  onPressEnter?: Function | any; // 键盘按下回调
}

const Input = forwardRef((props: InputProps, externalRef: any) => {
  const {
    id,
    name,
    inputRef,
    wrapperClassName,
    controlGroupWrapperClassName,
    defaultValue,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    onPressEnter,
    type,
    readonly,
    disabled,
    required,
    requiredLabel,
    label,
    labelClassName,
    controlClassName,
    controlGroupTextClassName,
    iconLeft,
    iconRight,
    autoComplete = "on",
    size,
    min,
    max,
    step,
  } = props;

  const rootRef = useRef<any>(null);

  const idRes = id;
  const typeRes = typeof type === "undefined" ? "text" : type;

  const [inputValue, setInputValue] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setInputValue(newValue);
    if (onChange) {
      onChange(newValue); // 触发父组件的 onChange 回调
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur(); // 触发父组件的 onBlur 回调
    }
  };

  const handleFoucus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (onPressEnter) {
      onPressEnter(event);
    }
  };

  useEffect(() => {
    if (defaultValue != null && defaultValue !== "") {
      setInputValue(defaultValue);
    } else {
      setInputValue("");
    }
  }, [defaultValue]);

  return (
    <>
      <div
        className={clsWrite(wrapperClassName, "mb-3 position-relative")}
        ref={rootRef}
      >
        {label ? (
          <>
            {typeof label === "string" ? (
              <label
                htmlFor={idRes}
                className={clsWrite(labelClassName, "form-label")}
              >
                {label}
              </label>
            ) : (
              <label
                htmlFor={idRes}
                className={clsWrite(labelClassName, "form-label")}
              >
                {label}
              </label>
            )}
          </>
        ) : null}

        <div
          className={clsCombine(
            "position-relative",
            clsWrite(controlGroupWrapperClassName, "input-group")
          )}
          style={{ width: `${size}px` }}
        >
          {iconLeft ? (
            <span
              className={clsWrite(
                controlGroupTextClassName,
                "input-group-text"
              )}
            >
              {iconLeft}
            </span>
          ) : null}

          <input
            ref={inputRef}
            id={idRes}
            name={name}
            type={typeRes}
            value={inputValue}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFoucus}
            onKeyDown={handleKeyDown}
            disabled={disabled || null}
            readOnly={readonly || null}
            className={clsWrite(controlClassName, "form-control")}
            autoComplete={autoComplete}
            min={typeRes === "number" ? min : undefined} // 仅当类型是 number 时传递 min
            max={typeRes === "number" ? max : undefined} // 仅当类型是 number 时传递 max
            step={typeRes === "number" ? step : undefined} // 仅当类型是 number 时传递 step
          />

          {iconRight ? (
            <span
              className={clsWrite(
                controlGroupTextClassName,
                "input-group-text"
              )}
            >
              {iconRight}
            </span>
          ) : null}
        </div>

        {required ? (
          <>
            {requiredLabel || requiredLabel === "" ? (
              requiredLabel
            ) : (
              <span className="position-absolute end-0 top-0 my-2 mx-2">
                <span className="text-danger">*</span>
              </span>
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
});

export default Input;
