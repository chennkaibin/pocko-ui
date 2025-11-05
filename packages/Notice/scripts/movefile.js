const { globSync } = require("glob");
const fs = require("fs");
const path = require("path");

// 源文件夹路径模式
const sourcePattern = "./dist/**/*.{js,css,d.ts}";
// 目标文件夹路径
const targetFolder = "./lib";

// 检查目标文件夹是否存在，如果不存在则创建
if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder, { recursive: true });
}

// 使用 glob 同步匹配文件并进行复制和重命名
const files = globSync(sourcePattern).filter((file) => {
  // 过滤掉 `dist\types\utils` 下的文件
  return !file.includes("dist\\types\\utils");
});

if (files.length === 0) {
  console.error("没有匹配到任何文件");
} else {
  files.forEach((file) => {
    console.log(file);

    // 获取文件名和扩展名
    const fileName = path.basename(file);

    // 构建目标文件路径
    const targetFilePath = path.join(targetFolder, fileName);

    // 确保目标文件夹存在
    const targetDir = path.dirname(targetFilePath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 复制并重命名文件
    fs.copyFile(file, targetFilePath, (err) => {
      if (err) {
        console.error(`无法复制文件 ${file}:`, err);
      } else {
        console.log(`已复制并重命名文件: ${file} 为 ${fileName}`);
      }
    });
  });
}
