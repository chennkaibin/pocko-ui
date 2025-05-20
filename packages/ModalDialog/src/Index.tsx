import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import "./Index.scss";

import { clsWrite, clsCombine } from "../../../utils/cls";
import useDraggable from "../../../utils/hooks/useDraggable";

interface Props {
  zIndex?: number;
  heading?: string;
  modalSize?: "full" | "xl" | "lg" | "common";
  modalContentClassName?: string;
  modalHeaderClassName?: string;
  modalBodyClassName?: string;
  modalFooterClassName?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onOpen?: Function;
  onSubmit?: Function;
  modalBodyHeight?: string;
  operationName?: string;
  onClose?: Function;
  triggerContent?: React.ReactNode;
  triggerClassName?: string;
  isDraggable?: boolean;
}

const Mask = forwardRef(
  (
    {
      modalSize = "common",
      heading,
      onSubmit,
      children,
      operationName = "确认",
      modalBodyHeight,
      onOpen,
      onClose,
      zIndex,
      header,
      footer,
      modalContentClassName,
      modalHeaderClassName,
      modalBodyClassName,
      modalFooterClassName,
      triggerContent,
      triggerClassName,
      isDraggable = false,
    }: Props,
    ref: React.ForwardedRef<any>
  ) => {
    const [isMounted, setIsMounted] = useState(false);
    const containerRef = useRef<HTMLElement | null>(null);
    const modalRef = useRef<any>(null);

    useEffect(() => {
      containerRef.current = document.createElement("div");
      containerRef.current.className = `modal-container ${
        triggerClassName || ""
      }`;
      document.body.appendChild(containerRef.current);
      setIsMounted(true);

      return () => {
        if (containerRef.current) {
          containerRef.current.remove();
          setIsMounted(false);
        }
      };
    }, []);

    const onOpenClick = () => {
      if (!modalRef?.current) return;

      if (onOpen) {
        setTimeout(() => {
          onOpen();
        }, 150);
      }

      modalRef.current!.style.display = "block";
      setTimeout(() => {
        modalRef.current!.classList.add("show");
      }, 100);
    };

    const onCloseClick = () => {
      if (!modalRef?.current) return;

      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 150);
      }

      modalRef.current!.classList.remove("show");
      setTimeout(() => {
        if (isDraggable) resetPosition();

        modalRef.current!.style.display = "none";
      }, 100);
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      open: onOpenClick,
      close: onCloseClick,
    }));

    // Draggable functionality
    const { dragContentHandle, dragHandle, resetPosition }: any = useDraggable({
      enabled: isDraggable, // if `false`, drag and drop is disabled
      preventOutsideScreen: {
        xAxis: false,
        yAxis: false,
      },
    });

    const modalContent = (
      <div
        ref={modalRef}
        className="modal fade bg-black bg-opacity-25 toast"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex }}
      >
        <div
          className={clsCombine(
            "modal-dialog modal-dialog-centered modal-dialog-scrollable",
            {
              "modal-fullscreen": modalSize === "full",
              "modal-xl": modalSize === "xl",
              "modal-lg": modalSize === "lg",
            }
          )}
        >
          <div
            ref={dragContentHandle}
            className={clsWrite(modalContentClassName, "modal-content")}
          >
            {header ? (
              <div
                ref={dragHandle}
                className={clsCombine({
                  "modal-header__draggable": isDraggable,
                })}
              >
                {header}
              </div>
            ) : (
              <div
                ref={dragHandle}
                className={clsCombine(
                  clsWrite(modalHeaderClassName, "modal-header"),
                  {
                    "modal-header__draggable": isDraggable,
                  }
                )}
              >
                <h1 className="modal-title fs-5">{heading}</h1>

                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={onCloseClick}
                ></button>
              </div>
            )}

            <div
              className={clsWrite(modalBodyClassName, "modal-body")}
              style={{
                height: modalBodyHeight ? `${modalBodyHeight}vh` : "auto",
              }}
            >
              {children}
            </div>

            {footer ? (
              footer
            ) : (
              <div className={clsWrite(modalFooterClassName, "modal-footer")}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onCloseClick}
                >
                  取消
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (onSubmit) {
                      onSubmit();
                    }
                  }}
                >
                  {operationName}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <>
        {triggerContent && (
          <div
            className={clsWrite(triggerClassName, "trigger-container")}
            onClick={onOpenClick}
          >
            {triggerContent}
          </div>
        )}

        {isMounted &&
          containerRef.current &&
          createPortal(modalContent, containerRef.current as HTMLElement)}
      </>
    );
  }
);

export default Mask;
