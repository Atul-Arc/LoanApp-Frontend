import { FaGithub } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2025 Atul Kharecha.</p>
      <a
        href="https://github.com/Atul-Arc"
        target="_blank"
        rel="noopener noreferrer"
        className="footer__link"
      >
        <FaGithub />
        <span>GitHub</span>
      </a>
    </footer>
  );
}
