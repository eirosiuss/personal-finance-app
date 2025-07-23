import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("personal_finance_data");
  let results = await collection.find({}).toArray();
  res.status(200).send(results);
});


// This section will help you get a single record by id
// router.get("/:id", async (req, res) => {
//   let collection = await db.collection("personal_finance_data");
//   let query = { _id: new ObjectId(req.params.id) };
//   let result = await collection.findOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.status(200).send(result);
// });

// This section will create a new budget.
router.post("/add-budget/:id", async (req, res) => {
  const { category, maximum, theme } = req.body;
  const userId = req.params.id;

  try {
    const result = await db.collection("personal_finance_data").updateOne(
      { _id: new ObjectId(userId) },
      {
        $push: {
          budgets: {
             _id: new ObjectId(),
            category,
            maximum: Number(maximum),
            theme,
          },
        },
      }
    );

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add budget");
  }
});

// This section will help you update a record by id.
// router.patch("/:id", async (req, res) => {
//   try {
//     const query = { _id: new ObjectId(req.params.id) };
//     const updates = {
//       $set: {
//         name: req.body.name,
//         position: req.body.position,
//         level: req.body.level,
//       },
//     };

//     let collection = await db.collection("personal_finance_data");
//     let result = await collection.updateOne(query, updates);
//     res.status(200).send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating record");
//   }
// });

// This section will delete a budget
router.delete("/delete-budget/:id/:category", async (req, res) => {
  const userId = req.params.id;
  const categoryToDelete = req.params.category;

  try {
    const result = await db.collection("personal_finance_data").updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { budgets: { category: categoryToDelete } } }
    );

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete budget");
  }
});

export default router;