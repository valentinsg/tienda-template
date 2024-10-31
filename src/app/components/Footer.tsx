import { FaFacebook, FaInstagram, FaGithub, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto text-center space-y-4">
        
        {/* Enlaces de navegación */}
        <div className="flex justify-center space-x-6 text-sm">
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Blog</a>
          <a href="#" className="hover:text-white">Jobs</a>
          <a href="#" className="hover:text-white">Press</a>
          <a href="#" className="hover:text-white">Accessibility</a>
          <a href="#" className="hover:text-white">Partners</a>
        </div>
        
        {/* Iconos de redes sociales */}
        <div className="flex justify-center space-x-6 text-2xl">
          <a href="#" className="hover:text-white">
            <FaFacebook />
          </a>
          <a href="#" className="hover:text-white">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-white">
            <FaGithub />
          </a>
          <a href="#" className="hover:text-white">
            <FaYoutube />
          </a>
        </div>

        {/* Derechos reservados */}
        <p className="text-sm">&copy; 2024 Your Company, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
