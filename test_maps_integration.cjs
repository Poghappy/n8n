#!/usr/bin/env node

/**
 * Google Maps 集成功能测试 (CommonJS版本)
 * 使用真实的API密钥测试所有地图功能
 */

require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

class GoogleMapsIntegrationTest {
    constructor() {
        this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
        this.testResults = [];
    }

    // 记录测试结果
    logResult(testName, success, message, data = null) {
        const result = {
            test: testName,
            success,
            message,
            data,
            timestamp: new Date().toISOString()
        };
        this.testResults.push(result);
        
        const status = success ? '✅' : '❌';
        console.log(`${status} ${testName}: ${message}`);
        if (data) {
            console.log(`   数据: ${JSON.stringify(data, null, 2)}`);
        }
    }

    // 测试地理编码功能
    async testGeocoding() {
        console.log('\n📍 测试 1: 地理编码功能');
        
        const addresses = [
            'Honolulu, HI',
            'Waikiki Beach, Honolulu, HI',
            'Pearl Harbor, HI',
            'Maui, HI'
        ];

        for (const address of addresses) {
            try {
                const result = await this.geocodeAddress(address);
                this.logResult(
                    `地理编码: ${address}`,
                    true,
                    `成功获取坐标`,
                    {
                        address: result.formatted_address,
                        location: result.geometry.location
                    }
                );
            } catch (error) {
                this.logResult(
                    `地理编码: ${address}`,
                    false,
                    `失败: ${error.message}`
                );
            }
        }
    }

    // 测试反向地理编码
    async testReverseGeocoding() {
        console.log('\n🔄 测试 2: 反向地理编码功能');
        
        const coordinates = [
            { lat: 21.3099, lng: -157.8581, name: '檀香山市中心' },
            { lat: 21.2793, lng: -157.8293, name: '威基基海滩' }
        ];

        for (const coord of coordinates) {
            try {
                const result = await this.reverseGeocode(coord.lat, coord.lng);
                this.logResult(
                    `反向地理编码: ${coord.name}`,
                    true,
                    `成功获取地址`,
                    { address: result.formatted_address }
                );
            } catch (error) {
                this.logResult(
                    `反向地理编码: ${coord.name}`,
                    false,
                    `失败: ${error.message}`
                );
            }
        }
    }

    // 测试距离计算
    async testDistanceCalculation() {
        console.log('\n📏 测试 3: 距离计算功能');
        
        const routes = [
            {
                origin: { lat: 21.3099, lng: -157.8581 },
                destination: { lat: 21.2793, lng: -157.8293 },
                name: '檀香山到威基基'
            }
        ];

        for (const route of routes) {
            try {
                const result = await this.calculateDistance(route.origin, route.destination);
                this.logResult(
                    `距离计算: ${route.name}`,
                    true,
                    `成功计算距离`,
                    {
                        distance: result.distance,
                        duration: result.duration
                    }
                );
            } catch (error) {
                this.logResult(
                    `距离计算: ${route.name}`,
                    false,
                    `失败: ${error.message}`
                );
            }
        }
    }

    // 测试附近搜索
    async testNearbySearch() {
        console.log('\n🔍 测试 4: 附近搜索功能');
        
        const searches = [
            {
                location: { lat: 21.3099, lng: -157.8581 },
                keyword: 'restaurant',
                name: '檀香山附近的餐厅'
            }
        ];

        for (const search of searches) {
            try {
                const result = await this.searchNearby(search.location, search.keyword);
                this.logResult(
                    `附近搜索: ${search.name}`,
                    true,
                    `找到 ${result.length} 个结果`,
                    { count: result.length, first_result: result[0] }
                );
            } catch (error) {
                this.logResult(
                    `附近搜索: ${search.name}`,
                    false,
                    `失败: ${error.message}`
                );
            }
        }
    }

