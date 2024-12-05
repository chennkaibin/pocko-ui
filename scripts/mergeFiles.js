const fs = require("fs-extra");
const path = require("path");
const { globSync } = require("glob");

// 源文件夹路径模式，排除 node_modules 文件夹
const sourcePattern = "./packages/!(node_modules)/lib";
// 目标文件夹路径
const targetFolder = "./lib";

console.log(sourcePattern);

// 使用 glob 同步匹配文件夹并进行复制和重命名
const folders = globSync(sourcePattern);

if (folders.length === 0) {
  console.error("没有匹配到任何文件夹");
} else {
  folders.forEach((folder) => {
    // 获取文件夹的最外层目录名称
    const dirName = path.dirname(folder);

    // 构建新的文件名
    const newFileName = `${dirName}`;
    // 构建目标文件路径
    const targetFilePath = path.join(targetFolder, newFileName);

    // 确保目标文件夹存在
    const targetDir = path.dirname(targetFilePath);

    // 确保目标文件夹存在
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 复制并重命名文件夹
    fs.copy(folder, targetFilePath, (err) => {
      if (err) {
        console.error(`无法复制文件夹 ${folder}:`, err);
      } else {
        console.log(`已复制并重命名文件夹: ${folder} 为 ${targetFilePath}`);
      }
    });
  });
}
