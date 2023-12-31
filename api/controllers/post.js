import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;

    const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    JOIN relationships AS r ON (p.userId = r.followedUserId AND r.followerUserId= ?)`;

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      // Now, you have access to userInfo from the decoded token
      const userId = userInfo.id; // Example: Assuming 'id' is a property of userInfo
  
      const q = 'INSERT INTO posts (`desc`, img, createdAt, userId) VALUES (?, ?, ?, ?)';


  
      const values = [
        req.body.desc,
        req.body.img,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userId
      ];
  
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post created!");
      });
    });
  };