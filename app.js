var SERVER_NAME = 'image-api'
var PORT = 5000
var HOST = '127.0.0.1'

var restify = require('restify')
var imageStore = require('save')('images')

var server = restify.createServer({name: SERVER_NAME})


server.listen(PORT, HOST, function (){
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints:')
  console.log('%s:%s/%s methods:(GET, POST, DELETE)',HOST,PORT,'images')  

})

function _showArgsError(next,errorMessage){
  console.log('POST /images: error '+errorMessage)
  return next(new restify.InvalidArgumentError(errorMessage))
}

function _logRequest(method, param){
  console.log('%s /images: received request '+JSON.stringify(param,null, 2),method)

}

function _logResponse(method, body){
  console.log('%s /images: response sent '+JSON.stringify(body,null, 2),method)
}

server.use(restify.fullResponse()).use(restify.bodyParser())

server.post('/images', function(req, res,next){
  _logRequest('POST',req.params)
  if(req.params.imageId === undefined){
    return _showArgsError(next, 'imageId is not specified')
  }
  else if(req.params.name === undefined){
    return _showArgsError(next, 'name is not specified')
  }
  else if(req.params.url === undefined){
    return _showArgsError(next, 'url is not specified')
  }
  else if(req.params.size === undefined){
    return _showArgsError(next, 'size is not specified')
  }

  var newImage = {
    imageId : req.params.imageId,
    name: req.params.name,
    url: req.params.url,
    size: req.params.size
  }

  imageStore.create(newImage, function(error, image){

 
    if(error) { 
      var errorMessage = "unable to create new record for image"
      console.log('POST /images: error '+errorMessage)
      next(500, restify.InternalError(errorMessage))
    }

    _logResponse('POST',newImage)
    res.send(201,image)
  })
})

server.get('/images',function(req,res,next){

  console.log('GET /images received request')

  imageStore.find({},function(error, images){
    res.send(images)
  })
})

server.get('/images', function(req, res,next){

})