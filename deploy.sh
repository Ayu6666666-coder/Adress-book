#!/bin/bash

echo "🚀 开始部署到GitHub Pages..."

# 构建项目
echo "📦 构建项目..."
npm run build

# 进入构建目录
cd build

# 初始化git仓库
git init
git add -A
git commit -m "部署到GitHub Pages"

# 推送到gh-pages分支
echo "🌐 推送到GitHub Pages..."
git push -f https://github.com/Ayu6666666-coder/Adress-book.git main:gh-pages

echo "✅ 部署完成！"
echo "🌍 网站将在几分钟后可访问：https://Ayu6666666-coder.github.io/Adress-book"

cd .. 