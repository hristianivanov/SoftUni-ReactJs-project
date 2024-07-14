import React from 'react'
import styles from './Logo.module.css';

function Logo() {
  return (
    <div className='flex items-end justify-center font-sans'>
      <p className='text-[#001858] text-[36px] font-semibold'> 
        Dasteen
        <span className='text-blue text-[18px] font-bold'>.Blog</span></p>
    </div>
  )
}

export default Logo
