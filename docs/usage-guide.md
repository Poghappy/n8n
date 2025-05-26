# 夏威夷华人平台 Google 地图集成使用指南

## 📋 概述

本指南将帮助您完成夏威夷华人平台的 Google 地图功能配置和使用。该系统集成了火鸟门户的信息模块和招聘模块，为用户提供基于位置的服务。

## 🚀 快速开始

### 1. 环境准备

#### 安装依赖
```bash
# 安装 Node.js 依赖
npm install

# 或使用 yarn
yarn install
```

#### 创建环境配置文件
```bash
# 在项目根目录创建 .env 文件
touch .env
```

#### 配置环境变量
在 `.env` 文件中添加以下配置：

```env
# Google 地图配置
GOOGLE_MAPS_API_KEY=你的Google地图API密钥
GOOGLE_APPLICATION_CREDENTIALS=./googleServiceAccount.json

# 火鸟门户系统配置
API_BASE=https://hawaiihub.net/include/json.php
ADMIN_USERNAME=你的管理员用户名
ADMIN_PASSWORD=你的管理员密码

# 夏威夷华人平台配置
HAWAIIHUB_BASE_URL=https://hawaiihub.net
HAWAIIHUB_ADMIN_URL=https://hawaiihub.net/admin/login
```

### 2. Google Cloud 配置

#### 获取 API 密钥
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择或创建项目 `core-trees-448409-c5`
3. 启用以下 API：
   - Maps JavaScript API
   - Geocoding API
   - Distance Matrix API
   - Places API
4. 创建 API 密钥并设置适当的限制

#### 配置服务账户
项目已包含 `googleServiceAccount.json` 文件，包含以下信息：
- 项目ID: `core-trees-448409-c5`
- 服务账户: `hawaiihub-map-bot@core-trees-448409-c5.iam.gserviceaccount.com`

### 3. 测试配置

运行测试以验证配置是否正确：

```bash
# 运行地图功能测试
npm test

# 或直接运行测试文件
node src/test/mapTest.js
```

## 🗺️ 功能使用

### 信息模块地图集成

#### 发布带位置的分类信息
```javascript
const FirebirdMapIntegration = require('./src/firebird/mapIntegration');

const mapIntegration = new FirebirdMapIntegration();

// 发布信息并自动添加地理位置
const infoData = {
    title: '出售二手车',
    description: '2020年丰田凯美瑞，车况良好',
    address: 'Honolulu, HI',
    category: 'vehicles',
    price: 25000
};

const result = await mapIntegration.addLocationToInfo(infoData);
console.log('发布成功:', result);
```

#### 搜索附近的信息
```javascript
// 搜索檀香山附近 5 公里内的车辆信息
const nearbyInfo = await mapIntegration.searchNearbyInfo(
    { lat: 21.3099, lng: -157.8581 }, // 檀香山坐标
    5000, // 5 公里半径
    'vehicles' // 车辆分类
);

console.log(`找到 ${nearbyInfo.length} 个附近的车辆信息`);
```

### 招聘模块地图集成

#### 发布带位置的招聘信息
```javascript
// 发布招聘信息并自动添加公司位置
const jobData = {
    job_name: '软件工程师',
    job_description: '负责网站开发和维护',
    company_name: '夏威夷科技公司',
    company_address: 'Waikiki Beach, Honolulu, HI',
    salary: '80000-120000',
    job_type: 'full-time'
};

const result = await mapIntegration.addJobLocation(jobData);
console.log('招聘信息发布成功:', result);
```

#### 搜索附近的工作机会
```javascript
// 搜索威基基海滩附近的工作机会
const nearbyJobs = await mapIntegration.searchNearbyJobs(
    { lat: 21.2793, lng: -157.8293 }, // 威基基海滩坐标
    10000, // 10 公里半径
    'technology' // 技术类职位
);

console.log(`找到 ${nearbyJobs.length} 个附近的工作机会`);
```

### 地图可视化

#### 生成地图页面
```javascript
// 生成包含多个位置的地图页面
const items = [
    {
        latitude: 21.3099,
        longitude: -157.8581,
        title: '檀香山办公室',
        description: '主要办公地点'
    },
    {
        latitude: 21.2793,
        longitude: -157.8293,
        title: '威基基分部',
        description: '旅游业务部门'
    }
];

const mapHTML = mapIntegration.generateMapHTML(items, {
    title: '夏威夷华人平台办公地点',
    center: { lat: 21.3099, lng: -157.8581 },
    zoom: 11
});

// 保存为 HTML 文件
const fs = require('fs').promises;
await fs.writeFile('locations-map.html', mapHTML);
```

## 🔧 高级功能

### 地理编码工具

