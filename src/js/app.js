$(document).ready(function () {
  var UrlMovie = 'https://api.themoviedb.org/3/search/movie';
  var UrlPopular = 'https://api.themoviedb.org/3/movie/popular';
  var ContainerMovie = '.container-film > ul';
  var Slider = '.carousel-inner';
  var UrlSeries = 'https://api.themoviedb.org/3/search/tv';
  var ContainerSeries = '.container-series > ul';
  $('.film').hide();
  $('.serie').hide();
  printPopular(UrlPopular, Slider);
  printUpcoming()

// CERCA CON TASTIERA//////////////////////
  $("#insert-film-name").keyup(function() {
   if (event.which == 13) {
     var InsertedFilm = $('#insert-film-name').val();
     printMovieTv(InsertedFilm, UrlMovie, ContainerMovie);
     printMovieTv(InsertedFilm, UrlSeries, ContainerSeries);
     $('#searched_content').hide();
     $('#upcomingFilms .listing_carousel').hide();
   }
  });

  // CLICK SUL CERCA//////////////////////////////
  $(document).on('click', '#search', function() {
    var InsertedFilm = $('#insert-film-name').val();
    printMovieTv(InsertedFilm, UrlMovie, ContainerMovie);
    printMovieTv(InsertedFilm, UrlSeries, ContainerSeries);
  });



  //SWIPE LEFT AND RIGHT BUTTONS////////////////////////

  var windowWidth = $(window).width();

  // Scroll to the right
  $('.next').on('click', function(){
     $('.carousel_items').animate({ scrollLeft: windowWidth }, 1000);
  })
  // Scroll to the left
  $('.prev').on('click', function(){
     $(".carousel_items").animate({ scrollLeft: '0' }, 1000);
  })

  //CLICK PER APRIRE IL POPUP CON DETTAGLI FILM
  var movieId = null;
  $('.overlay').hide();
  $(document).on('click', ".discover-btn", function(e){
    $('.popup').removeClass('d-none');
    $('.overlay').css('z-index', '4');
    $('body').css('overflow', 'hidden');
    $('.carousel-indicators li').addClass('d-none');
    $('.overlay').show();

    movieId = $(this).parents('.parentBtn').attr('data-id');
    SearchActors(movieId);
    GetDetails(movieId);
  })

  $(document).on('click', "#closePopupBtn", function(e){
    $('.overlay').hide();
    $('.popup').addClass('d-none');
    $('body').css('overflow', 'auto');
    $('.carousel-indicators li').removeClass('d-none');
    $('.cast-list').html('');
    $('.popup .details-container').html('');
  })

  //$('.read-more').hide();
  $(".read-more").click(function(){
      // $(this).siblings(".more-text").contents().unwrap();
      // $(this).remove();
  });




});



// FUNZIONE STAMPA FILM E SERIE//////////////////////
function printMovieTv(InsertedFilm, url, container) {
  $('#insert-film-name').val('');
  $(container).html('');
  $.ajax({
    url: url,
    method: 'GET',
    data: {
    api_key: '25046906a5edc120a00e8cdb72843203',
    query: InsertedFilm,
    language: 'it-IT',
    },
    success: function (risposta) {
      var source = document.getElementById("films-template").innerHTML;
      var template = Handlebars.compile(source);
      var movieId;
      var imgSize = 'w342';
      var ThisResults;
      for (var i = 0; i < risposta.results.length; i++) {
        ThisResults = risposta.results[i];
        movieId = ThisResults.id;
        var context = {
          poster_path: printPoster('film' ,ThisResults.poster_path, imgSize),
          title: ThisResults.title,
          original_title: ThisResults.original_title,
          language: ThisResults.original_language,
          name: ThisResults.name,
          original_name: ThisResults.original_name,
          vote_average: printStars(ThisResults),
          overview: ThisResults.overview,
          movieId: movieId
         };
         var html = template(context);
         $(container).append(html);

         if (ThisResults.poster_path === null) {
           printBorder(i);
         }
      }
      $('.film').show();
      $('.serie').show();
      $('.filmseries .retrocard').hide();
    },
    error: function (request, state, errors) {
      console.log(errors);
    }
  });
}

