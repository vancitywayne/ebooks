import express from "express";
import configureMiddleware from "../config/middleware.js";
import supabase from "../config/supabase.js";
import { verifyToken } from "../config/verify.js";

const app = express();
configureMiddleware(app);
const router = express.Router();

router.get("/categories", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id");

    if (error) {
      return res.json(error.message);
    }

    return res.json(data);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/get-categories/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", categoryId);

    if (error) {
      return res.json(error.message);
    }

    return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});

router.post("/insert-categories", verifyToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    const { data, error } = await supabase
      .from("categories")
      .insert({ name: name, description: description})
      .select("*");

    if (error) {
      return res.json(error.message);
    }

    return res.json({ data, message: "Insert category successfully!" });
  } catch (error) {
    return res.json(error);
  }
});

router.put("/update-categories/:id", verifyToken, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    const { data, error } = await supabase
      .from("categories")
      .update({ name: name, description: description})
      .eq("id", categoryId)
      .select("*");

    if (error) {
      return res.json(error.message);
    }

    return res.json({ data, message: "Update category successfully!" });
  } catch (error) {
    return res.json(error);
  }
});

router.delete("/delete-categories/:id", verifyToken, async (req, res) => {
  try {
    const categoryId = req.params.id;

    const { data, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId)
      .order("id");

    if (error) {
      return res.json(error.message);
    }

    return res.json({ data, message: "Delete category successfully" });
  } catch (error) {
    return res.json(error);
  }
});

export default router;