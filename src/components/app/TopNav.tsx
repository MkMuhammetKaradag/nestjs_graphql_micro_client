import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  AiOutlineSearch,
  AiOutlineFileSearch,
  AiOutlineUpload,
} from 'react-icons/ai';
import { BsThreeDotsVertical, BsBasket2Fill } from 'react-icons/bs';
import { BiMessageDetail } from 'react-icons/bi';
import { GrLogout } from 'react-icons/gr';
import { BsFillPersonFill } from 'react-icons/bs';

import { useMutation } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { LOGOUT_USER } from '../../graphql/mutations/Logout';
import { useAppDispatch, useAppSelector } from '../../context/hooks';
import { setIsAuth, setUser } from '../../context/slices/AuthSlice';
import { setSearchText } from '../../context/slices/AppSlice';
import { RootState } from '@reduxjs/toolkit/query';
import { SET_USER_ONLINE_STATUS } from '../../graphql/mutations/SetUserOnlineStatus';
function TopNav() {
  const [logoutUser] = useMutation(LOGOUT_USER);
  const [setUserOnlineStatus] = useMutation(SET_USER_ONLINE_STATUS);
  const [searchInput, setSearchInput] = useState('');
  const user = useAppSelector((s) => s.auth.user);
  const items = useAppSelector((state) => state.shoppingCart.items);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const getURL = () => {
    // Implement a function to get the current URL
    // You might use window.location.pathname in a browser environment
    return window.location.pathname;
  };

  const handleLogout = async () => {
    try {
      await setUserOnlineStatus({ variables: { input: { isOnline: false } } });
      await logoutUser();
      dispatch(setIsAuth(false));
      dispatch(setUser(null));
      setShowMenu(false);
    } catch (err) {
      console.log(err);
    }
  };
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="bg-white fixed z-30 flex items-center w-full top-0 left-0  border-b h-[61px]">
      <div
        className={[
          getURL() === '/auth' ? 'max-w-[1150px]' : '',
          'flex items-center justify-between w-full px-6 mx-auto',
        ].join(' ')}
      >
        <div
          className={getURL() === '/auth' ? 'w-[80%]' : 'lg:w-[20%] w-[70%]'}
        >
          <Link to="/">
            <img
              src={
                'https://cdn.prod.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e3a57bdb3717fbf9cec_Product_Default.svg'
              }
              width={getURL() !== '/auth' ? '130' : '50'}
              // height={getURL() == '/' ? '20' : '50'}
              alt="logo"
            />
          </Link>
        </div>
        <div className="hidden md:flex items-center bg-[#F1F1F1] p-1 rounded-full max-w-[380px] w-full">
          <input
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-3 my-2 bg-transparent placeholder-[#838383] text-[15px] focus:outline-none"
            placeholder="Search accounts"
          />
          <div
            className="px-3 py-1 flex items-center border-l border-l-gray-3 cursor-pointer"
            onClick={() => {
              // if (searchInput.length > 2) {
              dispatch(setSearchText(searchInput));
              // }
            }}
          >
            <AiOutlineSearch size="20" color="#838383" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 min-w-[275px] max-w-[320px] w-full">
          {user && user.roles.includes('admin') ? (
            <Link
              to="/create-product"
              className="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray-100"
            >
              <AiOutlineUpload size="20" color="#161724" />
              <span className="px-2 font-medium text-[15px] text-[#161724]">
                Create
              </span>
            </Link>
          ) : (
            <Link
              to="/"
              className="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray-100"
            >
              <AiOutlineFileSearch size="20" color="#161724" />
              <span className="px-2 font-medium text-[15px] text-[#161724]">
                Feed
              </span>
            </Link>
          )}
          {!user && (
            <div className="flex items-center">
              <button
                onClick={() => dispatch(setIsAuth(true))}
                className="flex items-center bg-[#F02C56] text-white border rounded-md px-3 py-[6px] min-w-[110px]"
              >
                <span className="mx-4 font-medium text-[15px]">Log In</span>
              </button>
              <BsThreeDotsVertical size="25" color="#161724" />
            </div>
          )}
          {user && (
            <div className="flex items-center">
              <Link
                to={'/basket/'}
                className="flex relative  flex-col px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => console.log('basket')}
              >
                <BsBasket2Fill
                  size="25"
                  // color="#161724"
                  className="cursor-pointer"
                />

                <div className="absolute top-2 right-3 inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {items.length}
                </div>
              </Link>
              <Link
                to={'/chats/'}
                className="flex relative  flex-col px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => console.log('chat')}
              >
                <BiMessageDetail size="25" color="#161724" />
              </Link>

              <div className="relative">
                <button className="mt-1" onClick={() => setShowMenu(!showMenu)}>
                  {user.profilPhoto ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.profilPhoto}
                    />
                  ) : (
                    <div className="rounded-full flex min-h-9 min-w-9 items-center justify-center bg-gray-200">
                      <span className="text-gray-500">N</span>
                    </div>
                  )}
                </button>
                {showMenu && (
                  <div
                    id="PopupMenu"
                    className="absolute bg-white rounded-lg py-1.5 w-[200px] shadow-xl border top-[43px] -right-2"
                  >
                    <Link
                      onClick={() => setShowMenu(!showMenu)}
                      to={'/profile/'}
                      className="flex flex-col px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {' '}
                      <BsFillPersonFill size="20" color="#161724" />
                      <span className="font-semibold text-sm">Profile</span>
                    </Link>
                    {user && (
                      <div
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <GrLogout size="20" color="#161724" />
                        <span className=" font-semibold text-sm">Log out</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopNav;
