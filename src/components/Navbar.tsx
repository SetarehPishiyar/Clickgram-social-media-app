import { Link } from "react-router";
import { MenuLinks } from "../constants";
import { useState } from "react";
import { CloseIcon, GithubIcon, MenuIcon } from "../constants/icons";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGithub, signOut, user } = useAuth();
  const displayName = user?.user_metadata.user_name || user?.email;
  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to={"/"}
            className="font-mono text-xl font-bold text-white tracking-wide"
          >
            Click
            <span className="text-gradient ">Gram</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {MenuLinks.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="toggle menu"
              className="text-gray-400"
            >
              {menuOpen ? (
                <CloseIcon size={30} color="#d2d4d2" />
              ) : (
                <MenuIcon color="#d2d4d2" />
              )}
            </button>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                {user.user_metadata.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-400">{displayName}</span>
                <button
                  onClick={signOut}
                  className="button py-1.5! rounded-2xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGithub}
                className="button flex! gap-2 items-center rounded-2xl py-1.5!"
              >
                <GithubIcon /> Sign In With Github
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
              <div className="px-2 pt-2 pb-3 flex flex-col gap-2 ">
                {MenuLinks.map((item) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
