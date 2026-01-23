import { useEffect, useRef } from "react";

export const useDropdown = (
  isShow: boolean,
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>,
  dropDownList: any[], // 添加下拉框内容作为参数
  loading: boolean,
  dropdownPosition: "top" | "bottom" | "auto" = "auto", // 新增参数，默认自动计算
  onHide?: () => void,
) => {
  const dropdown = useRef<HTMLDivElement | any>(null);
  const dropdownContent = useRef<HTMLDivElement | any>(null);
  const prevIsShowRef = useRef(false);

  useEffect(() => {
    if (prevIsShowRef.current && !isShow) {
      onHide?.();
    }
    prevIsShowRef.current = isShow;
  }, [isShow, onHide]);

  const adjustDropdownPosition = () => {
    if (dropdownContent.current && dropdown.current) {
      const dropdownRect = dropdown.current.getBoundingClientRect();
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      // 视口高度与上下可用空间
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - dropdownRect.bottom;
      const spaceAbove = dropdownRect.top;

      // 定位到上方或下方或者自适应
      let positionTop;
      if (dropdownPosition == "top") {
        // 始终显示在上方
        positionTop = `${dropdownRect.top + scrollY - dropdownContent.current.offsetHeight}px`;
        dropdownContent.current.style.maxHeight = `${Math.min(200, spaceAbove - 10)}px`;
      } else if (dropdownPosition == "bottom") {
        // 始终显示在下方
        positionTop = `${dropdownRect.bottom + scrollY}px`;
        dropdownContent.current.style.maxHeight = `${Math.min(200, spaceBelow - 10)}px`;
      } else {
        if (spaceBelow < 100 && spaceAbove > spaceBelow) {
          // 显示在上方
          positionTop = `${dropdownRect.top + scrollY - dropdownContent.current.offsetHeight}px`;
          dropdownContent.current.style.maxHeight = `${Math.min(200, spaceAbove - 10)}px`; // 留出10px间距
        } else {
          // 显示在下方
          positionTop = `${dropdownRect.bottom + scrollY}px`;
          dropdownContent.current.style.maxHeight = `${Math.min(200, spaceBelow - 10)}px`;
        }
      }

      // 水平方向定位
      let positionLeft = dropdownRect.left + scrollX;
      const dropdownWidth = dropdownContent.current.offsetWidth;
      const viewportWidth = window.innerWidth;
      const spaceRight = viewportWidth - dropdownRect.right;

      // 如果右侧空间不足，调整位置
      if (spaceRight < dropdownWidth) {
        positionLeft = Math.max(
          10,
          dropdownRect.right + scrollX - dropdownWidth,
        ); // 最小间距为10px
      }

      dropdownContent.current.style.left = `${positionLeft}px`;
      dropdownContent.current.style.top = positionTop;
    }
  };

  useEffect(() => {
    if (isShow) {
      adjustDropdownPosition();
    }
  }, [isShow, dropDownList.length, loading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isShow &&
        dropdown.current !== event.target &&
        !dropdown.current.contains(event.target as HTMLElement) &&
        dropdownContent.current !== event.target &&
        !dropdownContent.current.contains(event.target as HTMLElement)
      ) {
        setIsShow(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isShow]);

  return { dropdown, dropdownContent };
};
