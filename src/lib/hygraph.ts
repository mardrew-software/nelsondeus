import { GraphQLClient } from 'graphql-request';

export const hygraph = new GraphQLClient(process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT!, {
    headers: {
        Authorization: process.env.HYGRAPH_TOKEN ? `Bearer ${process.env.NEXT_HYGRAPH_TOKEN}` : '',
    },
});