import client from '../../lib/apollo';
import { GET_PAGE_BY_SLUG, GET_ALL_PAGES } from '../../lib/queries/pages';

export default function Page({ page }) {
  if (!page) return <p>Page not found</p>;

  return (
    <main>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
}

export async function getStaticPaths() {
  const res = await client.query({ query: GET_ALL_PAGES });

  const paths = res.data.pages.nodes.map((page) => ({
    params: { slug: page.slug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { data } = await client.query({
    query: GET_PAGE_BY_SLUG,
    variables: { slug: params.slug },
  });

  if (!data.page) return { notFound: true };

  return {
    props: { page: data.page },
    revalidate: 10,
  };
}
