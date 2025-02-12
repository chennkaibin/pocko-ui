import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Option from "./Option";
import "./Index.scss";

type Placement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
type Trigger = "hover" | "click";

interface MenuItem {
  label: string | ReactNode;
  value?: string;
  disabled?: boolean;
  divided?: boolean;
}

interface DropdownMenuProps {
  triggerButton: React.ReactNode;
  menuItems: MenuItem[];
  onChange?: Function;
  disabled?: boolean;
  placement?: Placement;
  trigger?: Trigger;
  wrapperClassName?: string;
  closeOnOutsideClick?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  triggerButton,
  menuItems,
  onChange,
  disabled = false,
  placement = "bottomLeft",
  trigger = "hover",
  wrapperClassName = "",
  closeOnOutsideClick = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const triggerRef = useRef<HTMLDivElement | any>(null);
  const menuRef = useRef<HTMLDivElement | any>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    switch (placement) {
      case "bottomLeft":
        return {
          top: triggerRect.bottom + scrollY,
          left: triggerRect.left + scrollX,
        };
      case "bottomRight":
        return {
          top: triggerRect.bottom + scrollY,
          left:
            triggerRect.right + scrollX - (menuRef.current?.offsetWidth || 0),
        };
      case "topLeft":
        return {
          top: triggerRect.top + scrollY - (menuRef.current?.offsetHeight || 0),
          left: triggerRect.left + scrollX,
        };
      case "topRight":
        return {
          top: triggerRect.top + scrollY - (menuRef.current?.offsetHeight || 0),
          left:
            triggerRect.right + scrollX - (menuRef.current?.offsetWidth || 0),
        };
      default:
        return {
          top: triggerRect.bottom + scrollY,
          left: triggerRect.left + scrollX,
        };
    }
  }, [placement]);

  const handleTrigger = useCallback(
    (open: boolean) => {
      if (disabled) return;

      if (open) {
        const pos: any = calculatePosition();
        setPosition(pos);
      }

      setIsOpen(open);
    },
    [calculatePosition, disabled]
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        menuRef.current !== event.target &&
        !menuRef.current.contains(event.target as HTMLElement) &&
        triggerRef.current !== event.target &&
        !triggerRef.current.contains(event.target as HTMLElement)
      ) {
        if (
          !menuRef.current ||
          !triggerRef.current ||
          menuRef.current.contains(event.target as Node) ||
          triggerRef.current.contains(event.target as Node)
        )
          return;
        handleTrigger(false);
      }
    },
    [handleTrigger]
  );

  useEffect(() => {
    if (isOpen && closeOnOutsideClick) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeOnOutsideClick, handleClickOutside]);

  const handleMenuItemClick = (menuItem: MenuItem) => {
    if (menuItem.disabled) return;

    onChange?.(menuItem);
    handleTrigger(false);
  };

  const triggerProps = {
    ...(trigger === "hover"
      ? {
          onMouseEnter: () => handleTrigger(true),
          onMouseLeave: () => handleTrigger(false),
        }
      : {
          onClick: () => handleTrigger(!isOpen),
        }),
  };

  return (
    <>
      <div
        className={`dd-dropdown-wrapper ${wrapperClassName} ${
          disabled ? "dd-disabled" : ""
        }`}
        aria-disabled={disabled}
        ref={triggerRef}
        {...triggerProps}
      >
        {triggerButton}

        {isOpen &&
          createPortal(
            <div
              ref={menuRef}
              className={`dd-dropdown-menu ${placement} ${
                isOpen ? "open" : ""
              }`}
              style={{
                top: position?.top,
                left: position?.left,
              }}
              onMouseLeave={
                trigger === "hover" ? () => handleTrigger(false) : undefined
              }
            >
              {menuItems.map((item, index) => (
                <div key={index}>
                  <Option
                    option={{ label: item.label, value: item.label }}
                    selectOp={() => handleMenuItemClick(item)}
                    buttonClassName={`dd-menu-item ${
                      item.disabled ? "disabled" : ""
                    }`}
                  />

                  {item.divided && <div className="dd-menu-divider" />}
                </div>
              ))}
            </div>,
            document.body
          )}
      </div>
    </>
  );
};

export default DropdownMenu;
