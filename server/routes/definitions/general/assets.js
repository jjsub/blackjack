'use strict';


module.exports ={
    description: 'Asset Routes',
    tags:['general'],
    auth: false,
    handler: {
        directoy:{
            path: __dirname + '/../../../../assets'
        }
    }
};