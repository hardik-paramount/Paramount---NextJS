// components/Footer.js
import Link from 'next/link';
import '../styles/globals.css'; // if you're using CSS Modules, rename to Footer.module.css

export default function Footer() {
  return (
    <footer className="site-footer" style={{background: '#000', color: '#fff'}}>
      <div className="footer-logo">Paramount</div>

      {/* <nav className="footer-menu">
        <p>Assign Footer Menu</p>
      </nav> */}

      <div className="footer-content">
        © {new Date().getFullYear()} Paramount Software Solutions | Powered By{' '}
        <a href="https://paramountsoft.net/" target="_blank" rel="noopener noreferrer">
          Paramount
        </a></div>
    </footer>
  );
}
