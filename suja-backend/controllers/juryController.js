// controllers/juryController.js
const Jury = require('../models/Jury');

// Create a new jury member
exports.createJury = async (req, res) => {
   try {
      const jury = new Jury(req.body);
      await jury.save();
      res.status(201).json(jury);
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
};

// Get all jury members
exports.getJuries = async (req, res) => {
   try {
      const juries = await Jury.find();
      res.json(juries);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};
