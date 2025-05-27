#!/usr/bin/env node

/**
 * 为联系人数据添加部门ID的脚本
 * 这个脚本会读取现有的contacts.json文件，为每个联系人添加部门ID字段
 */

const fs = require('fs');
const path = require('path');

// 生成部门ID的函数
function generateDepartmentId(departmentName) {
  // 使用部门名称的哈希值和固定前缀生成唯一ID
  const nameHash = departmentName.split('').reduce((hash, char) => {
    return hash + char.charCodeAt(0);
  }, 0).toString(36);
  return `dept_${nameHash}`;
}

// 主函数
function addDepartmentIds() {
  try {
    // 读取现有的联系人数据
    const contactsPath = path.join(__dirname, '../public/contacts.json');
    const contactsData = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));
    
    console.log('正在为联系人数据添加部门ID...');
    console.log(`当前联系人数量: ${contactsData.contacts.length}`);
    
    // 创建部门ID映射
    const departmentIdMap = new Map();
    const departmentList = [];
    
    // 为每个部门生成唯一ID
    contactsData.departments.forEach(dept => {
      const deptId = generateDepartmentId(dept);
      departmentIdMap.set(dept, deptId);
      departmentList.push({
        id: deptId,
        name: dept,
        description: `${dept}部门`
      });
    });
    
    console.log('生成的部门ID映射:');
    departmentIdMap.forEach((id, name) => {
      console.log(`  ${name} -> ${id}`);
    });
    
    // 为每个联系人添加部门ID
    const updatedContacts = contactsData.contacts.map(contact => {
      const departmentId = departmentIdMap.get(contact.部门) || generateDepartmentId(contact.部门 || '未分类');
      return {
        ...contact,
        部门ID: departmentId
      };
    });
    
    // 更新数据结构
    const updatedData = {
      ...contactsData,
      contacts: updatedContacts,
      departmentList: departmentList,
      fields: [...contactsData.fields, '部门ID']
    };
    
    // 备份原文件
    const backupPath = path.join(__dirname, '../public/contacts.backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(contactsData, null, 2));
    console.log(`原文件已备份到: ${backupPath}`);
    
    // 写入更新后的数据
    fs.writeFileSync(contactsPath, JSON.stringify(updatedData, null, 2));
    console.log(`已成功更新联系人数据，添加了部门ID字段`);
    console.log(`更新后的联系人数量: ${updatedData.contacts.length}`);
    console.log(`部门数量: ${updatedData.departmentList.length}`);
    
    // 显示统计信息
    console.log('\n部门统计:');
    updatedData.departmentList.forEach(dept => {
      const count = updatedContacts.filter(contact => contact.部门ID === dept.id).length;
      console.log(`  ${dept.name} (${dept.id}): ${count}人`);
    });
    
  } catch (error) {
    console.error('处理过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  addDepartmentIds();
}

module.exports = { addDepartmentIds, generateDepartmentId }; 