import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost/wordpress/graphql', // Change this
  cache: new InMemoryCache(),
});

export default client;
    