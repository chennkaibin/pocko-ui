import React, {
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
  forwardRef,
} from "react";
import { clsWrite, clsCombine } from "../../../utils/cls";
import "./Index.scss";

export interface OptionConfig {
  [propName: string]: string | number | React.ReactNode | boolean;
}

interface RadioProps {
  contentRef?: React.ForwardedRef<any>;
  wrapperClassName?: string;
  formCheckClassName?: string;
  formCheckLableClassName?: string;
  options?: OptionConfig[] | string | unknown;
  value?: string;
  id?: string | number | any;
  name?: string;
  /** Function */
  onChange?: (arg_1: any, arg_2: any, arg_3?: any, arg_4?: any) => void;
}

export default function Radio({
  contentRef,
  wrapperClassName,
  formCheckClassName,
  formCheckLableClassName,
  options,
  value,
  onChange,
  id,
  name,
  ...attributes
}: RadioProps) {
  const rootRef = useRef<any>(null);

  const [val, setVal] = useState<any>(null);

  function handleChange(arg_1: any, arg_2: any, arg_3: any, arg_4: any) {
    setVal(arg_1);

    if (onChange) {
      onChange(arg_1, arg_2, arg_3, arg_4);
    }
  }

  useEffect(() => {
    setVal(value);
  }, [value]);

  useImperativeHandle(
    contentRef,
    () => ({
      clear: (cb?: any) => {
        setVal("");
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
          clsWrite(wrapperClassName, "mb-3")
        )}
        ref={rootRef}
      >
        {Array.isArray(options)
          ? options.map((option, index) => (
              <div
                key={index}
                className={clsWrite(formCheckClassName, "form-check")}
                {...attributes}
              >
                <input
                  id={`pocko-radio-${id}-${name}-${index}`}
                  name={name}
                  type="radio"
                  className="form-check-input"
                  value={option.value}
                  checked={option.value === val}
                  onChange={(e) =>
                    handleChange(e.target.value, e, option.label, index)
                  }
                  disabled={option.disabled}
                />

                <label
                  className={clsWrite(
                    formCheckLableClassName,
                    "form-check-label"
                  )}
                  htmlFor={`pocko-radio-${id}-${name}-${index}`}
                >
                  {typeof option.label === "string" ? (
                    <span dangerouslySetInnerHTML={{ __html: option.label }} />
                  ) : (
                    option.label
                  )}
                </label>
              </div>
            ))
          : ""}
      </div>
    </>
  );
}
