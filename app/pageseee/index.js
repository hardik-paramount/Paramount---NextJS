import client from '../lib/apollo';
import { gql } from '@apollo/client';

export async function getStaticProps() {
  const { data } = await client.query({
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
  });

  return {
    props: {
      posts: data.posts.nodes,
    },
  };
}

export default function Home({ posts }) {
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
