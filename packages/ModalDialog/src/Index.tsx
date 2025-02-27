import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Index.scss";

import { clsWrite, clsCombine } from "../../../utils/cls";

interface Props {
  modalRef?: any;
  zIndex?: number;
  heading?: string;
  modalSize?: "full" | "xl" | "lg" | "common";
  modalContentClassName?: string;
  modalHeaderClassName?: string;
  modalBodyClassName?: string;
  modalFooterClassName?: string;
  // ----------------------------------
  children?: React.ReactNode;
  // ----------------------------------
  header?: React.ReactNode;
  footer?: React.ReactNode;

  onOpen?: Function;
  onSubmit?: Function;
  modalBodyHeight?: string;
  operationName?: string;
  onClose?: Function;

  // ----------------------------------
  triggerContent: React.ReactNode;
  triggerClassName?: string;
}

export default function Mask({
  modalRef,
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
}: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

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

  function onOpenClick() {
    if (modalRef.current === null) return;

    if (onOpen) {
      setTimeout(() => {
        onOpen();
      }, 150);
    }

    modalRef.current!.style.display = "block";
    setTimeout(() => {
      modalRef.current!.classList.add("show");
    }, 100);
  }

  function onCloseClick() {
    if (modalRef.current === null) return;

    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 150);
    }

    modalRef.current.classList.remove("show");
    setTimeout(() => {
      modalRef.current.style.display = "none";
    }, 100);
  }

  const modalContent = (
    <div
      ref={modalRef}
      className="modal fade bg-black bg-opacity-25 toast"
      tabIndex={-1}
      role="dialog"
      style={{ zIndex: zIndex }}
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
        <div className={clsWrite(modalContentClassName, "modal-content")}>
          {header ? (
            header
          ) : (
            <div className={clsWrite(modalHeaderClassName, "modal-header")}>
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
