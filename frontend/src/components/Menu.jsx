import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChevronDown, 
  FaChevronRight, 
  FaBuilding, 
  FaClipboardList, 
  FaMapMarkerAlt, 
  FaUsersCog, 
  FaFileAlt, 
  FaDesktop, 
  FaNetworkWired,
  FaTimes,
  FaSearch,
  FaHome
} from 'react-icons/fa';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenuData, setFilteredMenuData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = menuData.map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.items.length > 0);
      setFilteredMenuData(filtered);
      
      // Auto-expand all categories when searching
      const expanded = {};
      filtered.forEach(category => {
        expanded[category.id] = true;
      });
      setExpandedCategories(expanded);
    } else {
      setFilteredMenuData(menuData);
    }
  }, [searchTerm, menuData]);

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
        setFilteredMenuData(data.data);
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
      <div className={`menu-overlay ${isOpen ? 'open' : ''} backdrop-blur-sm`} onClick={onClose}>
        <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-smooth ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="spinner w-8 h-8 mx-auto mb-4"></div>
              <p className="text-gray-600">メニューを読み込み中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`menu-overlay ${isOpen ? 'open' : ''} backdrop-blur-sm`} onClick={onClose}>
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-smooth ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col scrollbar-thin`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FaHome className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">メニュー</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus-visible"
            aria-label="メニューを閉じる"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="メニューを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full pl-10 pr-4 py-2 text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-sm" />
              </button>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredMenuData.length === 0 && searchTerm ? (
            <div className="text-center py-8">
              <FaSearch className="text-gray-300 text-3xl mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                「{searchTerm}」に一致するメニューが見つかりません
              </p>
            </div>
          ) : (
            filteredMenuData.map(category => (
              <div key={category.id} className="animate-fade-in">
                <button
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                    expandedCategories[category.id] 
                      ? 'bg-primary-50 text-primary-700 shadow-sm' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                      expandedCategories[category.id]
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }`}>
                      {renderIcon(category.icon)}
                    </div>
                    <span className="font-medium text-sm">{category.title}</span>
                  </div>
                  <div className={`transform transition-transform duration-200 ${
                    expandedCategories[category.id] ? 'rotate-90' : ''
                  }`}>
                    <FaChevronRight className="text-xs" />
                  </div>
                </button>
                
                {expandedCategories[category.id] && (
                  <div className="ml-4 mt-1 space-y-1 animate-slide-down">
                    {category.items.map(item => (
                      <Link
                        key={item.id}
                        to={item.path}
                        className={`block p-3 pl-11 rounded-lg text-sm transition-all duration-200 group ${
                          isItemActive(item.path)
                            ? 'bg-primary-100 text-primary-700 font-medium shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={onClose}
                        title={item.description}
                      >
                        <div className="flex items-center justify-between">
                          <span>{item.title}</span>
                          {isItemActive(item.path) && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full animate-scale-in"></div>
                          )}
                        </div>
                        {item.description && searchTerm && item.description.toLowerCase().includes(searchTerm.toLowerCase()) && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              社内イントラネットシステム
            </p>
            <p className="text-xs text-gray-400 mt-1">
              v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;