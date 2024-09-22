import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";

// Define the HTTP link
const httpLink = createHttpLink({
  uri: "https://mobile.putram.site/",
});

// Define the auth link with asynchronous token retrieval
const authLink = setContext(async (_, { headers }) => {
  // Retrieve the token from SecureStore
  const token = await SecureStore.getItemAsync("authToken");
  // Return the headers with the authorization token
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
});

// Create Apollo Client with the auth link and HTTP link
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
