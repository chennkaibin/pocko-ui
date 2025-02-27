import React, { ReactNode, forwardRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Index.scss";

import { clsWrite, clsCombine } from "../../../utils/cls";

interface Props {
  zIndex?: String | any;
  heading?: string;
  modalSize?: "full" | "xl" | "lg" | "common";
  modalContentClassName?: string;
  modalHeaderClassName?: string;
  modalBodyClassName?: string;
  modalFooterClassName?: string;
  // ----------------------------------
  children?: ReactNode;
  // ----------------------------------
  header?: ReactNode;
  footer?: ReactNode;

  onOpen?: Function;
  onSubmit?: Function;
  modalBodyHeight?: string;
  operationName?: string;
  onClose?: Function;

  // ----------------------------------
  triggerContent: ReactNode;
  triggerClassName?: string;
}

const Mask = forwardRef(function Mask(
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
  }: Props,
  ref: any
) {
  function onOpenClick() {
    if (onOpen) {
      setTimeout(() => {
        onOpen();
      }, 150);
    }

    ref.current!.style.display = "block";
    setTimeout(() => {
      ref.current!.classList.add("show");
    }, 100);
  }

  function onCloseClick() {
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 150);
    }

    ref.current.classList.remove("show");
    setTimeout(() => {
      ref.current.style.display = "none";
    }, 100);
  }

  const modalContent = (
    <div
      ref={ref}
      className="modal fade bg-black bg-opacity-25 toast"
      tabIndex={-1}
      role="dialog"
      style={{ zIndex: `${zIndex}` }}
    >
      <div
        className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${
          modalSize === "full"
            ? "modal-fullscreen"
            : modalSize === "xl"
            ? "modal-xl"
            : modalSize === "lg"
            ? "modal-lg"
            : ""
        }`}
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

      {createPortal(modalContent, document.body)}
    </>
  );
});

export default Mask;
