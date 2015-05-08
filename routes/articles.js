var Article = require('../models/article');
var User = require('../models/user');


module.exports = function(app){

    /**
    * Find and retrieves all articles
    * @param {Object} req HTTP request object.
    * @param {Object} res HTTP response object.
    */

    findAllArticles = function(req, res){

        console.log('GET - /articles');
        
        return Article.find().populate('author').exec(function(err, articles){
            if(!err){
                return res.render('articles/index', { articles: articles });
            }else{
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server Error' });
            }
        });  
    };

    /**
    * Find and retrieves a single article by its SLUG
    * @param {Object} req HTTP request object.
    * @param {Object} res HTTP response object.
    */

    showArticle = function(req, res){

        console.log('GET - /article/:slug');

        return Article.findOne({ slug: req.params.slug }, function(err, article){
            if(!article){
                res.statusCode = 404;
                return res.send({ error: 'Page not found' });
            }

            if(!err){
                return res.render('articles/show', { article: article });
            }else{
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server Error' });
            }
        });
    };

    /**
    * Find and retrieves a single article by its SLUG
    */

    editArticle = function(req, res){

        console.log('GET - /article/:slug/edit');

        var user = req.session.user;
        return Article.findOne({ slug: req.params.slug, author: user._id }, function(err, article){
            if(!article){
                res.statusCode = 404;
                return res.send({ error: 'Page not found' });
            }

            if(!err){
                return res.render('articles/edit', { article: article });
            }else{
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server Error' });
            }
        });
    };

    /**
    * Creates a new article from the data request
    * @param {Object} req HTTP request object.
    * @param {Object} res HTTP response object.
    */

    createArticle = function(req, res){
        
        console.log('POST - /article');
        var user = req.session.user;
        var article = new Article({
            title       : req.body.title,
            description : req.body.description,
            content     : req.body.content,
            pic         : req.files.pic.path,
            author      : user._id
        });


        User.findById(user._id, function(err, user) {
            if(err || !user){
                req.session.flashMessage = {
                    type: 'error',
                    message: 'Article was failed to create.'
                }

                return res.redirect('/articles');
            }


            article.save(function(err){
                if(err){
                    if(err.name == 'ValidationError'){
                        res.statusCode = 400;
                        return res.render('articles/failed_created', { message: err, article: article });
                    }
                    console.log('Error while saving article : ' + err);
                    res.send({ error: err });
                    return
                }else{
                    console.log('Article created')
                    req.session.flashMessage = {
                        type: 'success',
                        message: 'Article was successfully created.'
                    }

                    user.articles.push(article);
                    user.save();
                    return res.redirect('/article/'+ article.slug);
                }
            });
        });
    };

    /**
    * Update a article by its ID
    * @param {Object} req HTTP request object.
    * @param {Object} res HTTP response object.
    */

    updateArticle = function(req, res){

        console.log('PUT - /article/:id');
        return Article.findById(req.params.id, function(err, article){

            if(!article){
                res.statusCode = 404;
                return res.send({ error: 'Page not found' });
            }

            if (req.body.title != null) article.title = req.body.title;
            if (req.body.description != null) article.description = req.body.description;
            if (req.body.content != null) article.content = req.body.content;

            return article.save(function(err){
                if(!err){
                    console.log('updated.');
                    req.session.flashMessage = {
                        type: 'success',
                        message: 'Article was successfully updated.'
                    }
                    return res.redirect('/article/'+ article.slug);
                }else{
                    if(err.name == 'ValidationError'){
                        res.statusCode = 400;
                        return res.render('articles/failed_updated', { message: err, article: article });
                    }else{
                        res.statusCode = 500;
                        res.send({ error: 'Server error' });
                    }

                    console.log('Internal server error(%d): %s', res.statusCode, err.message);
                
                }

                res.send(article);
            });
        });
    };

    /**
    * Delete a article by its ID
    * @param {Object} req HTTP request object.
    * @param {Object} res HTTP response object.
    */

    deleteArticle = function(req, res){

        console.log('DELETE - /article/:id');

        return Article.findById(req.params.id, function(err, article){
            if(!article){
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            return article.remove(function(err){
                if(!err){
                    console.log('Removed article.');
                    req.session.flashMessage = {
                        type: 'success',
                        message: 'Article was successfully removed.'
                    }
                    return res.redirect('/articles');
                }else{
                    res.statusCode = 500;
                    console.log('Internal error(%d): %s',res.statusCode,err.message);
                    return res.send({ error: 'Server error' })
                }
            })
        })
    };



    // Link routes and action

    app.get('/articles', findAllArticles);
   
    app.delete('/article/:id', deleteArticle);

    app.post('/article', createArticle);
    
    app.get('/article/new', function(req, res) {
        return res.render('articles/new');
    });

    app.get('/article/:slug', showArticle);

    app.put('/article/:id', updateArticle);
   
    app.get('/article/:slug/edit', editArticle);
};