import Mongoose from "mongoose";

interface IRefreshToken {
    token: string;
};

interface IRefreshTokenDocument extends IRefreshToken, Mongoose.Document {

};

interface IRefreshTokenModel extends Mongoose.Model<IRefreshTokenDocument> {
    findByToken(token: string): Promise<IRefreshTokenDocument | null>;
    findByIP(ip: string): Promise<IRefreshTokenDocument[]>;
}

class RefreshTokenClass {
    static async findByToken(this: IRefreshTokenModel, token: string): Promise<IRefreshTokenDocument | null> {
        return this.findOne({ token: token });
    }
    static async findByIP(this: IRefreshTokenModel, ip: string): Promise<IRefreshTokenDocument[]> {
        return this.find({ ip: ip });
    }
};

function Create(collectionName: string): IRefreshTokenModel {
    if (Mongoose.models[collectionName])
        return Mongoose.models[collectionName] as IRefreshTokenModel;

    const RefreshTokenSchema = new Mongoose.Schema<IRefreshTokenDocument>(
        {
            token: {
                type: String,
                required: true,
            },
        }, { timestamps: true }
    );

    const exp = Number(process.env.USER_REFRESH_TOKEN_EXPIRATION || 80000);
    RefreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: exp });
    RefreshTokenSchema.loadClass(RefreshTokenClass);

    return Mongoose.model<IRefreshTokenDocument, IRefreshTokenModel>(collectionName, RefreshTokenSchema);
}

const RefreshTokenModel = Create('refreshToken');

export default RefreshTokenModel;
export type { IRefreshToken, IRefreshTokenDocument, IRefreshTokenModel };