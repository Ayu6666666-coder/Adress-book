#!/bin/bash

echo "🔍 检查部署状态..."
echo "================================"

# 检查GitHub仓库
echo "📂 检查GitHub仓库..."
REPO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://github.com/Ayu6666666-coder/Adress-book)
if [ "$REPO_STATUS" = "200" ]; then
    echo "✅ GitHub仓库存在"
else
    echo "❌ GitHub仓库不存在 (状态码: $REPO_STATUS)"
    echo "   请先创建仓库: https://github.com/new"
fi

# 检查GitHub Pages
echo "🌐 检查GitHub Pages..."
PAGES_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://Ayu6666666-coder.github.io/Adress-book)
if [ "$PAGES_STATUS" = "200" ]; then
    echo "✅ GitHub Pages已部署成功"
    echo "   访问地址: https://Ayu6666666-coder.github.io/Adress-book"
elif [ "$PAGES_STATUS" = "404" ]; then
    echo "⏳ GitHub Pages尚未部署或正在构建中"
else
    echo "❓ GitHub Pages状态未知 (状态码: $PAGES_STATUS)"
fi

# 检查本地构建
echo "📦 检查本地构建..."
if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo "✅ 本地构建文件存在"
    BUILD_SIZE=$(du -sh build | cut -f1)
    echo "   构建大小: $BUILD_SIZE"
else
    echo "❌ 本地构建文件不存在"
fi

# 检查Git状态
echo "📝 检查Git状态..."
if git status --porcelain | grep -q .; then
    echo "⚠️  有未提交的更改"
    echo "   运行 'git status' 查看详情"
else
    echo "✅ Git状态干净"
fi

echo "================================"
echo "🔗 有用的链接:"
echo "   仓库: https://github.com/Ayu6666666-coder/Adress-book"
echo "   设置: https://github.com/Ayu6666666-coder/Adress-book/settings/pages"
echo "   网站: https://Ayu6666666-coder.github.io/Adress-book" 