#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 通讯录数据导入工具
 * 支持从CSV格式导入联系人信息
 */

// 数据验证函数
function validateContact(contact) {
  const errors = [];
  
  if (!contact.姓名 || contact.姓名.trim() === '') {
    errors.push('姓名不能为空');
  }
  
  if (!contact.部门 || contact.部门.trim() === '') {
    errors.push('部门不能为空');
  }
  
  return errors;
}

// 生成唯一ID
function generateId(index) {
  return (index + 1).toString();
}

// 从CSV数据创建联系人对象
function createContactFromCSV(row, index) {
  return {
    id: generateId(index),
    部门: (row.部门 || row.department || '').trim(),
    姓名: (row.姓名 || row.name || row.名字 || '').trim(),
    手机: (row.手机 || row.mobile || row.phone || '').trim() || null,
    分机: (row.分机 || row.extension || row.ext || '').trim() || null,
    直线: (row.直线 || row.direct || row.directline || '').trim() || null
  };
}

// 解析CSV数据
function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV文件格式错误：至少需要标题行和一行数据');
  }
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const contacts = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    const contact = createContactFromCSV(row, contacts.length);
    const errors = validateContact(contact);
    
    if (errors.length > 0) {
      console.error(`第${i + 1}行数据错误: ${errors.join(', ')}`);
      continue;
    }
    
    contacts.push(contact);
  }
  
  return contacts;
}

// 生成部门列表
function generateDepartments(contacts) {
  const departments = [...new Set(contacts.map(c => c.部门))];
  return departments.sort();
}

// 创建完整的通讯录数据结构
function createContactsData(contacts) {
  const departments = generateDepartments(contacts);
  
  return {
    contacts: contacts,
    departments: departments,
    total: contacts.length,
    fields: ['部门', '姓名', '手机', '分机', '直线']
  };
}

// 创建示例CSV文件
function createSampleCSV() {
  const sampleData = `部门,姓名,手机,分机,直线
技术部,张三,13800138000,8001,50328001
技术部,李四,13900139000,8002,50328002
市场部,王五,13700137000,8003,50328003
市场部,赵六,13600136000,8004,50328004`;

  const samplePath = path.join(__dirname, 'sample-contacts.csv');
  fs.writeFileSync(samplePath, sampleData, 'utf8');
  console.log(`📝 示例CSV文件已创建: ${samplePath}`);
  return samplePath;
}

// 主导入函数
function importContacts(inputFile, outputFile = null) {
  try {
    console.log('🔄 开始导入通讯录数据...');
    
    // 检查输入文件
    if (!fs.existsSync(inputFile)) {
      throw new Error(`输入文件不存在: ${inputFile}`);
    }
    
    // 读取文件内容
    const fileContent = fs.readFileSync(inputFile, 'utf8');
    const fileExt = path.extname(inputFile).toLowerCase();
    
    let contacts = [];
    
    if (fileExt === '.csv') {
      contacts = parseCSV(fileContent);
    } else if (fileExt === '.json') {
      const jsonData = JSON.parse(fileContent);
      contacts = Array.isArray(jsonData) ? jsonData : jsonData.contacts || [];
    } else {
      throw new Error('不支持的文件格式。请使用CSV或JSON文件。');
    }
    
    if (contacts.length === 0) {
      throw new Error('没有找到有效的联系人数据');
    }
    
    // 创建完整数据结构
    const contactsData = createContactsData(contacts);
    
    // 确定输出文件路径
    const outputPath = outputFile || path.join(__dirname, '../public/contacts.json');
    
    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 写入文件
    fs.writeFileSync(outputPath, JSON.stringify(contactsData, null, 2), 'utf8');
    
    console.log('✅ 导入成功！');
    console.log(`📊 统计信息:`);
    console.log(`   - 总联系人数: ${contactsData.total}`);
    console.log(`   - 部门数量: ${contactsData.departments.length}`);
    console.log(`   - 部门列表: ${contactsData.departments.join(', ')}`);
    console.log(`📁 输出文件: ${outputPath}`);
    
    return contactsData;
    
  } catch (error) {
    console.error('❌ 导入失败:', error.message);
    process.exit(1);
  }
}

// 命令行接口
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
📞 通讯录数据导入工具

用法:
  node import-contacts.js <输入文件> [输出文件]
  node import-contacts.js --sample    # 创建示例CSV文件

参数:
  输入文件    CSV或JSON格式的联系人数据文件
  输出文件    可选，默认为 ../public/contacts.json

CSV文件格式:
  必需列: 部门, 姓名
  可选列: 手机, 分机, 直线
  
示例:
  node import-contacts.js contacts.csv
  node import-contacts.js data.json public/contacts.json
  node import-contacts.js --sample
`);
    return;
  }
  
  if (args[0] === '--sample') {
    createSampleCSV();
    return;
  }
  
  const inputFile = args[0];
  const outputFile = args[1];
  
  importContacts(inputFile, outputFile);
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  importContacts,
  createSampleCSV,
  validateContact,
  parseCSV
}; 