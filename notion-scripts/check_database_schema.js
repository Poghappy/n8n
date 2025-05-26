const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: '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'
});

const DATABASE_ID = '1d07e8643b7b80b79135c068b625785a';

async function checkDatabaseSchema() {
  try {
    const response = await notion.databases.retrieve({
      database_id: DATABASE_ID
    });
    
    console.log('📊 数据库信息：');
    console.log('标题:', response.title[0]?.plain_text || '无标题');
    console.log('\n📋 数据库字段：');
    
    Object.entries(response.properties).forEach(([name, property]) => {
      console.log(`- ${name}: ${property.type}`);
      if (property.type === 'select' && property.select?.options) {
        console.log(`  选项: ${property.select.options.map(opt => opt.name).join(', ')}`);
      }
      if (property.type === 'multi_select' && property.multi_select?.options) {
        console.log(`  选项: ${property.multi_select.options.map(opt => opt.name).join(', ')}`);
      }
    });
    
    return response.properties;
    
  } catch (error) {
    console.error('❌ 获取数据库结构时出错：', error);
  }
}

checkDatabaseSchema();
