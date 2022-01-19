import {
    blockGetAction,
    blockGetByIdAction,
    blockPostByIdAction,
    blockPutAction,
    blockPutByIdAction
} from "./BlockActions";

export const AppRoutes = [
    {
        path: "/block",
        method: "put",
        action: blockPutAction
    },
    {
        path: "/block/:id",
        method: "put",
        action: blockPutByIdAction
    },
    {
        path: "/block",
        method: "get",
        action: blockGetAction
    },
    {
        path: "/block/:id",
        method: "get",
        action: blockGetByIdAction
    },
    {
        path: "/block/:id",
        method: "post",
        action: blockPostByIdAction
    }
];