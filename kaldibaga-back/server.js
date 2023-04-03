const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const util = require("util");

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./database.db');

const ACCESS_TOKEN_SECRET = 'ACCESS_TOKEN_SECRET';
const REFRESH_TOKEN_SECRET = 'REFRESH_TOKEN_SECRET';
const ACCESS_TOKEN_EXPIRATION = '30m';
const REFRESH_TOKEN_EXPIRATION = 182 * 24 * 60 * 60;


const db_run = util.promisify(db.run).bind(db);
const db_get = util.promisify(db.get).bind(db);
const db_all = util.promisify(db.all).bind(db);


db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        refreshToken TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        time_create TEXT,
        author_id INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS articles_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id,
        post_id
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS articles_dislikes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id,
        post_id
    )`);
});



const validateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const error401_text = 'Недействительный токен доступа.';
    if (token === null) {
        return res.status(401).json({error: error401_text});
    }
    try {
        let decodedAccessToken;
        try {
            decodedAccessToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        } catch (error) {
            return res.status(401).json({error: error401_text})
        }

        req.user = decodedAccessToken;

        await next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении данных пользователя' });
    }
}

// Регистрация пользователя
app.post('/register',
    body('email').isEmail(),
    body('username').isLength({ min: 3 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;

        try {
            const user = await db_get(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, email]);

            if (user) {
                return res.status(400).json({ error: 'Пользователь уже существует' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await db_run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [username, email, hashedPassword]);

            res.status(201).json({ok: true});

        } catch (error){
            console.error(error);
            res.status(500).json({ error: 'Ошибка при регистрации' });
        }
    });

// Авторизация пользователя
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db_get(`SELECT * FROM users WHERE username = ?`, [username]);

        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }

        const accessToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
        const refreshToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

        await db_run(`UPDATE users SET refreshToken = ? WHERE id = ?`, [refreshToken, user.id]);

        res.status(201).json({ accessToken, refreshToken });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при авторизации' });
    }
});

// Обновление токена доступа
app.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    const error401_text = 'Недействительный токен обновления.';
    try {
        const user = await db_get(`SELECT * FROM users WHERE refreshToken = ?`, [refreshToken]);
        if (!user) {
            return res.status(401).json({ error: error401_text });
        }

        let decodedRefreshToken;
        try {
            decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        } catch (error) {
            return res.status(401).json({error: error401_text})
        }

        const accessToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });

        res.status(201).json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при обновлении токена доступа' });
    }
});

app.post('/me', validateToken, async (req, res) => {
    res.json(req.user);
});

app.post(
    '/article/create', validateToken,
    body('title').isLength({min: 7}),
    body('content').isLength({ min: 10 }),
    async (req, res) => {
        try {
            const {title, content} = req.body;
            const time_create = new Date().toISOString();
            const user_id = req.user.id;

            console.log(req.user);

            await db_run(`INSERT INTO articles (title, content, time_create, author_id) VALUES (?, ?, ?, ?)`, [title, content, time_create, user_id]);

            res.status(200).json({ok: true});

        } catch (e) {
            console.error(e);
            res.status(500).json({error: 'Ошибка при создании поста.'})
        }
    }
)

app.post(
    '/article/list',
    validateToken,
    body('page').isInt(),
    body('limit').isInt(),
    async (req, res) => {
        try {
            const {page, limit} = req.body;

            const articles = await db_all(`SELECT * FROM articles ORDER BY time_create DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`);

            res.status(200).json({articles: articles});

        } catch (e) {
            console.error(e);
            res.status(500).json({error: 'Ошибка при загрузке списка постов.'})
        }
    }
)

app.post(
    '/article/view', validateToken,
    body('id').isInt(),
    async (req, res) => {
        try {
            const {id} = req.body;

            const article = await db_get(`SELECT * FROM articles WHERE id = ?`, [id]);

            res.status(200).json({article: article});

        } catch (e) {
            console.error(e);
            res.status(500).json({error: 'Ошибка при просмотре поста.'});
        }
    }
)

app.listen(3001, () => {
    console.log('Сервер запущен на порту 3001');
});
