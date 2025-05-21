// 页面加载完成后执行重排部门的逻辑
document.addEventListener('DOMContentLoaded', function() {
  // 给页面一些加载时间，确保React已经完全渲染
  setTimeout(function() {
    reorderDepartments();
  }, 500);

  // 监听部门选择变化事件
  const deptSelect = document.querySelector('.department-filter');
  if (deptSelect) {
    deptSelect.addEventListener('change', function() {
      // 当选择变化时，等待React重新渲染
      setTimeout(reorderDepartments, 100);
    });
  }

  // 监听搜索框变化事件
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      // 当搜索变化时，等待React重新渲染
      setTimeout(reorderDepartments, 100);
    });
  }

  // 监听视图切换按钮点击事件
  const viewButtons = document.querySelectorAll('.view-button');
  viewButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      // 当视图切换时，等待React重新渲染
      setTimeout(reorderDepartments, 100);
    });
  });
});

// 重排部门的函数
function reorderDepartments() {
  const container = document.querySelector('.contacts-container');
  if (!container) return;

  // 定义部门的正确顺序
  const departmentsOrder = [
    "总经理室",
    "行政人事部（党办）",
    "计划采购部",
    "市场拓展部",
    "新能源事业一部",
    "新能源事业二部",
    "生产事业部",
    "安全保障部",
    "临港事业部",
    "其他"
  ];

  // 获取所有部门元素
  const departments = container.querySelectorAll('.department-section');
  if (!departments.length) return;
  
  // 创建一个映射存储部门元素
  const deptMap = {};
  departments.forEach(dept => {
    const deptName = dept.querySelector('h3').textContent;
    deptMap[deptName] = dept;
  });

  // 清空容器
  container.innerHTML = '';

  // 按照定义的顺序重新添加部门元素
  departmentsOrder.forEach(deptName => {
    if (deptMap[deptName]) {
      container.appendChild(deptMap[deptName]);
    }
  });
} 