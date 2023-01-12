const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
.then(() => console.log('Connected to MongoDB....'))
.catch(err => console.error('Could not connect to MongoDB...',err));

const courseSchema = new mongoose.Schema({
    // _id:String,
    tags: {
        type: Array,
        validate: [{
            isAsync:true,
            validator: function (v) {
                // return new Promise((resolve)=>{
                // setTimeout(()=>{
                //         //Do some async work
                //         const result = v && v.length > 0;
                //         resolve(result);
                //
                // },1000);
                // });

                // const index = v?.length;
                // for(let i = 0; i <= index; i++){
                //     // const mos = v[i].length();
                //     if( v[i]?.length <= 4){
                //         console.log('Word should have more than 4 characters');
                //         process.exit(0);
                //
                //     }
                    return v && v.length > 0;


            },
            message:'A course should have at least one tag.'
        }, {
            isAsync: true,
            validator: function (v) {
                const index = v?.length;
                for (let i = 0; i <= index; i++) {
                    if (v[i]?.length <= 3) {
                        return false;
                    }
                    return true;
                }
            },
            message: "Word should have at least 4 characters."
        }]
    },
    date: {type: Date, default: Date.now},
    name: {
        type: String,
        required: true,
        minLength:5,
        maxLength:255 /*match:pattern*/
    },
    category:{
        type:String,
        required:true,
        enum:['web','mobile','network']
    },
    author: String,
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () {return this.isPublished;}
            }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'React Course',
        author: 'Lirak',
        tags: ['hajde'],
        isPublished: true,
        category:'web',
        price:20
    });
    try{
        const result = await course.save();
        console.log(result);
    }catch (ex){
        console.log(ex.message);
    }
}
createCourse();

async function getCourses(){
    //eq (equal)
    //ne (not equal)
    //gt (greater than)
    //gte (greater then or equal to)
    //lt (less than)
    //lte (less than or equal to)
    //in
    //nin (not in)
    //or
    //and

    const courses = await Course
        .find({isPublished:true})
        .or([{price:{$gte:15}},{name:/.*by.*/}])
        // .find({price:{ $gte: 10, $lte:20}})
        // .find({price:{$in:[10,15,20]}})
        //Stars with Mosh
        // .find({ author: /^Mosh/ })
        //Ends with Hamedani
        // .find({ author: /Hamedani$/i})
        //Contains Mosh
        // .find({ author: /.*Mosh.*/i})
        // .limit(10)
        // .sort({price: -1} )
        // .select({name: 1, author:1,price:1});
        // .count();
    console.log(courses)
}

// getCourses();

// async function updateCourse(id){
//     //Approach:Query first
//     //findById()
//     //Modify its properties
//     //save()
//
//     const course = await Course.findById(id);
//     if(!course) return;
//
//     course.isPublished = true;
//     course.author = 'Another Author';
//
//     const result = await course.save();
//     console.log(result);
// }

async function updateCourse(id){
    // const result = await Course.update({_id:id},{
    const result = await Course.findByIdAndUpdate(id,{
        $set:{
            author:'Lirak',
            isPublished:true
        }
    },{new:true});
    console.log(result);
}
// updateCourse('5a68fdf95db93f6477053ddd');

async function removeCourse(id){
    // const result = await Course.update({_id:id},{
    const result = await Course.deleteMany({_id:id});
    const course = await Course.findByIdAndUpdate(id);
    console.log(result);
}
// removeCourse("638f3cb33c5908e94faf9eae");

