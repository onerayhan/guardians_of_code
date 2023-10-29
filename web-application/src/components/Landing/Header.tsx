import { RiUserFill, RiUserAddFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'

function Header() {
    return (
        <div className="bg-primary-color fixed top-0 w-full z-50">
            <div className="container mx-auto h-11 flex items-center w-full justify-between p-3 pt-[1rem]">
                
                {/*     LOGO     */}
                <Link to="/">
                    <img src="/header_logo.svg" alt="Header Logo"/>
                </Link>

                <nav className="flex gap-x-8 text-sm font-semibold">
                    <Link to="/signin" className="flex items-center gap-x-2 text-white transition-all text-opacity-80 hover:text-opacity-100">
                        <RiUserFill size={20} />
                        Sign In
                    </Link>
                    <Link to="/signup" className="flex items-center gap-x-2 text-white transition-all text-opacity-80 hover:text-opacity-100">
                        <RiUserAddFill size={20} />
                        Sign Up
                    </Link>
                </nav>

            </div>
        </div>
    )
}

export default Header;