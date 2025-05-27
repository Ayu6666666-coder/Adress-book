#!/usr/bin/env node

/**
 * 调整联系人部门的脚本
 * 1. 周军：从市场拓展部调整到安全保障部第二位
 * 2. 乐天：从安全保障部调整到市场拓展部最后一位
 * 3. 施森山：从生产事业部调整到安全保障部
 */

const fs = require('fs');
const path = require('path');

function adjustDepartments() {
  try {
    // 读取现有的联系人数据
    const contactsPath = path.join(__dirname, '../public/contacts.json');
    const contactsData = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));
    
    console.log('正在调整联系人部门信息...');
    console.log(`当前联系人数量: ${contactsData.contacts.length}`);
    
    // 备份原文件
    const backupPath = path.join(__dirname, '../public/contacts.backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(contactsData, null, 2));
    console.log(`原文件已备份到: ${backupPath}`);
    
    // 找到需要调整的联系人
    const zhouJunIndex = contactsData.contacts.findIndex(contact => contact.姓名 === '周军');
    const leTianIndex = contactsData.contacts.findIndex(contact => contact.姓名 === '乐天');
    const shiSenShanIndex = contactsData.contacts.findIndex(contact => contact.姓名 === '施森山');
    
    if (zhouJunIndex === -1 || leTianIndex === -1 || shiSenShanIndex === -1) {
      throw new Error('未找到需要调整的联系人');
    }
    
    console.log('找到需要调整的联系人:');
    console.log(`  周军 (索引: ${zhouJunIndex}): ${contactsData.contacts[zhouJunIndex].部门} -> 安全保障部`);
    console.log(`  乐天 (索引: ${leTianIndex}): ${contactsData.contacts[leTianIndex].部门} -> 市场拓展部`);
    console.log(`  施森山 (索引: ${shiSenShanIndex}): ${contactsData.contacts[shiSenShanIndex].部门} -> 安全保障部`);
    
    // 获取部门ID
    const marketDeptId = 'dept_2u6k'; // 市场拓展部ID
    const safetyDeptId = 'dept_30b6'; // 安全保障部ID
    
    // 保存需要调整的联系人信息
    const zhouJun = { ...contactsData.contacts[zhouJunIndex] };
    const leTian = { ...contactsData.contacts[leTianIndex] };
    const shiSenShan = { ...contactsData.contacts[shiSenShanIndex] };
    
    // 更新部门信息
    zhouJun.部门 = '安全保障部';
    zhouJun.部门ID = safetyDeptId;
    
    leTian.部门 = '市场拓展部';
    leTian.部门ID = marketDeptId;
    
    shiSenShan.部门 = '安全保障部';
    shiSenShan.部门ID = safetyDeptId;
    
    // 从原位置移除这些联系人
    const updatedContacts = contactsData.contacts.filter((contact, index) => 
      index !== zhouJunIndex && index !== leTianIndex && index !== shiSenShanIndex
    );
    
    // 找到安全保障部的位置，插入周军到第二位，施森山到最后
    const safetyDeptStartIndex = updatedContacts.findIndex(contact => contact.部门 === '安全保障部');
    if (safetyDeptStartIndex !== -1) {
      // 周军插入到安全保障部第二位（樊文清之后）
      updatedContacts.splice(safetyDeptStartIndex + 1, 0, zhouJun);
      
      // 重新找到安全保障部的结束位置，插入施森山
      let safetyDeptEndIndex = safetyDeptStartIndex + 1;
      while (safetyDeptEndIndex < updatedContacts.length && updatedContacts[safetyDeptEndIndex].部门 === '安全保障部') {
        safetyDeptEndIndex++;
      }
      updatedContacts.splice(safetyDeptEndIndex, 0, shiSenShan);
    } else {
      // 如果没找到安全保障部，添加到最后
      updatedContacts.push(zhouJun, shiSenShan);
    }
    
    // 找到市场拓展部的结束位置，插入乐天到最后
    const marketDeptStartIndex = updatedContacts.findIndex(contact => contact.部门 === '市场拓展部');
    if (marketDeptStartIndex !== -1) {
      let marketDeptEndIndex = marketDeptStartIndex;
      while (marketDeptEndIndex < updatedContacts.length && updatedContacts[marketDeptEndIndex].部门 === '市场拓展部') {
        marketDeptEndIndex++;
      }
      updatedContacts.splice(marketDeptEndIndex, 0, leTian);
    } else {
      // 如果没找到市场拓展部，添加到最后
      updatedContacts.push(leTian);
    }
    
    // 更新数据结构
    const updatedData = {
      ...contactsData,
      contacts: updatedContacts
    };
    
    // 写入更新后的数据
    fs.writeFileSync(contactsPath, JSON.stringify(updatedData, null, 2));
    console.log('已成功调整联系人部门信息');
    
    // 显示调整后的统计信息
    console.log('\n调整后的部门统计:');
    const departmentStats = {};
    updatedContacts.forEach(contact => {
      const dept = contact.部门;
      if (!departmentStats[dept]) {
        departmentStats[dept] = 0;
      }
      departmentStats[dept]++;
    });
    
    Object.entries(departmentStats).forEach(([dept, count]) => {
      console.log(`  ${dept}: ${count}人`);
    });
    
    // 验证调整结果
    console.log('\n验证调整结果:');
    const newZhouJunIndex = updatedContacts.findIndex(contact => contact.姓名 === '周军');
    const newLeTianIndex = updatedContacts.findIndex(contact => contact.姓名 === '乐天');
    const newShiSenShanIndex = updatedContacts.findIndex(contact => contact.姓名 === '施森山');
    
    console.log(`  周军现在在: ${updatedContacts[newZhouJunIndex].部门} (位置: ${newZhouJunIndex + 1})`);
    console.log(`  乐天现在在: ${updatedContacts[newLeTianIndex].部门} (位置: ${newLeTianIndex + 1})`);
    console.log(`  施森山现在在: ${updatedContacts[newShiSenShanIndex].部门} (位置: ${newShiSenShanIndex + 1})`);
    
  } catch (error) {
    console.error('处理过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  adjustDepartments();
}

module.exports = { adjustDepartments }; 