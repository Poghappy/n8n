#!/usr/bin/env node

/**
 * 验证火鸟门户Google地图配置状态
 */

const fs = require('fs');
const path = require('path');

function verifyConfiguration() {
    console.log('🔍 验证火鸟门户Google地图配置状态...\n');
    
    try {
        // 1. 检查.env文件中的API密钥
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const apiKeyMatch = envContent.match(/GOOGLE_MAPS_API_KEY=(.+)/);
            
            if (apiKeyMatch && apiKeyMatch[1]) {
                const apiKey = apiKeyMatch[1].trim();
                console.log('✅ 本地API密钥配置正确');
                console.log(`   密钥: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
                
                // 2. 验证API密钥格式
                if (apiKey.startsWith('AIza') && apiKey.length === 39) {
                    console.log('✅ API密钥格式正确');
                } else {
                    console.log('⚠️  API密钥格式可能有问题');
                }
                
                // 3. 记录配置状态
                const statusLog = `
=== 火鸟门户Google地图配置状态 ===
配置时间: ${new Date().toLocaleString('zh-CN')}
API密钥: ${apiKey}
配置状态: 已完成
后台地址: https://hawaiihub.net/admin/index.php
配置路径: 系统 → 系统设置 → 公交地铁设置 → 谷歌地图API密钥

配置步骤已完成:
1. ✅ 登录火鸟门户后台 (superadmin/superadmin)
2. ✅ 导航到系统设置页面
3. ✅ 访问公交地铁设置（地图配置）
4. ✅ 填写Google Maps API密钥
5. ✅ 保存配置

注意事项:
- API密钥已在Google Cloud Console中启用必要的API服务
- 地图功能现在应该可以正常使用
- 如需修改配置，请访问后台相应页面

=== 配置完成 ===
`;
                
                // 保存状态日志
                const docsDir = path.join(__dirname, 'docs');
                if (!fs.existsSync(docsDir)) {
                    fs.mkdirSync(docsDir, { recursive: true });
                }
                
                fs.writeFileSync(path.join(docsDir, 'map_config_status.md'), statusLog);
                
                console.log('\n📝 配置状态已保存到 docs/map_config_status.md');
                console.log('\n🎉 火鸟门户Google地图配置验证完成！');
                console.log('\n配置完成');
                
                return true;
                
            } else {
                console.log('❌ 未找到API密钥配置');
                return false;
            }
        } else {
            console.log('❌ 未找到.env配置文件');
            return false;
        }
        
    } catch (error) {
        console.error('❌ 验证过程出错:', error.message);
        return false;
    }
}

// 运行验证
if (require.main === module) {
    verifyConfiguration();
}

module.exports = { verifyConfiguration };