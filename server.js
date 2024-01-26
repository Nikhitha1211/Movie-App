const express = require('express');
const cors = require('cors');
const fs = require("fs");
const { parse } = require("csv-parse");
const { v4: uuid } = require('uuid');

const data = [];

fs.createReadStream("./movies.csv")
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on("data", function (row) {
    data.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    console.log("parsed csv data:");
  });


const app = express();
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.get('/api/movies', (req, res) => {
  console.log('movies data');
  res.json(data)
});

app.get('/api/movies/genres', (req, res) => {
  console.log("genres call =>", data)
  const genres = data.reduce((acc, cur) => {
    let genresArr = [];
    let tempGenresArr = cur.genre.split(",");
    acc = [...acc, ...tempGenresArr];
    for (let genre of acc) {
      if (!genresArr.includes(genre)) {
        genresArr = [...genresArr, genre];
      }
    }
    return genresArr;
  }, []);
  res.json(genres)
})

app.get('/api/movies/filteredData', (req, res) => {
  let searchValue = req.query.s;
  let ratings = req.query.i;
  let genre = req.query.g;

  let filteredMovies;
  filteredMovies =
    searchValue?.length > 0
      ? data.filter(
        (movie) =>
          searchValue === movie.name.toLowerCase() ||
          searchValue === movie.director_name.toLowerCase() ||
          movie.writter_name.toLowerCase().split(",").includes(searchValue) ||
          movie.cast_name.toLowerCase().split(",").includes(searchValue)
      )
      : data;
  if (ratings > 0) {
    // filtereddata =
    //   searchValue?.length > 0 ? filtereddata : data;
    filteredMovies = filteredMovies.filter(
      (movie) => movie.imdb_rating >= ratings
    );
  }

  if (genre?.length > 0) {
    // filteredMovies =
    //   searchValue?.length > 0 || ratings > 7 ? filteredMovies : movies;
    filteredMovies = filteredMovies.filter((movie) =>
      movie.genre.includes(genre)
    );
  }
  res.json(filteredMovies)
})

app.listen(3000, () => {
  console.log('server started');
});


