// pages/[...slug].js

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

// GraphQL query to get pages
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

    // Get paths for all pages
    const paths = res.data.pages.edges.map(({ node }) => {
        const slugArray = node.uri.replace(/^\/|\/$/g, '').split('/');
        return {
            params: { slug: slugArray }
        };
    });

    // Exclude static paths (e.g., "/services")
    const staticPaths = ['/services'];  // Add other static paths if needed
    const filteredPaths = paths.filter((pathObj) => {
        return !staticPaths.includes(`/${pathObj.params.slug[0]}`);
    });

    return {
        paths: filteredPaths,
        fallback: 'blocking',  // You can adjust the fallback as necessary
    };
}

export async function getStaticProps({ params }) {
    const slug = params.slug.join('/');  // Important for dynamic slugs

    try {
        const res = await client.query({
            query: GET_PAGE_BY_SLUG,
            variables: { slug },
        });

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
