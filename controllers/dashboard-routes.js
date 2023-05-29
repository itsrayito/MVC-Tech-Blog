const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/config');

// all the posts from the user

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            userId: req.session.userId,
        },
        attributes: ['id', 'title', 'content', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username'],
            },
        ],
    })
    .then((dbPostData) => {
        const posts = dbPostData.map((post) => post.get({ plain: true }));
        res.sender('dashboard', { posts, loggedIn: true, username: req.session.username,});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// this will have the ability to edit a post

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username'],
            },
            {
                model: Comment,
                attributes: ['id', 'comment', 'postId', 'userId', 'created_at'],
                includes: {
                    model: User,
                    attributes: ['username'],
                },
            },
        ],
    })
    .then((dbPostData) => {
        if (!dbPostData) {
            res.status(404).json({ message: 'This id has no post.' });
            return;
        }
        const post = dbPostData.get({ plain: true });
        res.render('ediy-post', { post, loggedIn: true, usernanme: req.session.username });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// this will get a new post

router.get('/new', withAuth, (req, res) => {
    res.render('new-post', { username: req.session.username });
});

module.exports = router;