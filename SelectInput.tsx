import React, { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
// my-utils
import { useKeyboardNavigation } from './utils/useKeyboardNavigation'
import { useDropdown } from './utils/userDropDown'

import { clsWrite, clsCombine } from './utils/cls'

import './SelectInput.scss'

export interface CleanTriggerConfig {
  valid: boolean
  cleanValueLabel?: string
  cleanFunc?: Function
}

interface Props {
  type?: 'COMMON' | 'MULTI'
  label?: string | React.ReactNode // 添加了 label 支持
  wrapperClassName?: string // 最外层的样式名字
  wrapperContentInputClassName?: string // 内部input的样式名字
  popupMenuClassName?: string // 弹出层的样式名字
  renderOption?: (item: any) => React.ReactNode // 自定义选项渲染内容
  id: string | any
  name: string | any
  kbcode?: string | any
  dropdownRender: any[]
  dropdownPosition?: 'top' | 'bottom' | 'auto'
  inputId: string | any
  titleId: string | any
  defaultValue?: string | any
  index?: string | number | any
  onChange: Function
  onKeyDown?: Function | any
  onFoused?: Function | any
  onBlured?: Function | any
  size?: string | any
  zIndex?: string | any
  isDisable?: boolean
  isHandleInput?: boolean
  isDisableBodyScroll?: boolean
  cleanTrigger?: CleanTriggerConfig
  dataService?: any // 添加服务类作为参数
  dataServiceFunction?: string // 指定要调用的函数名称（初始化用）
  dataServiceFunctionParams?: any[] // 指定要调用的函数的传参（初始化用）
  dataServiceRetrieve?: boolean // 该服务类函数是否是检索类的
  // 新增：搜索时使用的服务配置
  searchDataService?: any // 搜索时使用的服务类
  searchDataServiceFunction?: string // 搜索时使用的函数名称
  searchDataServiceFunctionParams?: any[] // 搜索时使用的函数传参
  manualSearchTrigger?: boolean // 是否默认聚焦就检索
}

export default function SelectInput({
  type = 'COMMON',
  label,
  wrapperClassName,
  wrapperContentInputClassName,
  popupMenuClassName,
  id,
  name,
  kbcode = 'kb_code',
  dropdownRender,
  dropdownPosition,
  inputId,
  titleId,
  defaultValue,
  index,
  onChange,
  onKeyDown,
  onFoused,
  onBlured,
  size = 'auto',
  zIndex = 1101,
  isHandleInput = false,
  isDisable = false,
  isDisableBodyScroll = false,
  dataService,
  dataServiceFunction = 'getList', // 改为默认调用 getList 函数（初始化）
  dataServiceFunctionParams, // 调用函数的传参（初始化）
  dataServiceRetrieve = false, // 默认不是检索类的
  // 新增：搜索相关参数
  searchDataService,
  searchDataServiceFunction = 'retrieve', // 搜索时默认调用 retrieve 函数
  searchDataServiceFunctionParams, // 搜索时调用函数的传参
  renderOption,
  cleanTrigger,
  manualSearchTrigger = false,
}: Props) {
  const [keyword, setKeyword] = useState<any>(null)
  const [value, setValue] = useState<any>('')
  const [isShow, setIsShow] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // 调用dataService获取的值
  const [dataServiceList, setDataServiceList] = useState<any[]>([])
  const [initialData, setInitialData] = useState<any[]>([]) // 用来保存初始接口数据
  const [hasFetchedData, setHasFetchedData] = useState(false) // 判断是否已经调用过接口

  // 判断下拉框位置
  const { dropdown, dropdownContent } = useDropdown(
    isShow,
    setIsShow,
    dataServiceList,
    loading,
    dropdownPosition,
  )

  // 键盘逻辑
  const { focusedOption, setFocusedOption, handleKeyDown, handleOptionFocus, handleOptionBlur } =
    useKeyboardNavigation(
      dataServiceList.length,
      (index) => chooseOption(dataServiceList[index]),
      onKeyDown,
    )

  const dropDownList = useMemo(() => dataServiceList, [dataServiceList])

  // input框输入
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.toLowerCase()
    setKeyword(newValue)

    // 当允许手动输入时，触发 onChange 事件，将输入值传递给父组件
    if (isHandleInput) {
      if (index) {
        onChange(newValue, index)
      } else {
        onChange(newValue)
      }
    }

    if (newValue) {
      const title: any = document.getElementById(`${titleId}`)
      title.classList.add('z-n1')
    } else {
      const title: any = document.getElementById(`${titleId}`)
      title.classList.remove('z-n1')
    }
  }

  // 单选选择option
  function chooseOption(item: any) {
    setIsShow(false)

    if (index) {
      onChange(item, index)
    } else {
      onChange(item)
    }

    setValue(item[name])
    setKeyword(null) // 清空关键词以重置列表
    setFocusedOption(null) // 重置焦点选项为 null

    // 失去焦点
    setTimeout(() => {
      const input: any = document.getElementById(`${inputId}`)
      input.blur()
    }, 0)
  }

  // 多选判断是否勾选
  function toggleSelection(item: any) {
    const exists = value.some((i: any) => i[id] === item[id])

    let newValue
    if (exists) {
      newValue = value.filter((i: any) => i[id] !== item[id])
    } else {
      newValue = [...value, item]
    }

    setValue(newValue)

    if (index) {
      onChange(newValue, index)
    } else {
      onChange(newValue)
    }

    // 如果需要向父组件传递多选结果，可以在此调用 onChange
    // onChange(newValue)
  }

  // 检索
  const handleSearch = (keyword: string, searchArray: any[]) => {
    if (keyword == null) return searchArray

    const filteredList = searchArray.filter((obj: any) => {
      const nameMatch = obj[name] ? obj[name]?.includes(keyword) : false
      const kbcodeMatch = obj[kbcode] ? obj[kbcode].includes(keyword) : false

      return nameMatch || kbcodeMatch
    })

    return filteredList
  }

  // 清空
  function clearSelection() {
    setIsShow(false)
    setValue('')
    setKeyword(null)
    setFocusedOption(null) // 重置焦点

    if (cleanTrigger?.cleanFunc) {
      cleanTrigger.cleanFunc()
    }

    // 失去焦点
    setTimeout(() => {
      const input: any = document.getElementById(`${inputId}`)
      input.blur()
    }, 0)
  }

  useEffect(() => {
    if (!isShow) {
      setDataServiceList([])
      setHasFetchedData(false)
      setInitialData([])

      return
    }

    // 若启用手动检索，且 keyword 为 null，不发起接口调用
    if (manualSearchTrigger && keyword == null) {
      setLoading(false)
      setDataServiceList([])

      return
    }

    setLoading(true)

    // 判断是搜索场景还是初始化场景
    const isSearching = keyword != null && keyword !== ''
    
    if (isSearching) {
      // 搜索场景：使用搜索相关的服务配置
      const currentService = searchDataService || dataService
      const currentFunction = searchDataServiceFunction
      const currentParams = [...(searchDataServiceFunctionParams || [])]

      if (currentService && currentFunction) {
        const queryIndex = currentParams.indexOf('$QUERY_STRING')
        if (queryIndex !== -1) {
          currentParams[queryIndex] = keyword
        }

        currentService[currentFunction](...currentParams)
          .then((result: any) => {
            setDataServiceList(result || [])
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        // 如果没有配置搜索服务，则使用本地过滤
        const filteredList = handleSearch(keyword, initialData.length > 0 ? initialData : dropdownRender)
        setDataServiceList(filteredList)
        setLoading(false)
      }
    } else {
      // 初始化场景：使用初始化相关的服务配置
      if (dataService && dataServiceFunction) {
        const params = [...(dataServiceFunctionParams || [])]

        if (dataServiceRetrieve) {
          // 如果是检索类的，每次都调用接口
          dataService[dataServiceFunction](...params)
            .then((result: any) => {
              setDataServiceList(result || [])
            })
            .finally(() => {
              setLoading(false)
            })
        } else {
          // 如果不是检索类的，只在第一次调用接口
          if (!hasFetchedData) {
            dataService[dataServiceFunction](...params)
              .then((result: any) => {
                setHasFetchedData(true)
                setInitialData(result || [])
                setDataServiceList(result || [])
              })
              .finally(() => {
                setLoading(false)
              })
          } else {
            // 使用缓存的初始数据
            setDataServiceList(initialData)
            setLoading(false)
          }
        }
      } else {
        // 没有配置数据服务，使用 dropdownRender
        setDataServiceList(dropdownRender)
        setLoading(false)
      }
    }
  }, [keyword, isShow, dropdownRender, manualSearchTrigger])

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue)

      const renderList = dropdownRender.length > 0 ? dropdownRender : dropDownList

      // 根据 defaultValue 找到对应的选项索引，并设置 focusedOption
      const defaultOptionIndex = renderList.findIndex((item) => item[name] === defaultValue)

      if (defaultOptionIndex !== -1) {
        setFocusedOption(defaultOptionIndex)
      } else {
        setFocusedOption(null) // 如果没有找到匹配项，重置为 null
      }
    } else {
      setValue('')
      setFocusedOption(null) // 没有默认值时，重置 focusedOption
    }
  }, [defaultValue, dropDownList, dropdownRender])

  return (
    <div className={clsCombine(wrapperClassName, 'select-input__wrapper')}>
      {label ? <>{typeof label === 'string' ? <label>{label}</label> : label}</> : null}

      <div
        className="select-input__content"
        style={{ width: typeof size === 'number' ? `${size}px` : 'auto' }}
        ref={dropdown}
      >
        <input
          type="text"
          onChange={handleInputChange}
          id={inputId}
          className={clsCombine(
            clsWrite(wrapperContentInputClassName, 'form-control'),
            'select-input__content__input',
          )}
          onFocus={() => {
            if (isDisableBodyScroll) {
              const targetElement = document.body
              disableBodyScroll(targetElement)
            }

            if (type === 'MULTI') {
              setKeyword(null)
            }

            setIsShow(true)
            const title: any = document.getElementById(`${titleId}`)
            title.classList.add('text-secondary-emphasis', 'user-select-none', 'pe-none')

            // 外部聚焦方法
            if (onFoused) {
              onFoused()
            }
          }}
          onBlur={() => {
            const title: any = document.getElementById(`${titleId}`)
            const input: any = document.getElementById(`${inputId}`)
            title.classList.remove('text-secondary-emphasis', 'user-select-none', 'pe-none', 'z-n1')
            input.value = ''

            setTimeout(() => {
              if (isDisableBodyScroll) {
                clearAllBodyScrollLocks()
              }

              if (type === 'COMMON') {
                setKeyword(null)
                // setIsShow(false);
              }

              setFocusedOption(null)
            }, 100)

            // 外部失焦方法
            if (onBlured) {
              onBlured()
            }
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          disabled={isDisable}
        />

        <span
          className={`select-input__content__arrow ${
            isShow ? 'select-input__content__arrow--reverse' : ''
          }`}
          onClick={() => {
            const input: any = document.getElementById(`${inputId}`)
            input.focus()
          }}
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
                isShow ? 'select-input__popup__menu--isShow' : ''
              } ${clsCombine(popupMenuClassName)}`}
              style={{
                zIndex: zIndex,
                width: `${dropdown.current?.getBoundingClientRect().width}px`,
              }}
            >
              {/* 删除按钮项 */}
              {cleanTrigger?.valid && (
                <div
                  className="select-input__popup__list py-1 px-1 border-bottom bg-light"
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    clearSelection() // 清空选项
                  }}
                >
                  <span className="btn btn-sm btn-secondary">{cleanTrigger.cleanValueLabel}</span>
                </div>
              )}

              {loading && (dataService || searchDataService) ? (
                <div className="select-input__popup__list py-1 px-1">加载中...</div>
              ) : dropDownList.length !== 0 ? (
                type === 'COMMON' ? (
                  dropDownList?.map((item: any, index: any) => {
                    return (
                      <div
                        className={`select-input__popup__list py-1 px-1 ${
                          index + 1 === dropDownList.length ? '' : 'border-bottom'
                        } ${focusedOption === index ? 'text-bg-primary' : ''}`}
                        key={item[id] || ''}
                        onMouseDown={(e) => {
                          e.stopPropagation()
                          chooseOption(item)
                        }}
                        onFocus={() => handleOptionFocus(item)}
                        onBlur={handleOptionBlur}
                        data-id={item[id]}
                        data-name={item[name]}
                      >
                        {renderOption ? (
                          renderOption(item) // 使用自定义渲染函数
                        ) : (
                          <span>{item[name]}</span> // 默认渲染
                        )}
                      </div>
                    )
                  })
                ) : (
                  dropDownList?.map((item: any, index: any) => {
                    return (
                      <div
                        className={`select-input__popup__list py-1 px-1 ${
                          index + 1 === dropDownList.length ? '' : 'border-bottom'
                        } ${focusedOption === index ? 'text-bg-primary' : ''}`}
                        key={item[id] || ''}
                        onMouseDown={(e) => {
                          e.stopPropagation()
                          toggleSelection(item)
                        }}
                        onFocus={() => handleOptionFocus(item)}
                        onBlur={handleOptionBlur}
                        data-id={item[id]}
                        data-name={item[name]}
                      >
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          onMouseDown={(e) => e.stopPropagation()}
                          checked={value.some((i: any) => i[id] === item[id])}
                          onChange={() => toggleSelection(item)}
                        />
                        {renderOption ? (
                          renderOption(item) // 使用自定义渲染函数
                        ) : (
                          <span>{item[name]}</span> // 默认渲染
                        )}
                      </div>
                    )
                  })
                )
              ) : (
                <div className="select-input__popup__list py-1 px-1">没有更多数据</div>
              )}
            </div>,
            document.body,
          )}

        <div
          id={`${titleId}`}
          className="position-absolute ms-2 select-input__content__word__container"
          style={{
            transform: 'translateY(-50%)',
            top: '50%',
            width: `${dropdown.current?.getBoundingClientRect().width}px`,
          }}
          onMouseDown={(e: any) => {
            e.preventDefault()

            const input: any = document.getElementById(`${inputId}`)
            input.focus()
          }}
          title={
            Array.isArray(value) && value.length > 0
              ? value.map((item: any) => item[name]).join(', ')
              : value
          }
        >
          {type === 'COMMON' ? (
            <span>{value}</span>
          ) : (
            <span>
              {Array.isArray(value) && value.length > 0
                ? value.map((item: any) => item[name]).join(', ')
                : value}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}