import React, {
  ReactNode,
  forwardRef,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { createPortal } from "react-dom";
import "./Index.scss";

interface Props {
  children: ReactNode; // 显示的 popovers 内容
  modalBodyHeight: string; // 高度
  modalBodyWidth: string; // 宽度
  content: string | ReactNode; // 初始内容
  triggerShow: Boolean; // 点击是否显示
  externalClassName?: any[]; // 外部className数组，处理外部元素点击不会关闭
  closeFunc?: Function | any; // 关闭的时候触发的回调
}

const Popovers = forwardRef(function Popovers(
  {
    children,
    modalBodyHeight,
    modalBodyWidth,
    content,
    triggerShow,
    externalClassName,
    closeFunc,
  }: Props,
  ref: any
) {
  const [isShow, setIsShow] = useState(false);

  const popoverBtnRef: any = useRef(null);
  const popoverModalRef: any = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      // 遍历 externalClassName 数组，找到外部元素
      const isClickInsideExternalClasses = externalClassName?.some(
        (className) => {
          const externalElement = document.querySelector(`.${className}`);
          return externalElement && externalElement.contains(event.target);
        }
      );

      // 检查点击是否在 popoverModalRef、popoverBtnRef 或 externalClassName数组 区域之外
      if (
        isShow &&
        popoverModalRef.current &&
        !popoverModalRef.current.contains(event.target) &&
        popoverBtnRef.current &&
        !popoverBtnRef.current.contains(event.target) &&
        !isClickInsideExternalClasses
      ) {
        // 如果点击不在这三个区域内，关闭弹出层
        setIsShow(false);
      }
    }

    // 添加点击事件侦听器
    document.addEventListener("pointerdown", handleClickOutside);

    // 在组件销毁时移除事件侦听器
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isShow]);

  useEffect(() => {
    if (isShow) {
      adjustDropdownPosition();
    } else {
      if (closeFunc) {
        closeFunc();
      }
    }
  }, [isShow]);

  // 将 setIsShow 方法暴露给外部
  useImperativeHandle(ref, () => ({
    closePopover: () => setIsShow(false),
  }));

  function adjustDropdownPosition() {
    if (popoverModalRef.current && popoverBtnRef.current) {
      const buttonRect = popoverBtnRef.current.getBoundingClientRect();
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const popoverWidth = popoverModalRef.current.offsetWidth; // 获取弹窗的宽度
      const windowWidth = window.innerWidth; // 获取窗口的宽度

      // 默认的 left 值，使弹窗靠近按钮的左侧
      let leftPosition = buttonRect.left + 5;

      // 预留的右侧间隙
      const rightMargin = 20;

      // 如果弹窗超出右侧边界，调整 left 值使其贴合窗口右侧
      if (leftPosition + popoverWidth > windowWidth - rightMargin) {
        leftPosition = windowWidth - popoverWidth - rightMargin; // 靠近窗口右侧，预留 5px 间隙
      }

      // 设置弹窗的 left 和 top 属性
      popoverModalRef.current.style.left = `${leftPosition}px`;
      popoverModalRef.current.style.top = `${buttonRect.bottom + scrollY}px`;
    }
  }

  return (
    <>
      <div
        ref={popoverBtnRef}
        onClick={() => {
          if (triggerShow) {
            setIsShow(!isShow);
          }
        }}
      >
        {content}
      </div>

      {isShow &&
        createPortal(
          <div ref={ref}>
            <div
              ref={popoverModalRef}
              className="bg-white rounded border p-2 popovers-overflow"
              style={{
                height: `${modalBodyHeight}px`,
                width: `${modalBodyWidth}px`, // 请确认是否需要修改弹出内容的宽度
                zIndex: "1200",
                position: "absolute",
                overflow: "auto",
              }}
            >
              <div className="modal-body h-100">{children}</div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
});

export default Popovers;
