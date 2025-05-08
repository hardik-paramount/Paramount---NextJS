'use client';
import client from '../lib/apollo';
import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    client
      .query({
        query: gql`
          query {
            posts {
              nodes {
                title
                slug
                excerpt
              }
            }
          }
        `,
      })
      .then((result) => setPosts(result.data.posts.nodes));
  }, []);

  return (
    <main>
      <h1>WordPress Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <h2>{post.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          </li>
        ))}
      </ul>
    </main>
  );
}
