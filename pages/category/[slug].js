// pages/category/[slug].js

import { useRouter } from 'next/router';
import client from '../../lib/apollo';
import { GET_POSTS_BY_CATEGORY } from '../../lib/queries/posts';
import Link from 'next/link';

export default function CategoryPage({ posts, categoryName }) {
  const router = useRouter();
  if (router.isFallback) return <p>Loading...</p>;

  return (
    <main>
      <h1>Category: {categoryName}</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          </li>
        ))}
      </ul>
    </main>
  );
}

export async function getStaticPaths() {
  // Optional: you can preload specific categories or use fallback: 'blocking'
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  try {
    const { data } = await client.query({
      query: GET_POSTS_BY_CATEGORY,
      variables: { slug: params.slug },
    });

    if (!data?.category) return { notFound: true };

    return {
      props: {
        categoryName: data.category.name,
        posts: data.category.posts.nodes,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return { notFound: true };
  }
}
