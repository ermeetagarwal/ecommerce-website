const express = require("express");
const router = express.Router();
const Intro = require('../models/Intro'); // Import the Intro model
const Homecomponent = require('../models/Homecomponent'); // Import the Homecomponent model
router.get("/:homecomp", function (req, res, next) {
  const routeTitle = req.params.homecomp;
  Intro.findOne({ Title: routeTitle }, function (err, data) {
    if (!err) {
      if (data) {
        res.send(data.homecomponents);
      } else {
        res.status(404).send("Data not found route is invalid");
      }
    } else {
      res.send(err);
    }
  });
});

// router.post("/api/home/:homecomp", function (req, res, next) {
//   const homeCompImg = req.body.Image;
//   const homeCompTitle = req.body.Title;
//   const homeCompDisc = req.body.Description;
//   const routeTitle = req.params.homecomp;
//   Intro.findOne({ Title: routeTitle }, function (err, data) {
//     if (!err) {
//       if (!data) {
//         const newhomecomponent = new Homecomponent({
//           Title: homeCompTitle,
//           imageUrl: homeCompImg,
//           Description: homeCompDisc
//         });
//         const newintro = new Intro({
//           Title: routeTitle,
//           homecomponents: newhomecomponent
//         });
//         newhomecomponent.save(function (err) {
//           if (err) {
//             return res.status(500).send('Internal Server Error');

//           } else {
//             newintro.save(function (err) {
//               if (err) {
//                 return res.status(500).send('Internal Server Error');
//               } else {
//                 res.send("Success");
//               }
//             });
//           }
//         });
//       } else {
//         const newhomecomponent = new Homecomponent({
//           Title: homeCompTitle,
//           imageUrl: homeCompImg,
//           Description: homeCompDisc
//         });
//         newhomecomponent.save(function (err) {
//           if (err) {
//             return res.status(500).send('Internal Server Error');
//           } else {
//             data.homecomponents.push(newhomecomponent);
//             data.save(function (err) {
//               if (err) {
//                 return res.status(500).send('Internal Server Error');
//               } else {
//                 res.send("Success");
//               }
//             });
//           }
//         });
//       }
//     } else {
//         return res.status(500).send('Internal Server Error');
//     }
//   });
// });
router.post("/:homecomp", async function (req, res, next) {
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
        return res.status(409).send("Homecomponent with this title already exists.");
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
    res.status(500).send('Internal Server Error');
  }
});

router.delete("/:homecomp/:homeCompTitle", function (req, res,next) {
  const routeTitle = req.params.homecomp;
  const homeCompTitle = req.params.homeCompTitle;

  if (!homeCompTitle) {
    res.status(400).send("Homecomponent Title parameter is missing.");
    return;
  }

  Intro.findOne({ Title: routeTitle }, function (err, data) {
    if (!err && data) {
      // Find the index of the homecomponent with the given title
      const indexToRemove = data.homecomponents.findIndex(
        (component) => component.Title === homeCompTitle
      );

      if (indexToRemove !== -1) {
        // Remove the homecomponent from the array
        data.homecomponents.splice(indexToRemove, 1);
        // Save the updated Intro
        data.save(function (err) {
          if (err) {
            res.send(err);
          } else {
            Homecomponent.deleteOne({ Title: homeCompTitle },function(err){
                if(err){
                  res.status(500).send("deletion of homecomponent become unsuccessfull")
                }
                res.status(200).send("Homecomponent deleted successfully.");
            });
            
          }
        });
      } else {
        res.status(404).send("Homecomponent not found in the specified Intro.");
      }
    } else {
      res.status(404).send("Intro not found.");
    }
  });
});

module.exports = router;