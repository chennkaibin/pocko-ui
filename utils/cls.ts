function clsWrite(s: any, defaultCls: string, targetCls?: string): string {
  if (s || s === "") {
    return targetCls !== undefined ? targetCls : s;
  }
  return defaultCls;
}

function clsCombine(...classes: any[]) {
  return classes
    .map((cls) => {
      if (typeof cls === "string") {
        return cls;
      } else if (typeof cls === "object" && cls !== null) {
        return Object.keys(cls)
          .filter((key) => cls[key]) // 仅选择值为 true 的类名
          .join(" ");
      }
      return "";
    })
    .filter(Boolean) // 过滤掉 falsy 值
    .join(" "); // 用空格连接
}

export { clsWrite, clsCombine };
