// 翻译模块，负责调用阿里云机器翻译接口
const { client } = require('./config'); // 这行是引入阿里云SDK客户端

/**
 * translateText: 翻译文本
 * @param {string} text - 需要翻译的文本
 * @param {string} targetLang - 目标语言（如 'en'、'zh'）
 * @returns {Promise<string>} 翻译结果
 */
async function translateText(text, targetLang) {
  // 这行是构造API请求参数
  const params = {
    Service: 'alimt',
    Action: 'TranslateGeneral',
    SourceText: text,
    TargetLanguage: targetLang,
    SourceLanguage: 'auto' // 自动检测源语言
  };
  // 这行是调用阿里云翻译API
  const result = await client.request('alimt', params);
  // 这行是返回翻译结果
  return result.TranslatedText;
}

module.exports = { translateText };