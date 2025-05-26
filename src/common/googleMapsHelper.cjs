/**
 * Google 地图集成工具类
 * 用于火鸟门户系统的地图功能集成
 */

require('dotenv').config();
const { Client } = require('@googlemaps/google-maps-services-js');

class GoogleMapsHelper {
    constructor() {
        this.client = new Client({});
        this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
        
        if (!this.apiKey) {
            console.warn('警告: GOOGLE_MAPS_API_KEY 未配置');
        }
    }

    /**
     * 地理编码 - 将地址转换为经纬度
     * @param {string} address - 地址字符串
     * @returns {Promise<Object>} 包含经纬度的对象
     */
    async geocodeAddress(address) {
        try {
            if (!this.apiKey) {
                throw new Error('Google Maps API Key 未配置');
            }

            const response = await this.client.geocode({
                params: {
                    address: address,
                    key: this.apiKey,
                },
            });

            if (response.data.results.length === 0) {
                throw new Error(`未找到地址: ${address}`);
            }

            const result = response.data.results[0];
            return {
                latitude: result.geometry.location.lat,
                longitude: result.geometry.location.lng,
                formatted_address: result.formatted_address,
                place_id: result.place_id,
            };
        } catch (error) {
            console.error('地理编码错误:', error);
            throw error;
        }
    }

    /**
     * 反向地理编码 - 将经纬度转换为地址
     * @param {number} lat - 纬度
     * @param {number} lng - 经度
     * @returns {Promise<string>} 格式化的地址
     */
    async reverseGeocode(lat, lng) {
        try {
            if (!this.apiKey) {
                throw new Error('Google Maps API Key 未配置');
            }

            const response = await this.client.reverseGeocode({
                params: {
                    latlng: `${lat},${lng}`,
                    key: this.apiKey,
                },
            });

            if (response.data.results.length === 0) {
                throw new Error(`未找到坐标对应的地址: ${lat}, ${lng}`);
            }

            return response.data.results[0].formatted_address;
        } catch (error) {
            console.error('反向地理编码错误:', error);
            throw error;
        }
    }

    /**
     * 生成地图 JavaScript 代码
     * @param {Object} options - 地图配置选项
     * @returns {string} JavaScript 代码字符串
     */
    generateMapScript(options = {}) {
        const {
            containerId = 'map',
            zoom = 10,
            center = { lat: 21.3099, lng: -157.8581 }, // 夏威夷檀香山
            markers = [],
        } = options;

        return `
            function initMap() {
                const map = new google.maps.Map(document.getElementById('${containerId}'), {
                    zoom: ${zoom},
                    center: ${JSON.stringify(center)},
                });

                ${markers.map((marker, index) => `
                    const marker${index} = new google.maps.Marker({
                        position: ${JSON.stringify(marker.position)},
                        map: map,
                        title: '${marker.title || ''}',
                    });

                    ${marker.infoWindow ? `
                        const infoWindow${index} = new google.maps.InfoWindow({
                            content: '${marker.infoWindow}',
                        });

                        marker${index}.addListener('click', () => {
                            infoWindow${index}.open(map, marker${index});
                        });
                    ` : ''}
                `).join('')}
            }

            function loadGoogleMaps() {
                const script = document.createElement('script');
                script.src = 'https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap';
                script.async = true;
                document.head.appendChild(script);
            }

            // 自动加载地图
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', loadGoogleMaps);
            } else {
                loadGoogleMaps();
            }
        `;
    }

    /**
     * 计算两点之间的距离
     * @param {Object} origin - 起点 {lat, lng}
     * @param {Object} destination - 终点 {lat, lng}
     * @returns {Promise<Object>} 距离和时间信息
     */
    async calculateDistance(origin, destination) {
        try {
            if (!this.apiKey) {
                throw new Error('Google Maps API Key 未配置');
            }

            const response = await this.client.distancematrix({
                params: {
                    origins: [`${origin.lat},${origin.lng}`],
                    destinations: [`${destination.lat},${destination.lng}`],
                    key: this.apiKey,
                },
            });

            const element = response.data.rows[0].elements[0];
            
            if (element.status !== 'OK') {
                throw new Error('无法计算距离');
            }

            return {
                distance: element.distance.text,
                duration: element.duration.text,
                distance_value: element.distance.value, // 米
                duration_value: element.duration.value, // 秒
            };
        } catch (error) {
            console.error('距离计算错误:', error);
            throw error;
        }
    }

    /**
     * 搜索附近的地点
     * @param {Object} location - 中心位置 {lat, lng}
     * @param {string} keyword - 搜索关键词
     * @param {number} radius - 搜索半径（米）
     * @returns {Promise<Array>} 地点列表
     */
    async searchNearby(location, keyword, radius = 5000) {
        try {
            if (!this.apiKey) {
                throw new Error('Google Maps API Key 未配置');
            }

            const response = await this.client.placesNearby({
                params: {
                    location: `${location.lat},${location.lng}`,
                    radius: radius,
                    keyword: keyword,
                    key: this.apiKey,
                },
            });

            return response.data.results.map(place => ({
                name: place.name,
                address: place.vicinity,
                location: place.geometry.location,
                place_id: place.place_id,
                rating: place.rating,
                types: place.types,
            }));
        } catch (error) {
            console.error('附近搜索错误:', error);
            throw error;
        }
    }

    /**
     * 验证 API 连接
     * @returns {Promise<boolean>} 连接状态
     */
    async testConnection() {
        try {
            await this.geocodeAddress('Honolulu, HI');
            console.log('Google Maps API 连接正常');
            return true;
        } catch (error) {
            console.error('Google Maps API 连接失败:', error);
            return false;
        }
    }
}

module.exports = GoogleMapsHelper; 