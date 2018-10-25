const getLineNums = (blockHeight) => {
  const linesHeight = 1.5 * 16;
  return Math.floor(blockHeight / linesHeight);
}

const reviewKey = {
  review_id: "review_id",
  movie_id: "movie_id",
  imageUrl: "imageUrl",
  name: "name",
  data_type: "data_type",
  text: "text",
  voiceUrl: "voiceUrl",
  user_id: "user_id",
  duration: "duration"
}

const movieKey = {
  id: "id",
  title: "title",
  image: "image",
  description: "description",
  create_time: "create_time"
}

const getReviewOpt = (options) => {
  const review = {
    review_id: options[reviewKey.review_id],
    movie_id: options[reviewKey.movie_id],
    imageUrl: options[reviewKey.imageUrl],
    name: options[reviewKey.name],
    data_type: options[reviewKey.data_type],
    text: options[reviewKey.text],
    voiceUrl: options[reviewKey.voiceUrl],
    user_id: options[reviewKey.user_id],
    duration: options[reviewKey.duration]
  }
  return review
}

const getMovieOpt = (options) => {
  const movie = {
    id: options[movieKey.id],
    title: options[movieKey.title],
    image: options[movieKey.image],
    description: options[movieKey.description],
    create_time: options[movieKey.create_time]
  }
  return movie
}

const createMovieParam = (movie) => {
  let paramUrl = ''
  for (const [key, keyValue] of Object.entries(movieKey)) {
    paramUrl += keyValue + '=' + movie[keyValue] + '&&'
  }
  return paramUrl
}

const createReviewParam = (review) => {
  let paramUrl = ''
  for (const [key, keyValue] of Object.entries(reviewKey)) {
    paramUrl += keyValue + '=' + review[keyValue] + '&&'
  }
  return paramUrl
}

const getFileName = (url) => {
  var filename = url.substring(url.lastIndexOf('/')+1);
  return filename
}

module.exports = { getLineNums, getReviewOpt, getMovieOpt,
                   createMovieParam, createReviewParam, getFileName }
