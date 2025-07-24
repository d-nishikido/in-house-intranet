import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronDown, FaChevronRight, FaBuilding, FaClipboardList, FaMapMarkerAlt, FaUsersCog, FaFileAlt, FaDesktop, FaNetworkWired } from 'react-icons/fa';
import './Menu.css';

const iconMap = {
  building: FaBuilding,
  'clipboard-list': FaClipboardList,
  'map-marker-alt': FaMapMarkerAlt,
  'users-cog': FaUsersCog,
  'file-alt': FaFileAlt,
  desktop: FaDesktop,
  'network-wired': FaNetworkWired
};

const Menu = ({ isOpen, onClose }) => {
  const [menuData, setMenuData] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/menu', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch menu');
      
      const data = await response.json();
      if (data.success) {
        setMenuData(data.data);
        // Auto-expand categories based on current path
        const expanded = {};
        data.data.forEach(category => {
          if (category.items.some(item => location.pathname.startsWith(item.path))) {
            expanded[category.id] = true;
          }
        });
        setExpandedCategories(expanded);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const isItemActive = (path) => {
    return location.pathname === path;
  };

  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || FaFileAlt;
    return <IconComponent className="menu-icon" />;
  };

  if (loading) {
    return (
      <div className={`menu-container ${isOpen ? 'open' : ''}`}>
        <div className="menu-loading">読み込み中...</div>
      </div>
    );
  }

  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`menu-container ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2>メニュー</h2>
          <button className="menu-close" onClick={onClose}>×</button>
        </div>
        
        <nav className="menu-nav">
          {menuData.map(category => (
            <div key={category.id} className="menu-category">
              <button
                className="menu-category-header"
                onClick={() => toggleCategory(category.id)}
              >
                {renderIcon(category.icon)}
                <span className="menu-category-title">{category.title}</span>
                <span className="menu-chevron">
                  {expandedCategories[category.id] ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              </button>
              
              {expandedCategories[category.id] && (
                <div className="menu-items">
                  {category.items.map(item => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`menu-item ${isItemActive(item.path) ? 'active' : ''}`}
                      onClick={onClose}
                      title={item.description}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Menu;