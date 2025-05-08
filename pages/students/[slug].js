import client from '../../lib/apollo';
import { GET_ALL_STUDENTS, GET_STUDENT_BY_SLUG } from '../../lib/queries/students';
import Image from 'next/image';

export default function StudentDetail({ student }) {
  if (!student) return <p>Student not found</p>;

  const image = student.featuredImage?.node;

  return (
    <main>
      <h1>{student.title}</h1>
      {image && <Image src={image.sourceUrl} alt={image.altText || student.title} width={800} height={500} />}
      <div dangerouslySetInnerHTML={{ __html: student.content }} />
    </main>
  );
}

export async function getStaticPaths() {
  const { data } = await client.query({ query: GET_ALL_STUDENTS });

  const paths = data.students.nodes.map((student) => ({
    params: { slug: student.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  try {
    const { data } = await client.query({
      query: GET_STUDENT_BY_SLUG,
      variables: { slug: params.slug },
    });

    if (!data?.student) return { notFound: true };

    return {
      props: {
        student: data.student,
      },
      revalidate: 10,
    };
  } catch (err) {
    return { notFound: true };
  }
}
