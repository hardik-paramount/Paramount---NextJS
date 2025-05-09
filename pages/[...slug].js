import { gql } from '@apollo/client';
import client from '../lib/apollo';

export default function Page({ title, content }) {
  return (
    <main>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </main>
  );
}

// GraphQL query to get a page by its slug/URI
const GET_PAGE_BY_SLUG = gql`
  query PageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      title
      content
    }
  }
`;

export async function getStaticPaths() {
  const res = await client.query({
    query: gql`
      query GetAllPages {
        pages(first: 100) {
          edges {
            node {
              uri
            }
          }
        }
      }
    `
  });

  const staticPaths = ['/services']; // Add any additional static paths to exclude

  const paths = res.data.pages.edges
    .map(({ node }) => {
      const trimmedUri = node.uri.replace(/^\/|\/$/g, '');

      // If URI is empty (i.e. homepage), skip
      if (!trimmedUri || staticPaths.includes(`/${trimmedUri}`)) return null;

      return {
        params: {
          slug: trimmedUri.split('/')
        }
      };
    })
    .filter(Boolean); // Remove null values

  return {
    paths,
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const slug = params.slug.join('/');

  try {
    const res = await client.query({
      query: GET_PAGE_BY_SLUG,
      variables: { slug },
    });

    if (!res?.data?.page) {
      return { notFound: true };
    }

    return {
      props: {
        title: res.data.page.title,
        content: res.data.page.content,
      },
      revalidate: 10,
    };
  } catch (e) {
    return { notFound: true };
  }
}
