#!/bin/bash

echo "🚀 为GitHub Pages构建项目..."

# 构建项目（带homepage路径）
npm run build

echo "✅ GitHub Pages构建完成！"
echo "📁 构建文件位于 build/ 目录"
echo "🌐 准备部署到: https://Ayu6666666-coder.github.io/Adress-book"

# 随时运行此命令检查状态
./check-deployment.sh 