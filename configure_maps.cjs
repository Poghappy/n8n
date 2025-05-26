#!/usr/bin/env node

/**
 * 火鸟门户后台Google地图配置自动化脚本
 * 功能：自动登录后台并配置Google Maps API密钥
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 读取环境配置
function loadEnvConfig() {
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
        throw new Error('未找到.env配置文件');
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const config = {};
    
    envContent.split('\n').forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
            const [key, value] = line.split('=');
            if (key && value) {
                config[key.trim()] = value.trim();
            }
        }
    });
    
    return config;
}

// 记录操作日志
function logOperation(message, status = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${status}] ${message}`;
    console.log(logMessage);
    
    // 写入日志文件
    const logPath = path.join(__dirname, 'docs', 'operation.log');
    fs.appendFileSync(logPath, logMessage + '\n');
}

async function configureGoogleMaps() {
    let browser = null;
    
    try {
        // 加载配置
        const config = loadEnvConfig();
        const apiKey = config.GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
            throw new Error('未找到Google Maps API密钥');
        }
        
        logOperation('开始配置火鸟门户Google地图设置');
        logOperation(`使用API密钥: ${apiKey.substring(0, 10)}...`);
        
        // 启动浏览器
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1200, height: 800 }
        });
        
        const page = await browser.newPage();
        
        // 1. 访问登录页面
        logOperation('步骤1: 访问火鸟门户后台登录页面');
        await page.goto('https://hawaiihub.net/admin/index.php');
        await page.waitForTimeout(2000);
        
        // 2. 执行登录
        logOperation('步骤2: 执行登录操作');
        await page.evaluate(() => {
            const inputs = document.querySelectorAll('input');
            if (inputs.length >= 2) {
                inputs[0].value = 'superadmin';
                inputs[1].value = 'superadmin';
                
                const button = document.querySelector('button');
                if (button) {
                    button.click();
                }
            }
        });
        
        // 等待登录完成
        await page.waitForTimeout(3000);
        
        // 3. 导航到系统配置
        logOperation('步骤3: 导航到系统配置页面');
        await page.goto('https://hawaiihub.net/admin/index.php?m=system&c=config&a=index');
        await page.waitForTimeout(2000);
        
        // 4. 点击公交地铁设置（包含地图配置）
        logOperation('步骤4: 访问地图配置页面');
        await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            for (let el of elements) {
                if (el.textContent && el.textContent.includes('公交地铁设置')) {
                    el.click();
                    break;
                }
            }
        });
        
        await page.waitForTimeout(3000);
        
        // 5. 配置Google Maps API密钥
        logOperation('步骤5: 配置Google Maps API密钥');
        const configResult = await page.evaluate((apiKey) => {
            // 查找API密钥输入框
            const inputs = document.querySelectorAll('input[type="text"], input[type="password"], textarea');
            let apiKeyInput = null;
            
            for (let input of inputs) {
                if (input.value && input.value.includes('AIza')) {
                    apiKeyInput = input;
                    break;
                }
            }
            
            if (apiKeyInput) {
                apiKeyInput.value = apiKey;
                apiKeyInput.dispatchEvent(new Event('input'));
                apiKeyInput.dispatchEvent(new Event('change'));
                
                // 查找并点击保存按钮
                const buttons = document.querySelectorAll('button, input[type="submit"]');
                for (let btn of buttons) {
                    if (btn.textContent && (btn.textContent.includes('保存') || btn.textContent.includes('提交'))) {
                        btn.click();
                        return { success: true, message: 'API密钥已配置并保存' };
                    }
                }
                
                return { success: true, message: 'API密钥已配置，但未找到保存按钮' };
            }
            
            return { success: false, message: '未找到API密钥输入框' };
        }, apiKey);
        
        if (configResult.success) {
            logOperation(`配置成功: ${configResult.message}`, 'SUCCESS');
        } else {
            logOperation(`配置失败: ${configResult.message}`, 'ERROR');
        }
        
        // 6. 等待保存完成
        await page.waitForTimeout(2000);
        
        // 7. 验证配置
        logOperation('步骤6: 验证配置结果');
        const verifyResult = await page.evaluate(() => {
            const inputs = document.querySelectorAll('input');
            for (let input of inputs) {
                if (input.value && input.value.includes('AIza')) {
                    return { success: true, currentValue: input.value };
                }
            }
            return { success: false, message: '无法验证配置' };
        });
        
        if (verifyResult.success) {
            logOperation(`验证成功: API密钥已正确配置为 ${verifyResult.currentValue}`, 'SUCCESS');
        }
        
        // 截图保存
        await page.screenshot({ 
            path: path.join(__dirname, 'docs', 'map_config_final.png'),
            fullPage: true 
        });
        
        logOperation('配置完成，截图已保存', 'SUCCESS');
        
    } catch (error) {
        logOperation(`配置过程出错: ${error.message}`, 'ERROR');
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// 主函数
async function main() {
    try {
        await configureGoogleMaps();
        console.log('\n🎉 配置完成！');
        console.log('✅ Google Maps API密钥已成功配置到火鸟门户后台');
        console.log('📝 操作日志已保存到 docs/operation.log');
        console.log('📸 配置截图已保存到 docs/map_config_final.png');
    } catch (error) {
        console.error('\n❌ 配置失败:', error.message);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { configureGoogleMaps };