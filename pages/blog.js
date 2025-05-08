// pages/blog.js
import { gql } from '@apollo/client';
import client from '../lib/apollo';
import Link from 'next/link';
import { useState } from 'react';

const GET_ALL_POSTS_WITH_TITLE = gql`
  query GetAllPostsWithTitle {
    posts(first: 100) {
      nodes {
        title
        slug
        excerpt
      }
    }
  }
`;

const POSTS_PER_PAGE = 5;

export default function Blog({ posts }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <main>
      <h1>Blog</h1>
      <ul>
        {paginatedPosts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <h2>{post.title}</h2>
            </Link>
            <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div style={{ marginTop: '20px' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: page === currentPage ? '#333' : '#eee',
              color: page === currentPage ? '#fff' : '#000',
            }}
          >
            {page}
          </button>
        ))}
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const res = await client.query({
    query: GET_ALL_POSTS_WITH_TITLE,
  });

  return {
    props: {
      posts: res.data.posts.nodes,
    },
    revalidate: 10,
  };
}
