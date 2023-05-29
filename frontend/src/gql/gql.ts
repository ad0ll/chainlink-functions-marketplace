/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    query AuthorFunctionRegistereds($first: Int!, $skip: Int!, $owner: Bytes!) {\n        functionRegistereds(\n            orderBy: blockNumber\n            orderDirection: desc\n            skip: $skip\n            first: $first\n            where: {owner: $owner}\n        ) {\n            id\n            functionId\n            owner\n            metadata_name\n            metadata_desc\n            metadata_imageUrl\n            metadata_category\n            fee\n            blockTimestamp\n        }\n    }\n": types.AuthorFunctionRegisteredsDocument,
    "\n    query DrilldownPage($functionId: ID!){\n        functionRegistered(\n\n            id: $functionId\n        ){\n            id\n            functionId\n            owner\n            metadata_owner\n            metadata_name\n            metadata_desc\n            metadata_imageUrl\n            metadata_expectedArgs\n            metadata_category\n            fee\n            subId\n        }\n    }\n\n": types.DrilldownPageDocument,
    "\n    query EventSpammerFunctionRegistered($first: Int!, $skip: Int!) {\n        functionRegistereds(\n            orderBy: blockNumber\n            orderDirection: desc\n            skip: $skip\n            first: $first\n        ) {\n            id\n            functionId\n            owner\n            fee\n            metadata_name\n            metadata_desc\n            metadata_imageUrl\n            metadata_category\n            blockTimestamp\n        }\n    }\n": types.EventSpammerFunctionRegisteredDocument,
    "\n    query EventSpammerRecentFunctionRegistered {\n        functionRegistereds(\n            orderBy: blockNumber\n            orderDirection: desc\n            first: 3\n        ) {\n            id\n            functionId\n            owner\n            metadata_name\n            metadata_desc\n            metadata_imageUrl\n            metadata_category\n        }\n    }\n": types.EventSpammerRecentFunctionRegisteredDocument,
    "\n    query EventSpammerOwnerPage($owner: Bytes!){\n        functionRegistereds(\n            orderBy: blockTimestamp\n            orderDirection: desc\n            where: {\n                owner: $owner\n            }\n        ){\n            id\n            functionId\n            owner\n            blockTimestamp\n            fee\n            subId\n            metadata_name\n            metadata_imageUrl\n            #            metadata_subscriptionPool\n            #            metadata_lockedProfitPool\n            #            metadata_unlockedProfitPool\n        }\n    }": types.EventSpammerOwnerPageDocument,
    "\n    query EventSpammerOwnerPageCounts($functionId: Bytes!, $blockTimestamp_gt: BigInt!){\n        functionCalleds(where: {\n            functionId: $functionId,\n            blockTimestamp_gt: $blockTimestamp_gt\n        },\n            first: 10000){\n            blockTimestamp\n        }\n    }": types.EventSpammerOwnerPageCountsDocument,
    "\n    query EventSpammerOwnerPageStats($owner: Bytes!, $blockTimestamp_gt: BigInt!){\n        functionCalleds(where: {\n            owner: $owner,\n            blockTimestamp_gt: $blockTimestamp_gt\n        },\n            first: 10000){\n            fee\n            blockTimestamp\n        }\n    }": types.EventSpammerOwnerPageStatsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query AuthorFunctionRegistereds($first: Int!, $skip: Int!, $owner: Bytes!) {\n        functionRegistereds(\n            orderBy: blockNumber\n            orderDirection: desc\n            skip: $skip\n            first: $first\n            where: {owner: $owner}\n        ) {\n            id\n            functionId\n            owner\n            metadata_name\n            metadata_desc\n            metadata_imageUrl\n            metadata_category\n            fee\n            blockTimestamp\n        }\n    }\n"): (typeof documents)["\n    query AuthorFunctionRegistereds($first: Int!, $skip: Int!, $owner: Bytes!) {\n        functionRegistereds(\n            orderBy: blockNumber\n            orderDirection: desc\n            skip: $skip\n            first: $first\n            where: {owner: $owner}\n        ) {\n            id\n            functionId\n            owner\n            metadata_name\n            metadata_desc\n            metadata_imageUrl\n            metadata_category\n            fee\n            blockTimestamp\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query DrilldownPage($functionId: ID!){\n        functionRegistered(\n\n            id: $functionId\n        ){\n            id\n            functionId\n            owner\n            metadata_owner\n            metadata_name\n            metadata_desc\n            metadata_imageUrl\n            metadata_expectedArgs\n            metadata_category\n            fee\n            subId\n        }\n    }\n\n"): (typeof documents)["\n    query DrilldownPage($functionId: ID!){\n        functionRegistered(\n\n            id: $functionId\n        ){\n            id\n            functionId\n            owner\n            metadata_owner\n            metadata_name\n            metadata_desc\n            metadata_imageUrl\n            metadata_expectedArgs\n            metadata_category\n            fee\n            subId\n        }\n    }\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query EventSpammerFunctionRegistered($first: Int!, $skip: Int!) {\n        functionRegistereds(\n            orderBy: blockNumber\n            orderDirection: desc\n            skip: $skip\n            first: $first\n        ) {\n            id\n            functionId\n            owner\n            fee\n            metadata_name\n            metadata_desc\n            metadata_imageUrl\n            metadata_category\n            blockTimestamp\n        }\n    }\n"): (typeof documents)["\n    query EventSpammerFunctionRegistered($first: Int!, $skip: Int!) {\n        functionRegistereds(\n            orderBy: blockNumber\n            orderDirection: desc\n            skip: $skip\n            first: $first\n        ) {\n            id\n            functionId\n            owner\n            fee\n            metadata_name\n            metadata_desc\n            metadata_imageUrl\n            metadata_category\n            blockTimestamp\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query EventSpammerRecentFunctionRegistered {\n        functionRegistereds(\n            orderBy: blockNumber\n            orderDirection: desc\n            first: 3\n        ) {\n            id\n            functionId\n            owner\n            metadata_name\n            metadata_desc\n            metadata_imageUrl\n            metadata_category\n        }\n    }\n"): (typeof documents)["\n    query EventSpammerRecentFunctionRegistered {\n        functionRegistereds(\n            orderBy: blockNumber\n            orderDirection: desc\n            first: 3\n        ) {\n            id\n            functionId\n            owner\n            metadata_name\n            metadata_desc\n            metadata_imageUrl\n            metadata_category\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query EventSpammerOwnerPage($owner: Bytes!){\n        functionRegistereds(\n            orderBy: blockTimestamp\n            orderDirection: desc\n            where: {\n                owner: $owner\n            }\n        ){\n            id\n            functionId\n            owner\n            blockTimestamp\n            fee\n            subId\n            metadata_name\n            metadata_imageUrl\n            #            metadata_subscriptionPool\n            #            metadata_lockedProfitPool\n            #            metadata_unlockedProfitPool\n        }\n    }"): (typeof documents)["\n    query EventSpammerOwnerPage($owner: Bytes!){\n        functionRegistereds(\n            orderBy: blockTimestamp\n            orderDirection: desc\n            where: {\n                owner: $owner\n            }\n        ){\n            id\n            functionId\n            owner\n            blockTimestamp\n            fee\n            subId\n            metadata_name\n            metadata_imageUrl\n            #            metadata_subscriptionPool\n            #            metadata_lockedProfitPool\n            #            metadata_unlockedProfitPool\n        }\n    }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query EventSpammerOwnerPageCounts($functionId: Bytes!, $blockTimestamp_gt: BigInt!){\n        functionCalleds(where: {\n            functionId: $functionId,\n            blockTimestamp_gt: $blockTimestamp_gt\n        },\n            first: 10000){\n            blockTimestamp\n        }\n    }"): (typeof documents)["\n    query EventSpammerOwnerPageCounts($functionId: Bytes!, $blockTimestamp_gt: BigInt!){\n        functionCalleds(where: {\n            functionId: $functionId,\n            blockTimestamp_gt: $blockTimestamp_gt\n        },\n            first: 10000){\n            blockTimestamp\n        }\n    }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query EventSpammerOwnerPageStats($owner: Bytes!, $blockTimestamp_gt: BigInt!){\n        functionCalleds(where: {\n            owner: $owner,\n            blockTimestamp_gt: $blockTimestamp_gt\n        },\n            first: 10000){\n            fee\n            blockTimestamp\n        }\n    }"): (typeof documents)["\n    query EventSpammerOwnerPageStats($owner: Bytes!, $blockTimestamp_gt: BigInt!){\n        functionCalleds(where: {\n            owner: $owner,\n            blockTimestamp_gt: $blockTimestamp_gt\n        },\n            first: 10000){\n            fee\n            blockTimestamp\n        }\n    }"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;