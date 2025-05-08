import client from '../../lib/apollo';
import { gql } from '@apollo/client';

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query {
        students(first: 100) {
          nodes {
            slug
          }
        }
      }
    `,
  });

  const paths = data.students.nodes.map(student => ({
    params: { slug: student.slug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { data } = await client.query({
    query: gql`
      query GetStudent($slug: ID!) {
        student(id: $slug, idType: SLUG) {
          title
          content
        }
      }
    `,
    variables: { slug: params.slug },
  });

  if (!data.student) return { notFound: true };

  return { props: { student: data.student }, revalidate: 60 };
}

export default function Student({ student }) {
  return (
    <div style={{ padding: 40 }}>
      <h1>{student.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: student.content }} />
    </div>
  );
}
