const Card = require("../models/card");
const {ServerError, NotFoundError, BadRequest} = require("../errors/errors");

const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(ServerError).send({ message: "На сервере произошла ошибка" }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card, message: 'Карточка создана' }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BadRequest).send({ message: "Некорректные данные" });
      } else {
        res.status(ServerError).send({ message: "На сервере произошла ошибка" });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NotFoundError).send({ message: 'Карточка не найдена' });
      } else {
        card.remove();
        res.status(200).send({ data: card, message: 'Карточка удалена' });
      }
    })
    .catch((err) => res.status(ServerError).send({ message: "На сервере произошла ошибка" }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id }}, { new: true })
    .then((card) => {
      if(!card) {
        res.status(NotFoundError).send({ message: 'Карточка не найдена'});
      } else {
        res.status(200).send({ message: "Поставили лайк" });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BadRequest).send({ message: "Некорректные данные" });
      } else {
        res.status(ServerError).send({ message: "На сервере произошла ошибка" });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id }}, { new: true })
  .then((card) => {
    if(!card) {
      res.status(NotFoundError).send({ message: 'Карточка не найдена'});
    } else {
      res.status(200).send({ message: "Убрали лайк" });
    }
  })    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BadRequest).send({ message: "Некорректные данные" });
      } else {
        res.status(ServerError).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };