import React from "react";
import { ApolloProvider } from "@apollo/client";
import AppNavigator from "./navigation/AppNavigator";
import client from "./config/apollo"; // Assuming you have configured Apollo Client here

export default function App() {
  return (
    // Wrap the entire app with ApolloProvider
    <ApolloProvider client={client}>
      <AppNavigator />
    </ApolloProvider>
  );
}
