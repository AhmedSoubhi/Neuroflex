import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './navmenu.scss';

function NavMenu() {
  const [selectedItem, setSelectedItem] = useState('home'); // Default to 'home'
  const navigate = useNavigate();

  const handleNavigation = (itemId, path) => {
    setSelectedItem(itemId);
    navigate(path);
  };

  const getMarginLeft = () => {
    switch (selectedItem) {
      case 'home':
        return '0%';
      case 'main':
        return '25%';
      case 'dashboard':
        return '50%';
      case 'search-patients':
        return '75%';
      default:
        return '0%';
    }
  };

  return (
    <nav className="slidemenu">
      <input
        type="radio"
        name="slideItem"
        id="slide-item-1"
        className="slide-toggle"
        checked={selectedItem === 'home'}
        onChange={() => handleNavigation('home', '/home')}
      />
      <label htmlFor="slide-item-1" onClick={() => handleNavigation('home', '/home')}>
        <p className="icon">♬</p>
        <span>Feedback</span>
      </label>

      <input
        type="radio"
        name="slideItem"
        id="slide-item-2"
        className="slide-toggle"
        checked={selectedItem === 'main'}
        onChange={() => handleNavigation('main', '/')}
      />
      <label htmlFor="slide-item-2" onClick={() => handleNavigation('main', '/')}>
        <p className="icon">★</p>
        <span>Home Page</span>
      </label>

      <input
        type="radio"
        name="slideItem"
        id="slide-item-3"
        className="slide-toggle"
        checked={selectedItem === 'dashboard'}
        onChange={() => handleNavigation('dashboard', '/dashboard')}
      />
      <label htmlFor="slide-item-3" onClick={() => handleNavigation('dashboard', '/dashboard')}>
        <p className="icon">★</p>
        <span>Dashboard</span>
      </label>

      <input
        type="radio"
        name="slideItem"
        id="slide-item-4"
        className="slide-toggle"
        checked={selectedItem === 'search-patients'}
        onChange={() => handleNavigation('search-patients', '/search-patients')}
      />
      <label htmlFor="slide-item-4" onClick={() => handleNavigation('search-patients', '/search-patients')}>
        <p className="icon">🔍</p>
        <span>Search Patients</span>
      </label>

      <div className="clear"></div>

      <div className="slider">
        <div className="bar" style={{ marginLeft: getMarginLeft() }}></div>
      </div>
    </nav>
  );
}

export default NavMenu;
