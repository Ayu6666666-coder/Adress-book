# 办公通讯录网站部署说明

本文档提供了如何部署办公通讯录网站的详细说明。

## 项目概述

这是一个基于React的办公通讯录网站，使用Create React App构建，支持联系人搜索、筛选和详细信息查看功能。

## 文件结构

```
address_book_slim/
├── data/                  # 通讯录数据文件（可选，用于数据处理）
├── build/                 # 构建后的静态网站文件（npm run build后生成）
├── docs/                  # 项目文档
│   └── 通讯录数据导入指南.md # 数据导入详细指南
├── public/                # 公共资源文件
│   ├── contacts.json      # 网站使用的联系人数据
│   ├── favicon.svg        # 网站图标
│   ├── index.html         # HTML模板
│   └── manifest.json      # PWA配置
├── scripts/               # 工具脚本
│   └── import-contacts.js # 通讯录数据导入工具
├── src/                   # 源代码
│   ├── App.css            # 样式文件
│   ├── App.tsx            # 主应用组件
│   ├── index.tsx          # 应用入口
│   ├── index.css          # 全局样式
│   └── assets/            # 静态资源
├── package.json           # 项目配置和依赖
├── package-lock.json      # 依赖锁定文件
├── tsconfig.json          # TypeScript配置
├── deploy.sh              # 自动部署脚本
└── README.md              # 项目说明文档
```

## 🚀 快速部署

### 方法1：使用自动部署脚本（推荐）

1. **配置GitHub仓库**（如果还没有）：
   ```bash
   # 创建GitHub仓库后，添加远程仓库
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   
   # 推送代码到main分支
   git add .
   git commit -m "初始提交"
   git push -u origin main
   ```

2. **更新package.json中的homepage字段**：
   ```json
   "homepage": "https://你的用户名.github.io/你的仓库名"
   ```

3. **运行部署脚本**：
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **访问网站**：
   部署完成后，网站将在几分钟后可访问：
   https://你的用户名.github.io/你的仓库名

### 方法2：手动部署到GitHub Pages

1. **构建项目**：
   ```bash
   npm install
   npm run build
   ```

2. **使用gh-pages部署**：
   ```bash
   npm run deploy
   ```

### 方法3：部署到其他静态托管服务

1. **构建项目**：
   ```bash
   npm install
   npm run build
   ```

2. **上传build目录**：
   将 `build` 目录中的所有文件上传到您的静态托管服务（如Netlify、Vercel、阿里云OSS等）

## 🔧 本地开发

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **启动开发服务器**：
   ```bash
   npm start
   ```

3. **在浏览器中访问**：
   http://localhost:3000

## 📝 更新通讯录数据

### 方法1：使用导入工具（推荐）

项目提供了专门的数据导入工具，支持从CSV和JSON文件导入：

1. **准备数据文件**：
   - 支持CSV格式（推荐）
   - 支持JSON格式
   - 必需字段：部门、姓名
   - 可选字段：手机、分机、直线

2. **使用导入工具**：
   ```bash
   # 进入scripts目录
   cd scripts
   
   # 创建示例CSV文件
   node import-contacts.js --sample
   
   # 从CSV文件导入
   node import-contacts.js your-contacts.csv
   
   # 查看帮助信息
   node import-contacts.js --help
   ```

3. **CSV文件格式示例**：
   ```csv
   部门,姓名,手机,分机,直线
   技术部,张三,13800138000,8001,50328001
   技术部,李四,13900139000,8002,50328002
   市场部,王五,13700137000,8003,50328003
   ```

### 方法2：直接编辑JSON文件

1. **修改数据文件**：
   编辑 `public/contacts.json` 文件

2. **数据格式示例**：
   ```json
   {
     "contacts": [
       {
         "id": "1",
         "部门": "技术部",
         "姓名": "张三",
         "手机": "13800138000",
         "分机": "8001",
         "直线": "50328001"
       }
     ],
     "departments": ["技术部", "市场部"],
     "total": 1,
     "fields": ["部门", "姓名", "手机", "分机", "直线"]
   }
   ```

