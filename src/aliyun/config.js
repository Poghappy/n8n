// 阿里云配置文件，负责读取.env中的密钥和初始化SDK客户端
require('dotenv').config(); // 这行是加载.env环境变量
const { Config, Client } = require('@alicloud/openapi-client'); // 这行是引入阿里云官方SDK

// 这行是从环境变量读取阿里云AccessKeyId
const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID;
// 这行是从环境变量读取阿里云AccessKeySecret
const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET;
// 这行是从环境变量读取阿里云RegionId
const regionId = process.env.ALIYUN_REGION_ID;

// 这行是初始化阿里云SDK客户端
const client = new Client(new Config({
  accessKeyId,
  accessKeySecret,
  regionId
}));

module.exports = { client, accessKeyId, accessKeySecret, regionId };