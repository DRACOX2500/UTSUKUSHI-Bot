import { Schema, model } from "mongoose";
import { User } from "@/types/business";
import { SCHEMAS } from "@/database/database";

const userSchema = new Schema<User>({
    id: {
        type: String,
        require: true,
        unique: true,
    },
    songs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: SCHEMAS.SONG
        }],
        default: []
    }
})

export const UserModel = model<User>(SCHEMAS.USER, userSchema);