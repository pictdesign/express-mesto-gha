const Card = require("../models/card");

const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка", err}));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card, message: 'Карточка создана' }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Некорректные данные" });
      } else {
        res.status(500).send({ message: "Произошла ошибка", err });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        card.remove();
        res.status(200).send({ data: card, message: 'Карточка удалена' });
      }
    })
    .catch((err) => res.status(500).send({ message: "Произошла ошибка", err}));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id }}, { new: true })
    .then((card) => res.status(200).send({ message: "Поставили лайк", data: card }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка", err}));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id }}, { new: true })
    .then((card) => res.send({ message: "Убрали лайк", data: card }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка", err}));
}


module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };