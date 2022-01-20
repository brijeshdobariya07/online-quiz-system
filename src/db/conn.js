const mongoose = require("mongoose");

mongoose
	.connect(
		"mongodb+srv://brijeshd:brijeshd@cluster0.ujvma.mongodb.net/quizProject?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log("MongoDB Connected...");
	})
	.catch((error) => {
		console.log(error);
	});

// mongoose.connect("mongodb://localhost:27017/quizProject",{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// }).then(()=>{
//     console.log("MongoDB Connected...");
// }).catch((error)=>{
//     console.log(error);
// })
