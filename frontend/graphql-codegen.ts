import type {CodegenConfig} from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: "https://subgraph.satsuma-prod.com/5636b4e4f174/2f2cac0b14bf2592543789045a02fa2ea9f0a91ab1f6e23e8859e8e618e6d1a7/event-spammer-4/api",
    documents: "src/**/*.tsx",
    generates: {
        "src/gql/": {
            preset: "client",
            plugins: []
        },
        "./graphql.schema.json": {
            plugins: ["introspection"]
        }
    }
};

export default config;