// FUNZIONE CHE STAMPA NELLO SLIDER I FILM PIU POPOLARI//////////////
function printPopular(url, container) {
  $('#insert-film-name').val('');
  $(container).html('');
  $.ajax({
    url: url,
    method: 'GET',
    data: {
    api_key: '25046906a5edc120a00e8cdb72843203',
    language: 'it-IT',
    },
    success: function (risposta) {
      var source = document.getElementById("slides-template").innerHTML;
      var template = Handlebars.compile(source);
      var ThisResults;
      var movieId;
      var imgSize = 'w1280';

      ResultsArray = [];
      var i = 0;
      while (ResultsArray.length <= 5) {
        ThisResults = risposta.results[i];
        if (ThisResults.overview.length > 0) {
          ResultsArray.push(ThisResults);
          movieId = ThisResults.id;
          filmGenre = ThisResults.genre_ids;
          var context = {
            backdrop_path: printPoster('film', ThisResults.backdrop_path, imgSize),
            title: ThisResults.title,
            genres: filmGenre,
            vote_average: printStars(ThisResults.vote_average),
            overview: ThisResults.overview,
           };

           var html = template(context);
           $(container).append(html);
           GetGenres(filmGenre);
           $('.carousel-inner > div:first-child').addClass('active');
        }
        i++;
      }
      //console.log(ResultsArray.length);
    },
    error: function (request, state, errors) {
      console.log(errors);
    }
  });
}

//FUNZIONE CHE STAMPA LE NUOVE USCITE
function printUpcoming() {
  $('.carousel_items').html('');
  $.ajax({
    url: 'https://api.themoviedb.org/3/movie/upcoming',
    method: 'GET',
    data: {
    api_key: '25046906a5edc120a00e8cdb72843203',
    language: 'it-IT',
    },
    success: function (risposta) {
      var source = document.getElementById("upcoming-template").innerHTML;
      var template = Handlebars.compile(source);
      var ThisResults;
      var movieId;
      var imgSize = 'w185';

      for (var i = 0; i < 15; i++) {
        ThisResults = risposta.results[i];
        movieId = ThisResults.id;
        filmGenre = ThisResults.genre_ids;
        var context = {
          poster_path: printPoster('film', ThisResults.poster_path, imgSize),
          title: ThisResults.title,
          //original_title: ThisResults.original_title,
          //language: ThisResults.original_language,
          vote_average: printStars(ThisResults.vote_average),
          overview: ThisResults.overview,
          movieId: movieId
         };
         readMore(ThisResults.overview);
         var html = template(context);
         $('.carousel_items').append(html);
      }
    },
    error: function (request, state, errors) {
      console.log(errors);
    }
  });
}

function readMore(overview) {
  var maxLength = 50;
  var myStr = overview;
  if(myStr.trim().length > maxLength){
    $('.read-more').show();
      // var newStr = myStr.substring(0, maxLength);
      // var removedStr = myStr.substring(maxLength, $.trim(myStr).length);
      // $('.overview-wrap p.overview').empty().html(newStr);
      // $('.overview-wrap p.overview').append('<span class="more-text">' + removedStr + '</span>');
  }
  // $(".show-read-more").each(function(){
  //     var myStr = $(this).text();
  //
  // });

}


//FUNZIONE CHE STAMPA I DETTAGLI DEL FILM
function GetDetails(movieId) {
  $.ajax({
    url: 'https://api.themoviedb.org/3/movie/' + movieId,
    method: 'GET',
    data: {
    api_key: '25046906a5edc120a00e8cdb72843203',
    language: 'it-IT',
    },
    success: function (data) {
      var source = document.getElementById("details-template").innerHTML;
      var template = Handlebars.compile(source);
      var year = data.release_date.substr(0, 4);
      var runtime = data.runtime;
      var budget = new Intl.NumberFormat();
      var description = data.overview;
      var genresName = ' ';
      for (var i = 0; i < data.genres.length; i++) {

        if (i == data.genres.length - 1) {
          genresName += data.genres[i].name;

        } else {

          genresName += data.genres[i].name + ', ';

        }
      }

        // controlli
      if (runtime == 0) {
        runtime = '-';
      } else {
        runtime += ' min';
      }
      if (data.budget == 0) {
        budget = '-';
      } else {
        budget = budget.format(data.budget) + ' $';;
      }

      if (description.length == 0) {
        description = 'Descrizione del film non disponibile.';
      }

      var revenue = new Intl.NumberFormat();

      if (data.revenue > 0) {
        revenue = revenue.format(data.revenue) + ' $';

      } else {
        revenue = '-';
      }


      var context = {
        backdrop_path: printPoster('film', data.backdrop_path, 'w1280'),
        title: data.title,
        vote_average: printStars(data.vote_average),
        year: year,
        runtime: runtime,
        language: data.original_language,
        overview: description,
        poster: printPoster('film', data.poster_path, 'w185'),
        release_date: data.release_date,
        genres: genresName,
        budget: budget,
        revenue: revenue,
      };
      var html = template(context);
      $('.popup .details-container').append(html);
    },
    error: function (errors) {
      console.log(errors);
    }
  });

}