    // 地理编码API调用
    geocodeAddress(address) {
        return new Promise((resolve, reject) => {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
            
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        if (result.status === 'OK') {
                            resolve(result.results[0]);
                        } else {
                            reject(new Error(`API错误: ${result.status} - ${result.error_message || '未知错误'}`));
                        }
                    } catch (error) {
                        reject(new Error(`解析响应失败: ${error.message}`));
                    }
                });
            }).on('error', reject);
        });
    }

    // 反向地理编码API调用
    reverseGeocode(lat, lng) {
        return new Promise((resolve, reject) => {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
            
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        if (result.status === 'OK') {
                            resolve(result.results[0]);
                        } else {
                            reject(new Error(`API错误: ${result.status} - ${result.error_message || '未知错误'}`));
                        }
                    } catch (error) {
                        reject(new Error(`解析响应失败: ${error.message}`));
                    }
                });
            }).on('error', reject);
        });
    }

    // 距离计算API调用
    calculateDistance(origin, destination) {
        return new Promise((resolve, reject) => {
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${this.apiKey}`;
            
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        if (result.status === 'OK' && result.rows[0].elements[0].status === 'OK') {
                            const element = result.rows[0].elements[0];
                            resolve({
                                distance: element.distance.text,
                                duration: element.duration.text,
                                distance_value: element.distance.value,
                                duration_value: element.duration.value
                            });
                        } else {
                            reject(new Error(`API错误: ${result.status} - ${result.error_message || '未知错误'}`));
                        }
                    } catch (error) {
                        reject(new Error(`解析响应失败: ${error.message}`));
                    }
                });
            }).on('error', reject);
        });
    }

    // 附近搜索API调用（使用Places API）
    searchNearby(location, keyword) {
        return new Promise((resolve, reject) => {
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=5000&keyword=${keyword}&key=${this.apiKey}`;
            
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        if (result.status === 'OK') {
                            resolve(result.results.slice(0, 3)); // 只返回前3个结果
                        } else {
                            reject(new Error(`API错误: ${result.status} - ${result.error_message || '未知错误'}`));
                        }
                    } catch (error) {
                        reject(new Error(`解析响应失败: ${error.message}`));
                    }
                });
            }).on('error', reject);
        });
    }

    // 生成测试报告
    generateReport() {
        console.log('\n📊 测试报告生成中...');
        
        const successCount = this.testResults.filter(r => r.success).length;
        const totalCount = this.testResults.length;
        const successRate = ((successCount / totalCount) * 100).toFixed(1);

        const report = {
            summary: {
                total_tests: totalCount,
                successful: successCount,
                failed: totalCount - successCount,
                success_rate: `${successRate}%`,
                timestamp: new Date().toISOString()
            },
            api_key: `${this.apiKey.substring(0, 10)}...${this.apiKey.substring(this.apiKey.length - 4)}`,
            results: this.testResults
        };

        // 保存报告到文件
        const reportPath = path.join(process.cwd(), 'docs', 'test_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log('\n🎉 测试完成！');
        console.log(`📊 总测试数: ${totalCount}`);
        console.log(`✅ 成功: ${successCount}`);
        console.log(`❌ 失败: ${totalCount - successCount}`);
        console.log(`📈 成功率: ${successRate}%`);
        console.log(`📄 详细报告已保存到: ${reportPath}`);

        return report;
    }

    // 运行所有测试
    async runAllTests() {
        console.log('🚀 开始 Google Maps 集成功能测试...');
        console.log(`🔑 使用API密钥: ${this.apiKey.substring(0, 10)}...${this.apiKey.substring(this.apiKey.length - 4)}`);

        if (!this.apiKey) {
            console.error('❌ 未找到API密钥，请确保.env文件中配置了GOOGLE_MAPS_API_KEY');
            return;
        }

        try {
            await this.testGeocoding();
            await this.testReverseGeocoding();
            await this.testDistanceCalculation();
            await this.testNearbySearch();
            
            return this.generateReport();
        } catch (error) {
            console.error('❌ 测试过程中发生错误:', error.message);
        }
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const tester = new GoogleMapsIntegrationTest();
    tester.runAllTests();
}

module.exports = GoogleMapsIntegrationTest; 