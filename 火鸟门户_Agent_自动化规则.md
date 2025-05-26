---
type: menu
description: 火鸟门户 Agent 自动化规则——夏威夷华人平台专用。在 Agent 模式下自动配置并调用火鸟门户各模块接口及采集插件。
---

# 火鸟门户 Agent 自动化规则（夏威夷华人平台专用）

## 1. 新闻资讯模块（service=news）
- 拉新闻列表：  
  `GET /include/json.php?service=news&action=list&page=1&pageSize=20`
- 查看文章详情：  
  `GET /include/json.php?service=news&action=detail&aid=文章ID`
- 配置采集规则：  
  1. 打开后台 →「采集规则」→ 新建
  2. 列表页地址填：目标新闻列表 URL
  3. 标题标记：`<title>` ~ `</title>`
  4. 正文标记：`<description>` ~ `</description>`
  5. 时间标记：`<pubDate>` ~ `</pubDate>`
  6. 其他按需 → 保存

---

## 2. 分类信息模块（service=info）
- 列表查询：  
  `GET /include/json.php?service=info&action=ilist&typeid=分类ID&page=1&pageSize=20`
- 查看详情：  
  `GET /include/json.php?service=info&action=detail&aid=信息ID`
- 发布/修改：  
  `POST /include/json.php?service=info&action=put`  
  参数：`title`、`addrid`、`body`、`imglist`

---

## 3. 招聘模块（service=job）
- 列表查询：  
  `GET /include/json.php?service=job&action=post&addrid=地区ID&page=1&pageSize=20`
- 查看详情：  
  `GET /include/json.php?service=job&action=detail&aid=职位ID`
- 发布职位：  
  `POST /include/json.php?service=job&action=postSave`  
  参数：`company`、`title`、`description`、`addrid`

---

## 4. 房产模块（service=house）
- 列表查询：  
  `GET /include/json.php?service=house&action=houseList&addrid=地区ID&pageSize=20`
- 查看详情：  
  `GET /include/json.php?service=house&action=houseDetail&aid=房源ID`
- 发布房源：  
  `POST /include/json.php?service=house&action=addHouse`  
  参数：`title`、`addrid`、`price`、`body`、`imglist`

---

## 5. 圈子模块（service=circle）
- 获取动态列表：  
  `GET /include/json.php?service=circle&action=getCircleList&page=1`
- 发布新动态：  
  `POST /include/json.php?service=circle&action=circleSave`  
  参数：`content`、`imglist`

---

## 6. AI 助手插件（service=aiAssistant）
- 获取配置：  
  `GET /include/json.php?service=aiAssistant&action=getConfig`
- 发起 AI 问答：  
  `POST /include/json.php?service=aiAssistant&action=ask`  
  参数：`prompt`、`userId`

---

## 7. 通用小贴士
- 所有列表/查询接口都支持 `page` + `pageSize` 分页。
- 分类筛选用 `typeid`，地区筛选用 `addrid`。
- 发布/修改接口统一用 `put`/`postSave`，字段按模块要求补齐。
- 调用前先查询 `config` 接口，确认模块是否开启（`channelSwitch=0` 表示开启）。
- 统一返回字段：`state` 100 成功，101 参数错，200 失败。

---

## 示例 Agent 调用

- **新闻列表**：  
  ```http
  GET /include/json.php?service=news&action=list&page=1&pageSize=20
  ```
- **发布分类信息**：  
  ```http
  POST /include/json.php?service=info&action=put
  参数：title=xxx&addrid=xxx&body=xxx&imglist=xxx
  ```
- **AI 问答**：  
  ```http
  POST /include/json.php?service=aiAssistant&action=ask
  参数：prompt=xxx&userId=xxx
  ```

---

> **使用说明**：  
> 本规则用于 Agent 模式下自动化调用火鸟门户各模块接口。请严格按照接口参数和返回值规范进行调用。采集插件配置时，参考新闻模块采集规则填写页面标记。遇到新模块或特殊需求时，优先查阅本规则并补充说明。