```javascript
const GoogleMapsHelper = require('./src/common/googleMapsHelper');
const mapsHelper = new GoogleMapsHelper();

// 地址转坐标
const location = await mapsHelper.geocodeAddress('Pearl Harbor, HI');
console.log('坐标:', location.latitude, location.longitude);

// 坐标转地址
const address = await mapsHelper.reverseGeocode(21.3649, -157.9507);
console.log('地址:', address);

// 计算距离
const distance = await mapsHelper.calculateDistance(
    { lat: 21.3099, lng: -157.8581 }, // 起点
    { lat: 21.2793, lng: -157.8293 }  // 终点
);
console.log('距离:', distance.distance, '车程:', distance.duration);

// 搜索附近地点
const nearbyPlaces = await mapsHelper.searchNearby(
    { lat: 21.3099, lng: -157.8581 },
    'restaurant',
    2000
);
console.log('附近餐厅:', nearbyPlaces);
```

### 批量处理

```javascript
// 批量为现有信息添加地理位置
async function batchAddLocations() {
    const { callApi } = require('./src/common/apiHelper');
    
    // 获取所有信息
    const response = await callApi({
        service: 'info',
        action: 'ilist',
        page: 1,
        limit: 100
    });
    
    for (const info of response.data) {
        if (info.address && !info.latitude) {
            try {
                const location = await mapsHelper.geocodeAddress(info.address);
                
                // 更新信息位置
                await callApi({
                    service: 'info',
                    action: 'edit',
                    id: info.id,
                    latitude: location.latitude,
                    longitude: location.longitude
                });
                
                console.log(`已更新信息 ${info.id} 的位置`);
            } catch (error) {
                console.error(`信息 ${info.id} 位置更新失败:`, error);
            }
        }
    }
}
```

## 📊 监控和日志

### 查看操作日志
```bash
# 查看操作状态日志
cat docs/status.md

# 实时监控日志
tail -f docs/status.md
```

### 日志格式
```
时间 | 模块 | 操作 | 状态 | 备注
2024-01-15 10:30:00 | info | put | 成功 | 添加信息并包含位置: 出售二手车
2024-01-15 10:31:00 | job | put | 成功 | 添加招聘信息并包含位置: 软件工程师
```

## 🚨 故障排除

### 常见问题

#### 1. API 密钥错误
**症状**: `Google Maps API Key 未配置` 或 `API 密钥无效`

**解决方案**:
- 检查 `.env` 文件中的 `GOOGLE_MAPS_API_KEY` 是否正确
- 确认 API 密钥已启用相关服务
- 检查 API 密钥的使用限制设置

#### 2. 地理编码失败
**症状**: `未找到地址` 或地理编码返回错误

**解决方案**:
- 确认地址格式正确（建议包含州名，如 "Honolulu, HI"）
- 检查网络连接
- 验证 Geocoding API 是否已启用

#### 3. 配额超限
**症状**: API 调用返回配额错误

**解决方案**:
- 检查 Google Cloud Console 中的 API 使用情况
- 考虑升级 API 计划或优化调用频率
- 实施缓存机制减少重复调用

#### 4. 权限不足
**症状**: 服务账户权限错误

**解决方案**:
- 确认服务账户具有必要的 API 权限
- 检查 `googleServiceAccount.json` 文件是否正确
- 验证项目 ID 是否匹配

### 调试工具

```bash
# 测试 API 连接
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Honolulu,HI&key=YOUR_API_KEY"

# 验证服务账户文件
node -e "console.log(require('./googleServiceAccount.json'))"

# 检查环境变量
node -e "require('dotenv').config(); console.log(process.env.GOOGLE_MAPS_API_KEY)"
```

## 📚 API 参考

### FirebirdMapIntegration 类

#### 方法列表

- `addLocationToInfo(infoData)` - 为信息添加位置
- `addJobLocation(jobData)` - 为招聘信息添加位置
- `searchNearbyInfo(location, radius, category)` - 搜索附近信息
- `searchNearbyJobs(location, radius, category)` - 搜索附近招聘
- `generateMapHTML(items, options)` - 生成地图页面
- `testMapFunctions()` - 测试地图功能

### GoogleMapsHelper 类

#### 方法列表

- `geocodeAddress(address)` - 地理编码
- `reverseGeocode(lat, lng)` - 反向地理编码
- `calculateDistance(origin, destination)` - 计算距离
- `searchNearby(location, keyword, radius)` - 搜索附近地点
- `generateMapScript(options)` - 生成地图脚本
- `testConnection()` - 测试 API 连接

## 🔄 更新和维护

### 定期维护任务

1. **检查 API 使用情况**
   - 每月检查 Google Cloud Console 中的 API 使用统计
   - 监控配额使用情况，避免超限

2. **更新地理位置数据**
   - 定期运行批量更新脚本
   - 清理无效的地理位置数据

3. **性能优化**
   - 实施地理编码结果缓存
   - 优化地图加载性能

### 版本更新

```bash
# 更新依赖包
npm update

# 检查安全漏洞
npm audit

# 修复安全问题
npm audit fix
```

## 📞 技术支持

如果您在使用过程中遇到问题，请：

1. 查看本文档的故障排除部分
2. 运行测试脚本诊断问题
3. 检查操作日志获取详细错误信息
4. 联系技术支持团队

---

**最后更新**: 2024年1月15日  
**版本**: 1.0.0  
**维护者**: 夏威夷华人平台技术团队 