import express, {Application, NextFunction, Request, Response} from "express";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

const envToken = process.env.ACCESS_TOKEN_SECRET || ""
const app: Application = express()
app.use(express.json())

export interface User {
    username: string
    password: string
    email: string

}

app.post('/login', (req, res) => {
    const {username, password, email} = req.body
    const user = {username, password, email}
    const token = generateAccessToken(user)
    return res.status(200).json({
        username: user.username,
        email: user.email,
        token
    })
    //generate token
})

function generateAccessToken(user: User) {
    return jwt.sign(user, envToken, {expiresIn: '15m'})
}

const posts = [
    {
        username: 'ali',
        title: "Post 1"
    },
    {
        username: 'peter',
        title: "Post 2"
    },
    {
        username: 'peter',
        title: "Post 2"
    },
]
app.get('/posts', authUserToken, (req, res) => {
    return res.status(200).json({
        data: posts.filter(post => post.username === req.user.username)
    })
})

function authUserToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({})
    jwt.verify(token,envToken,(err,user)=>{
        if(err) return res.status(403).json({})
        req.user = user as User
        next()
    })
}
app.listen(4001,()=>{
    console.log("server is here")
})
