const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: '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'
});

const DATABASE_ID = '1d07e8643b7b80b79135c068b625785a';

async function createGoogleMapsRecord() {
  try {
    const currentTime = new Date().toISOString();

    const response = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID
      },
      properties: {
        // 标题字段 - 使用实际的标题字段名
        "推文标题": {
          "title": [
            {
              "text": {
                "content": "Google Maps API 配置完成"
              }
            }
          ]
        },
        // 内容类型
        "内容类型": {
          "select": {
            "name": "文章"
          }
        },
        // 是否AI生成
        "是否AI生成": {
          "checkbox": false
        },
        // 发布状态
        "发布状态": {
          "select": {
            "name": "已发布"
          }
        },
        // 作者
        "作者": {
          "rich_text": [
            {
              "text": {
                "content": "系统管理员"
              }
            }
          ]
        },
        // 生成状态
        "生成状态": {
          "select": {
            "name": "已生成"
          }
        },
        // 生成时间
        "生成时间": {
          "date": {
            "start": currentTime
          }
        },
        // 生成内容
        "生成内容": {
          "rich_text": [
            {
              "text": {
                "content": "Google Maps API 配置已完成，包括以下配置项：\n\n1. Google Maps API Key 配置\n2. Google Service Account 配置\n3. 环境变量设置\n4. 相关文档更新"
              }
            }
          ]
        },
        // 摘要
        "摘要": {
          "rich_text": [
            {
              "text": {
                "content": "夏威夷华人平台的Google Maps API集成配置已完成，包括API密钥设置、服务账户配置和环境变量配置。"
              }
            }
          ]
        },
        // 关键词
        "关键词": {
          "multi_select": [
            {
              "name": "Google Maps"
            },
            {
              "name": "API配置"
            },
            {
              "name": "夏威夷华人平台"
            },
            {
              "name": "地图服务"
            }
          ]
        }
      },
      children: [
        {
          "object": "block",
          "type": "heading_1",
          "heading_1": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "Google Maps API 配置完成记录"
                }
              }
            ]
          }
        },
        {
          "object": "block",
          "type": "paragraph",
          "paragraph": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "配置时间：" + new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
                }
              }
            ]
          }
        },
        {
          "object": "block",
          "type": "heading_2",
          "heading_2": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "配置详情"
                }
              }
            ]
          }
        },
        {
          "object": "block",
          "type": "bulleted_list_item",
          "bulleted_list_item": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "✅ Google Maps API Key 已配置"
                }
              }
            ]
          }
        },
        {
          "object": "block",
          "type": "bulleted_list_item",
          "bulleted_list_item": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "✅ Google Service Account 凭证已设置"
                }
              }
            ]
          }
        },
        {
          "object": "block",
          "type": "bulleted_list_item",
          "bulleted_list_item": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "✅ 环境变量 .env 文件已配置"
                }
              }
            ]
          }
        },
        {
          "object": "block",
          "type": "bulleted_list_item",
          "bulleted_list_item": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "✅ 配置文档已更新 (docs/google-maps-setup.md)"
                }
              }
            ]
          }
        },
        {
          "object": "block",
          "type": "heading_2",
          "heading_2": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "相关文件"
                }
              }
            ]
          }
        },
        {
          "object": "block",
          "type": "code",
          "code": {
            "caption": [],
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "docs/google-maps-setup.md\ngoogleServiceAccount.json\n.env"
                }
              }
            ],
            "language": "plain text"
          }
        },
        {
          "object": "block",
          "type": "heading_2",
          "heading_2": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "环境变量配置"
                }
              }
            ]
          }
        },
        {
          "object": "block",
          "type": "code",
          "code": {
            "caption": [],
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "GOOGLE_MAPS_API_KEY=【新生成的浏览器 Key】\nGOOGLE_APPLICATION_CREDENTIALS=./googleServiceAccount.json"
                }
              }
            ],
            "language": "bash"
          }
        },
        {
          "object": "block",
          "type": "heading_2",
          "heading_2": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "下一步计划"
                }
              }
            ]
          }
        },
        {
          "object": "block",
          "type": "bulleted_list_item",
          "bulleted_list_item": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "🔄 集成Google Maps到前端应用"
                }
              }
            ]
          }
        },
        {
          "object": "block",
          "type": "bulleted_list_item",
          "bulleted_list_item": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "🔄 测试地图功能"
                }
              }
            ]
          }
        },
        {
          "object": "block",
          "type": "bulleted_list_item",
          "bulleted_list_item": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "🔄 优化地图性能"
                }
              }
            ]
          }
        }
      ]
    });

    console.log('✅ Google Maps 配置记录已成功创建到 Notion！');
    console.log('📄 页面ID:', response.id);
    console.log('🔗 页面URL:', response.url);

    return response;

  } catch (error) {
    console.error('❌ 创建 Notion 页面时出错：', error);

    // 如果是权限错误，提供帮助信息
    if (error.code === 'unauthorized') {
      console.log('\n🔧 可能的解决方案：');
      console.log('1. 检查 Notion API Token 是否正确');
      console.log('2. 确保 Integration 有访问数据库的权限');
      console.log('3. 检查数据库ID是否正确');
    }

    // 如果是数据库结构错误，提供帮助信息
    if (error.code === 'validation_error') {
      console.log('\n🔧 可能的解决方案：');
      console.log('1. 检查数据库字段名称是否正确');
      console.log('2. 确保所有必需字段都已提供');
      console.log('3. 检查字段类型是否匹配');
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  createGoogleMapsRecord();
}

module.exports = { createGoogleMapsRecord };
