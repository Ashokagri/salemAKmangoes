import { Mail, MapPin, Phone } from 'lucide-react';
import React from 'react'
import './FooterTop.css'


const ContactItemData = [
    {
        title: 'Visit Our Store',
        subtitle: 'Airport Road, Kamalapuram, Salem - 636309',
        subtitle2: 'Tamil Nadu, India',
        icon: <MapPin className="h-6 w-6" />
    },
    {
        title: 'Call Us',
        subtitle: '+91 81480 96385',
        icon: <Phone className="h-6 w-6" />
    },
    {
        title: 'Email Us',
        subtitle: 'salem.ak.mango@gmail.com',
        icon: <Mail className="h-6 w-6" />
    },
];

const FooterTop = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-transparent border-b border-white/10">
            {ContactItemData.map((item) => (
                <div key={item.title} className='flex items-start gap-4 group p-4 transition-all duration-300 hover:bg-white/5 rounded-2xl'>
                    <div className="p-3 bg-white/10 rounded-xl text-[#ffcc33] group-hover:bg-[#99cc33] group-hover:text-[#1a3c34] transition-all">
                        {item.icon}
                    </div>
                    <div>
                        <h3 className='font-bold footer-top-title text-lg mb-1 drop-shadow-sm'>
                            {item.title}
                        </h3>
                        <p className='text-white font-medium text-sm leading-relaxed opacity-90 transition-opacity group-hover:opacity-100'>
                            {item.subtitle}
                            {item.subtitle2 && <><br />{item.subtitle2}</>}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FooterTop;
