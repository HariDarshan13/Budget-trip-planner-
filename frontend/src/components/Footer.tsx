import { MapPin, Heart, Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-travel-cloud border-t border-primary/10" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        {/* Brand Section */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">TripPlan TN</span>
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed max-w-lg">
            Making Tamil Nadu travel planning effortless, beautiful, and budget-friendly. 
            Discover your perfect adventure with AI-powered itineraries.
          </p>

          {/* Contact Info */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>hello@tripplantn.com</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 mb-8">
            {[
              { icon: Instagram, href: '#', label: 'Instagram' },
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Facebook, href: '#', label: 'Facebook' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 bg-primary/10 hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 text-primary"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-primary/10 w-full mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 TripPlan TN. All rights reserved.
            </p>
            
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-4 md:mt-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for Tamil Nadu travelers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
