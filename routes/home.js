const express = require("express");
const Intro = require("../models/Intro.js"); // Import the Intro model
const Homecomponent = require("../models/Homecomponent.js"); // Import the Homecomponent model

const router = express.Router();

router.get("/:homecomp", async (req, res) => {
  try {
    const routeTitle = req.params.homecomp;
    data = await Intro.findOne({ Title: routeTitle });

    if (data) {
      res.send(data.homecomponents);
    } else {
      res.status(404).send("Data not found route is invalid");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send("An unexpected error occurred.");
  }
});

router.post("/:homecomp", async (req, res) => {
  try {  
    const homeCompImg = req.body.Image;
    const homeCompTitle = req.body.Title;
    const homeCompDisc = req.body.Description;
    const routeTitle = req.params.homecomp;

    const existingIntro = await Intro.findOne({ Title: routeTitle });

    if (!existingIntro) {
      const newhomecomponent = new Homecomponent({
        Title: homeCompTitle,
        imageUrl: homeCompImg,
        Description: homeCompDisc,
      });

      const newintro = new Intro({
        Title: routeTitle,
        homecomponents: newhomecomponent,
      });

      await newhomecomponent.save();
      await newintro.save();

      res.send("Success");
    } else {
      const homeComponentExists = existingIntro.homecomponents.some(
        (component) => component.Title === homeCompTitle
      );

      if (homeComponentExists) {
        return res
          .status(409)
          .send("Homecomponent with this title already exists.");
      }

      const newhomecomponent = new Homecomponent({
        Title: homeCompTitle,
        imageUrl: homeCompImg,
        Description: homeCompDisc,
      });

      await newhomecomponent.save();
      existingIntro.homecomponents.push(newhomecomponent);
      await existingIntro.save();

      res.send("Success");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send("An unexpected error occurred.");
  }
});

router.delete("/:homecomp/:homeCompTitle", async (req, res) => {
  try {
    const routeTitle = req.params.homecomp;
    const homeCompTitle = req.params.homeCompTitle;

    if (!homeCompTitle) {
      res.status(400).send("Homecomponent Title parameter is missing.");
      return;
    }

    const data = await Intro.findOne({ Title: routeTitle });

    if (data) {
      const indexToRemove = data.homecomponents.findIndex(
        (component) => component.Title === homeCompTitle
      );

      if (indexToRemove !== -1) {
        data.homecomponents.splice(indexToRemove, 1);

        try {
          await data.save();
          await Homecomponent.deleteOne({ Title: homeCompTitle });
          res.status(200).send("Homecomponent deleted successfully.");
        } catch (err) {
          res.status(500).send("Deletion of homecomponent was unsuccessful.");
        }
      } else {
        res.status(404).send("Homecomponent not found in the specified Intro.");
      }
    } else {
      res.status(404).send("Intro not found.");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send("An unexpected error occurred.");
  }
});

module.exports = router;

