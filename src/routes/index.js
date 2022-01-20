const express = require("express");
const router = express.Router();
const https = require("https");
const { start } = require("repl");
const { ensureAuthenticated } = require("../../config/auth");
const axios = require("axios");
const Exam = require("../models/Exam.js");
const Student = require("../models/Student.js");

let newTestCode;

router.get("/", (req, res) => {
	res.render("index");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
	res.render("dashboard", {
		name: req.user.name,
	});
});

router.post("/dashboard", async (req, res) => {
	const { testName, testCode, category, difficulty, limit } = req.body;
	const name = req.user.name;
	const email = req.user.email;

	const url =
		"https://quizapi.io/api/v1/questions?apiKey=PgCAQzEcs1eGMj5R1Dyt7Qk7bPtI3Rl7QmAVc3iC&category=" +
		category +
		"&difficulty=" +
		difficulty +
		"&limit=" +
		limit;

	const data = await axios
		.get(url)
		.then(async (res) => {
			const newData = res.data;
			console.log(newData);
			console.log("New Data : ", typeof newData);
			const newExam = {
				name,
				email,
				testName,
				testCode,
				newData,
			};

			const save = await Exam.create(newExam);
		})
		.catch((err) => console.log(err));

	res.render("dashboard", {
		name: req.user.name,
	});
});

router.get("/code", (req, res) => {
	res.render("code");
});

router.post("/code", async (req, res) => {
	const { name, rollno, testCode } = req.body;
	let errors = [];

	const examCode = await Exam.findOne(
		{ testCode: testCode },
		{ _id: 0 }
	).select({ testCode: 1 });

	const exam = await Exam.findOne({ testCode: testCode }, { _id: 0 });

	if (examCode === null) {
		errors.push({ msg: "Invalid Code Please Verify Your Code" });
	} else {
		newTestCode = examCode;
		req.flash("tCode", testCode);
		res.redirect("quiz");
	}

	if (errors.length > 0) {
		res.render("code", {
			errors,
		});
	}
});

router.get("/quiz", async (req, res) => {
	const forThisTest = newTestCode.testCode;
	const exam = await Exam.findOne({ testCode: forThisTest });
	const forThisQuiz = exam.testName;
	let questions = [];
	exam.newData.forEach((ques) => {
		questions.push(ques);
	});

	res.render("quiz", { questions, forThisTest, forThisQuiz });
});

router.post("/quiz", async (req, res) => {
	const { testCode, testName, name, rollno } = req.body;
	const exam = await Exam.findOne({ testCode: testCode }, { _id: 0 });

	const quizData = req.body;
	const quizDataLength = Object.keys(quizData).length;

	let answers = [];

	for (let k = 0; k < quizDataLength - 4; k++) {
		answers[k] = quizData["question" + (k + 1)];
	}

	let score = 0;

	for (let i = 0; i < exam.newData.length; i++) {
		const correctAnswer = exam.newData[i].correct_answer;
		const correctAnswerValue = exam.newData[i].answers[correctAnswer];

		if (correctAnswerValue === answers[i]) {
			score++;
		}
	}

	console.log(score);
	const marks = score;
	const studentData = {
		name,
		rollno,
		testName,
		testCode,
		marks,
	};

	const createStudentRecord = await Student.create(studentData);

	req.flash("marks", marks);
	res.redirect("/");
});

module.exports = router;
