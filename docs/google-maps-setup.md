# 火鸟门户 Google 地图配置说明

## 1. 环境变量配置

### .env 配置模板
```env
# Google 地图配置
GOOGLE_MAPS_API_KEY=【你的浏览器 API Key】
GOOGLE_APPLICATION_CREDENTIALS=./googleServiceAccount.json

# 火鸟门户系统配置
API_BASE=https://hawaiihub.net/include/json.php
ADMIN_USERNAME=【管理员用户名】
ADMIN_PASSWORD=【管理员密码】

# 夏威夷华人平台配置
HAWAIIHUB_BASE_URL=https://hawaiihub.net
HAWAIIHUB_ADMIN_URL=https://hawaiihub.net/admin/login
```

## 2. Google 服务账户配置

当前项目已包含 `googleServiceAccount.json` 文件，配置信息：
- 项目ID: `core-trees-448409-c5`
- 服务账户邮箱: `hawaiihub-map-bot@core-trees-448409-c5.iam.gserviceaccount.com`
- 客户端ID: `107738384711500014909`

## 3. 配置步骤

### 步骤 1: 创建 .env 文件
```bash
# 在项目根目录创建 .env 文件
touch .env
```

### 步骤 2: 配置 Google Maps API Key
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择项目 `core-trees-448409-c5`
3. 启用 Maps JavaScript API
4. 创建 API 密钥（限制为浏览器使用）
5. 将 API 密钥填入 `.env` 文件的 `GOOGLE_MAPS_API_KEY`

### 步骤 3: 验证服务账户权限
确保服务账户具有以下权限：
- Maps Platform API 访问权限
- Geocoding API 权限
- Places API 权限（如需要）

## 4. 代码集成示例

### JavaScript 前端集成
```javascript
// 加载 Google Maps API
function loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);
}

// 初始化地图
function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: 21.3099, lng: -157.8581 }, // 夏威夷檀香山
    });
}
```

### Node.js 后端集成
```javascript
const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});

// 地理编码示例
async function geocodeAddress(address) {
    try {
        const response = await client.geocode({
            params: {
                address: address,
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
}
```

## 5. 火鸟门户集成

### 信息模块地图集成
```javascript
// 在发布分类信息时添加地图选择功能
async function addLocationToInfo(infoData) {
    const locationData = await geocodeAddress(infoData.address);
    
    const params = {
        service: 'info',
        action: 'put',
        ...infoData,
        latitude: locationData[0].geometry.location.lat,
        longitude: locationData[0].geometry.location.lng,
    };
    
    return await callApi(params);
}
```

### 招聘模块地图集成
```javascript
// 在发布招聘信息时添加公司位置
async function addJobLocation(jobData) {
    const locationData = await geocodeAddress(jobData.company_address);
    
    const params = {
        service: 'job',
        action: 'put',
        ...jobData,
        company_lat: locationData[0].geometry.location.lat,
        company_lng: locationData[0].geometry.location.lng,
    };
    
    return await callApi(params);
}
```

## 6. 故障排除

### 常见问题
1. **API 密钥无效**: 检查密钥是否正确配置且未过期
2. **配额超限**: 检查 Google Cloud Console 中的 API 使用情况
3. **权限不足**: 确保服务账户具有必要的 API 权限
4. **CORS 错误**: 确保 API 密钥配置了正确的域名限制

### 调试命令
```bash
# 测试 API 连接
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Honolulu,HI&key=${GOOGLE_MAPS_API_KEY}"

# 验证服务账户
node -e "console.log(require('./googleServiceAccount.json'))"
```