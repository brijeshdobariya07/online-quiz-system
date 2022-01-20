const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const Exam = require("../models/Exam");
const Student = require("../models/Student");

router.get("/login", (req, res) => {
	res.render("login");
});

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	const { email, name, password, password2 } = req.body;
	let errors = [];

	if (!name || !email || !password || !password2) {
		errors.push({ msg: "Please Fill in all the fields" });
	}

	if (password !== password2) {
		errors.push({ msg: "Password doesn't match" });
	}

	if (password.length < 6) {
		errors.push({ msg: "Password should be at least 6 charaxters" });
	}

	if (errors.length > 0) {
		res.render("register", {
			errors,
			name,
			email,
			password,
			password2,
		});
	} else {
		User.findOne({ email: email }).then((user) => {
			if (user) {
				// User Exist
				errors.push({ msg: "Email is already registered" });
				res.render("register", {
					errors,
					name,
					email,
					password,
					password2,
				});
			} else {
				const newUser = new User({
					name,
					email,
					password,
				});
				console.log(newUser);
				newUser
					.save()
					.then((user) => {
						req.flash("success_msg", "You are now registered and can log in");
						res.redirect("login");
					})
					.catch((err) => console.log(err));
			}
		});
	}
});

// Login Handle
router.post("/login", (req, res, next) => {
	passport.authenticate(
		"local",
		{
			successRedirect: "/dashboard",
			failureRedirect: "/users/login",
			failureFlash: true,
		},
		console.log(req.body)
	)(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "You are Logged out");
	res.redirect("login");
});

router.get("/tests/:name", async (req, res) => {
	const name = req.params.name;
	const exam = await Exam.find({ name: name });

	const examDetails = [];
	exam.forEach((details) => {
		let thisDetail = {
			testName: details.testName,
			testCode: details.testCode,
		};
		examDetails.push(thisDetail);
	});

	res.render("tests", { name, examDetails });
});

router.get("/tests/:name/:code", async (req, res) => {
	const name = req.params.name;
	const code = req.params.code;

	const testData = await Exam.findOne({ name: name, testCode: code });
	const questionsData = testData.newData;

	res.render("viewtest", { name, testData, questionsData });
});

router.get("/tests/:name/delete/:testName/:testCode", async (req, res) => {
	const testName = req.params.testName;
	const testCode = req.params.testCode;
	const name = req.params.name;

	const deleted = await Exam.deleteOne({
		testName: testName,
		testCode: testCode,
	});

	const exam = await Exam.find({ name: name });
	// console.log("Exam : ", exam);

	const examDetails = [];

	exam.forEach((details) => {
		let thisDetail = {
			testName: details.testName,
			testCode: details.testCode,
		};
		examDetails.push(thisDetail);
	});

	res.render("tests", { name, examDetails });
});

router.get("/custom/:name", (req, res) => {
	const name = req.params.name;
	res.render("customTest", { name });
});

router.post("/custom/:name", async (req, res) => {
	const {
		name,
		email,
		testName,
		testCode,
		question,
		answer_a,
		answer_b,
		answer_c,
		answer_d,
		correct_answer,
	} = req.body;
	let newData = [];
	let queObj = {};
	let ansObj = {};

	ansObj["answer_a"] = answer_a;
	ansObj["answer_b"] = answer_b;
	ansObj["answer_c"] = answer_c;
	ansObj["answer_d"] = answer_d;

	queObj["question"] = question;
	queObj["answers"] = ansObj;
	queObj["correct_answer"] = correct_answer;

	newData.push(queObj);

	const exam = await Exam.findOne({ testName: testName, testCode: testCode });
	let createExam;

	if (exam !== null) {
		exam.newData.push(queObj);
		const save = new Exam(exam);
		const savedExam = await save.save();
		res.render("customTest", { name, email, testName, testCode, exam });
	} else {
		const thisExam = { name, email, testName, testCode, newData };
		createExam = await Exam.create(thisExam);
		res.render("customTest", { name, email, testName, testCode, createExam });
	}

	// res.render('customTest',{name,email,testName,testCode,exam,createExam});
});

router.get("/result/:name", async (req, res) => {
	const name = req.params.name;
	const exam = await Exam.find({ name: name });

	const examDetails = [];
	exam.forEach((details) => {
		let thisDetail = {
			testName: details.testName,
			testCode: details.testCode,
		};
		examDetails.push(thisDetail);
	});

	res.render("resultTestName", { name, examDetails });
});

router.get("/result/:name/:code", async (req, res) => {
	const name = req.params.name;
	const testCode = req.params.code;

	const students = await Student.find({ testCode: testCode });
	console.log(students);

	res.render("studentResult", { name, students });
});

module.exports = router;
