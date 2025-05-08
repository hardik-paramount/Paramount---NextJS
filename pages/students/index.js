import client from '../../lib/apollo';
import { GET_ALL_STUDENTS } from '../../lib/queries/students';
import Link from 'next/link';

export default function StudentsPage({ students }) {
  return (
    <main>
      <h1>Student Records</h1>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <Link href={`/students/${student.slug}`}>{student.title}</Link>
            <div dangerouslySetInnerHTML={{ __html: student.excerpt }} />
          </li>
        ))}
      </ul>
    </main>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({ query: GET_ALL_STUDENTS });

  return {
    props: {
      students: data.students.nodes,
    },
    revalidate: 10,
  };
}
