import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";

import { clsWrite } from "../../../utils/cls";
import useDraggable from "../../../utils/hooks/useDraggable";

import "./Index.scss";

/** 单条通知对象 */
export interface Notice {
  message: string;
  description?: string;
  duration?: number;
}

/** Notification 组件 Props */
export interface NotificationProps {
  wrapperContentClassName?: string; // 容器额外样式
  wrapperContentMessageClassName?: string; // 消息文本样式
  wrapperContentDescriptionClassName?: string; // 描述文本样式
  wrapperContentCloseInconClassName?: string; // 关闭按钮样式
  closeIcon?: React.ReactNode; // 自定义关闭按钮
  onOpen?: () => void; // 打开时回调
  onClose?: () => void; // 关闭时回调

  width?: number | string; // 通知宽度
  top?: number; // 通知距离顶部
  zIndex?: number;

  isDraggable?: boolean;
}

/** Notification 组件 ref 暴露方法 */
export interface NoticeRef {
  open: (notice: Notice) => void;
  close: () => void;
}

const Notification = forwardRef<NoticeRef, NotificationProps>((props, ref) => {
  const {
    wrapperContentClassName,
    wrapperContentMessageClassName,
    wrapperContentDescriptionClassName,
    wrapperContentCloseInconClassName,
    closeIcon,
    onOpen,
    onClose,
    width = 400,
    top = 20,
    zIndex = 1020,
    isDraggable = false,
  } = props;

  const [visible, setVisible] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<Notice>({
    message: "",
    description: "",
    duration: 3,
  });

  // 暴露给 ref 调用的方法
  useImperativeHandle(ref, () => ({
    open: (notice: Notice) => showNotice(notice),
    close: () => handleClose(),
  }));

  // 打开通知
  const showNotice = (notice: Notice) => {
    setCurrentNotice(notice);
    setVisible(true);
    onOpen?.();

    if (notice.duration && notice.duration > 0) {
      setTimeout(() => handleClose(), notice.duration * 1000);
    }
  };

  // 关闭通知
  const handleClose = () => {
    setVisible(false);
    resetPosition();

    onClose?.();
  };

  //
  // Draggable functionality
  const { dragContentHandle, dragHandle, resetPosition }: any = useDraggable({
    enabled: isDraggable, // if `false`, drag and drop is disabled
    preventOutsideScreen: {
      xAxis: false,
      yAxis: false,
    },
  });

  if (!visible) return null;

  let widthValue = typeof width === "number" ? `${width}px` : width;

  const noticeContent = (
    <div
      ref={dragContentHandle}
      className="noticefication-content"
      style={{
        width: widthValue,
        maxWidth:
          typeof width === "number" ? `calc(100vw - ${width}px)` : "100vw",
        top,
        zIndex: zIndex,
      }}
    >
      <div
        ref={dragHandle}
        className={`${clsWrite(
          wrapperContentClassName,
          "bg-white shadow-lg border p-4 relative"
        )} animate-slide-in `}
      >
        <div
          className={clsWrite(
            wrapperContentMessageClassName,
            "noticefication-content_message"
          )}
        >
          {currentNotice.message}
        </div>

        {currentNotice.description && (
          <div
            className={clsWrite(
              wrapperContentDescriptionClassName,
              "noticefication-content_description mt-1"
            )}
          >
            {currentNotice.description}
          </div>
        )}

        <div
          className={clsWrite(
            wrapperContentCloseInconClassName,
            "noticefication-content_close"
          )}
          onClick={handleClose}
        >
          {closeIcon || "×"}
        </div>
      </div>
    </div>
  );

  return createPortal(noticeContent, document.body);
});

export default Notification;
