# 🔧 启用 Google Maps API 服务指南

## 🚨 当前问题
您的API密钥格式正确，但是API调用被拒绝。这是因为需要在Google Cloud Console中启用相应的API服务。

## 📋 需要启用的API服务

请在Google Cloud Console中启用以下4个API：

### 1. **Geocoding API** ⭐ (最重要)
- **用途**: 地址转坐标、坐标转地址
- **状态**: ❌ 未启用（导致当前测试失败）

### 2. **Maps JavaScript API**
- **用途**: 地图显示和交互
- **状态**: ❓ 需要检查

### 3. **Distance Matrix API**
- **用途**: 距离和时间计算
- **状态**: ❓ 需要检查

### 4. **Places API**
- **用途**: 地点搜索和附近搜索
- **状态**: ❓ 需要检查

## 🔧 启用步骤

### 在您的Google Cloud Console中：

1. **访问API库**
   - 在左侧菜单点击 **"API 和服务"** → **"库"**

2. **搜索并启用每个API**
   
   **步骤 A: 启用 Geocoding API**
   - 在搜索框输入 `Geocoding API`
   - 点击 **"Geocoding API"**
   - 点击 **"启用"** 按钮
   
   **步骤 B: 启用 Maps JavaScript API**
   - 搜索 `Maps JavaScript API`
   - 点击并启用
   
   **步骤 C: 启用 Distance Matrix API**
   - 搜索 `Distance Matrix API`
   - 点击并启用
   
   **步骤 D: 启用 Places API**
   - 搜索 `Places API`
   - 点击并启用

3. **验证启用状态**
   - 在左侧菜单点击 **"已启用的 API 和服务"**
   - 确认看到所有4个API都在列表中

## ⚡ 快速启用链接

如果您在项目 `core-trees-448409-c5` 中，可以直接点击以下链接：

- [启用 Geocoding API](https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com?project=core-trees-448409-c5)
- [启用 Maps JavaScript API](https://console.cloud.google.com/apis/library/maps-backend.googleapis.com?project=core-trees-448409-c5)
- [启用 Distance Matrix API](https://console.cloud.google.com/apis/library/distance-matrix-backend.googleapis.com?project=core-trees-448409-c5)
- [启用 Places API](https://console.cloud.google.com/apis/library/places-backend.googleapis.com?project=core-trees-448409-c5)

## 🧪 启用后的测试

启用所有API后，运行以下命令重新测试：

```bash
# 重新测试所有功能
node test_maps_integration.cjs

# 或者快速测试单个功能
node api_key_validator.cjs AIzaSyCGkzu4xH35eOFC1qPw10y_tKjvEJ-vDLw
```

## 💡 常见问题

**Q: 启用API后还是失败怎么办？**
A: 
1. 等待1-2分钟让API生效
2. 检查API密钥是否有使用限制
3. 确认项目配额是否充足

**Q: 如何检查API是否已启用？**
A: 在Google Cloud Console左侧菜单 → "已启用的 API 和服务" 中查看

**Q: 需要付费吗？**
A: Google Maps API有免费配额，通常足够测试和小规模使用

## 🎯 下一步

启用API后，您将能够：
- ✅ 地址转坐标转换
- ✅ 距离和时间计算  
- ✅ 附近地点搜索
- ✅ 完整的火鸟门户地图集成

请启用这些API后告诉我，我将立即重新运行测试！ 