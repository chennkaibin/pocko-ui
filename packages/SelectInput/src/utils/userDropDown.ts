import { useEffect, useRef } from "react";

export const useDropdown = (
  isShow: boolean,
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>,
  dropDownList: any[], // 添加下拉框内容作为参数
  loading: boolean
) => {
  const dropdown = useRef<HTMLDivElement | any>(null);
  const dropdownContent = useRef<HTMLDivElement | any>(null);

  const adjustDropdownPosition = () => {
    if (dropdownContent.current && dropdown.current) {
      const dropdownRect = dropdown.current.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - dropdownRect.bottom - 20;
      const spaceAbove = dropdownRect.top - 20;

      let positionTop;
      if (spaceBelow < 100 && spaceAbove > spaceBelow) {
        // 显示在上方
        positionTop = `${
          dropdownRect.top + scrollY - dropdownContent.current.offsetHeight
        }px`;
        dropdownContent.current.style.maxHeight = `${Math.min(
          200,
          spaceAbove
        )}px`;
      } else {
        // 显示在下方
        positionTop = `${dropdownRect.bottom + scrollY}px`;
        dropdownContent.current.style.maxHeight = `${Math.min(
          200,
          spaceBelow
        )}px`;
      }

      dropdownContent.current.style.left = `${dropdownRect.left + scrollX}px`;
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
