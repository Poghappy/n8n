/**
 * 火鸟门户地图集成模块
 * 为信息模块和招聘模块提供地图功能支持
 */

const GoogleMapsHelper = require('../common/googleMapsHelper.cjs');
const { callApi } = require('../common/apiHelper.cjs');

class FirebirdMapIntegration {
    constructor() {
        this.mapsHelper = new GoogleMapsHelper();
    }

    /**
     * 信息模块 - 添加位置信息
     * @param {Object} infoData - 信息数据
     * @returns {Promise<Object>} API 响应
     */
    async addLocationToInfo(infoData) {
        try {
            let locationData = null;
            
            // 如果提供了地址，进行地理编码
            if (infoData.address) {
                locationData = await this.mapsHelper.geocodeAddress(infoData.address);
            }

            const params = {
                service: 'info',
                action: 'put',
                ...infoData,
            };

            // 添加地理位置信息
            if (locationData) {
                params.latitude = locationData.latitude;
                params.longitude = locationData.longitude;
                params.formatted_address = locationData.formatted_address;
                params.place_id = locationData.place_id;
            }

            const result = await callApi(params);
            
            // 记录操作日志
            await this.logOperation('info', 'put', '成功', `添加信息并包含位置: ${infoData.title || '未知标题'}`);
            
            return result;
        } catch (error) {
            console.error('信息模块地图集成错误:', error);
            await this.logOperation('info', 'put', '失败', `错误: ${error.message}`);
            throw error;
        }
    }

    /**
     * 招聘模块 - 添加公司位置
     * @param {Object} jobData - 招聘数据
     * @returns {Promise<Object>} API 响应
     */
    async addJobLocation(jobData) {
        try {
            let locationData = null;
            
            // 如果提供了公司地址，进行地理编码
            if (jobData.company_address) {
                locationData = await this.mapsHelper.geocodeAddress(jobData.company_address);
            }

            const params = {
                service: 'job',
                action: 'put',
                ...jobData,
            };

            // 添加公司地理位置信息
            if (locationData) {
                params.company_lat = locationData.latitude;
                params.company_lng = locationData.longitude;
                params.company_formatted_address = locationData.formatted_address;
                params.company_place_id = locationData.place_id;
            }

            const result = await callApi(params);
            
            // 记录操作日志
            await this.logOperation('job', 'put', '成功', `添加招聘信息并包含位置: ${jobData.job_name || '未知职位'}`);
            
            return result;
        } catch (error) {
            console.error('招聘模块地图集成错误:', error);
            await this.logOperation('job', 'put', '失败', `错误: ${error.message}`);
            throw error;
        }
    }

    /**
     * 搜索附近的信息
     * @param {Object} location - 中心位置 {lat, lng}
     * @param {number} radius - 搜索半径（米）
     * @param {string} category - 信息分类
     * @returns {Promise<Array>} 附近的信息列表
     */
    async searchNearbyInfo(location, radius = 5000, category = '') {
        try {
            // 获取信息列表
            const params = {
                service: 'info',
                action: 'ilist',
                category: category,
                page: 1,
                limit: 100,
            };

            const response = await callApi(params);
            
            if (!response.data || !Array.isArray(response.data)) {
                return [];
            }

            // 过滤有位置信息的数据
            const infoWithLocation = response.data.filter(item => 
                item.latitude && item.longitude
            );

            // 计算距离并过滤
            const nearbyInfo = [];
            for (const info of infoWithLocation) {
                try {
                    const distance = await this.mapsHelper.calculateDistance(
                        location,
                        { lat: parseFloat(info.latitude), lng: parseFloat(info.longitude) }
                    );

                    if (distance.distance_value <= radius) {
                        nearbyInfo.push({
                            ...info,
                            distance: distance.distance,
                            duration: distance.duration,
                        });
                    }
                } catch (distanceError) {
                    console.warn('距离计算失败:', distanceError);
                }
            }

            // 按距离排序
            nearbyInfo.sort((a, b) => 
                parseFloat(a.distance) - parseFloat(b.distance)
            );

            return nearbyInfo;
        } catch (error) {
            console.error('搜索附近信息错误:', error);
            throw error;
        }
    }

