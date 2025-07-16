import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
// import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "../auth";

// const client = new GraphQLClient("http://localhost:9000/graphql", {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return { Authorization: `Bearer ${accessToken}` };
//     }
//     return {};
//   },
// });

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const customLink = new ApolloLink((operation, forward) => {
  console.log("[authLink] operation:", operation);
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(customLink, httpLink),
  cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`;

export const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
// export async function createJob({ title, description }) {
//   const mutation = gql`
//     mutation CreateJob($input: CreateJobInput) {
//       job: createJob(input: $input) {
//         ...JobDetail
//       }
//       ${jobDetailFragment}
//     }
//   `;
// const { job } = await client.request(mutation, {
//   input: { title, description },
// });
//
//   const { data } = await apolloClient.mutate({
//     mutation,
//     variables: { input: { title, description } },
//     update: (cache, { data }) => {
//       cache.writeQuery({
//         query: jobByIdQuery,
//         variables: { id: data.job.id },
//         data,
//       });
//     },
//   });
//   return data.job;
// }

export const jobsQuery = gql`
  query Jobs {
    jobs {
      id
      date
      title
      company {
        id
        name
      }
    }
  }
`;

// export async function getJobs() {
//   const query = gql`
//     query {
//       jobs {
//         id
//         date
//         title
//         company {
//           id
//           name
//         }
//       }
//     }
//   `;

//   // const { jobs } = await client.request(query);
//   const { data } = await apolloClient.query({
//     query,
//     fetchPolicy: "network-only",
//   });
//   return data.jobs;
// }

// export async function getJob(id) {
//   // const { job } = await client.request(query, { id });
//   const { data } = await apolloClient.query({
//     query: jobByIdQuery,
//     variables: { id },
//   });
//   return data.job;
// }

export const companyByIdQuery = gql`
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`;

// export async function getCompany(id) {

//   // const { company } = await client.request(query, { id });
//   const { data } = await apolloClient.query({
//     query: companyByIdQuery,
//     variables: { id },
//   });
//   return data.company;
// }
