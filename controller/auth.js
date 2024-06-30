import express from "express";
import supabase from "../config/supabase.js";
import bcrypt from "bcrypt";
import configureMiddleware from "../config/middleware.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
configureMiddleware(app);
const router = express.Router();

router.post("/registration", async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const saltRound = 10;
    const hash = await bcrypt.hash(password, saltRound);

    const { data, error } = await supabase
      .from("users")
      .insert({ fullname: fullname, username: username, email: email, password: hash, admin: false })
      .select("*");

    if (error) {
      return res.json(error.message);
    }

    const userId = data[0].id;
    return res.json({userId: userId, data, message: "Registration successful!"});
  } catch (error) {
    return res.json(error);
  }
});

router.put("/assign-role/:id", async (req, res) => {
  try {
    const { admin } = req.body;
    const UserId = req.params.id;


    const { data, error } = await supabase
      .from("users")
      .update({ admin: admin })
      .eq("id", UserId)
      .select("*");

    if (error) {
      return res.json(error.message);
    }

    return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`username.eq.${username}`);

    if (error) {
      return res.json({ error: error.message });
    }

    if (data.length > 0) {
      bcrypt.compare(password, data[0].password, (error, response) => {
        if (error) {
          return res.json({ error: error.message });
        }

        if (response) {
          const user = data[0];
          const getToken =
            process.env.JWT_TOKEN;
          const token = jwt.sign(
            { id: user.id, admin: user.admin },
            getToken,
            { expiresIn: "24h" }
          );


          return res.json({
            message: `Login Successfull, ${user.fullname}`,
            token: token,
            dataUser: user,
            admin: user.admin,
          });
        } else {
          return res.json({
            message: "Wrong username/email or password combination!",
          });
        }
      });
    } else {
      return res.json({ message: "User doesn't exist" });
    }
  } catch (error) {
    return res.json({ error: error.message });
  }
});

export default router;