interface EnvData
{
    db_conn_uri : string,
    db_name : string,
    server_port : number,
    server_address : string,
    atoken_key : string,
    atoken_expire : number,
    rtoken_key : string,
    rtoken_expire : number,
};

function getEnv() : EnvData
{
    const {
        DATABASE_CONNECTION_STRING,
        DATABASE_NAME,
        SERVER_PORT,
        SERVER_ADDRESS,
        USER_ACCESS_TOKEN,
        USER_ACCESS_TOKEN_EXPIRATION,
        USER_REFRESH_TOKEN,
        USER_REFRESH_TOKEN_EXPIRATION,
    } = process.env;
    
    return {
        db_conn_uri : DATABASE_CONNECTION_STRING || 'mongodb://localhost:27017/mood-diary-db',
        db_name : DATABASE_NAME || 'mood-diary-db',
        server_port : Number(SERVER_PORT || 80),
        server_address : SERVER_ADDRESS || 'localhost',
        atoken_key : USER_ACCESS_TOKEN || '',
        atoken_expire : Number(USER_ACCESS_TOKEN_EXPIRATION || '3600000'),
        rtoken_key : USER_REFRESH_TOKEN || '',
        rtoken_expire : Number(USER_REFRESH_TOKEN_EXPIRATION || '5184000000'),
    };
}

export default getEnv;
export type { EnvData };