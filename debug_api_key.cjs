#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 调试 API 密钥读取...');
console.log('');

// 直接读取.env文件
const envPath = path.join(process.cwd(), '.env');
console.log('读取.env文件路径:', envPath);

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ .env文件存在');
    console.log('文件内容:');
    console.log(envContent);
    
    // 解析API密钥
    const lines = envContent.split('\n');
    let apiKey = null;
    
    for (const line of lines) {
        if (line.startsWith('GOOGLE_MAPS_API_KEY=')) {
            apiKey = line.split('=')[1];
            break;
        }
    }
    
    console.log('\n📋 解析结果:');
    console.log('API密钥存在:', !!apiKey);
    console.log('API密钥长度:', apiKey ? apiKey.length : 0);
    console.log('API密钥开头:', apiKey ? apiKey.substring(0, 10) : 'N/A');
    console.log('API密钥结尾:', apiKey ? apiKey.substring(apiKey.length - 4) : 'N/A');
    console.log('完整API密钥:', apiKey);
    
    // 现在使用dotenv测试
    console.log('\n🔄 使用dotenv测试:');
    require('dotenv').config();
    const dotenvApiKey = process.env.GOOGLE_MAPS_API_KEY;
    console.log('dotenv读取的密钥:', dotenvApiKey);
    console.log('dotenv密钥长度:', dotenvApiKey ? dotenvApiKey.length : 0);
    
    // 测试API调用
    if (apiKey && apiKey.length > 10) {
        const https = require('https');
        const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Honolulu,HI&key=${apiKey}`;
        
        console.log('\n🧪 测试API调用...');
        console.log('使用密钥:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));
        
        https.get(testUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    console.log('API响应状态:', result.status);
                    if (result.status === 'OK') {
                        console.log('✅ API调用成功!');
                        console.log('地址:', result.results[0].formatted_address);
                        console.log('坐标:', result.results[0].geometry.location);
                    } else {
                        console.log('❌ API调用失败');
                        console.log('错误信息:', result.error_message);
                    }
                } catch (error) {
                    console.error('解析响应失败:', error.message);
                    console.log('原始响应:', data);
                }
            });
        }).on('error', (error) => {
            console.error('请求失败:', error.message);
        });
    } else {
        console.error('❌ API密钥无效或太短');
    }
} else {
    console.error('❌ .env文件不存在');
} 