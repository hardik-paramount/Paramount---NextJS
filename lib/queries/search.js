import { gql } from '@apollo/client';

export const SEARCH_CONTENT = gql`
  query SearchContent($query: String!) {
    contentNodes(where: { search: $query }) {
      nodes {
        __typename
        ... on Post {
          id
          slug
          title
        }
        ... on Page {
          id
          slug
          title
        }
        ... on Student {
          id
          slug
          title
        }
      }
    }
  }
`;
