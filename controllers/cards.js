const Card = require("../models/card");

const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => console.log(err));
};

const createCard = (req, res) => {
  return Card.create(req.body, req.user._id)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err }));
};

const deleteCard = (req, res) => {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err }));
};

const likeCard = (req, res) => {
  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id }}, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: 'Error occured', err }));
};

const dislikeCard = (req, res) => {
  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id }}, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: 'Error occured', err }));
}


module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };

