import {User} from "../server";

export {};

declare global {
    namespace Express{
        interface Request{
            user: User;
        }
    }
}
