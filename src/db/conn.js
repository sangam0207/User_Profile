const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/Registration')
.then(()=>{
    console.log('connection is successful')
})
.catch(()=>{
    console.log('connection Fail')
})