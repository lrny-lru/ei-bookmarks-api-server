const express = require('express');
const jsonParse = require('express').json();
const bookmarkRoute = express.Router();
const logger = require('./logger');
const uuid = require('uuid').v4;

const { data, findItem, validateUrl, deleteItem } = require('./data');

function validateJsonRequest (req, res, next) {
  const contentType = req.headers['content-type'];
  
  if(!contentType || contentType.includes('json')) {
    return res
      .status(400)
      .sjon({ message: 'Request must include JSON body'});
  }
  next();
}

//GET
bookmarkRoute
  .route('/')
  .get((req,res) => { 
    res 
      .status(200)
      .json(data);

  })

// POST

  .post(jsonParse, validateJsonRequest, (req,res) =>{
    const { title, url, desc, rating} = req.body;

    if( !title ){
      return res
        .status(400)
        .json({ message: 'Title required '});
    }

    if( !url || validateUrl(url) ){
      return res
        .status(400)
        .json({ message: ' Valid URL required '});
    }

    if ( rating && !parseInt(rating) ){
      return res
        .status(400)
        .json({ message: 'Rating must be a number' });
    }

    const newBookmark = {
      id:uuid(),
      title,
      url,
      desc: desc || '',
      rating: parseInt(rating) || null
    };
    // Add new data to the database
    data.push( newBookmark );
    return res
      .status( 200 )
      .json( newBookmark );
  });

// PATCH

bookmarkRoute
  .route('/:id')
  .patch(jsonParse, validateJsonRequest, (req,res) => {
    const { id } = req.params;
    const { title, url, desc, rating } = req.body;

    if ( !(title || desc || url || rating ) ){ 
      return res
        .status(400)
        .json({ mesage: 'At least one valid field required'});
    }

    if ( url && !validateUrl(url) ){
      return res
        .status(400)
        .json({ message: 'URL must be valid'});
    }
    if (rating && !parseInt(rating)) {
      return res
        .status(400)
        .json({ message: 'Rating must be a number' });
    }
    const bookmark = findItem(id);
    if (!bookmark) {
      return res
        .status(404)
        .json({ message: `Bookmark with id ${id} not found` });
    }


    title && Object.assign(bookmark, { title });
    url && Object.assign(bookmark, { url });
    desc && Object.assign(bookmark, { desc });
    rating && Object.assign(bookmark, { rating });

    return res
      .status(200)
      .json(bookmark);

  })

// Delete

  .delete((req, res) => {
    const { id } = req.params;
    if (!deleteItem(id)) {
      return res
        .status(404)
        .json({ message: `Bookmark with id ${id} not found` });
    }
    return res
      .status(200)
      .end();
  });

    


module.exports = bookmarkRoute;

