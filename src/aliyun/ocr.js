// OCR模块，负责调用阿里云OCR接口识别图片文字
const { client } = require('./config'); // 这行是引入阿里云SDK客户端
const fs = require('fs'); // 这行是引入文件系统模块

/**
 * recognizeImage: 识别图片中的文字
 * @param {string} imagePath - 本地图片文件路径
 * @returns {Promise<string>} 识别出的文字
 */
async function recognizeImage(imagePath) {
  // 这行是读取图片文件并转为Base64
  const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
  // 这行是构造API请求参数
  const params = {
    Service: 'ocr',
    Action: 'RecognizeGeneral',
    ImageBase64: imageBase64
  };
  // 这行是调用阿里云OCR API
  const result = await client.request('ocr', params);
  // 这行是返回识别结果
  return result.Text;
}

module.exports = { recognizeImage };