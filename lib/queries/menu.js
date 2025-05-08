import { gql } from '@apollo/client';

export const GET_MENU = gql`
  query GetMenu {
  menu(id: "", idType: NAME) {
    menuItems {
      nodes {
        label
        uri
      }
    }
  }
}

`;
