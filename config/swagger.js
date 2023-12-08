const options={
    swaggerDefinition:{
        info:{
            title:'Node Js Backend API ',
            version:'1.0.0',
            description: "API description",
        },
        servers:[
            {
                url: 'http://localhost:3000/'
            }
        ]
    },
    apis:["./routes/*.js"]
}
module.exports = options;