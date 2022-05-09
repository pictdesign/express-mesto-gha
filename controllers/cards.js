const Card = require("../models/card");

const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

const createCard = (req, res) => {
  return Card.create(req.body, req.user._id)
    .then((card) => res.status(201).send({ data: card, message: 'Карточка создана' }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

const deleteCard = (req, res) => {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send({ data: card, message: 'Карточка удалена' }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

const likeCard = (req, res) => {
  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id }}, { new: true })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

const dislikeCard = (req, res) => {
  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id }}, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
}


module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };

