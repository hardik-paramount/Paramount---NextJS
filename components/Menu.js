'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import client from '../lib/apollo';
import { GET_MENU } from '../lib/queries/menu';
import { SEARCH_CONTENT } from '../lib/queries/search';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { FaRegMoon } from 'react-icons/fa';

function getContentPath(item) {
  switch (item.__typename) {
    case 'Post':
      return `/blog/${item.slug}`;
    case 'Page':
      return `/${item.slug}`;
    case 'Student':
      return `/students/${item.slug}`;
    default:
      return `/${item.slug}`;
  }
}


export default function Menu() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    client.query({ query: GET_MENU })
      .then(res => setItems(res?.data?.menu?.menuItems?.nodes || []))
      .catch(err => console.error('Menu fetch failed:', err));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.length > 2) {
        client.query({
          query: SEARCH_CONTENT,
          variables: { query: searchTerm },
        }).then(res => {
          setResults(res.data.contentNodes.nodes);
          setShowResults(true);
        });
      } else {
        setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      const now = new Intl.DateTimeFormat('en-IN', options).format(new Date());
      setCurrentTime(now);
    };

    updateTime(); // initial call
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Topbar with date and live time */}
      <div className="topbar">
        {currentTime}
      </div>
      <header className="menu-header">
        <div className="left-section">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <FiMenu size={24} />
          </button>
          <Link href="/">
            <img
              src="https://paramountsoft.net/wp-content/uploads/2023/03/logo.svg"
              alt="Logo"
              className="logo"
              width={100}
              height={100}
            />
          </Link>
        </div>

        <nav className={`menu-nav ${menuOpen ? 'active' : ''}`}>
          <ul className="menu-list">
            {items.map(item => (
              <li key={`${item.id}-${item.uri}`} className="menu-item">
                <Link href={item.uri} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search site content"
          />
          {showResults && results.length > 0 && (
            <ul className="search-results" role="listbox">
              {results.map((item) => (
                <li key={`${item.__typename}-${item.id}`} className="search-result-item">
                  <Link href={getContentPath(item)}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>


        <div className="right-icons">
          {/* <FiSearch size={20} /> */}
          <div className="icon-circle">
            <FaRegMoon size={16} />
          </div>
        </div>

        <style jsx>{`
        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          border-bottom: 1px solid #eee;
          background: white;
          position: relative;
          flex-wrap: wrap;
        }
        .left-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .hamburger {
          background: none;
          border: none;
          display: none;
          cursor: pointer;
        }
        .logo {
          height: 40px;
          width: auto;
        }
        .menu-nav {
          display: flex;
          flex-grow: 1;
          justify-content: center;
        }
        .menu-nav ul {
          display: flex;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .menu-nav a {
          text-decoration: none;
          font-weight: 500;
        }
        .search-wrapper {
          position: relative;
          margin-right: 1rem;
        }
        input[type="text"] {
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #ccc;
          width: 100%;
          z-index: 100;
          max-height: 200px;
          overflow-y: auto;
        }
        .search-results li {
          padding: 0.5rem;
          cursor: pointer;
        }
        .search-results li:hover {
          background: #f0f0f0;
        }
        .right-icons {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .icon-circle {
          background: #f3f3f3;
          border-radius: 50%;
          padding: 0.5rem;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .hamburger {
            display: block;
          }
          .menu-nav {
            display: ${menuOpen ? 'block' : 'none'};
            width: 100%;
            margin-top: 1rem;
          }
          .menu-nav ul {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
      </header>
    </>
  );
}
