# 🚀 快速开始 - Google Maps API 配置

## 📋 当前状态
✅ 项目代码已完成  
✅ 依赖包已安装  
✅ .env 文件已创建  
✅ 配置脚本已准备  
❌ 需要获取 Google Maps API 密钥  

## 🔑 获取 API 密钥（2 分钟）

### 方法 1: 快速获取（推荐）
1. 打开浏览器，访问：https://console.cloud.google.com/
2. 登录您的 Google 账户
3. 选择或创建项目 `core-trees-448409-c5`
4. 点击左侧菜单 "API 和服务" > "凭据"
5. 点击 "+ 创建凭据" > "API 密钥"
6. 复制生成的 API 密钥

### 方法 2: 使用现有密钥
如果您已有 Google Maps API 密钥，可以直接使用。

## ⚡ 一键配置

获取到 API 密钥后，运行以下命令：

```bash
# 替换 YOUR_API_KEY 为您的实际 API 密钥
node update_api_key.js YOUR_API_KEY
```

示例：
```bash
node update_api_key.js AIzaSyBkEd8rJqHvKvXXXXXXXXXXXXXXXXXXXXX
```

## 🧪 测试配置

配置完成后，立即测试：

```bash
# 运行完整测试
npm test

# 或运行快速测试
node -e "require('dotenv').config(); console.log('API Key:', process.env.GOOGLE_MAPS_API_KEY ? '已配置 ✅' : '未配置 ❌');"
```

## 🎯 临时测试方案

如果您暂时无法获取 API 密钥，我可以为您创建一个模拟测试环境：

```bash
# 运行模拟测试（无需真实 API 密钥）
node src/test/mockTest.js
```

## 📞 需要帮助？

如果您在获取 API 密钥过程中遇到问题，请：

1. 查看 `GET_API_KEY_GUIDE.md` 详细指南
2. 或者告诉我您的 Google 账户邮箱，我可以提供更具体的指导
3. 或者我们可以先用模拟数据进行测试

---

**下一步**: 获取 API 密钥 → 运行配置脚本 → 测试功能 → 开始使用！ 