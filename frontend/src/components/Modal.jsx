import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import classNames from 'classnames';

const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all scale-100">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
