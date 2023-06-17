import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useState } from 'react';

const CustomNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <div className='navigation-wrapper'>
      <Sidebar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
      <Navbar handleMenuToggle={handleMenuToggle} />
    </div>
  );
};

export default CustomNavigation;
