import React, { useState } from 'react';
import './DepartmentManager.css';

interface Department {
  id: string;
  name: string;
  description?: string;
}

interface Contact {
  id: string;
  部门: string;
  部门ID: string;
  姓名: string;
  手机?: string;
  分机?: string;
  直线?: string;
}

interface DepartmentManagerProps {
  departments: Department[];
  contacts: Contact[];
  onClose: () => void;
}

const DepartmentManager: React.FC<DepartmentManagerProps> = ({
  departments,
  contacts,
  onClose
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // 计算每个部门的联系人数量
  const getDepartmentContactCount = (departmentId: string): number => {
    return contacts.filter(contact => contact.部门ID === departmentId).length;
  };

  // 获取部门的联系人列表
  const getDepartmentContacts = (departmentId: string): Contact[] => {
    return contacts.filter(contact => contact.部门ID === departmentId);
  };

  return (
    <div className="department-manager-overlay" onClick={onClose}>
      <div className="department-manager" onClick={(e) => e.stopPropagation()}>
        <div className="department-manager-header">
          <h2>部门管理</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="department-manager-content">
          <div className="department-list-panel">
            <h3>部门列表 ({departments.length}个部门)</h3>
            <div className="department-list">
              {departments.map(dept => (
                <div 
                  key={dept.id} 
                  className={`department-item ${selectedDepartment?.id === dept.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <div className="department-info">
                    <div className="department-name">{dept.name}</div>
                    <div className="department-id">ID: {dept.id}</div>
                    <div className="department-count">
                      {getDepartmentContactCount(dept.id)}人
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="department-details-panel">
            {selectedDepartment ? (
              <div className="department-details">
                <h3>部门详情</h3>
                <div className="detail-section">
                  <div className="detail-item">
                    <label>部门名称:</label>
                    <span>{selectedDepartment.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>部门ID:</label>
                    <span className="department-id-display">{selectedDepartment.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>部门描述:</label>
                    <span>{selectedDepartment.description || '暂无描述'}</span>
                  </div>
                  <div className="detail-item">
                    <label>联系人数量:</label>
                    <span>{getDepartmentContactCount(selectedDepartment.id)}人</span>
                  </div>
                </div>

                <div className="department-contacts">
                  <h4>部门联系人</h4>
                  <div className="contacts-list">
                    {getDepartmentContacts(selectedDepartment.id).map(contact => (
                      <div key={contact.id} className="contact-item">
                        <div className="contact-name">{contact.姓名}</div>
                        {contact.手机 && (
                          <div className="contact-phone">{contact.手机}</div>
                        )}
                        {contact.分机 && (
                          <div className="contact-extension">分机: {contact.分机}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <div className="no-selection-icon">📋</div>
                <div className="no-selection-text">请选择一个部门查看详情</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManager; 