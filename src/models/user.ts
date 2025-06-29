import Mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcrypt"

interface Mood {
    angle: number,
    magnitude: number,
    description: string,
    date: Date,
};

interface IUser {
    username: string,
    password: string,
    moods: Mood[];
};

interface IUserDocument extends IUser, Mongoose.Document {
    comparePassword(password: string): Promise<boolean>;
};

interface IUserModel extends Mongoose.Model<IUserDocument> {
    findByUsername(username: string): Promise<IUserDocument | null>;
};

class UserClass {
    static async findByUsername(this: IUserModel, username: string): Promise<IUserDocument | null> {
        return this.findOne({ username });
    }
    async comparePassword(this: IUserDocument, password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password)
    }
};

function Create(collectionName: string): IUserModel {
    if (Mongoose.models[collectionName])
        return Mongoose.models[collectionName] as IUserModel;

    const MoodSchema = new Mongoose.Schema<Mood>(
        {
            angle: {
                type: Number,
                required: true
            },
            magnitude: {
                type: Number,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        },
        { _id: false }
    );

    const UserSchema = new Mongoose.Schema<IUserDocument>(
        {
            username: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            moods: {
                type: [MoodSchema],
                default: []
            }
        }
    );

    UserSchema.loadClass(UserClass);
    return Mongoose.model<IUserDocument, IUserModel>(collectionName, UserSchema);
}

const UserModel = Create('users');

export default UserModel;
export type { Mood, IUser, IUserDocument, IUserModel };