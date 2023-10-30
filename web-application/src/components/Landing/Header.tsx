import { RiUserFill, RiUserAddFill } from 'react-icons/ri'
import { BiUserCircle} from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { useUserEntry } from '../../contexts/UserEntryContext'

function Header() {

    const { user } = useUser();
    const { showSignIn, showSignUp } = useUserEntry();

    return (
        <div className="bg-primary-color fixed top-0 w-full h-12 z-50">
            <div className="container mx-auto h-11 flex items-center w-full justify-between p-3 pt-[1rem]">
                
                {/*     LOGO     */}
                <Link to="/">
                    <img src="/header_logo.svg" alt="Header Logo"/>
                </Link>

                <nav className="flex gap-x-8 text-sm font-semibold">
                {user ? 
                    ( // User is logged in, show user ID
                    <div className="flex items-center gap-x-2 text-white transition-all text-opacity-80 hover:text-opacity-100">
                        <BiUserCircle size={20} />
                        <span>{user.id}</span>
                    </div>
                    ) 
                    : 
                    ( // User is not logged in, show sign in and sign up links
                    <>
                    <button onClick={showSignIn} className="flex items-center gap-x-2 text-white transition-all text-opacity-80 hover:text-opacity-100">
                        <RiUserFill size={20} />
                        Sign In
                    </button>
                    <button onClick={showSignUp} className="flex items-center gap-x-2 text-white transition-all text-opacity-80 hover:text-opacity-100">
                        <RiUserAddFill size={20} />
                        Sign Up
                    </button>
                    </>
                    )
                }
                </nav>

            </div>
        </div>
    )
}

export default Header;