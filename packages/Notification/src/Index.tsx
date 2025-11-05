import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";

import { clsWrite, clsCombine } from "../../../utils/cls";

import "./Index.scss";

interface Notice {
  message: string;
  description?: string;
  duration?: number;
}

interface NotificationProps {
  wrapperContentClassName?: string; // 内部样式名
  wrapperContentMessageClassName?: string;
  wrapperContentDescriptionClassName?: string;
  closeIcon?: React.ReactNode;
  onOpen?: Function | any; // 打开时触发函数
  onClose?: Function | any; // 关闭时触发函数
}

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
    const [container] = useState(() => document.createElement("div"));

    // 初始化挂载容器
    useEffect(() => {
      container.className = "noticefication-content";
      document.body.appendChild(container);

      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        container.style.top = `${20 + scrollTop}px`;
        container.style.right = "20px";
      };

      handleScroll();
      window.addEventListener("scroll", handleScroll);
      return () => {
        document.body.removeChild(container);
        window.removeEventListener("scroll", handleScroll);
      };
    }, [container]);

    // 暴露给 ref 调用的方法
    useImperativeHandle(ref, () => ({
      open: (n: Notice) => showNotice(n),
      close: () => handleClose(),
    }));

    // 打开通知
    const showNotice = (n: Notice) => {
      setCurrentNotice(n);
      setVisible(true);
      onOpen?.();

      if (n.duration && n.duration > 0) {
        setTimeout(() => handleClose(), n.duration * 1000);
      }
    };

    // 关闭通知
    const handleClose = () => {
      setVisible(false);
      onClose?.();
    };

    if (!visible) return null;

    const noticeContent = (
      <div
        className={clsWrite(
          wrapperContentClassName,
          "bg-white shadow-lg border p-4 animate-slide-in position-relative"
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
          className="noticefication-content_close"
          onClick={() => setVisible(false)}
        >
          {closeIcon || "X"}
        </div>
      </div>
    );

    return createPortal(noticeContent, container);
  }
);

export default Notification;
