import { Client } from '@notionhq/client';

const notion = new Client({
  auth: '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'
});

// 从 URL 中提取的数据库 ID
const DATABASE_ID = '1d07e8643b7b80b79135c068b625785a';

async function getDatabaseInfo() {
  try {
    // 首先尝试获取数据库信息
    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID
    });
    console.log('成功连接到数据库！');
    console.log('数据库名称:', database.title[0]?.plain_text);
    console.log('当前属性:', Object.keys(database.properties).join(', '));
    
    // 然后更新数据库结构
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
    
    console.log('\n数据库结构更新成功！');
    console.log('新添加的字段：');
    console.log('- 生成内容（富文本）');
    console.log('- 生成时间（日期）');
    console.log('- 生成状态（选择）');
    console.log('- 摘要（富文本）');
    console.log('- 关键词（多选）');
    
  } catch (error) {
    if (error.code === 'object_not_found') {
      console.error('错误：找不到数据库。请确保：');
      console.error('1. 数据库 ID 正确');
      console.error('2. 已经将数据库与集成共享');
      console.error('3. 集成有权限访问该数据库');
      console.error('\n具体步骤：');
      console.error('1. 打开 Notion 数据库页面');
      console.error('2. 点击右上角的 "Share" 按钮');
      console.error('3. 点击 "Add connections"');
      console.error('4. 找到并选择你的集成');
    } else {
      console.error('更新数据库结构时出错：', error);
    }
  }
}

getDatabaseInfo();