// FUNZIONE STAMPA POSTER///////////////////////////
function printPoster(type, path, imgSize) {
  var type = type;
  var urlPoster = '';
  var urlImg = "https://image.tmdb.org/t/p/" + imgSize + "/";
  urlPoster = urlImg + path;

  if (type == 'film') {
    if (path == null) {
      urlPoster = "img/no-cover.png";
    }
  } else {
    if (path == null) {
      urlPoster = "img/no-photo.png";
    }
  }

  // if (type == 'film' && path == null) {
  //   urlPoster = "img/no-cover.png";
  // } else {
  //   urlPoster = urlImg + path;
  // }
  //
  // if (type == 'actor' && path == null) {
  //   urlPoster = "img/no-photo.png";
  // } else {
  //   urlPoster = urlImg + path;
  // }


  return urlPoster;
}

function opacity(index) {
  $('.container-film li').eq(index).css('opacity', '0.5');
  //console.log(  $('.container-film li').eq(index).css('opacity', '0.5'));
}

function printBorder(index) {
  $('li.actor .actor-image').eq(index).addClass('borders');
  $('li .filmseries').eq(index).css('border', '1px solid yellow');
}

// FUNZIONE STAMPA STELLE VOTO/////////////////////
function printStars (risultati) {
  var filmVote = Math.ceil(parseInt(risultati) / 2);
  var stars = '';

  for (var i = 0; i <= 5; i++) {
    if (i <= filmVote) {

    stars += '<i class="fas fa-star"></i>';

  } else if (i > filmVote && i < 5) {
    stars += '<i class="far fa-star"></i>';
  } else if (filmVote == 0) {
    stars = '-';
  }

  }
  return stars

}

// FUNZIONE RICERCA ATTORI////////////////////////

function SearchActors(movieId) {
  $.ajax({
    url: 'https://api.themoviedb.org/3/movie/' + movieId + '/credits',
    method: 'GET',
    data: {
    api_key: '25046906a5edc120a00e8cdb72843203',
    },
    success: function (data) {
      var source = document.getElementById("cast-template").innerHTML;
      var template = Handlebars.compile(source);

      var Cast = data.cast;
      var Crew = data.crew;
      var Director = '';
      for (var i = 0; i < Crew.length; i++) {
        if (Crew[i].job == 'Director') {
          Director = Crew[i].name;
        }
      }

      var ThisResult;
      for (var i = 0; i < Cast.length; i++) {
        ThisResult = data.cast[i];
        //console.log(ThisResult);
        var context = {
          actorName: ThisResult.name,
          actorImg: printPoster('actor', ThisResult.profile_path, 'w185'),
          actorCharacter: ThisResult.character,
          director: Director,
        };
        var html = template(context);
        $('.cast-list').append(html);
        if (ThisResult.profile_path == null) {
          printBorder(i);
        }
      }
    },
    error: function (errors) {
      console.log(errors);
    }
  });
}

// FUNZIONE CHE STAMPA I GENERI DEI FILM///////////////////
function GetGenres(filmGenre) {
  $.ajax({
    url: 'https://api.themoviedb.org/3/genre/movie/list',
    method: 'GET',
    data: {
    api_key: '25046906a5edc120a00e8cdb72843203',
    language: 'it-IT',
    },
    success: function (data) {
      var results = data.genres;
      var singleFilmGen = [];
      var singleFilmGenName;
      var arrayFilmGenName = [];
      for (var k = 0; k < results.length; k++) {
        for (var n = 0; n < filmGenre.length; n++) {
          if (results[k].id == filmGenre[n]) {
            singleFilmGenName = '<span>' + results[k].name + '</span>';
            arrayFilmGenName.push(singleFilmGenName + ' ');
            $('[data-gen="'+ filmGenre +'"]').html(arrayFilmGenName);
            }
          }
        }
      },
      error: function (errors) {
        console.log(errors);
      }
    });
}
