import React from 'react'
import ShoppingHeader from './ShoppingHeader';
import { Outlet } from 'react-router-dom';

const ShoppingLayout = () => {
    return (
        <div className="flex flex-col bg-white">
          {/* common header */}
          <ShoppingHeader />
          <main className="flex flex-col w-full ">
            <Outlet />
          </main>
        </div>
      );
}

export default ShoppingLayout