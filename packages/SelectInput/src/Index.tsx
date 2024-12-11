import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
// my-utils
import { useKeyboardNavigation } from "./utils/useKeyboardNavigation";
import { useDropdown } from "./utils/userDropDown";

import { clsWrite, clsCombine } from "../../../utils/cls";

import "./Index.scss";

interface Props {
  type?: "COMMON" | "MULTI";
  label?: string | React.ReactNode; // 添加了 label 支持
  wrapperClassName?: string; // 最外层的样式名字
  wrapperConentInputClassName?: string; // 内部input的样式名字
  popupMenuClassName?: string; // 弹出层的样式名字
  id: string | any;
  name: string | any;
  kbcode?: string | any;
  dropdownRender: any[];
  inputId: string | any;
  titleId: string | any;
  defaultValue?: string | any;
  index?: string | number | any;
  onChange: Function;
  onKeyDown?: Function | any;
  size?: string | any;
  zIndex?: string | any;
  isHandleInput?: boolean;
  isDisableBodyScroll?: boolean;
  dataService?: any; // 添加服务类作为参数
  dataServiceFunction?: string; // 指定要调用的函数名称
  dataServiceFunctionParams?: any[]; // 指定要调用的函数的传参
  dataServiceRetrieve?: boolean; // 该服务类函数是否是检索类的
}

