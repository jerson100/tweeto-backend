const express = require("express");
const { CreateTweetSchema, ValidationRouterParametersSchema} = require("../models/Tweet/Tweet.validation");
const TweetController = require("../controllers/Tweet.controller");
const requestValidation = require("../middlewares/requestValidation");
const { validationSchema } = require("../middlewares/ValidationSchema");
const { validateObjectIdSchema } = require("../utils/validation/objectId");
const { verifyUserAuthenticationToken } = require("../middlewares/token");
const { isItMyTweet } = require("../middlewares/tweet");
const { USERS_TYPE } = require("../configs/constant");
const { verifyUsersType } = require("../middlewares/user");

const Router = express.Router();

Router.route("/")
  .get(
    verifyUserAuthenticationToken,
    verifyUsersType(USERS_TYPE.ADMINISTRATOR),
    requestValidation(async (req, res) => {
      const { _id: idUser } = req.us;
      const tweets = await TweetController.allFollowing(idUser);
      return res.json({ data: tweets });
    })
  )
  .post(
    verifyUserAuthenticationToken,
    validationSchema(CreateTweetSchema),
    requestValidation(async (req, res) => {
      const newTweet = await TweetController.add({
        ...req.body,
        user: req.us._id,
      });
      return res.status(201).json({
        data: {
          ...newTweet._doc,
          user: req.us,
        },
      });
    })
  );

Router.route("/:idTweet")
  .get(
    verifyUserAuthenticationToken,
    validationSchema(validateObjectIdSchema("idTweet"), "params"),
    requestValidation(async (req, res) => {
      const { idTweet } = req.params;
      const tweet = await TweetController.getById(idTweet);
      return res.json({ data: tweet });
    })
  )
  .delete(
    [
      verifyUserAuthenticationToken,
      isItMyTweet,
      validationSchema(validateObjectIdSchema("idTweet"), "params"),
    ],
    requestValidation(async (req, res) => {
      const { idTweet } = req.params;
      await TweetController.remove(idTweet);
      return res.status(200).send();
    })
  );

//obtenemos todos los posts a los que el usuario sigue pues...
Router.get(
  "/timeline/feed",
  verifyUserAuthenticationToken,
    validationSchema(ValidationRouterParametersSchema, "query"),
  requestValidation(async (req, res) => {
    const { _id: idUser } = req.us;
    const {page, per_page} = req.query;
    const tweets = await TweetController.getTweetsIFollow(idUser, parseInt(page), parseInt(per_page));
    // const tweets = await TweetController.getTweetsIFollow2(idUser);
    return res.json({ data: tweets });
  })
);

module.exports = Router;
