//config settings
var SERVER_NAME = 'image-api'
var PORT = 5000
var HOST = '127.0.0.1'

var restify = require('restify')
//create memrory store for to store images information
var imageStore = require('save')('images')

//declare POST and GET counters
var postCounter = 0
var getCounter = 0

//create server
var server = restify.createServer({name: SERVER_NAME})

//list to serve and display avaiblem methods
server.listen(PORT, HOST, function (){
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints:')
  console.log('%s:%s/%s methods:(GET, POST, DELETE)',HOST,PORT,'images')  

})


server.use(restify.fullResponse()).use(restify.bodyParser())

//function to display error if an argument is missing
function _showArgsError(next,errorMessage){
  console.log('POST /images: error '+errorMessage)
  return next(new restify.InvalidArgumentError(errorMessage))
}

//function to display and increament count values, 
//this function also logs that a request that was received
function _logRequest(method, param){

  if(method == 'POST'){
    postCounter++
  }
  if(method == 'GET'){
    getCounter++
  }

  console.log('Processed Request Count: GET:%s POST:%s',getCounter,postCounter)
  console.log('%s /images: received request '+JSON.stringify(param,null, 2),method)
}

//logs that response is being sent back to clients
function _logResponse(method, body){
  console.log('%s /images: response sent '+JSON.stringify(body,null, 2),method)
}



//api to add a new images memory
server.post('/images', function(req, res,next){

  //logs request recieved
  _logRequest('POST',req.params)
  
  //valid request
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

  //create image object
  var newImage = {
    imageId : req.params.imageId,
    name: req.params.name,
    url: req.params.url,
    size: req.params.size
  }

  //save create images
  imageStore.create(newImage, function(error, image){

    //if error while saving return internal server error
    if(error) { 
      console.log('POST /images: error '+JSON.stringify(error.errors))
      next(restify.InternalError("unable to create new record for image"))
    }
    //log response
    _logResponse('POST',newImage)
    res.send(201,image)
  })
})


//delete all image from memory database
server.del('/images',function(req,res,next){

  _logRequest('POST',req.params)
  
  //delete all images from memory store
  imageStore.deleteMany({},function(){

  })
  
  _logResponse('DELETE',[])
  
  res.send()
})

//get all images in memory database
server.get('/images',function(req,res,next){
  _logRequest('GET',req.params)

  //find all images and send response as json array
  imageStore.find({},function(error, images){
   
    if(error) { 
      console.log('POST /images: error '+JSON.stringify(error.errors))
      next(restify.InternalError("unable to get images"))
    }
    _logResponse('GET',images)
    res.send(images)
  })
})

