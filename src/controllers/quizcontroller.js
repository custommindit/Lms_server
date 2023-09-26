const { section_exists, add_time,removequizSTD} = require("./misc");
const Quiz = require("../models/quiz");
const Grade = require("../models/grade");
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
        choices:[]
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
    if (G === null) {
      return res.json({
        Success: false,
        message: "You have not started this quiz???",
      });
    } else {
      const Q= await Quiz.findById(body.id)
      let count = 0;
      
      for (let i = 0; i < body.choices.length; i++) {
        if (body.choices[i] === Q.answers[i]) {
          count++;
        }
      }
      Grade.findByIdAndUpdate(G._id,{
        $set:{grade:count,choices:body.choices}
      })
        .then((response) => {

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
    console.log(error)
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



module.exports.allgrades = async (req, res) => {
  try {
    const id =req.params.id
    var solvers=await Grade.find({quiz_id:id})
    var ll=[]
    solvers.forEach(grade => {
      ll.push({
        email:grade.student_email,
        choices:grade.choices,
        grade:grade.grade
      })
    });
    return res.json({Success:true,message:"fetched all relevent data",data:ll})

  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.deleteone = async (req, res) => {
  try {
    let id = req.params.id;
    Quiz.findById(id).then(async(response) => {
        await removequizSTD(id)
        await add_time(response.unit,0-response.time)
        await Quiz.deleteOne({_id:id})
        return  res.json({ Success: true, message: "Quiz deleted" });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
