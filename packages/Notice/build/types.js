const fs = require("fs");
const path = require("path");

// 定义要查找的文件名
let currentDir = path.resolve(__dirname, "../@types");

// 查找文件
const typesFilePath = findFileInSubDirs(currentDir, "Index.d.ts");
const typesTargetPath = path.resolve(__dirname, "../dist/index.d.ts");

if (fs.existsSync(typesFilePath)) {
  fs.copyFileSync(typesFilePath, typesTargetPath);
  fs.rmSync(path.resolve(__dirname, "../@types"), { recursive: true });
  console.log("\x1b[36m%s\x1b[0m", `--> Deleted "@types" successfully`);
  console.log("\x1b[36m%s\x1b[0m", `--> Copied "dist/index.d.ts" successfully`);
} else {
  console.error(
    "\x1b[31m%s\x1b[0m",
    `--> Source file not found: ${typesFilePath}`
  );
}

// 递归查找文件
function findFileInSubDirs(dir, file) {
  const files = fs.readdirSync(dir);

  if (files.includes(file)) {
    return path.join(dir, file);
  }

  // 如果当前目录没有目标文件，则递归查找子目录
  for (const fileOrDir of files) {
    const fullPath = path.join(dir, fileOrDir);
    const stat = fs.statSync(fullPath);

    // 如果是目录，则递归查找该目录
    if (stat.isDirectory()) {
      const result = findFileInSubDirs(fullPath, file);
      if (result) {
        return result;
      }
    }
  }

  return null;
}
