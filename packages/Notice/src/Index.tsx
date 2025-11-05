import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";

import { clsWrite } from "../../../utils/cls";

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
  closeIcon?: React.ReactNode; // 自定义关闭按钮
  onOpen?: () => void; // 打开时回调
  onClose?: () => void; // 关闭时回调
}

/** Notification 组件 ref 暴露方法 */
export interface NotificationRef {
  open: (notice: Notice) => void;
  close: () => void;
}

const Notification = forwardRef<NotificationRef, NotificationProps>(
  (props, ref) => {
    const {
      wrapperContentClassName,
      wrapperContentMessageClassName,
      wrapperContentDescriptionClassName,
      closeIcon,
      onOpen,
      onClose,
    } = props;

    const [visible, setVisible] = useState(false);
    const [currentNotice, setCurrentNotice] = useState<Notice>({
      message: "",
      description: "",
      duration: 3,
    });
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    // 延迟初始化容器，避免 SSR 报错
    useEffect(() => {
      const div = document.createElement("div");
      div.className = "noticefication-content";
      document.body.appendChild(div);
      setContainer(div);

      return () => {
        document.body.removeChild(div);
      };
    }, []);

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
      onClose?.();
    };

    // SSR 阶段或未初始化容器，直接返回 null
    if (!container || !visible) return null;

    const noticeContent = (
      <div
        className={clsWrite(
          wrapperContentClassName,
          "bg-white shadow-lg border p-4 animate-slide-in relative"
        )}
      >
        <div
          className={clsWrite(
            wrapperContentMessageClassName,
            "noticefication-content_message font-medium text-gray-900"
          )}
        >
          {currentNotice.message}
        </div>

        {currentNotice.description && (
          <div
            className={clsWrite(
              wrapperContentDescriptionClassName,
              "noticefication-content_description text-gray-600 text-sm mt-1"
            )}
          >
            {currentNotice.description}
          </div>
        )}

        <div
          className="noticefication-content_close cursor-pointer absolute top-2 right-2"
          onClick={handleClose}
        >
          {closeIcon || "×"}
        </div>
      </div>
    );

    return createPortal(noticeContent, container);
  }
);

export default Notification;
