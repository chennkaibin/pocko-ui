import { useState, useEffect } from "react";

export const useKeyboardNavigation = (
  optionsCount: number,
  chooseOption: (index: number) => void,
  onKeyDown?: Function | any
) => {
  const [focusedOption, setFocusedOption] = useState<number | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    switch (key) {
      case "ArrowUp":
        event.preventDefault();
        setFocusedOption((prev) =>
          prev === null
            ? optionsCount - 1
            : (prev - 1 + optionsCount) % optionsCount
        );
        break;
      case "ArrowDown":
        event.preventDefault();
        setFocusedOption((prev) =>
          prev === null ? 0 : (prev + 1) % optionsCount
        );
        break;
      case "Enter":
        if (focusedOption !== null) {
          chooseOption(focusedOption);
        }
        break;
      default:
        break;
    }

    // 回调函数，传键盘按下的值
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  useEffect(() => {
    const visibleItems = document.querySelectorAll(
      ".select-input__popup__list"
    );
    if (focusedOption !== null && visibleItems[focusedOption]) {
      visibleItems[focusedOption].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [focusedOption]);

  // 设置焦点选项
  function handleOptionFocus(item: any) {
    setFocusedOption(item);
  }

  // 清除焦点选项
  function handleOptionBlur() {
    setFocusedOption(null);
  }

  return {
    focusedOption,
    setFocusedOption,
    handleKeyDown,
    handleOptionFocus,
    handleOptionBlur,
  };
};
