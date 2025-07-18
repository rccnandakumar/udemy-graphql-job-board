import cors from "cors";
import express from "express";
import { authMiddleware, handleLogin } from "./auth.js";
import { readFile } from "node:fs/promises";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { resolvers } from "./resolver.js";
import { getUser } from "./db/users.js";
import { createCompanyLoader } from "./db/companies.js";

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);

const typeDefs = await readFile("./schema.graphql", "utf8");

async function getContext({ req }) {
  const companyLoader = createCompanyLoader();
  const context = { companyLoader };
  if (req.auth) {
    // const user = await getUser(req.auth.sub);
    // return { user };
    context.user = await getUser(req.auth.sub);
  }
  return context;
}

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
app.use("/graphql", apolloMiddleware(apolloServer, { context: getContext }));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Graphql endpoint http://localhost:${PORT}/graphql`);
});
