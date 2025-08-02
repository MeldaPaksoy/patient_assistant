import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, Bot, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  console.log('🔍 Header render - isAuthenticated:', isAuthenticated, 'showAuthModal:', showAuthModal);

  const handleAuthClick = () => {
    console.log('🔄 Auth button clicked, isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      logout();
    } else {
      console.log('🔓 Opening auth modal');
      setShowAuthModal(true);
    }
  };

  return (
    <div>
      <header className="border-b border-border bg-background">
        <div className="flex items-center justify-between px-4 md:px-10 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 relative">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                className="w-full h-full fill-foreground"
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M8 15.2699C6.56217 15.2699 5.1566 14.8435 3.96107 14.0447C2.76556 13.2459 1.83376 12.1105 1.28352 10.7821C0.733283 9.45367 0.589313 7.99193 0.869823 6.58173C1.15033 5.1715 1.84272 3.87613 2.85943 2.85943C3.87613 1.84272 5.1715 1.15034 6.58173 0.869827C7.99193 0.589317 9.45367 0.733287 10.7821 1.28352C12.1105 1.83376 13.2459 2.76556 14.0447 3.9611C14.8435 5.1566 15.2699 6.56217 15.2699 8H8V15.2699Z" 
                />
              </svg>
            </div>
            <h1 className="text-base md:text-lg font-bold text-foreground font-lexend">Patient Assistant</h1>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-9">
          <Link to="/" className="text-sm text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/resources" className="text-sm text-foreground hover:text-primary transition-colors">
            Resources
          </Link>
          <Link to="/faq" className="text-sm text-foreground hover:text-primary transition-colors">
            FAQ
          </Link>
          <Link to="/ai-chat" className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <Bot className="w-4 h-4" />
            AI Chat
          </Link>
          <Link to="/about" className="text-sm text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        <div className="flex items-center gap-2 md:gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button variant="outline" className="rounded-xl px-3 md:px-4 h-8 md:h-10 font-bold text-xs md:text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user?.first_name ? `${user.first_name}` : 'Profile'}
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleAuthClick}
                className="rounded-xl px-3 md:px-4 h-8 md:h-10 font-bold text-xs md:text-sm flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleAuthClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-3 md:px-4 h-8 md:h-10 font-bold text-xs md:text-sm"
            >
              Get Started
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              className="text-sm text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/resources"
              className="text-sm text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              to="/faq"
              className="text-sm text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              to="/ai-chat"
              className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Bot className="w-4 h-4" />
              AI Chat
            </Link>
            <Link
              to="/about"
              className="text-sm text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>

    {/* Auth Modal */}
    {showAuthModal && (
      <>
        {console.log('🎭 Rendering AuthModal')}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    )}
  </div>
  );
}
