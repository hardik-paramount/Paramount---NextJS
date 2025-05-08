import { gql } from '@apollo/client';

export const GET_ALL_PAGES = gql`
  query GetAllPages {
    pages(first: 100) {
      nodes {
        slug
      }
    }
  }
`;

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      title
      content
    }
  }
`;
