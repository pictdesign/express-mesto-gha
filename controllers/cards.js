const Card = require("../models/card");
const {ServerError, NotFoundError, BadRequestError} = require("../errors/errors");


const getCards = (req, res, next) => {
  return Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card, message: 'Карточка создана' }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      } else {
        card.remove();
        res.status(200).send({ data: card, message: 'Карточка удалена' });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id }}, { new: true })
    .then((card) => {
      if(!card) {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res.status(200).send({ message: "Поставили лайк" });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id }}, { new: true })
  .then((card) => {
    if(!card) {
      throw new NotFoundError('Карточка не найдена');
    } else {
      res.status(200).send({ message: "Убрали лайк" });
    }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };