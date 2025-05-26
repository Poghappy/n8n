## 阿里云 AI 服务

### 1. 配置文件
- `src/aliyun/config.js`：读取 .env 并初始化阿里云 SDK 客户端。

### 2. 文本摘要
- `summarizeText(text)`
- 用法示例：
  ```js
  const { summarizeText } = require('./src/aliyun/textSummary');
  const summary = await summarizeText('原始文本内容');
  ```
- 参数：text（待摘要内容，string）

### 3. OCR 识别
- `recognizeImage(imagePath)`
- 用法示例：
  ```js
  const { recognizeImage } = require('./src/aliyun/ocr');
  const text = await recognizeImage('/path/to/image.jpg');
  ```
- 参数：imagePath（本地图片路径，string）

### 4. 翻译
- `translateText(text, targetLang)`
- 用法示例：
  ```js
  const { translateText } = require('./src/aliyun/translate');
  const en = await translateText('你好', 'en'); // 中译英
  const zh = await translateText('hello', 'zh'); // 英译中
  ```
- 参数：text（待翻译内容，string），targetLang（目标语言代码，string）

### 5. 图像生成
- `generateImage(prompt)`
- 用法示例：
  ```js
  const { generateImage } = require('./src/aliyun/imageGenerate');
  const url = await generateImage('夏威夷海滩风景');
  ```
- 参数：prompt（图片描述，string）
# 夏威夷华人平台 - 火鸟门户API技术文档

## 基础配置

### API 基础地址
```
https://hawaiihub.net/include/json.php
```

### 认证方式
- 使用 .env 中的 API_TOKEN 或 ADMIN_COOKIE
- 后台登录地址：https://hawaiihub.net/admin/login

---

## 新闻模块 (article)

### 1. 新闻列表
**接口：** `?service=article&action=alist`
**参数：**
- typeid: 分类ID
- page: 页码 (默认1)

**示例：**
```
https://hawaiihub.net/include/json.php?service=article&action=alist&page=1
```

### 2. 新闻详情
**接口：** `?service=article&action=detail`
**参数：**
- param: 新闻ID

**示例：**
```
https://hawaiihub.net/include/json.php?service=article&action=detail&param=126
```

### 3. 发布新闻
**接口：** `?service=article&action=put`
**参数：**
- title: 标题
- typeid: 分类ID  
- body: 内容
- 其他字段...

### 4. 编辑新闻
**接口：** `?service=article&action=edit`
**参数：**
- id: 新闻ID
- title: 标题
- body: 内容
- 其他字段...

### 5. 删除新闻
**接口：** `?service=article&action=del`
**参数：**
- id: 新闻ID

---

## 招聘模块 (job)

### 1. 招聘列表
**接口：** `?service=job&action=post`
**参数：**
- addr: 地址
- type: 类型
- page: 页码

**示例：**
```
https://hawaiihub.net/include/json.php?service=job&action=post&page=1
```

### 2. 招聘详情
**接口：** `?service=job&action=detail`
**参数：**
- param: 职位ID

### 3. 发布职位
**接口：** `?service=job&action=put`
**参数：**
- title: 职位标题
- type: 职位类型
- salary: 薪资
- 其他字段...

### 4. 编辑职位
**接口：** `?service=job&action=edit`
**参数：**
- id: 职位ID
- title: 职位标题
- 其他字段...

### 5. 删除职位
**接口：** `?service=job&action=del`
**参数：**
- id: 职位ID

---

## 分类信息模块 (info)

### 1. 信息列表
**接口：** `?service=info&action=ilist`
**参数：**
- typeid: 分类ID
- page: 页码

**示例：**
```
https://hawaiihub.net/include/json.php?service=info&action=ilist&page=1
```

### 2. 信息详情
**接口：** `?service=info&action=detail`
**参数：**
- param: 信息ID

### 3. 发布信息
**接口：** `?service=info&action=put`
**参数：**
- title: 标题
- typeid: 分类ID
- body: 内容
- 其他字段...

### 4. 删除信息
**接口：** `?service=info&action=del`
**参数：**
- id: 信息ID

---

## 系统配置模块 (siteConfig)

### 获取系统配置
**接口：** `?service=siteConfig&action=config`
**参数：** 无

---

## 数据采集模块

### 基于火鸟采集规则的自动化采集

根据截图显示的采集配置：

#### 1. 采集设置
- **采集节点：** 58
- **采集列表页：** https://ihuoniao.cn/sz/article/fangchan/
- **采集方式：** 自动采集+URL生成

#### 2. 采集字段配置
- **文章正文内容标记：** `<div class="wmain">`
- **发布内容语法标记：** `&nbsp;&nbsp;&nbsp;来源：`
- **文章正文结束标记：** `</a>&nbsp;&nbsp;&nbsp;作者：`
- **文章来源标记：** `</a>&nbsp;&nbsp;&nbsp;作者：`

#### 3. 采集流程
1. 从列表页获取文章链接
2. 按设定的标记提取内容
3. 清理和格式化数据
4. 发布到对应模块

#### 4. 自动化接口
```javascript
// 采集API调用示例
const collectData = {
  "service": "article",
  "action": "put", 
  "title": "采集的标题",
  "typeid": 1,
  "body": "采集的内容",
  "source": "采集来源"
};
```

---

## 错误码说明

- **200:** 成功
- **400:** 参数错误
- **401:** 认证失败
- **404:** 资源不存在
- **500:** 服务器错误

---

## 返回格式

```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 具体数据
  }
}
```

---

## 使用示例

### JavaScript 调用示例
```javascript
const callApi = async (service, action, params) => {
  const baseUrl = process.env.API_BASE;
  const url = `${baseUrl}?service=${service}&action=${action}&${new URLSearchParams(params)}`;
  
  const response = await fetch(url, {
    headers: {
      'Cookie': process.env.ADMIN_COOKIE
    }
  });
  
  return await response.json();
};

// 获取新闻列表
const newsList = await callApi('article', 'alist', { page: 1 });

// 发布新闻
const publishNews = await callApi('article', 'put', {
  title: '新闻标题',
  typeid: 1,
  body: '新闻内容'
});
```

### Python 调用示例
```python
import os
import requests

def call_api(service, action, params={}):
    base_url = os.getenv('API_BASE')
    params.update({'service': service, 'action': action})
    
    headers = {
        'Cookie': os.getenv('ADMIN_COOKIE')
    }
    
    response = requests.get(base_url, params=params, headers=headers)
    return response.json()

# 获取新闻列表
news_list = call_api('article', 'alist', {'page': 1})

# 发布新闻
publish_result = call_api('article', 'put', {
    'title': '新闻标题',
    'typeid': 1,
    'body': '新闻内容'
})
```