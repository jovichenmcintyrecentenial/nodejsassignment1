var SERVER_NAME = 'image-api'
var PORT = 5000
var HOST = '127.0.0.1'

var restify = require('restify')
var imageStore = require('save')('images')

var server = restify.createServer({name: SERVER_NAME})


server.listen(PORT, HOST, function (){
  console.log('Server %s listening at %s', server.name, server.url)

})

server.use(restify.fullResponse()).use(restify.bodyParser())

server.post('/images', function(req, res,next){
  console.log('POST /images')

  if(req.params.imageId === undefined){
    return next(new restify.InvalidArgumentError('imageId is not specified'))
  }
  else if(req.params.name === undefined){
    return next(new restify.InvalidArgumentError('name is not specified'))
  }
  else if(req.params.url === undefined){
    return next(new restify.InvalidArgumentError('url is not specified'))
  }
  else if(req.params.size === undefined){
    return next(new restify.InvalidArgumentError('size is not specified'))
  }

  var newImage = {
    imageId : req.params.imageId,
    name: req.params.name,
    url: req.params.url,
    size: req.params.size
  }

  imageStore.create(newImage, function(error, image){

    if(error) next(restify.InvalidArgumentError(JSON.stringify(error.errors)))

    res.send(201,image)
  })
})

server.get('/images',function(req,res,next){

  console.log('GET /images')

  imageStore.find({},function(error, images){
    res.send(images)
  })
})

server.get('/images', function(req, res,next){

})