const express = require('express');
const multer = require('multer');
const Resource = require('../models/Resource'); // Ensure the path to Resource model is correct

const router = express.Router();

// Set up multer for handling file uploads
const upload = multer({ dest: 'uploads/resumes/' });

// POST request to add a new resource
router.post('/add', upload.single('resume'), async (req, res) => {
  console.log('Request Body:', req.body);  // Log request body
  console.log('Uploaded File:', req.file); // Log the uploaded file
  
  try {
    const newResource = new Resource({
      fullName: req.body.fullName,  // From form input
      resume: req.file ? req.file.path : '',  // Resume file path from multer
      vendorName: req.body.vendorName,  // Vendor name from form input
      technologies: req.body.technologies ? JSON.parse(req.body.technologies) : [],
    });

    await newResource.save();  // Save to the database
    res.status(201).json({ message: 'Resource added successfully!' });
  } catch (error) {
    console.error('Error saving resource:', error);
    res.status(400).json({ error: 'Error saving resource' });
  }
});
router.get('/', async (req, res) => {
    try {
      // Fetching all resources from the database
      const resources = await Resource.find(); 
      res.json(resources);  // Sending the resources back as a response
    } catch (error) {
      console.error("Error fetching resources:", error);  // Log any errors to the console
      res.status(500).json({ error: 'Error fetching resources.' });  // Send an error response if something goes wrong
    }
  });

module.exports = router;
