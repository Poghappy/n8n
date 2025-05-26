const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: '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'
});

const DATABASE_ID = '1d07e8643b7b80b79135c068b625785a';

async function updateDatabaseSchema() {
  try {
    const response = await notion.databases.update({
      database_id: DATABASE_ID,
      properties: {
        // 生成内容 - 富文本字段，可以存储格式化的文本
        "生成内容": {
          "rich_text": {}
        },
        // 生成时间 - 日期时间字段
        "生成时间": {
          "date": {}
        },
        // 生成状态 - 选择字段
        "生成状态": {
          "select": {
            "options": [
              {
                "name": "待生成",
                "color": "gray"
              },
              {
                "name": "生成中",
                "color": "yellow"
              },
              {
                "name": "已生成",
                "color": "green"
              },
              {
                "name": "生成失败",
                "color": "red"
              }
            ]
          }
        },
        // 摘要 - 富文本字段，用于存储 AI 生成的文章摘要
        "摘要": {
          "rich_text": {}
        },
        // 关键词 - 多选字段，用于存储文章关键词
        "关键词": {
          "multi_select": {
            "options": []  // 选项会根据生成的关键词动态添加
          }
        }
      }
    });
    
    console.log('数据库结构更新成功！');
    console.log('新添加的字段：');
    console.log('- 生成内容（富文本）');
    console.log('- 生成时间（日期）');
    console.log('- 生成状态（选择）');
    console.log('- 摘要（富文本）');
    console.log('- 关键词（多选）');
    
  } catch (error) {
    console.error('更新数据库结构时出错：', error);
  }
}

updateDatabaseSchema();