import React, { useState, useEffect } from 'react';
import './App.css';

// 新增部门接口定义
interface Department {
  id: string;
  name: string;
  description?: string;
}

interface Contact {
  id: string;
  部门: string;
  部门ID: string; // 新增部门ID字段
  姓名: string;
  手机?: string;
  分机?: string;
  直线?: string;
}

interface ContactsData {
  contacts: Contact[];
  departments: string[];
  departmentList: Department[]; // 新增部门列表
  total: number;
  fields: string[];
}

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentList, setDepartmentList] = useState<Department[]>([]); // 新增部门列表状态
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('所有部门');
  const [expandedDepartments, setExpandedDepartments] = useState<Record<string, boolean>>({});
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 根据部门名称生成部门ID的辅助函数
  const generateDepartmentId = (departmentName: string): string => {
    // 使用部门名称的拼音首字母和时间戳生成唯一ID
    const timestamp = Date.now().toString(36);
    const nameHash = departmentName.split('').reduce((hash, char) => {
      return hash + char.charCodeAt(0);
    }, 0).toString(36);
    return `dept_${nameHash}_${timestamp}`;
  };

  // 从联系人数据生成部门列表的辅助函数
  const generateDepartmentList = (contacts: Contact[]): Department[] => {
    const departmentMap = new Map<string, Department>();
    
    contacts.forEach(contact => {
      if (contact.部门 && !departmentMap.has(contact.部门)) {
        departmentMap.set(contact.部门, {
          id: contact.部门ID || generateDepartmentId(contact.部门),
          name: contact.部门,
          description: `${contact.部门}部门`
        });
      }
    });
    
    return Array.from(departmentMap.values());
  };

  useEffect(() => {
    // 修复数据获取路径，确保在不同环境下都能正确加载
    // 获取当前应用的基础路径
    const basePath = process.env.PUBLIC_URL || '';
    const dataPath = `${basePath}/contacts.json`;
    
    console.log('正在加载通讯录数据，路径:', dataPath);
    
    fetch(dataPath)
      .then(response => {
        console.log('响应状态:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: ContactsData) => {
        console.log('成功加载通讯录数据:', data);
        if (!data.contacts || !Array.isArray(data.contacts)) {
          throw new Error('数据格式错误：contacts字段不存在或不是数组');
        }
        
        // 处理联系人数据，确保每个联系人都有部门ID
        const processedContacts = data.contacts.map(contact => {
          if (!contact.部门ID) {
            // 如果没有部门ID，根据部门名称生成一个
            const deptId = generateDepartmentId(contact.部门);
            return { ...contact, 部门ID: deptId };
          }
          return contact;
        });
        
        setContacts(processedContacts);
        setDepartments(data.departments || []);
        
        // 处理部门列表数据
        if (data.departmentList && Array.isArray(data.departmentList)) {
          setDepartmentList(data.departmentList);
        } else {
          // 如果没有部门列表，从联系人数据中生成
          const generatedDepartments = generateDepartmentList(processedContacts);
          setDepartmentList(generatedDepartments);
        }
        
        // 初始化所有部门为展开状态
        const expanded: Record<string, boolean> = {};
        (data.departments || []).forEach(dept => {
          expanded[dept] = true;
        });
        setExpandedDepartments(expanded);
        
        setError(null);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('加载通讯录数据失败:', error);
        setError(`加载数据失败: ${error.message}`);
        setIsLoading(false);
      });
  }, []);

  // 过滤联系人
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      searchTerm === '' || 
      (contact.姓名 && contact.姓名.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.部门 && contact.部门.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.手机 && contact.手机.includes(searchTerm)) ||
      (contact.直线 && contact.直线.includes(searchTerm)) ||
      (contact.分机 && contact.分机.includes(searchTerm));
    
    const matchesDepartment = 
      selectedDepartment === '所有部门' || 
      contact.部门 === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // 按部门分组联系人
  const groupedContacts: Record<string, Contact[]> = {};
  
  filteredContacts.forEach(contact => {
    const dept = contact.部门 || '未分类';
    if (!groupedContacts[dept]) {
      groupedContacts[dept] = [];
    }
    groupedContacts[dept].push(contact);
  });

  // 切换部门展开/折叠状态
  const toggleDepartment = (dept: string) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [dept]: !prev[dept]
    }));
  };

  // 显示联系人详情
  const showContactDetails = (contact: Contact) => {
    setSelectedContact(contact);
  };

  // 关闭联系人详情
  const closeContactDetails = () => {
    setSelectedContact(null);
  };

  // 计算每个部门的联系人数量
  const getDepartmentCount = (dept: string) => {
    return groupedContacts[dept]?.length || 0;
  };
  
  return (
    <div className="app">
      <header className="header">
        <h1 className="company-name">上海新金桥能源科技有限公司</h1>
        <h2 className="app-title">通讯录</h2>
      </header>

      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索姓名、部门、电话..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
          <span className="search-icon">🔍</span>
        </div>
        
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="department-select"
        >
          <option value="所有部门">所有部门</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="loading">
          <div>正在加载通讯录数据...</div>
          <div style={{fontSize: '14px', marginTop: '10px', opacity: 0.7}}>
            请稍候，正在从服务器获取最新数据
          </div>
        </div>
      ) : error ? (
        <div className="error-message">
          <div>❌ {error}</div>
          <div style={{fontSize: '14px', marginTop: '10px'}}>
            请检查网络连接或联系管理员
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{marginTop: '15px', padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#4285f4', color: 'white', cursor: 'pointer'}}
          >
            重新加载
          </button>
        </div>
      ) : (
        <div className="contacts-container">
          {/* 添加数据统计信息 */}
          <div className="data-stats">
            <span>共 {filteredContacts.length} 位联系人</span>
            {searchTerm && <span>（搜索："{searchTerm}"）</span>}
            {selectedDepartment !== '所有部门' && <span>（部门：{selectedDepartment}）</span>}
          </div>
          
          {Object.keys(groupedContacts).length === 0 ? (
            <div className="no-results">
              <div>😔 未找到匹配的联系人</div>
              <div style={{fontSize: '14px', marginTop: '10px', opacity: 0.7}}>
                请尝试调整搜索条件或选择其他部门
              </div>
            </div>
          ) : (
            departments.map(dept => (
              groupedContacts[dept] && (
                <div key={dept} className="department-section">
                  <div 
                    className="department-header" 
                    onClick={() => toggleDepartment(dept)}
                  >
                    <h3>{dept}</h3>
                    <div className="department-header-right">
                      <span className="contact-count">{getDepartmentCount(dept)}人</span>
                      <span className={`expand-icon ${expandedDepartments[dept] ? 'expanded' : ''}`}>▼</span>
                    </div>
                  </div>
                  
                  {expandedDepartments[dept] && (
                    <div className="contact-list">
                      {groupedContacts[dept].map(contact => (
                        <div 
                          key={contact.id} 
                          className="contact-item"
                          onClick={() => showContactDetails(contact)}
                        >
                          <div className="contact-name">{contact.姓名}</div>
                          {contact.手机 && (
                            <a 
                              href={`tel:${contact.手机}`} 
                              className="contact-phone" 
                              onClick={(e) => e.stopPropagation()}
                            >
                              {contact.手机}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            ))
          )}
        </div>
      )}

      {selectedContact && (
        <div className="contact-details-overlay" onClick={closeContactDetails}>
          <div className="contact-details" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeContactDetails}>×</button>
            <h3 className="detail-name">{selectedContact.姓名}</h3>
            <p className="detail-department">{selectedContact.部门}</p>
            <p className="detail-department-id">部门ID: {selectedContact.部门ID}</p>
            
            <div className="contact-info">
              {selectedContact.手机 && (
                <a href={`tel:${selectedContact.手机}`} className="contact-action">
                  <div className="action-label">手机</div>
                  <div className="action-value">{selectedContact.手机}</div>
                </a>
              )}
              
              {selectedContact.直线 && (
                <a href={`tel:${selectedContact.直线}`} className="contact-action">
                  <div className="action-label">直线</div>
                  <div className="action-value">{selectedContact.直线}</div>
                </a>
              )}
              
              {selectedContact.分机 && (
                <div className="contact-action">
                  <div className="action-label">分机</div>
                  <div className="action-value">{selectedContact.分机}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div 
        className="made-by-jin" 
        onClick={() => window.open('https://github.com/yourusername', '_blank')}
      >
        Made By Jin
      </div>

      {/* 新增底部静态备注 */}
      <footer className="footer-remark">Made By Jin</footer>
    </div>
  );
}

export default App;
