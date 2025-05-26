#!/usr/bin/env node

/**
 * 夏威夷华人平台 Google Maps 系统启动脚本
 * 提供快速测试和使用地图功能的入口
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗺️  夏威夷华人平台 Google Maps 集成系统');
console.log('='.repeat(50));

// 检查环境配置
function checkEnvironment() {
    console.log('\n🔍 检查环境配置...');
    
    // 检查.env文件
    if (!fs.existsSync('.env')) {
        console.log('❌ .env文件不存在');
        return false;
    }
    
    // 检查API密钥
    const envContent = fs.readFileSync('.env', 'utf8');
    const hasApiKey = envContent.includes('GOOGLE_MAPS_API_KEY=');
    
    if (!hasApiKey) {
        console.log('❌ 未配置Google Maps API密钥');
        return false;
    }
    
    console.log('✅ 环境配置正常');
    return true;
}

// 显示菜单
function showMenu() {
    console.log('\n📋 可用操作:');
    console.log('1. 🧪 运行完整集成测试');
    console.log('2. 🔥 运行火鸟门户集成测试');
    console.log('3. 🔑 验证API密钥');
    console.log('4. 🗺️  打开测试地图');
    console.log('5. 📊 查看系统状态');
    console.log('6. 🚪 退出');
    console.log('');
}

// 执行命令
function runCommand(command, description) {
    console.log(`\n🚀 ${description}...`);
    console.log('-'.repeat(40));
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${description}完成`);
    } catch (error) {
        console.log(`❌ ${description}失败:`, error.message);
    }
}

// 主程序
async function main() {
    // 检查环境
    if (!checkEnvironment()) {
        console.log('\n❌ 环境检查失败，请先配置环境');
        process.exit(1);
    }
    
    // 显示菜单
    showMenu();
    
    // 读取用户输入
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('请选择操作 (1-6): ', (answer) => {
        switch (answer.trim()) {
            case '1':
                runCommand('node test_maps_integration.cjs', '完整集成测试');
                break;
            case '2':
                runCommand('node src/test/mapTest.cjs', '火鸟门户集成测试');
                break;
            case '3':
                runCommand('node debug_api_key.cjs', 'API密钥验证');
                break;
            case '4':
                if (fs.existsSync('test-map.html')) {
                    console.log('\n🗺️  测试地图文件: test-map.html');
                    console.log('请在浏览器中打开此文件查看地图');
                    runCommand('open test-map.html', '打开测试地图');
                } else {
                    console.log('❌ 测试地图文件不存在，请先运行测试');
                }
                break;
            case '5':
                if (fs.existsSync('FINAL_SYSTEM_STATUS.md')) {
                    runCommand('cat FINAL_SYSTEM_STATUS.md', '查看系统状态');
                } else {
                    console.log('❌ 系统状态文件不存在');
                }
                break;
            case '6':
                console.log('\n👋 再见！');
                break;
            default:
                console.log('❌ 无效选择');
        }
        rl.close();
    });
}

// 如果直接运行此文件
if (require.main === module) {
    main().catch(console.error);
} 