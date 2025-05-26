# 🗺️ Google Maps API 完整配置指南

## 📋 第一步：创建或使用现有API密钥

### 方法1：创建新的API密钥（推荐）
1. 在当前页面点击 **"创建凭据"** 按钮
2. 选择 **"API密钥"**
3. 复制生成的密钥（应该以 `AIza` 开头）

### 方法2：使用现有密钥
如果您的现有密钥格式正确（以`AIza`开头），可以直接使用。

## 🔧 第二步：启用必要的API服务

在左侧菜单点击 **"库"**，搜索并启用以下4个API：

1. **Maps JavaScript API** - 用于地图显示
2. **Geocoding API** - 用于地址转坐标  
3. **Distance Matrix API** - 用于距离计算
4. **Places API** - 用于地点搜索

## 🌐 第三步：配置网址签名（可选但推荐）

### 在"立即对网址进行签名"部分：

1. **网址字段**：填入您的域名
   ```
   https://hawaiihub.net
   ```

2. **示例URL**：系统会自动生成，类似：
   ```
   https://maps.googleapis.com/maps/api/staticmap?
   YOUR_REQUEST_PARAMETERS&key=YOUR_KEY_OR_CLIENT=YOUR_KEY_OR_ID
   ```

### 域名限制设置：
1. 点击您的API密钥进行编辑
2. 在 **"应用限制"** 中选择 **"HTTP引荐来源网址"**
3. 添加以下域名：
   ```
   https://hawaiihub.net/*
   https://*.hawaiihub.net/*
   http://localhost:*/*  (用于本地测试)
   ```

## 🔑 第四步：API限制配置

在API密钥编辑页面：

1. 选择 **"限制密钥"**
2. 勾选以下4个API：
   - Maps JavaScript API
   - Geocoding API
   - Distance Matrix API
   - Places API

## ✅ 配置完成检查清单

- [ ] 创建或确认API密钥（以`AIza`开头）
- [ ] 启用4个必要的API服务
- [ ] 设置域名限制（hawaiihub.net）
- [ ] 配置API限制（只允许4个地图API）
- [ ] 测试API密钥有效性

## 🚨 重要提醒

**您只需要1个API密钥**，不需要创建4个！
一个API密钥可以调用多个已启用的API服务。

## 🧪 测试您的配置

配置完成后，告诉我您的API密钥，我将自动：
1. 验证密钥格式
2. 测试API连接
3. 配置到您的项目
4. 运行功能测试 