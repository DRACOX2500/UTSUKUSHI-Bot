import { User } from "@/types/business";
import { AbstractStore } from "./abstract-store";

export class UserStore extends AbstractStore<User[]> {

    constructor() {
        super(null as any, []);
    }
}