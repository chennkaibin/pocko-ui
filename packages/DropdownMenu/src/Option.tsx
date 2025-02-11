import React from "react";

export interface OptionConfig {
  label?: React.ReactNode; // 支持 ReactNode 类型的 label
  value?: string | any;
}

export type OptionProps = {
  option?: OptionConfig;
  buttonClassName?: string;
  selectOp?: (value: any, option: any) => void | undefined;
};

const Option: React.FC<OptionProps> = ({
  option,
  buttonClassName,
  selectOp,
}) => {
  const _label = option ? option.label : "";
  const _value = option ? option.value : "";

  function handleSelect(e: any) {
    e.preventDefault();

    const _value = e.currentTarget.dataset.value;

    selectOp?.(_value, option);
  }

  return (
    <>
      <button
        className={buttonClassName}
        data-opt="true"
        data-value={_value}
        data-label={_label}
        data-itemdata={option ? JSON.stringify(option) : ""}
        tabIndex={-1}
        dangerouslySetInnerHTML={{
          __html: `${_label}`,
        }}
        onClick={handleSelect}
      ></button>
    </>
  );
};

export default Option;
