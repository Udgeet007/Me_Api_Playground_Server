import { Profile } from "../models/profile.model.js";

// Create a new profile
export const createProfile = async (req, res) => {
  try {
    // Extract all data from request body
    const {
      name,
      email,
      education,
      skills,
      projects,
      work,
      links
    } = req.body;

    // Validate required fields
    if (!name || !email || !links?.github || !links?.linkedin || !links?.portfolio) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, and all links (github, linkedin, portfolio) are required"
      });
    }

    // Check if profile with this email already exists
    const existingProfile = await Profile.findOne({ email });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Profile with this email already exists"
      });
    }

    // Create new profile object
    const profileData = {
      name,
      email,
      education: education || [],
      skills: skills || [],
      projects: projects || [],
      work: work || [],
      links: {
        github: links.github,
        linkedin: links.linkedin,
        portfolio: links.portfolio
      }
    };

    // Create and save the profile
    const newProfile = new Profile(profileData);
    const savedProfile = await newProfile.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: savedProfile
    });

  } catch (error) {
    console.error("Error creating profile:", error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors
      });
    }

    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getAllProfiles = async (req, res) => {
  
};