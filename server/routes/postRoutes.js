import express from 'express';
import * as dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

/* Get All Posts */
router.route('/').get(async(req, res) => {
    try {
        const posts = await Post.find({});
        return res.status(200).json({
            success: true,
            data: posts
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

/* Create a Post */
router.route('/').post(async(req, res) => { 
    try {
        const { name, prompt, photo } = req.body;
        const folder = 'DALL - E';
        const response = await cloudinary.uploader.upload(photo, {folder});
        const newPost = await Post.create({
            name,
            prompt,
            photo: response.url
        });
        return res.status(200).json({
            success: true,
            data: newPost
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


export default router;