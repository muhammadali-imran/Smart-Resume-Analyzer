import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'text-primary bg-blue-50' : 'text-muted hover:text-primary';
    };

    const linkStyle = "flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium";

    return (
        <nav className="bg-white border-b border-border sticky top-0 z-50">
            <div className="container h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Briefcase size={24} />
                    <span>SmartResume</span>
                </Link>

                <div className="flex items-center gap-2">
                    <Link
                        to="/"
                        className={`${linkStyle} ${location.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                        Browse Jobs
                    </Link>
                    <Link
                        to="/evaluate"
                        className={`${linkStyle} ${location.pathname === '/evaluate' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                        Evaluate Resume
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
