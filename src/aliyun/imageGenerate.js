// 图像生成模块，负责调用阿里云文生图服务
const { client } = require('./config'); // 这行是引入阿里云SDK客户端

/**
 * generateImage: 根据描述生成图片
 * @param {string} prompt - 图片描述
 * @returns {Promise<string>} 图片URL或Base64
 */
async function generateImage(prompt) {
  // 这行是构造API请求参数
  const params = {
    Service: 'imageprocess',
    Action: 'GenerateImage',
    Prompt: prompt
  };
  // 这行是调用阿里云文生图API
  const result = await client.request('imageprocess', params);
  // 这行是返回图片URL或Base64
  return result.ImageUrl || result.ImageBase64;
}

module.exports = { generateImage };