3. **重新构建和部署**：
   ```bash
   npm run build
   ./deploy.sh
   ```

### 详细导入指南

查看完整的数据导入指南：[通讯录数据导入指南](docs/通讯录数据导入指南.md)

## 🎨 自定义网站

您可以通过修改以下文件来自定义网站：

- **`src/App.tsx`**：修改网站功能和布局
- **`src/App.css`**：修改网站样式
- **`src/index.css`**：修改全局样式
- **`public/contacts.json`**：更新联系人数据
- **`public/manifest.json`**：修改PWA配置

修改后需要重新构建项目：
```bash
npm run build
```

## 🛠️ 技术栈

- **React 18**：前端框架
- **TypeScript**：类型安全
- **Create React App**：构建工具
- **CSS3**：样式设计
- **GitHub Pages**：静态网站托管

## 📋 功能特性

- ✅ 联系人搜索（姓名、部门、职位）
- ✅ 部门筛选
- ✅ 响应式设计（支持手机、平板、电脑）
- ✅ 联系人详细信息查看
- ✅ 一键拨号和发邮件
- ✅ PWA支持

## ⚠️ 注意事项

- 网站完全在客户端运行，不需要后端服务器
- 所有数据都存储在 `contacts.json` 文件中，确保该文件格式正确
- 网站设计为响应式，可在手机、平板和电脑上良好显示
- 部署到GitHub Pages时，确保仓库名称与package.json中的homepage字段匹配

## 🐛 常见问题

### 1. 构建失败
- 检查Node.js版本（推荐v16+）
- 删除node_modules文件夹，重新运行 `npm install`
- 确保TypeScript版本与react-scripts兼容（使用4.9.5版本）

### 2. 部署后页面空白
- 检查package.json中的homepage字段是否正确
- 确保GitHub Pages设置中选择了gh-pages分支

### 3. 数据不显示
- 检查public/contacts.json文件格式是否正确
- 确保JSON文件编码为UTF-8

### 4. TypeScript编译错误
- 确保所有导入路径不包含文件扩展名（如.tsx）
- 检查是否有未使用的组件或依赖导致编译错误

## 🔧 最近修复的问题

### 2024年12月 - 代码问题修复
- **修复TypeScript版本冲突**：将TypeScript从5.8.3降级到4.9.5以兼容react-scripts 5.0.1
- **清理未使用的依赖**：删除了未使用的shadcn/ui组件和相关hooks，简化项目结构
- **修复导入路径错误**：修正了index.tsx中的App组件导入路径
- **修复Tailwind CSS问题**：移除了未安装的Tailwind CSS指令，替换为标准CSS变量和样式
- **优化全局样式**：改进了index.css文件，添加了更好的样式重置和CSS变量定义
- **修复HTML资源引用问题**：移除了不存在的favicon.ico和logo192.png引用，避免404错误
- **创建自定义图标**：添加了SVG格式的favicon，提升用户体验
- **优化PWA配置**：更新了manifest.json文件，添加了SEO相关的meta标签
- **优化项目结构**：移除了不必要的components、hooks、lib目录，使项目更加简洁
- **确保构建成功**：项目现在可以正常构建和运行，CSS文件大小也得到了优化

### 2024年12月 - UI优化更新
- **移除联系人详情图标**：去掉了手机📱、直线☎️、分机📞等emoji图标，界面更加简洁清爽
- **优化联系人详情布局**：采用左右对齐的布局，标签在左，联系方式在右
- **增强交互效果**：鼠标悬停时有背景色变化和圆角效果
- **保持功能完整性**：手机和直线号码仍然可以点击拨打
- **改进视觉层次**：使用颜色和字重区分标签和数值，提升可读性

## 📞 技术支持

如果您在部署过程中遇到问题，请检查：
1. Node.js和npm版本
2. 网络连接
3. GitHub仓库权限设置
4. 文件路径和命名

---

**项目版本**：1.0.0  
**最后更新**：2024年12月
