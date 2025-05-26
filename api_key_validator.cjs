#!/usr/bin/env node

/**
 * Google Maps API 密钥验证和配置工具 (CommonJS版本)
 * 帮助用户验证 API 密钥格式并自动配置到系统中
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

class ApiKeyValidator {
    constructor() {
        this.envPath = path.join(process.cwd(), '.env');
    }

    // 验证 API 密钥格式
    validateKeyFormat(apiKey) {
        console.log('🔍 验证 API 密钥格式...');
        
        if (!apiKey) {
            console.error('❌ API 密钥不能为空');
            return false;
        }

        if (!apiKey.startsWith('AIza')) {
            console.error('❌ Google Maps API 密钥必须以 "AIza" 开头');
            console.error(`💡 您提供的密钥: ${apiKey.substring(0, 10)}...`);
            console.error('💡 正确格式示例: AIzaSyBkEd8rJqHvKvXXXXXXXXXXXXXXXXXXXXX');
            return false;
        }

        if (apiKey.length < 35 || apiKey.length > 45) {
            console.error('❌ API 密钥长度不正确');
            console.error(`💡 当前长度: ${apiKey.length}，正确长度应该在 35-45 个字符之间`);
            return false;
        }

        console.log('✅ API 密钥格式验证通过');
        console.log(`🔑 密钥: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
        return true;
    }

    // 测试 API 密钥有效性
    async testApiKey(apiKey) {
        console.log('🧪 测试 API 密钥有效性...');
        
        return new Promise((resolve) => {
            const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Honolulu,HI&key=${apiKey}`;
            
            https.get(testUrl, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        if (result.status === 'OK') {
                            console.log('✅ API 密钥测试成功！');
                            console.log(`📍 测试结果: ${result.results[0].formatted_address}`);
                            console.log(`📍 坐标: ${result.results[0].geometry.location.lat}, ${result.results[0].geometry.location.lng}`);
                            resolve(true);
                        } else if (result.status === 'REQUEST_DENIED') {
                            console.error('❌ API 密钥被拒绝');
                            console.error('💡 可能原因: API 密钥无效或未启用 Geocoding API');
                            console.error('💡 请在 Google Cloud Console 中启用 Geocoding API');
                            resolve(false);
                        } else {
                            console.error(`❌ API 测试失败: ${result.status}`);
                            console.error(`💡 错误信息: ${result.error_message || '未知错误'}`);
                            resolve(false);
                        }
                    } catch (error) {
                        console.error('❌ 解析响应失败:', error.message);
                        resolve(false);
                    }
                });
            }).on('error', (error) => {
                console.error('❌ 网络请求失败:', error.message);
                resolve(false);
            });
        });
    }

    // 配置 API 密钥到 .env 文件
    configureApiKey(apiKey) {
        console.log('⚙️  配置 API 密钥到 .env 文件...');
        
        try {
            let envContent = '';
            
            // 检查 .env 文件是否存在
            if (fs.existsSync(this.envPath)) {
                envContent = fs.readFileSync(this.envPath, 'utf8');
            }
            
            // 替换或添加 API 密钥
            if (envContent.includes('GOOGLE_MAPS_API_KEY=')) {
                envContent = envContent.replace(
                    /GOOGLE_MAPS_API_KEY=.*/,
                    `GOOGLE_MAPS_API_KEY=${apiKey}`
                );
            } else {
                envContent += `\nGOOGLE_MAPS_API_KEY=${apiKey}\n`;
            }
            
            fs.writeFileSync(this.envPath, envContent);
            
            console.log('✅ API 密钥已成功配置到 .env 文件');
            console.log(`🔑 配置的密钥: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
            
            return true;
        } catch (error) {
            console.error('❌ 配置失败:', error.message);
            return false;
        }
    }

    // 显示下一步操作
    showNextSteps() {
        console.log('\n🎉 配置完成！下一步操作:');
        console.log('');
        console.log('1. 测试地图功能:');
        console.log('   npm test');
        console.log('');
        console.log('2. 运行模拟测试:');
        console.log('   node src/test/mockTest.js');
        console.log('');
        console.log('3. 查看使用指南:');
        console.log('   cat docs/usage-guide.md');
        console.log('');
        console.log('4. 测试火鸟门户集成:');
        console.log('   node src/test/mapTest.js');
        console.log('');
        console.log('5. 查看配置状态:');
        console.log('   cat .env | grep GOOGLE_MAPS_API_KEY');
    }

    // 主要验证和配置流程
    async validateAndConfigure(apiKey) {
        console.log('🚀 开始 Google Maps API 密钥验证和配置...\n');
        
        // 1. 格式验证
        if (!this.validateKeyFormat(apiKey)) {
            return false;
        }
        
        // 2. 有效性测试
        const isValid = await this.testApiKey(apiKey);
        if (!isValid) {
            console.log('\n💡 如果您确定密钥正确，请检查:');
            console.log('   1. 是否启用了 Geocoding API');
            console.log('   2. 是否设置了正确的 API 限制');
            console.log('   3. 是否有足够的配额');
            console.log('   4. 访问 Google Cloud Console 启用必要的 API');
            return false;
        }
        
        // 3. 配置到系统
        if (!this.configureApiKey(apiKey)) {
            return false;
        }
        
        // 4. 显示下一步
        this.showNextSteps();
        
        return true;
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const apiKey = process.argv[2];
    
    if (!apiKey) {
        console.log('📖 用法: node api_key_validator.cjs YOUR_API_KEY');
        console.log('📖 示例: node api_key_validator.cjs AIzaSyBkEd8rJqHvKvXXXXXXXXXXXXXXXXXXXXX');
        console.log('');
        console.log('💡 或者直接告诉 AI 您的 API 密钥，AI 将自动运行此脚本');
        process.exit(1);
    }
    
    const validator = new ApiKeyValidator();
    validator.validateAndConfigure(apiKey);
}

module.exports = ApiKeyValidator; 