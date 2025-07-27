const { response } = require("express");
const Unit = require("../models/unit");
const FakeViews = require("../models/fakeviews");
const {
  get_parts,
  buycount,
  delete_parts,
  delete_std_unit,
} = require("./misc");
const { isEmailAdmin } = require("../utils/staticEmail.js");
const fs = require("fs");
const path = require("path");
const Section = require("../models/section");
module.exports.create = async (req, res) => {
  try {
    let body = req.body;
    const new_unit = new Unit({
      name: body.name,
      price: body.price,
      level: body.level,
      totaltime: 0,
      image: req.file.path,
      elementcount: 0,
    });
    new_unit.save().then(async (response) => {
      if (response) {
        if (body.fakeviews) {
          let newfake = new FakeViews({
            unit_id: response._id,
            fake_number: body.fakeviews,
          });
          await newfake.save();
        }
        return res.json({
          message: `Unit ( ${response.name} ) Created`,
          Success: true,
          data: response,
        });
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.my_level = async (req, res) => {
  try {
    const level = req.body.decoded.level;
    Unit.find({ level: level }).then((response) => {
      if (response) {
        return res.json({
          Success: true,
          data: response,
        });
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.get_info = async (req, res) => {
  try {
    const id = req.params.id;

    const [quizes, sections, material] = await get_parts(id);
    const U = await Unit.findById(id);
    if (response) {
      return res.json({
        Success: true,
        quizes: quizes,
        sections: sections,
        material: material,
        unit: U,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.get_all = async (req, res) => {
  try {
    Unit.find().then((response) => {
      return res.json({
        Success: true,
        data: response,
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.get_level = async (req, res) => {
  try {
    const level = req.params.level;
    Unit.find({ level: level }).then((response) => {
      return res.json({
        Success: true,
        data: response,
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};

module.exports.update = async (req, res) => {
  try {
    let body = req.body;
    Unit.findByIdAndUpdate(
      body._id,
      {
        name: body.name,
        price: body.price,
        level: body.level,
      },
      { new: true }
    ).then((response) => {
      if (response) {
        return res.json({
          message: `Unit ( ${response.name} ) edited`,
          Success: true,
          data: response,
        });
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.delete = async (req, res) => {
  try {
    if (req.body.decoded.admin && req.body.decoded.email === isEmailAdmin()) {
      const unit = await Unit.findById(req.params.id);

      if (!unit) {
        return res.json({ Success: false, message: "Unit not found" });
      }

      if (unit.image) {
        const imagePath = path.join(__dirname, "..", unit.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      const sections = await Section.find({ unit: req.params.id });

      for (const section of sections) {
        if (section.video) {
          const relativePath = section?.video?.replace(
            "http://77.37.86.189:8753",
            ""
          );
          const videoPath = path.join(__dirname, "..", relativePath);
          if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
          }
        }
      }

      await Section.deleteMany({ unit: req.params.id });
      await delete_parts(req.params.id);
      await delete_std_unit(req.params.id);
      Unit.deleteOne({ _id: req.params.id }).then((response) => {
        return res.json({ Success: true, message: "Deleted" });
      });
    } else {
      return res.json({ Success: false, message: "INVALID AUTH" });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.get_std_number = async (req, res) => {
  try {
    const id = req.params.id;
    let fakeexists = await FakeViews.findOne({ unit_id: id });
    if (fakeexists !== null) {
      return res.json({
        Success: true,
        count: fakeexists.fake_number,
      });
    } else {
      const count = await buycount(id);
      console.log(count);
      return res.json({
        Success: true,
        count: count,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
/*
module.exports.all_units_data=async(req,res)=>{
    try {
        
        
        const [quizes,sections,material]=await get_parts(id)
        const U=await Unit.findById(id)
            if(response){
                return res.json({
                    Success:true,
                    quizes:quizes,
                    sections:sections,
                    material:material,
                    unit:U
            })
            }
        
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}*/

module.exports.update = async (req, res) => {
  try {
    if (!req.body.decoded.admin && req.body.decoded.email !== isEmailAdmin()) {
      return res.json({ Success: false, message: "Missing auth level 0" });
    }
    let updated = { Success: false, message: "SOME ERROR OCCURED" };
    let body = req.body;

    updated.name = body.name;
    updated.price = body.price;
    updated.level = body.level;

    if (req.file && req.file.path) {
      const currentUnit = await Unit.findById(body._id);

      if (currentUnit && currentUnit.image) {
        const oldImagePath = path.join(__dirname, "..", currentUnit.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updated.image = req.file.path;
    }

    Unit.findByIdAndUpdate(body._id, updated, { new: true }).then(
      async (response) => {
        if (response) {
          if (body.fakeviews) {
            let fakeexists = await FakeViews.findOne({ unit_id: response._id });
            if (fakeexists !== null) {
              await FakeViews.updateOne(
                { _id: fakeexists._id },
                { fake_number: body.fakeviews }
              );
            } else {
              let newfake = new FakeViews({
                unit_id: response._id,
                fake_number: body.fakeviews,
              });
              await newfake.save();
            }
          }
          return res.json({
            message: `Unit ( ${response.name} ) edited`,
            Success: true,
            data: response,
          });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    if (req.file && req.file.path) {
      const newImagePath = path.join(__dirname, "..", req.file.path);
      if (fs.existsSync(newImagePath)) {
        fs.unlinkSync(newImagePath);
      }
    }
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
