// lib/queries/posts.js
import { gql } from '@apollo/client';

export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts(first: 100) {
      edges {
        node {
          slug
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      content
      slug
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }  
      author {
        node {
          name
        }
      }
    }
  }
`;

// Query to get previous and next posts based on the current post's slug
export const GET_PREVIOUS_AND_NEXT_POSTS = gql`
  query GetPreviousAndNextPosts($slug: String!) {
  previousPost: posts(where: { before: $slug, first: 1 }) {
    edges {
      node {
        title
        slug
      }
    }
  }
  nextPost: posts(where: { after: $slug, first: 1 }) {
    edges {
      node {
        title
        slug
      }
    }
  }
}
`;

export const GET_PAGINATED_POSTS = gql`
  query GetPaginatedPosts($offset: Int!, $size: Int!) {
    posts(first: $size, after: $offset) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      name
      posts {
        nodes {
          id
          title
          slug
          excerpt
        }
      }
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts($first: Int!, $after: String) {
  posts(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      slug
      title
      date
      author {
        node {
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
    }
  }
}

`;