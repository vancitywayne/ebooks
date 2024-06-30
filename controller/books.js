import express from "express";
import configureMiddleware from "../config/middleware.js";
import supabase from "../config/supabase.js";
import multer from "multer";
import { verifyToken } from "../config/verify.js";

const app = express();
configureMiddleware(app);
const router = express.Router();

router.get("/books", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select(`*, categories(*)`)
      .order("id");

    if (error) {
      return res.json(error.message);
    }

    return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});

router.get("/books-categories/:id", async (req, res) => {
  try {
    const categoriesId = req.params.id;

    const { data, error } = await supabase
      .from("books")
      .select(`*, categories(*)`)
      .eq("categories_id", categoriesId)
      .order("id");

    if (error) {
      return res.json(error.message);
    }

    return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});

router.get("/get-books/:id", async (req, res) => {
  try {
    const booksId = req.params.id;

    const { data, error } = await supabase
      .from("books")
      .select(`*, categories(*)`)
      .eq("id", booksId);

    if (error) {
      return res.json(error.message);
    }

    return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});

router.delete("/delete-books/:id", verifyToken, async (req, res) => {
  try {
    const booksId = req.params.id;






    const { data: dataBooks, error: errorBooks } = await supabase
      .from("books")
      .delete()
      .eq("id", booksId);

    if (errorBooks) {
      return res.json(errorBooks.message);
    }

    return res.json({
      data: dataBooks,
      message: "Delete books successfully!",
    });
  } catch (error) {
    return res.json(error);
  }
});



router.post(
  "/insert-books",
  verifyToken,
  async (req, res) => {
    try {
      const { title, author, summary, year, cover_image, categories_id } = req.body;


      const { data: booksData, error: booksError } = await supabase
        .from("books")
        .insert({
            title: title,
            author: author,
            summary: summary,
            year: year,
            cover_image: cover_image,
            categories_id: categories_id,
        })
        .select("*");

      if (booksError) {
        return res.json(booksError);
      }

      return res.json({
        data: booksData[0],
        message: "Insert books successfully!",
      });
    } catch (error) {
      return res.json(error);
    }
  }
);

router.put(
    "/update-books/:id",
    verifyToken,
    async (req, res) => {
      try {
        const { title, author, summary, year, cover_image, categories_id } = req.body;
        const booksId = req.params.id;
  
        const { data: booksData, error: booksError } = await supabase
          .from("books")
          .update({
              title: title,
              author: author,
              summary: summary,
              year: year,
              cover_image: cover_image,
              categories_id: categories_id,
          }).eq("id", booksId)
          .select("*");
  
        if (booksError) {
          return res.json(booksError);
        }
  
        return res.json({
          data: booksData[0],
          message: "Update books successfully!",
        });
      } catch (error) {
        return res.json(error);
      }
    }
  );
export default router;