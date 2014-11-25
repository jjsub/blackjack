'use strict';

var mongoose   = require('mongoose'),
    bcrypt     = require('bcrypt'),
    UserSchema = null,
    request    =   require('request'),
    AWS        =   require('aws-sdk'),
    path       =   require('path'),
    User       = null;

UserSchema = new mongoose.Schema({
  username:  {type: String, required: true, validate: [usernameV, 'username length'], unique: true},
  password:  {type: String, required: true, validate: [passwordV, 'password length']},
    avatar:  {type: String, required: true},
  createdAt: {type: Date,  required: true, default: Date.now}
});

UserSchema.methods.encrypt = function(){
  this.password = bcrypt.hashSync(this.password, 10);
};

UserSchema.methods.download = function(cb){
    var s3   = new AWS.S3(),
        url  = this.avatar,
        ext  = path.extname(this.avatar),
        file = this._id + '.avatar' + ext;

    this.avatar = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + '/' + file;

    request({url: url, encoding: null}, function(err, response, body){
        var params = {Bucket: process.env.AWS_BUCKET, Key: file, Body: body, ACL: 'public-read'};
        s3.putObject(params, cb);
    });
};

/*UserSchema.methods.download = function(cb){
    var assetDir = __dirname + '/../../assets/' + this._id,
        ext      = path.extname(this.avatar);

    fs.mkdirSync(assetDir);

    request(this.avatar).pipe(fs.createWriteStream(assetDir + '/avatar' + ext));
    this.avatar = '/assets' + this._id + '/avatar' + ext;
};*/



UserSchema.statics.login = function(obj, cb){
  User.findOne({username: obj.username}, function(err, user){
    if(!user){
     return cb();
    }

    var isGood = bcrypt.compareSync(obj.password, user.password);

    if(!isGood){
      return cb();
    }

    cb(user);
  });
};

function usernameV(v){
  return v.length >= 3 && v.length <= 12;
}

function passwordV(v){
  return v.length === 60;
}


/*request({url: 'url', encoding: 'binary'}, function(err, resp, html){
    if(!err && resp.statusCode == 200) {
        var $ = cheerio.load(html);
        $('img').each(function(){
            var img =  $(this).attr('src');
            console.log('+ -------- +')
            console.log(img)

            var data = new imgModel({
                url: url

            })


        });
    }

});*/




User = mongoose.model('User', UserSchema);
module.exports = User;
