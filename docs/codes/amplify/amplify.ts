// config/amplify.ts
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

// Auth
import { Auth } from "aws-amplify";

await Auth.signUp({ username: email, password });
await Auth.signIn(email, password);
await Auth.signOut();

// API (GraphQL)
import { API } from "aws-amplify";
import { createTask } from "./graphql/mutations";

await API.graphql({
  query: createTask,
  variables: { input: { title: "Task" } },
});
