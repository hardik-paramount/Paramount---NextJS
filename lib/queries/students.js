import { gql } from '@apollo/client';

export const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    students {
      nodes {
        id
        title
        slug
        excerpt
      }
    }
  }
`;

export const GET_STUDENT_BY_SLUG = gql`
  query GetStudentBySlug($slug: ID!) {
    student(id: $slug, idType: SLUG) {
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;
