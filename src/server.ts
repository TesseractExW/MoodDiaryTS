import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import login from "@auth/login";
import logout from "@auth/logout";
import register from "@auth/register";
import refresh from "@auth/refresh";
import verification from "@auth/verification";
import db from "@config/database";
import env from "@config/env";
import adddata from "@user/adddata";

const __dirname = path.resolve();
class Server {
	public app: express.Express;
	public start(): void {
		const { server_port, server_address } = env.get();

		console.log(`Listening To port ${server_port}`);
		this.app.listen(server_port);

		this.routes();
	}
	public routes() {
		// auth
		this.app.post("/auth/login", login);
		this.app.post("/auth/register", register);
		this.app.post("/auth/logout", verification, logout);
		this.app.post("/auth/refresh", refresh);
		// user
		this.app.post('/user/adddata', verification, adddata);

		// public
		this.app.get("/", 
            (req: express.Request, res: express.Response) => {
			    res.render("home");
            }
        );
		this.app.get(
			"/about",
			(req: express.Request, res: express.Response) => {
				res.render("about");
			}
		);
		this.app.get(
			"/login",
			(req: express.Request, res: express.Response) => {
				res.render("login");
			}
		);
		this.app.get(
			"/logout",
			(req: express.Request, res: express.Response) => {
				res.render("logout");
			}
		);
		this.app.get("/home", 
            (req: express.Request, res: express.Response) => {
			    res.render("home");
		    }
        );
		this.app.get(
			"/register",
			(req: express.Request, res: express.Response) => {
				res.render("register");
			}
		);

        // private add verify middleware
        this.app.get(
            "/private/dash",
            verification,
            (req: express.Request, res: express.Response) => {
                // res.render("dash.ejs", {username:"test"});
                res.render("dash.ejs", {
					username: req.data?.username,
					moods: req.data?.moods
				});
            }
        )

	}
	constructor() {
		env.config();
		db.Connect();

		this.app = express();
		this.app.use(cookieParser());
		this.app.use(express.json());

		const dir = path.join(__dirname, "public");
		this.app.use("/public", express.static(dir));

		this.app.set("view engine", "ejs");
		this.app.set("views", path.join(__dirname, "src/controllers/public"));
	}
}

export default Server;
