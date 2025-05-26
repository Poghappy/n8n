#!/usr/bin/env node

/**
 * Google Maps API 密钥更新脚本
 * 用法: node update_api_key.js YOUR_API_KEY
 */

const fs = require('fs');
const path = require('path');

function updateApiKey(apiKey) {
    const envPath = path.join(process.cwd(), '.env');
    
    try {
        // 读取现有的 .env 文件
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // 替换 API 密钥
        envContent = envContent.replace(
            /GOOGLE_MAPS_API_KEY=.*/,
            `GOOGLE_MAPS_API_KEY=${apiKey}`
        );
        
        // 写回文件
        fs.writeFileSync(envPath, envContent);
        
        console.log('✅ Google Maps API 密钥已成功更新到 .env 文件');
        console.log(`🔑 API 密钥: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
        
        // 验证配置
        console.log('\n📋 当前 .env 配置:');
        console.log(envContent);
        
        return true;
    } catch (error) {
        console.error('❌ 更新 API 密钥失败:', error.message);
        return false;
    }
}

function testApiKey(apiKey) {
    console.log('\n🧪 开始测试 API 密钥...');
    
    // 这里可以添加 API 密钥测试逻辑
    const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Honolulu,HI&key=${apiKey}`;
    
    console.log('🔗 测试 URL:', testUrl);
    console.log('💡 您可以在浏览器中访问上述 URL 来测试 API 密钥是否有效');
    
    return true;
}

// 主函数
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('📖 用法: node update_api_key.js YOUR_API_KEY');
        console.log('📖 示例: node update_api_key.js AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
        process.exit(1);
    }
    
    const apiKey = args[0];
    
    // 验证 API 密钥格式
    if (!apiKey.startsWith('AIza') || apiKey.length < 30) {
        console.error('❌ API 密钥格式不正确');
        console.error('💡 Google Maps API 密钥应该以 "AIza" 开头，长度约为 39 个字符');
        process.exit(1);
    }
    
    console.log('🚀 开始更新 Google Maps API 密钥...');
    
    // 更新 API 密钥
    if (updateApiKey(apiKey)) {
        // 测试 API 密钥
        testApiKey(apiKey);
        
        console.log('\n🎉 配置完成！');
        console.log('📝 下一步: 运行 npm test 来测试地图功能');
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { updateApiKey, testApiKey }; 