    /**
     * 搜索附近的招聘信息
     * @param {Object} location - 中心位置 {lat, lng}
     * @param {number} radius - 搜索半径（米）
     * @param {string} category - 招聘分类
     * @returns {Promise<Array>} 附近的招聘信息列表
     */
    async searchNearbyJobs(location, radius = 5000, category = '') {
        try {
            // 获取招聘列表
            const params = {
                service: 'job',
                action: 'ilist',
                category: category,
                page: 1,
                limit: 100,
            };

            const response = await callApi(params);
            
            if (!response.data || !Array.isArray(response.data)) {
                return [];
            }

            // 过滤有位置信息的数据
            const jobsWithLocation = response.data.filter(item => 
                item.company_lat && item.company_lng
            );

            // 计算距离并过滤
            const nearbyJobs = [];
            for (const job of jobsWithLocation) {
                try {
                    const distance = await this.mapsHelper.calculateDistance(
                        location,
                        { lat: parseFloat(job.company_lat), lng: parseFloat(job.company_lng) }
                    );

                    if (distance.distance_value <= radius) {
                        nearbyJobs.push({
                            ...job,
                            distance: distance.distance,
                            duration: distance.duration,
                        });
                    }
                } catch (distanceError) {
                    console.warn('距离计算失败:', distanceError);
                }
            }

            // 按距离排序
            nearbyJobs.sort((a, b) => 
                parseFloat(a.distance) - parseFloat(b.distance)
            );

            return nearbyJobs;
        } catch (error) {
            console.error('搜索附近招聘错误:', error);
            throw error;
        }
    }

    /**
     * 生成地图页面 HTML
     * @param {Array} items - 要显示的项目列表
     * @param {Object} options - 地图选项
     * @returns {string} HTML 代码
     */
    generateMapHTML(items, options = {}) {
        const {
            title = '地图视图',
            center = { lat: 21.3099, lng: -157.8581 },
            zoom = 10,
        } = options;

        const markers = items.map(item => ({
            position: {
                lat: parseFloat(item.latitude || item.company_lat),
                lng: parseFloat(item.longitude || item.company_lng),
            },
            title: item.title || item.job_name || '未知标题',
            infoWindow: `
                <div>
                    <h3>${item.title || item.job_name || '未知标题'}</h3>
                    <p>${item.description || item.job_description || '无描述'}</p>
                    ${item.distance ? `<p>距离: ${item.distance}</p>` : ''}
                    ${item.duration ? `<p>车程: ${item.duration}</p>` : ''}
                </div>
            `,
        }));

        const mapScript = this.mapsHelper.generateMapScript({
            containerId: 'map',
            zoom,
            center,
            markers,
        });

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    #map {
                        height: 600px;
                        width: 100%;
                    }
                    .info-panel {
                        padding: 20px;
                        background: #f5f5f5;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="info-panel">
                    <h1>${title}</h1>
                    <p>共找到 ${items.length} 个结果</p>
                </div>
                <div id="map"></div>
                <script>
                    ${mapScript}
                </script>
            </body>
            </html>
        `;
    }

    /**
     * 记录操作日志
     * @param {string} module - 模块名称
     * @param {string} action - 操作类型
     * @param {string} status - 状态
     * @param {string} note - 备注
     */
    async logOperation(module, action, status, note) {
        const fs = require('fs').promises;
        const path = require('path');
        
        try {
            const logDir = path.join(process.cwd(), 'docs');
            const logFile = path.join(logDir, 'status.md');
            
            const timestamp = new Date().toLocaleString('zh-CN');
            const logEntry = `${timestamp} | ${module} | ${action} | ${status} | ${note}\n`;
            
            await fs.appendFile(logFile, logEntry);
        } catch (error) {
            console.error('写入日志失败:', error);
        }
    }

    /**
     * 测试地图功能
     * @returns {Promise<boolean>} 测试结果
     */
    async testMapFunctions() {
        try {
            console.log('开始测试地图功能...');
            
            // 测试 Google Maps API 连接
            const connectionOk = await this.mapsHelper.testConnection();
            if (!connectionOk) {
                throw new Error('Google Maps API 连接失败');
            }

            // 测试地理编码
            const location = await this.mapsHelper.geocodeAddress('Honolulu, HI');
            console.log('地理编码测试成功:', location);

            // 测试反向地理编码
            const address = await this.mapsHelper.reverseGeocode(21.3099, -157.8581);
            console.log('反向地理编码测试成功:', address);

            console.log('地图功能测试完成，所有功能正常');
            return true;
        } catch (error) {
            console.error('地图功能测试失败:', error);
            return false;
        }
    }
}

module.exports = FirebirdMapIntegration; 