const { section_exists, add_time } = require("./misc");
const Quiz = require("../models/quiz");
const Grade = require("../models/grade");
const Student =require('../models/student')
const { response } = require("express");

module.exports.create = async (req, res) => {
  try {
    let body = req.body;
    const section = await section_exists(body.section);
    if (section === null) {
      return res.json({ Success: false, message: "Unit doesn't exist" });
    }
    if (body.questions.length !== body.answers.length) {
      return res.json({
        Success: false,
        message: "questions and answers do not match",
      });
    }
    const new_quiz = new Quiz({
      name: section.name,
      questions: body.questions,
      answers: body.answers,
      time: body.time,
      unit: section.unit,
      section: section._id,
      level: section.level,
      grading: body.grading,
    });
    new_quiz.save().then(async (response) => {
      if (response) {
        await add_time(section.unit, response.time);
        return res.json({
          Success: true,
          message: `quiz ( ${response.name} ) Created`,
          data: response,
        });
      } else return res.json({ Success: false, message: "Creation Failed" });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.start = async (req, res) => {
  try {
    const body = req.body;
    const Q = await Grade.findOne({
      quiz_id: body.id,
      student_email: body.decoded.email,
    });
    if (Q !== null) {
      return res.json({
        Success: false,
        message: "You have already accessed this quiz",
      });
    } else {
      const new_grade = new Grade({
        student_email: body.decoded.email,
        quiz_id: body.id,
        grade: -1,
      });
      new_grade.save().then((response) => {
        return res.json({ Success: true, message: "Quiz timer started!!" });
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.finish = async (req, res) => {
  try {
    const body = req.body;
    const G = await Grade.findOne({
      quiz_id: body.id,
      student_email: body.decoded.email,
    });
    const student = await Student.findOne({ email: body.decoded.email });
    if (G === null) {
      return res.json({
        Success: false,
        message: "You have not started this quiz???",
      });
    } else {
      const Q= Quiz.findById(body.id)
      let count = 0;
      for (let i = 0; i < body.choices.length; i++) {
        if (body.choices[i] === Q.answers[i]) {
          count++;
        }
      }
      Grade.findByIdAndUpdate(G._id,{
        $set:{grade:count,choices:body.choices}
      })
        .then(async(response) => {
          const myUnit = student.myunits.find((unitObj) => unitObj.unit === Q.unit);
          const uniquequizes = new Set(myUnit.quizes);
          myUnit.quizes.forEach((quiz) => uniquequizes.add(quiz));
          uniquequizes.add(body.id)
          myUnit.quizes = Array.from(uniquequizes);
          await student.save();
          return res.json({ Success: true, message: "Quiz graded " });
        })
        .catch((error) => {
          return res.json({
            Success: false,
            message: "Failed to update grade",
          });
        });
    }
  } catch (error) {
    return res.json({ Success: false, message: "SOME ERROR OCCURRED" });
  }
};

module.exports.getone = async (req, res) => {
  try {
    let id = req.params.id;
    Quiz.findById(id).then((response) => {
      return res.json({ Success: true, data: response });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};

module.exports.my_grades = async (req, res) => {
  try {
    Grade.find({student_email:req.body.decoded.email}).then((response) => {
      return res.json({ Success: true, data: response });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};