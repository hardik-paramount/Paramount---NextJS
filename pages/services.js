// pages/services.js
import { gql } from '@apollo/client';
import client from '../lib/apollo';

export default function ServicesPage({ page }) {
  return (
    <main>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
}

// Updated GraphQL query to fetch only the services page by URI
const GET_SERVICE_PAGE = gql`
  query GetServicePage {
    page(id: "services", idType: URI) {
      title
      content
    }
  }
`;

export async function getStaticProps() {
  try {
    const res = await client.query({
      query: GET_SERVICE_PAGE,
    });

    const page = res.data.page;

    if (!page) {
      return { notFound: true }; // Return 404 if no page found
    }

    return {
      props: {
        page,
      },
      revalidate: 10, // Revalidate after 10 seconds for fresh data
    };
  } catch (error) {
    console.error('Error fetching service page:', error);
    return { notFound: true }; // Return 404 on error
  }
}
