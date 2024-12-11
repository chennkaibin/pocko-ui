import React, {
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
  forwardRef,
} from "react";
import { clsWrite, clsCombine } from "../../../utils/cls";
import "./Index.scss";

interface CheckboxProps {
  contentRef?: React.ForwardedRef<any>;
  wrapperClassName?: string;
  controlClassName?: string;
  itemSelectedClassName?: string;
  value: string | boolean;
  label?: React.ReactNode | string;
  /** input  */
  id?: string | number | any;
  name?: string;
  checked?: boolean;
  disabled?: any;
  style?: React.CSSProperties;
  /** Function */
  onChange?: (arg_1: any, arg_2: any) => void;
}

export default function Checkbox({
  contentRef,
  wrapperClassName,
  controlClassName,
  itemSelectedClassName,
  value,
  label,
  name,
  checked,
  disabled,
  id,
  style,
  onChange,
  ...attributes
}: CheckboxProps) {
  const rootRef = useRef<any>(null);

  const idRes = id;
  const nameRes = name;

  const [val, setVal] = useState<any>(null); //

  // onChange函数
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const _check = event.target.checked;
    setVal(_check);

    if (typeof onChange === "function") {
      onChange(event, value);
    }
  }

  useEffect(() => {
    setVal(checked);
  }, [checked]);

  useImperativeHandle(
    contentRef,
    () => ({
      clear: (cb?: any) => {
        setVal(false);
        cb?.();
      },
      set: (value: string, cb?: any) => {
        setVal(value);
        cb?.();
      },
    }),
    [contentRef]
  );

  return (
    <>
      <div
        className={clsCombine(
          "form-check__wrapper",
          clsWrite(wrapperClassName, "mb-3"),
          val ? clsWrite(itemSelectedClassName, "item-selected") : ""
        )}
        ref={rootRef}
      >
        <div className="form-check">
          <input
            className={clsWrite(controlClassName, "form-check-input")}
            type="checkbox"
            value={(value as string) || ""}
            checked={val || false}
            id={`pocko-form-check-label-${idRes}`}
            data-checked={val}
            data-name={`pocko-form-check-label-${nameRes}`}
            style={{ cursor: "pointer", ...style }}
            disabled={disabled || null}
            onChange={handleChange}
            {...attributes}
          />

          {label && (
            <label
              htmlFor={`pocko-form-check-label-${idRes}`}
              className="form-check-label"
            >
              {label}
            </label>
          )}
        </div>
      </div>
    </>
  );
}
