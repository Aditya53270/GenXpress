import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import imagingo1 from '../assets/imagingo1.jpg'

const Navbar = () => {
  const { user,  token, setShowLogin ,logout,credit} = useContext(AppContext) || {}

  return (
    <nav className='flex items-center justify-between py-4'>
      <Link to='/' className='flex items-center gap-2'>
         <img src={imagingo1} alt='Imagingo' className='w-10 h-10 object-cover rounded-full' />
      </Link>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow'>
          <img src={assets.credit_star} alt='credit' className='w-5 h-5' />
          <p className='text-sm'>credit left: {credit}</p>
        </div>

        {!token ? (
          <button
            type='button'
            onClick={() => setShowLogin?.(true)}
            className='px-4 py-1 rounded-full bg-black text-white text-sm'
          >
            Login
          </button>
        ) : (
          <div className='flex items-center gap-2'>
            <p className='text-sm'>hi,{user?.name || 'User'}</p>
            <div className='relative group'>
            <img src={assets.profile_icon} alt='profile' className='w-8 h-8 drop-shadow rounded-full' />
            <div className='absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block'>
              <ul className='py-2'>
                <li  className='px-4 py-2 hover:bg-gray-100'>
                  <button onClick={logout} className='w-full text-left'>Logout</button>
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
