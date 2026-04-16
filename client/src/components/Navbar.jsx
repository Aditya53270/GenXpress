import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const { user,  token, setShowLogin ,logout,credit} = useContext(AppContext) || {}

  return (
    <nav className='flex items-center justify-between py-4'>
      <Link to='/' className='flex items-center gap-3'>
         <img src={assets.genxpressLogo} alt='GenXpress' className='w-11 h-11 object-cover rounded-full border border-zinc-300 shadow-sm' />
         <div className='leading-tight'>
          <p className='text-2xl font-extrabold tracking-tight text-zinc-900'>GenXpress</p>
          <p className='text-[11px] font-medium text-zinc-500 -mt-1'>AI Content Creation Platform</p>
         </div>
      </Link>

      <div className='flex items-center gap-4'>
        <Link to="/text-studio" className="text-sm font-medium text-purple-700 hover:text-purple-900">
          Text Studio
        </Link>
        <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-sm'>
          <img src={assets.credit_star} alt='credit' className='w-5 h-5' />
          <p className='text-sm text-zinc-700'>credit left: {credit}</p>
        </div>

        {!token ? (
          <button
            type='button'
            onClick={() => setShowLogin?.(true)}
            className='px-4 py-1 rounded-full bg-zinc-900 text-white text-sm hover:bg-zinc-800 transition'
          >
            Login
          </button>
        ) : (
          <div className='flex items-center gap-2'>
            <p className='text-sm text-zinc-700'>hi, {user?.name || 'User'}</p>
            <div className='relative group'>
            <img src={assets.profile_icon} alt='profile' className='w-8 h-8 drop-shadow rounded-full' />
            <div className='absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg hidden group-hover:block'>
              <ul className='py-2'>
                <li  className='px-4 py-2 hover:bg-zinc-100'>
                  <button onClick={logout} className='w-full text-left text-zinc-700'>Logout</button>
                </li>
              </ul>
            </div>
          </div>

          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