export default function SelectInput({
  type = "COMMON",
  label,
  wrapperClassName,
  wrapperConentInputClassName,
  popupMenuClassName,
  id,
  name,
  kbcode = "kb_code",
  dropdownRender,
  inputId,
  titleId,
  defaultValue,
  index,
  onChange,
  onKeyDown,
  size = "auto",
  zIndex = 1101,
  isHandleInput = false,
  isDisableBodyScroll = false,
  dataService,
  dataServiceFunction = "retrieveList", // 默认调用 retrieveList 函数
  dataServiceFunctionParams, // 调用函数的传参
  dataServiceRetrieve = false, // 默认不是检索类的
}: Props) {
  const [keyword, setKeyword] = useState<string>("");
  const [value, setValue] = useState<any>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // 调用dataService获取的值
  const [dataServiceList, setDataServiceList] = useState<any[]>([]);
  const [initialData, setInitialData] = useState<any[]>([]); // 用来保存初始接口数据
  const [hasFetchedData, setHasFetchedData] = useState(false); // 判断是否已经调用过接口

  // 判断下拉框位置
  const { dropdown, dropdownContent } = useDropdown(
    isShow,
    setIsShow,
    dataServiceList,
    loading
  );

  // 键盘逻辑
  const {
    focusedOption,
    setFocusedOption,
    handleKeyDown,
    handleOptionFocus,
    handleOptionBlur,
  } = useKeyboardNavigation(
    dataServiceList.length,
    (index) => chooseOption(dataServiceList[index]),
    onKeyDown
  );

  const dropDownList = useMemo(() => dataServiceList, [dataServiceList]);

  // input框输入
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.trim().toLowerCase();
    setKeyword(newValue);

    // 当允许手动输入时，触发 onChange 事件，将输入值传递给父组件
    if (isHandleInput) {
      if (index) {
        onChange(newValue, index);
      } else {
        onChange(newValue);
      }
    }
  };

  // 单选选择option
  function chooseOption(item: any) {
    setIsShow(false);

    if (index) {
      onChange(item, index);
    } else {
      onChange(item);
    }

    setValue(item[name]);
    setKeyword(""); // 清空关键词以重置列表
    setFocusedOption(null); // 重置焦点选项为 null

    // 失去焦点
    setTimeout(() => {
      const input: any = document.getElementById(`${inputId}`);
      input.blur();
    }, 0);
  }

  // 多选判断是否勾选
  function toggleSelection(item: any) {
    const exists = value.some((i: any) => i[id] === item[id]);

    let newValue;
    if (exists) {
      newValue = value.filter((i: any) => i[id] !== item[id]);
    } else {
      newValue = [...value, item];
    }

    setValue(newValue);

    if (index) {
      onChange(newValue, index);
    } else {
      onChange(newValue);
    }

    // 如果需要向父组件传递多选结果，可以在此调用 onChange
    // onChange(newValue)
  }

  // 检索
  const handleSearch = (keyword: string, searchArray: any[]) => {
    const filteredList = searchArray.filter((obj: any) => {
      const nameMatch = obj[name] ? obj[name]?.includes(keyword) : false;
      const kbcodeMatch = obj[kbcode] ? obj[kbcode].includes(keyword) : false;

      return nameMatch || kbcodeMatch;
    });

    return filteredList;
  };

  useEffect(() => {
    if (isShow) {
      setLoading(true);

      if (dataService && dataServiceFunction) {
        const params = [...(dataServiceFunctionParams || [])];

        // 检查是否有 $QUERY_STRING，如果有，替换 keyword
        const queryIndex = params.indexOf("$QUERY_STRING");
        if (queryIndex !== -1) {
          params[queryIndex] = keyword || "*"; // 替换为 keyword 或 '*'
        }

        // 如果该参数是true，则代表是retrieve接口，实时搜索
        if (dataServiceRetrieve) {
          dataService[dataServiceFunction](...params)
            .then((result: any) => {
              if (result.length > 0) {
                setDataServiceList(result);
              } else {
                setDataServiceList([]);
              }
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          if (!hasFetchedData) {
            // 如果没有调用过接口，则调用一次
            dataService[dataServiceFunction](...params)
              .then((result: any) => {
                setHasFetchedData(true); // 标记已经获取过数据

                if (result.length > 0) {
                  setInitialData(result); // 保存原始数据
                  setDataServiceList(result);
                } else {
                  setDataServiceList([]);
                  setInitialData([]);
                }
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            // 本地过滤检索
            const filteredList = handleSearch(keyword, initialData);

            setDataServiceList(filteredList);
            setLoading(false);
          }
        }
      } else {
        const filteredList = handleSearch(keyword, dropdownRender);

        setDataServiceList(filteredList);
        setLoading(false);
      }
    } else {
      setDataServiceList([]);
      setHasFetchedData(false);
      setInitialData([]);
    }
  }, [keyword, isShow, dropdownRender]);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);

      const renderList =
        dropdownRender.length > 0 ? dropdownRender : dropDownList;

      // 根据 defaultValue 找到对应的选项索引，并设置 focusedOption
      const defaultOptionIndex = renderList.findIndex(
        (item) => item[name] === defaultValue
      );

      if (defaultOptionIndex !== -1) {
        setFocusedOption(defaultOptionIndex);
      } else {
        setFocusedOption(null); // 如果没有找到匹配项，重置为 null
      }
    } else {
      setValue("");
      setFocusedOption(null); // 没有默认值时，重置 focusedOption
    }
  }, [defaultValue, dropDownList, dropdownRender]);

  return (
    <div className={clsCombine(wrapperClassName, "select-input__wrapper")}>
      {label ? (
        <>{typeof label === "string" ? <label>{label}</label> : label}</>
      ) : null}

      <div
        className="select-input__content"
        style={{ width: typeof size === "number" ? `${size}px` : "auto" }}
        ref={dropdown}
      >
        <input
          type="text"
          onChange={handleInputChange}
          id={inputId}
          className={clsCombine(
            clsWrite(wrapperConentInputClassName, "form-control"),
            "select-input__content__input"
          )}
          onFocus={() => {
            const targetElement = document.body;

            if (isDisableBodyScroll) {
              disableBodyScroll(targetElement);
            }

            if (type === "MULTI") {
              setKeyword("");
            }

            setIsShow(true);
            const title: any = document.getElementById(`${titleId}`);
            title.classList.add("text-secondary-emphasis", "z-n1");
          }}
          onBlur={() => {
            const title: any = document.getElementById(`${titleId}`);
            const input: any = document.getElementById(`${inputId}`);
            title.classList.remove("text-secondary-emphasis", "z-n1");
            input.value = "";

            setTimeout(() => {
              if (isDisableBodyScroll) {
                clearAllBodyScrollLocks();
              }

              if (type === "COMMON") {
                setKeyword("");
                // setIsShow(false);
              }

              setFocusedOption(null);
            }, 100);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        <span
          className={`select-input__content__arrow ${
            isShow ? "select-input__content__arrow--reverse" : ""
          }`}
        >
          <svg width="10px" height="10px" viewBox="0 -4.5 20 20">
            <g stroke="none" strokeWidth="1" fill="none">
              <g
                transform="translate(-180.000000, -6684.000000)"
                className="arrow-fill-g"
                fill="#a5a5a5"
              >
                <g transform="translate(56.000000, 160.000000)">
                  <path d="M144,6525.39 L142.594,6524 L133.987,6532.261 L133.069,6531.38 L133.074,6531.385 L125.427,6524.045 L124,6525.414 C126.113,6527.443 132.014,6533.107 133.987,6535 C135.453,6533.594 134.024,6534.965 144,6525.39"></path>
                </g>
              </g>
            </g>
          </svg>
        </span>

        {isShow &&
          createPortal(
            <div
              ref={dropdownContent}
              className={`select-input__popup__menu position-absolute shadow border rounded ${
                isShow ? "select-input__popup__menu--isShow" : ""
              } ${clsCombine(popupMenuClassName)}`}
              style={{
                zIndex: zIndex,
                width: `${dropdown.current?.getBoundingClientRect().width}px`,
              }}
            >
              {loading && dataService ? (
                <div className="select-input__popup__list py-1 px-1">
                  加载中...
                </div>
              ) : dropDownList.length !== 0 ? (
                type === "COMMON" ? (
                  dropDownList?.map((item: any, index: any) => {
                    return (
                      <div
                        className={`select-input__popup__list py-1 px-1 ${
                          index + 1 === dropDownList.length
                            ? ""
                            : "border-bottom"
                        } ${focusedOption === index ? "text-bg-primary" : ""}`}
                        key={item[id] || ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          chooseOption(item);
                        }}
                        onFocus={() => handleOptionFocus(item)}
                        onBlur={handleOptionBlur}
                        data-id={item[id]}
                        data-name={item[name]}
                      >
                        {item[name]}
                      </div>
                    );
                  })
                ) : (
                  dropDownList?.map((item: any, index: any) => {
                    return (
                      <div
                        className={`select-input__popup__list py-1 px-1 ${
                          index + 1 === dropDownList.length
                            ? ""
                            : "border-bottom"
                        } ${focusedOption === index ? "text-bg-primary" : ""}`}
                        key={item[id] || ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelection(item);
                        }}
                        onFocus={() => handleOptionFocus(item)}
                        onBlur={handleOptionBlur}
                        data-id={item[id]}
                        data-name={item[name]}
                      >
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          onClick={(e) => e.stopPropagation()}
                          checked={value.some((i: any) => i[id] === item[id])}
                          onChange={() => toggleSelection(item)}
                        />
                        {item[name]}
                      </div>
                    );
                  })
                )
              ) : (
                <div className="select-input__popup__list py-1 px-1">
                  没有更多数据
                </div>
              )}
            </div>,
            document.body
          )}

        <div
          id={`${titleId}`}
          className="position-absolute ms-2 select-input__content__word__container"
          style={{
            transform: "translateY(-50%)",
            top: "50%",
            width: `${dropdown.current?.getBoundingClientRect().width}px`,
          }}
          onClick={() => {
            const input: any = document.getElementById(`${inputId}`);
            input.focus();
          }}
          title={
            Array.isArray(value) && value.length > 0
              ? value.map((item: any) => item[name]).join(", ")
              : value
          }
        >
          {type === "COMMON" ? (
            <span>{value}</span>
          ) : (
            <span>
              {Array.isArray(value) && value.length > 0
                ? value.map((item: any) => item[name]).join(", ")
                : value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
