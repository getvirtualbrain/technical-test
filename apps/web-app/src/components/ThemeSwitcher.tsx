import React from 'react';
import { IoIosSunny } from "react-icons/io";
import { IoIosMoon } from "react-icons/io";

import { useTheme } from './ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="max-w-fit">
      <div className='flex items-center'>{theme === 'light' ? <IoIosMoon/> : <IoIosSunny/>} {theme === 'light' ? 'dm' : 'lm'}</div>
    </button>
  );
};

export default ThemeSwitcher;
