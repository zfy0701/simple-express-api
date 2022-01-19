import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Block} from "./Block";
import { IsNull } from "typeorm";

async function fetchFullBlock(id: string) {
    const blockRepository = getManager().getRepository(Block);

    return await blockRepository.findOne(
        {
            where: { id },
            relations: ["children"],
            loadRelationIds: true,
        }
    );
}

// Creates a new block and returns the block JSON
export async function blockPutAction(request: Request, response: Response) {
    const blockRepository = getManager().getRepository(Block);
    const block = await blockRepository.save(await blockRepository.create())
    response.send(await fetchFullBlock(block.id));
}

export async function blockPutByIdAction(request: Request, response: Response) {
    const blockRepository = getManager().getRepository(Block);

    const block = await blockRepository.save(await blockRepository.create(
        {
            parent: {
                id: request.params.id
            }
        }
    ));
    response.send(await fetchFullBlock(block.id));
}

// Fetches all top level blocks (blocks with no parents)
export async function blockGetAction(request: Request, response: Response) {
    const blockRepository = getManager().getRepository(Block);

    // The following query should be able to do the works
    // SELECT "Block"."id", "Block"."properties", "Block"."parentId", "Block__children"."id" AS "Block__children_id"
    // FROM "block" "Block"
    // LEFT JOIN "block" "Block__children" ON "Block__children"."parentId"="Block"."id"
    // WHERE "Block"."parentId" IS NULL

    // But the query that blockRepository generated is actually not as optimal
    // probably not worth digging into it right now.
    const blocks = await blockRepository.find(
        {
            where: { parent: IsNull() },
            relations: ["children"],
            loadRelationIds: true
        }
    );
    response.send(blocks);
}

// Fetches a block by ID
export async function blockGetByIdAction(request: Request, response: Response) {
    const block = await fetchFullBlock(request.params.id)

    if (!block) {
        response.status(404);
        response.end();
        return;
    }

    response.send(block);
}

// Updates a blocks properties by Id
export async function blockPostByIdAction(request: Request, response: Response) {
    const blockRepository = getManager().getRepository(Block);

    if (!request.is("application/json")) {
        response.status(400);
        response.end();
        return;
    }

    await blockRepository.update(
        {
            id: request.params.id
        },
        {
            properties: request.body
        }
        // This is doing a full update, not sure if this need to be a partial update
        // e.g. { a: '0', b: '0' } => { a: '1', c: '1' } will NOT become { a: '1', b: '0', c: '1' }
    );

    response.send(await fetchFullBlock(request.params.id));
}