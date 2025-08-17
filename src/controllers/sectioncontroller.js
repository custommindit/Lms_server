const {
  unit_exists,
  add_time,
  removequizSTD,
  removesectionSTD,
} = require("./misc");
const Section = require("../models/section");
const Quiz = require("../models/quiz");
const Grade = require("../models/grade");
const Unit = require("../models/unit");
const { isEmailAdmin } = require("../utils/staticEmail.js");
const fs = require("fs");
const path = require("path");

module.exports.create = async (req, res) => {
  try {
    let body = req.body;
    const unite = await unit_exists(body.unit);
    if (
      unite === null ||
      !req.body.decoded.admin ||
      req.body.decoded.email !== isEmailAdmin()
    ) {
      return res.json({ Success: false, message: "Unit doesn't exist" });
    }

    const new_section = new Section({
      name: body.name,
      description: body.description,
      time: body.time,
      video: body.video,
      unit: body.unit,
      level: unite.level,
    });
    new_section
      .save()
      .then(async (response) => {
        if (response) {
          await add_time(body.unit, response.time);
          return res.json({
            Success: true,
            message: `Section (${response.name}) Created`,
            data: response,
          });
        }
      })
      .catch((saveError) => {
        console.error("Error saving section:", saveError.message);
        res
          .status(500)
          .json({ Success: false, message: "Failed to save section" });
      });
  } catch (error) {
    console.error("Unexpected error in create:", error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};

module.exports.getone = async (req, res) => {
  try {
    let id = req.params.id;
    Section.findById(id)
      .then((response) => {
        return res.json({ Success: true, data: response });
      })
      .catch((findError) => {
        console.error("Error finding section:", findError.message);
        res
          .status(500)
          .json({ Success: false, message: "Failed to find section" });
      });
  } catch (error) {
    console.error("Unexpected error in getone:", error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};

module.exports.updateone = async (req, res) => {
  try {
    let id = req.params.id;
    const current = await Section.findOne({ _id: id });

    var toupdate = {
      description: req.body.description,
      name: req.body.name,
      time: req.body.time,
    };

    if (req.file) {
      if (current.video) {
        try {
          const fileName = current.video.split("/").pop();
          const fullPath = path.join(
            __dirname,
            "..",
            "..",
            "uploads",
            fileName
          );

          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted old video: ${fullPath}`);
          }
        } catch (err) {
          console.error("Error deleting old video:", err.message);
        }
      }

      // Set new video path
      toupdate.video = "http://77.37.51.112:8753/" + req.file.path;
    } else if (req.body.video) {
      // Use direct video URL if provided
      toupdate.video = req.body.video;
    }
    Section.findByIdAndUpdate(id, toupdate)
      .then(async (response) => {
        await Quiz.updateMany(
          { section: req.params.id },
          { name: req.body.name }
        );
        await Unit.updateOne(
          { _id: current.unit },
          { $inc: { totaltime: toupdate.time - current.time } }
        );
        await Quiz.updateMany(
          { section: current._id },
          { name: req.body.name }
        );
        return res.json({ Success: true, message: "Updated" });
      })
      .catch((updateError) => {
        console.error("Error updating section:", updateError.message);
        res
          .status(500)
          .json({ Success: false, message: "Failed to update section" });
      });
  } catch (error) {
    console.error("Unexpected error in updateone:", error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};

module.exports.deleteone = async (req, res) => {
  try {
    if (!req.body.decoded.admin && req.body.decoded.email !== isEmailAdmin()) {
      return res.json({ Success: false, message: "INVALID auth" });
    } else {
      let id = req.params.id;
      const deleted = await Section.findById(id);
      if (!deleted) {
        return res.json({ success: false, message: "Section Not Found" });
      }
      if (deleted.video) {
        const fileName = deleted.video.split("/").pop();
        const videoPath = path.join(__dirname, "..", "..", "uploads", fileName);

        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      }
      const quizArr = await Quiz.find({ section: deleted._id });
      await add_time(deleted.unit, 0 - deleted.time);
      await removesectionSTD(id);
      const deletePromises = quizArr.map(async (quiz) => {
        await removequizSTD(quiz._id);
        await add_time(deleted.unit, 0 - quiz.time);
        await Quiz.findByIdAndDelete(quiz._id);
        await Grade.deleteMany({ quiz_id: quiz._id });
      });
      await Promise.all(deletePromises);
      await Section.deleteOne({ _id: deleted._id });
      return res.json({
        Success: true,
        message: "Section and its linked quizzes deleted",
      });
    }
  } catch (error) {
    console.error("Unexpected error in deleteone:", error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};

module.exports.createwithupload = async (req, res) => {
  try {
    console.log("Upload started at", new Date());
    
    // التحقق من وجود الوحدة (معلق حالياً)
    // let body = req.body;
    // const unite = await unit_exists(body.unit);
    // if (unite === null || !req.body.decoded.admin || req.body.decoded.email !== isEmailAdmin()) {
    //   return res.json({ Success: false, message: "Unit doesn't exist" });
    // }
    
    if (!req.file) {
      return res.json({ Success: false, message: "No chunk uploaded" });
    }

    const fileId = req.headers["x-file-id"] || Date.now().toString();
    const fileName = req.headers["x-file-name"] || `${fileId}.mp4`;
    const chunkIndex = parseInt(req.headers["x-chunk-index"]) || 0;
    const totalChunks = parseInt(req.headers["x-total-chunks"]) || 1;
    
    // مسار الملف النهائي
    const finalPath = path.join(__dirname, "../../uploads", fileName);
    // مسار الـ chunk المؤقت
    const chunkPath = req.file.path;

    // إذا كانت هذه هي الـ chunk الأولى، تأكد من عدم وجود ملف قديم
    if (chunkIndex === 0 && fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }

    // قراءة الـ chunk وإضافته للملف النهائي
    const chunkData = fs.readFileSync(chunkPath);
    fs.appendFileSync(finalPath, chunkData);
    
    // حذف الـ chunk المؤقت
    fs.unlinkSync(chunkPath);

    console.log(`✅ Chunk ${chunkIndex + 1}/${totalChunks} uploaded for ${fileName}`);

    // إذا كانت هذه آخر chunk
    if (chunkIndex === totalChunks - 1) {
      console.log(`🎉 File ${fileName} upload completed!`);
      
      // هنا يمكنك حفظ بيانات الفيديو في قاعدة البيانات
      // const new_section = new Section({
      //   name: body.name,
      //   description: body.description,
      //   time: body.time,
      //   video: "http://77.37.86.189:8753/" + fileName,
      //   unit: body.unit,
      //   level: unite.level,
      // });
      // await new_section.save();
      // await add_time(body.unit, response.time);

      return res.json({
        Success: true,
        message: "File upload completed",
        fileId,
        fileName,
        filePath: finalPath
      });
    }

    return res.json({
      Success: true,
      message: "Chunk uploaded successfully",
      fileId,
      fileName,
      chunkIndex,
      totalChunks
    });

  } catch (error) {
    console.error("Error in createwithupload:", error);
    return res.status(500).json({ 
      Success: false, 
      message: "An error occurred",
      error: error.message 
    });
  }
};
