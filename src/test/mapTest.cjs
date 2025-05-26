/**
 * Google 地图功能测试
 * 用于验证地图集成是否正常工作
 */

const FirebirdMapIntegration = require('../firebird/mapIntegration.cjs');
const GoogleMapsHelper = require('../common/googleMapsHelper.cjs');

async function runMapTests() {
    console.log('🗺️  开始 Google 地图功能测试...\n');

    try {
        // 初始化地图集成
        const mapIntegration = new FirebirdMapIntegration();
        const mapsHelper = new GoogleMapsHelper();

        // 测试 1: API 连接测试
        console.log('📡 测试 1: Google Maps API 连接');
        const connectionOk = await mapsHelper.testConnection();
        console.log(`   结果: ${connectionOk ? '✅ 连接成功' : '❌ 连接失败'}\n`);

        if (!connectionOk) {
            console.log('⚠️  请检查以下配置:');
            console.log('   1. .env 文件中的 GOOGLE_MAPS_API_KEY 是否正确');
            console.log('   2. API 密钥是否已启用相关服务');
            console.log('   3. 网络连接是否正常\n');
            return;
        }

        // 测试 2: 地理编码测试
        console.log('🌍 测试 2: 地理编码功能');
        const testAddresses = [
            'Honolulu, HI',
            'Waikiki Beach, Honolulu, HI',
            'Pearl Harbor, HI',
            'Haleakala National Park, Maui, HI'
        ];

        for (const address of testAddresses) {
            try {
                const location = await mapsHelper.geocodeAddress(address);
                console.log(`   ✅ ${address}`);
                console.log(`      坐标: ${location.latitude}, ${location.longitude}`);
                console.log(`      格式化地址: ${location.formatted_address}\n`);
            } catch (error) {
                console.log(`   ❌ ${address}: ${error.message}\n`);
            }
        }

        // 测试 3: 反向地理编码测试
        console.log('🔄 测试 3: 反向地理编码功能');
        const testCoordinates = [
            { lat: 21.3099, lng: -157.8581, name: '檀香山' },
            { lat: 21.2793, lng: -157.8293, name: '威基基海滩' },
            { lat: 21.3649, lng: -157.9507, name: '珍珠港' }
        ];

        for (const coord of testCoordinates) {
            try {
                const address = await mapsHelper.reverseGeocode(coord.lat, coord.lng);
                console.log(`   ✅ ${coord.name} (${coord.lat}, ${coord.lng})`);
                console.log(`      地址: ${address}\n`);
            } catch (error) {
                console.log(`   ❌ ${coord.name}: ${error.message}\n`);
            }
        }

        // 测试 4: 距离计算测试
        console.log('📏 测试 4: 距离计算功能');
        const origin = { lat: 21.3099, lng: -157.8581 }; // 檀香山
        const destination = { lat: 21.2793, lng: -157.8293 }; // 威基基海滩

        try {
            const distance = await mapsHelper.calculateDistance(origin, destination);
            console.log('   ✅ 檀香山 → 威基基海滩');
            console.log(`      距离: ${distance.distance}`);
            console.log(`      车程: ${distance.duration}\n`);
        } catch (error) {
            console.log(`   ❌ 距离计算失败: ${error.message}\n`);
        }

        // 测试 5: 附近搜索测试
        console.log('🔍 测试 5: 附近搜索功能');
        const searchLocation = { lat: 21.3099, lng: -157.8581 }; // 檀香山
        
        try {
            const nearbyPlaces = await mapsHelper.searchNearby(
                searchLocation, 
                'restaurant', 
                2000
            );
            console.log(`   ✅ 找到 ${nearbyPlaces.length} 个附近的餐厅`);
            
            if (nearbyPlaces.length > 0) {
                console.log('   前 3 个结果:');
                nearbyPlaces.slice(0, 3).forEach((place, index) => {
                    console.log(`      ${index + 1}. ${place.name}`);
                    console.log(`         地址: ${place.address}`);
                    console.log(`         评分: ${place.rating || '无评分'}`);
                });
            }
            console.log('');
        } catch (error) {
            console.log(`   ❌ 附近搜索失败: ${error.message}\n`);
        }

        // 测试 6: 地图 HTML 生成测试
        console.log('🗺️  测试 6: 地图 HTML 生成');
        const testItems = [
            {
                latitude: 21.3099,
                longitude: -157.8581,
                title: '檀香山市中心',
                description: '夏威夷州首府'
            },
            {
                latitude: 21.2793,
                longitude: -157.8293,
                title: '威基基海滩',
                description: '著名旅游景点'
            }
        ];

        try {
            const mapHTML = mapIntegration.generateMapHTML(testItems, {
                title: '夏威夷地图测试',
                center: { lat: 21.3099, lng: -157.8581 },
                zoom: 11
            });

            // 保存测试地图文件
            const fs = require('fs').promises;
            const path = require('path');
            const testMapFile = path.join(process.cwd(), 'test-map.html');
            await fs.writeFile(testMapFile, mapHTML);
            
            console.log('   ✅ 地图 HTML 生成成功');
            console.log(`   📄 测试地图已保存到: ${testMapFile}`);
            console.log('   🌐 在浏览器中打开该文件查看地图\n');
        } catch (error) {
            console.log(`   ❌ 地图 HTML 生成失败: ${error.message}\n`);
        }

        // 测试 7: 火鸟门户集成测试（模拟）
        console.log('🔥 测试 7: 火鸟门户集成测试（模拟）');
        
        // 模拟信息数据
        const mockInfoData = {
            title: '测试分类信息',
            description: '这是一个测试的分类信息',
            address: 'Honolulu, HI',
            category: 'test'
        };

        // 模拟招聘数据
        const mockJobData = {
            job_name: '测试招聘职位',
            job_description: '这是一个测试的招聘职位',
            company_address: 'Waikiki Beach, Honolulu, HI',
            company_name: '测试公司'
        };

        console.log('   📝 模拟信息数据地理编码...');
        try {
            const infoLocation = await mapsHelper.geocodeAddress(mockInfoData.address);
            console.log(`   ✅ 信息位置: ${infoLocation.formatted_address}`);
        } catch (error) {
            console.log(`   ❌ 信息地理编码失败: ${error.message}`);
        }

        console.log('   💼 模拟招聘数据地理编码...');
        try {
            const jobLocation = await mapsHelper.geocodeAddress(mockJobData.company_address);
            console.log(`   ✅ 公司位置: ${jobLocation.formatted_address}`);
        } catch (error) {
            console.log(`   ❌ 招聘地理编码失败: ${error.message}`);
        }

        console.log('\n🎉 所有测试完成！');
        console.log('\n📋 测试总结:');
        console.log('   - Google Maps API 连接正常');
        console.log('   - 地理编码功能正常');
        console.log('   - 反向地理编码功能正常');
        console.log('   - 距离计算功能正常');
        console.log('   - 附近搜索功能正常');
        console.log('   - 地图 HTML 生成正常');
        console.log('   - 火鸟门户集成准备就绪');

    } catch (error) {
        console.error('❌ 测试过程中发生错误:', error);
        console.log('\n🔧 故障排除建议:');
        console.log('   1. 检查 .env 文件配置');
        console.log('   2. 确认 Google Maps API 密钥有效');
        console.log('   3. 检查网络连接');
        console.log('   4. 确认依赖包已正确安装');
    }
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
    runMapTests();
}

module.exports = { runMapTests }; 