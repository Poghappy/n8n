/**
 * 火鸟门户 API 调用辅助工具
 * 统一处理与火鸟门户系统的API交互
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * 调用火鸟门户API
 * @param {Object} params - API参数
 * @returns {Promise<Object>} API响应
 */
async function callApi(params) {
    const apiBase = process.env.API_BASE || 'https://hawaiihub.net/include/json.php';
    
    return new Promise((resolve, reject) => {
        try {
            const url = new URL(apiBase);
            const queryParams = new URLSearchParams(params);
            url.search = queryParams.toString();
            
            const protocol = url.protocol === 'https:' ? https : http;
            
            const options = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method: 'GET',
                headers: {
                    'User-Agent': 'HawaiiHub-MapBot/1.0',
                    'Accept': 'application/json',
                }
            };
            
            const req = protocol.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        resolve(result);
                    } catch (parseError) {
                        console.warn('API响应解析失败，返回原始数据:', data);
                        resolve({ data: data, raw: true });
                    }
                });
            });
            
            req.on('error', (error) => {
                console.error('API调用失败:', error);
                reject(error);
            });
            
            req.setTimeout(30000, () => {
                req.destroy();
                reject(new Error('API调用超时'));
            });
            
            req.end();
            
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 测试API连接
 * @returns {Promise<boolean>} 连接是否成功
 */
async function testApiConnection() {
    try {
        const result = await callApi({
            service: 'info',
            action: 'config'
        });
        return !!result;
    } catch (error) {
        console.error('API连接测试失败:', error);
        return false;
    }
}

module.exports = {
    callApi,
    testApiConnection
}; 