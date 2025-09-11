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
  try {
    // Extract query parameters for pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional: Add search functionality
    let Users = {};
    if (req.query.search) {
      Users = {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
          { 'skills': { $in: [new RegExp(req.query.search, 'i')] } }
        ]
      };
    }

    // Get profiles with pagination
    const profiles = await Profile.find(Users)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination info
    const totalProfiles = await Profile.countDocuments(Users);
    const totalPages = Math.ceil(totalProfiles / limit);

    // Check if profiles exist
    if (!profiles || profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No profiles found"
      });
    }

    // Return success response with pagination info
    res.status(200).json({
      success: true,
      message: "Profiles fetched successfully",
      data: profiles,
      pagination: {
        currentPage: page,
        totalPages,
        totalProfiles,
        profilesPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Error fetching profiles:", error);
    
    res.status(500).json({
      success: false,
      message: "Error in fetching profiles",
      error: error.message,
    });
  }
};
