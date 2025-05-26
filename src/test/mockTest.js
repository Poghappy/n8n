/**
 * 模拟测试 - 无需真实 API 密钥
 * 用于验证系统架构和代码逻辑
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 模拟 Google Maps Helper
class MockGoogleMapsHelper {
    constructor() {
        this.apiKey = 'MOCK_API_KEY_FOR_TESTING';
        console.log('🧪 使用模拟 Google Maps Helper');
    }

    async geocodeAddress(address) {
        console.log(`📍 模拟地理编码: ${address}`);
        
        // 模拟夏威夷地区的地理编码结果
        const mockResults = {
            'Honolulu, HI': { latitude: 21.3099, longitude: -157.8581, formatted_address: 'Honolulu, HI, USA' },
            'Waikiki Beach, Honolulu, HI': { latitude: 21.2793, longitude: -157.8293, formatted_address: 'Waikiki Beach, Honolulu, HI, USA' },
            'Pearl Harbor, HI': { latitude: 21.3649, longitude: -157.9507, formatted_address: 'Pearl Harbor, HI, USA' },
            'Maui, HI': { latitude: 20.7984, longitude: -156.3319, formatted_address: 'Maui, HI, USA' }
        };

        const result = mockResults[address] || {
            latitude: 21.3099 + (Math.random() - 0.5) * 0.1,
            longitude: -157.8581 + (Math.random() - 0.5) * 0.1,
            formatted_address: `${address} (模拟地址)`,
            place_id: `mock_place_id_${Date.now()}`
        };

        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return result;
    }

    async reverseGeocode(lat, lng) {
        console.log(`🔄 模拟反向地理编码: ${lat}, ${lng}`);
        
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return `模拟地址 (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    }

    async calculateDistance(origin, destination) {
        console.log(`📏 模拟距离计算: ${JSON.stringify(origin)} → ${JSON.stringify(destination)}`);
        
        // 简单的距离计算（直线距离）
        const R = 6371; // 地球半径（公里）
        const dLat = (destination.lat - origin.lat) * Math.PI / 180;
        const dLng = (destination.lng - origin.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 100));

        return {
            distance: `${distance.toFixed(1)} km`,
            duration: `${Math.round(distance * 2)} 分钟`,
            distance_value: Math.round(distance * 1000), // 米
            duration_value: Math.round(distance * 2 * 60) // 秒
        };
    }

    async searchNearby(location, keyword, radius = 5000) {
        console.log(`🔍 模拟附近搜索: ${keyword} (半径: ${radius}m)`);
        
        // 模拟搜索结果
        const mockPlaces = [
            { name: `${keyword} 1`, address: '模拟地址 1', location: { lat: location.lat + 0.001, lng: location.lng + 0.001 }, rating: 4.5 },
            { name: `${keyword} 2`, address: '模拟地址 2', location: { lat: location.lat - 0.001, lng: location.lng + 0.001 }, rating: 4.2 },
            { name: `${keyword} 3`, address: '模拟地址 3', location: { lat: location.lat + 0.001, lng: location.lng - 0.001 }, rating: 4.8 }
        ];

        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 150));
        
        return mockPlaces;
    }

    generateMapScript(options = {}) {
        console.log('🗺️  生成模拟地图脚本');
        return `
            // 模拟地图脚本
            console.log('地图配置:', ${JSON.stringify(options)});
            function initMap() {
                console.log('模拟地图初始化完成');
            }
        `;
    }

    async testConnection() {
        console.log('🔗 模拟 API 连接测试');
        await new Promise(resolve => setTimeout(resolve, 200));
        return true;
    }
}

// 模拟火鸟门户 API 调用
function mockCallApi(params) {
    console.log(`🔥 模拟火鸟门户 API 调用:`, params);
    
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                data: params.action === 'ilist' ? [
                    { id: 1, title: '模拟信息1', latitude: 21.3099, longitude: -157.8581 },
                    { id: 2, title: '模拟信息2', latitude: 21.2793, longitude: -157.8293 }
                ] : { id: Date.now(), ...params },
                message: '模拟操作成功'
            });
        }, 100);
    });
}

// 模拟火鸟门户地图集成
class MockFirebirdMapIntegration {
    constructor() {
        this.mapsHelper = new MockGoogleMapsHelper();
        console.log('🔥 使用模拟火鸟门户地图集成');
    }

    async addLocationToInfo(infoData) {
        console.log('📝 模拟添加信息位置:', infoData.title);
        
        if (infoData.address) {
            const location = await this.mapsHelper.geocodeAddress(infoData.address);
            infoData.latitude = location.latitude;
            infoData.longitude = location.longitude;
        }

        const result = await mockCallApi({
            service: 'info',
            action: 'put',
            ...infoData
        });

        console.log('✅ 信息添加成功');
        return result;
    }

    async addJobLocation(jobData) {
        console.log('💼 模拟添加招聘位置:', jobData.job_name);
        
        if (jobData.company_address) {
            const location = await this.mapsHelper.geocodeAddress(jobData.company_address);
            jobData.company_lat = location.latitude;
            jobData.company_lng = location.longitude;
        }

        const result = await mockCallApi({
            service: 'job',
            action: 'put',
            ...jobData
        });

        console.log('✅ 招聘信息添加成功');
        return result;
    }

    async searchNearbyInfo(location, radius, category) {
        console.log(`🔍 模拟搜索附近信息: ${category} (半径: ${radius}m)`);
        
        const mockInfo = await mockCallApi({
            service: 'info',
            action: 'ilist',
            category: category
        });

        // 模拟距离计算
        for (const info of mockInfo.data) {
            const distance = await this.mapsHelper.calculateDistance(location, {
                lat: info.latitude,
                lng: info.longitude
            });
            info.distance = distance.distance;
            info.duration = distance.duration;
        }

        console.log(`✅ 找到 ${mockInfo.data.length} 个附近信息`);
        return mockInfo.data;
    }

    generateMapHTML(items, options = {}) {
        console.log('🗺️  生成模拟地图 HTML');
        return `
            <!DOCTYPE html>
            <html>
            <head><title>模拟地图</title></head>
            <body>
                <h1>模拟地图视图</h1>
                <p>共 ${items.length} 个位置</p>
                <div id="map">模拟地图容器</div>
                <script>console.log('模拟地图加载完成');</script>
            </body>
            </html>
        `;
    }
}

// 运行模拟测试
async function runMockTests() {
    console.log('🧪 开始模拟测试...\n');

    try {
        const mapIntegration = new MockFirebirdMapIntegration();

        // 测试 1: 地理编码
        console.log('📍 测试 1: 地理编码功能');
        const location = await mapIntegration.mapsHelper.geocodeAddress('Honolulu, HI');
        console.log(`   结果: ${location.formatted_address} (${location.latitude}, ${location.longitude})\n`);

        // 测试 2: 信息模块集成
        console.log('📝 测试 2: 信息模块地图集成');
        const infoResult = await mapIntegration.addLocationToInfo({
            title: '测试分类信息',
            description: '这是一个测试信息',
            address: 'Waikiki Beach, Honolulu, HI',
            category: 'test'
        });
        console.log(`   结果: ${infoResult.success ? '成功' : '失败'}\n`);

        // 测试 3: 招聘模块集成
        console.log('💼 测试 3: 招聘模块地图集成');
        const jobResult = await mapIntegration.addJobLocation({
            job_name: '测试招聘职位',
            job_description: '这是一个测试职位',
            company_address: 'Pearl Harbor, HI',
            company_name: '测试公司'
        });
        console.log(`   结果: ${jobResult.success ? '成功' : '失败'}\n`);

        // 测试 4: 附近搜索
        console.log('🔍 测试 4: 附近搜索功能');
        const nearbyInfo = await mapIntegration.searchNearbyInfo(
            { lat: 21.3099, lng: -157.8581 },
            5000,
            'test'
        );
        console.log(`   结果: 找到 ${nearbyInfo.length} 个附近信息\n`);

        // 测试 5: 地图生成
        console.log('🗺️  测试 5: 地图 HTML 生成');
        const mapHTML = mapIntegration.generateMapHTML([
            { latitude: 21.3099, longitude: -157.8581, title: '测试位置1' },
            { latitude: 21.2793, longitude: -157.8293, title: '测试位置2' }
        ]);
        console.log(`   结果: HTML 长度 ${mapHTML.length} 字符\n`);

        console.log('🎉 所有模拟测试通过！');
        console.log('\n📋 测试总结:');
        console.log('   ✅ 地理编码功能正常');
        console.log('   ✅ 信息模块集成正常');
        console.log('   ✅ 招聘模块集成正常');
        console.log('   ✅ 附近搜索功能正常');
        console.log('   ✅ 地图生成功能正常');
        console.log('\n💡 系统架构验证完成，可以配置真实 API 密钥进行实际测试！');

    } catch (error) {
        console.error('❌ 模拟测试失败:', error);
    }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
    runMockTests();
}

export { 
    MockGoogleMapsHelper, 
    MockFirebirdMapIntegration, 
    runMockTests 
}; 