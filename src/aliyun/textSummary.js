// 文本摘要模块，负责调用阿里云文本摘要API
const { client } = require('./config'); // 这行是引入阿里云SDK客户端

/**
 * summarizeText: 对输入文本进行摘要
 * @param {string} text - 需要摘要的文本内容
 * @returns {Promise<string>} 摘要结果
 */
async function summarizeText(text) {
  // 这行是构造API请求参数
  const params = {
    Service: 'alinlp',
    Action: 'GetSummary',
    Text: text,
    Length: 100 // 这行是摘要长度，可根据需求调整
  };
  // 这行是调用阿里云API
  const result = await client.request('alinlp', params);
  // 这行是返回API的摘要结果
  return result.Summary;
}

module.exports = { summarizeText };