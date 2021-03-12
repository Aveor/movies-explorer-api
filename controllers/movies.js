const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => {
      if (!movie) {
        throw new ValidationError('Ошибка валидации');
      }
      res.send(movie);
    })
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  Movie.findOne(
    {
      movieId: req.params.movieId,
      owner: req.user._id,
    },
  )
    .select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new ValidationError('Некорректный ID фильма');
      }
      const deletedMovie = movie;
      movie.remove();
      res.send(deletedMovie);
    })
    .catch((err) => next(err));
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
