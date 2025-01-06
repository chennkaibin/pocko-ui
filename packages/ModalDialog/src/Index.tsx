import React, { ReactNode, forwardRef, useEffect } from "react";
import { createPortal } from "react-dom";
import useDraggable from "../../../utils/useDraggable";
import "./Index.scss";

interface Props {
  maskWidth: string;
  maxWidth?: string;
  title: string;
  confirmClickFn: Function;
  children: ReactNode;
  modalBodyHeight?: string;
  operationName?: string;
  closeModalClick?: Function;
  footBtn?: Boolean;
  body?: Boolean;
  isDraggable?: Boolean | String;
  zIndex?: String | any;
  footer?: ReactNode;
}

const Mask = forwardRef(function Mask(
  {
    maskWidth,
    maxWidth,
    title,
    confirmClickFn,
    children,
    operationName = "确认",
    modalBodyHeight = "auto",
    closeModalClick,
    footBtn = true,
    body = true,
    isDraggable = false,
    zIndex,
    footer,
  }: Props,
  ref: any
) {
  const handleDisappearClick: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    if (closeModalClick) {
      setTimeout(() => {
        closeModalClick();
      }, 150);
    }

    resetModal();
    ref.current.classList.remove("show");
    setTimeout(() => {
      ref.current.style.display = "none";
    }, 100);
  };

  const { dragContentHandle, dragHandle, resetPosition }: any = useDraggable({
    enabled: isDraggable ? true : false, // if `false`, drag and drop is disabled
    preventOutsideScreen: {
      xAxis: true,
      yAxis: true,
    },
    onStart: (
      coordinates: Record<string, number>,
      handleEl: HTMLElement | null,
      contentEl: HTMLElement | null
    ) => {},
    onDrag: (
      coordinates: Record<string, number>,
      handleEl: HTMLElement | null,
      contentEl: HTMLElement | null
    ) => {
      // console.log(coordinates) // {dx: -164, dy: -37}
    },
    onStop: (
      coordinates: Record<string, number>,
      handleEl: HTMLElement | null,
      contentEl: HTMLElement | null
    ) => {},
  });

  const resetModal = () => {
    resetPosition?.();
  };

  const modalContent = (
    <div
      ref={ref}
      className="modal fade bg-black bg-opacity-25 toast"
      id="exampleModalLive"
      tabIndex={-1}
      role="dialog"
      style={{ zIndex: `${zIndex}` }}
    >
      <div
        className={
          maskWidth === "full"
            ? "modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen"
            : maskWidth === "xl"
            ? "modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl"
            : maskWidth === "lg"
            ? "modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
            : "modal-dialog modal-dialog-centered modal-dialog-scrollable"
        }
        style={{ maxWidth: maxWidth }}
      >
        <div className="modal-content" ref={dragContentHandle}>
          <div
            className={`modal-header ${
              isDraggable ? "anes-care-cursor-all-scroll" : ""
            }`}
            style={{ cursor: `${isDraggable ? "pointer" : "auto"}` }}
            ref={dragHandle}
          >
            <h1 className="modal-title fs-5" id="exampleModalLiveLabel">
              {title}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleDisappearClick}
            ></button>
          </div>
          <div
            className={`modal-body`}
            style={{
              height:
                modalBodyHeight == "auto" ? "auto" : `${modalBodyHeight}vh`,
            }}
          >
            {children}
          </div>

          {footer ? (
            footer
          ) : (
            <div className="modal-footer">
              {footBtn && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleDisappearClick}
                >
                  取消
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  confirmClickFn();
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

  return body ? createPortal(modalContent, document.body) : modalContent;
});

export default Mask;
