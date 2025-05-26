# 🔑 Google Maps API 密钥获取指南

## 📋 快速操作步骤

### 1. 登录 Google Cloud Console
1. 在浏览器中访问：https://console.cloud.google.com/
2. 使用您的 Google 账户登录

### 2. 选择项目
1. 在页面顶部的项目选择器中，选择项目：`core-trees-448409-c5`
2. 如果没有看到这个项目，请创建一个新项目

### 3. 启用必要的 API
1. 在左侧菜单中，点击 "API 和服务" > "库"
2. 搜索并启用以下 API：
   - **Maps JavaScript API**
   - **Geocoding API** 
   - **Distance Matrix API**
   - **Places API**

### 4. 创建 API 密钥
1. 在左侧菜单中，点击 "API 和服务" > "凭据"
2. 点击页面顶部的 "+ 创建凭据"
3. 选择 "API 密钥"
4. 复制生成的 API 密钥（类似：AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX）

### 5. 配置 API 密钥限制（推荐）
1. 点击刚创建的 API 密钥旁边的编辑按钮
2. 在 "应用限制" 中选择 "HTTP 引荐来源网址"
3. 添加您的域名：`https://hawaiihub.net/*`
4. 在 "API 限制" 中选择 "限制密钥"
5. 选择之前启用的 4 个 API
6. 点击 "保存"

## 🔄 获取密钥后的操作

获取到 API 密钥后，请告诉我密钥内容，我将自动配置到系统中并进行测试。

---

**注意**: API 密钥是敏感信息，请妥善保管。 