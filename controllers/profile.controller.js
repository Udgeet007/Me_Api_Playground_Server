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
    res.status(500).json({
      success: false,
      message: "Error in fetching profiles",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // Get profile ID from URL parameters
    const { id } = req.params;

    // Extract all data from request body
    const {
      name,
      education,
      skills,
      projects,
      work,
      links
    } = req.body;

    // Check if profile exists
    const existingProfile = await Profile.findById(id);
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // Create update object with only provided fields
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (education !== undefined) updateData.education = education;
    if (skills !== undefined) updateData.skills = skills;
    if (projects !== undefined) updateData.projects = projects;
    if (work !== undefined) updateData.work = work;
    if (links !== undefined) {
      updateData.links = {
        github: links.github,
        linkedin: links.linkedin,
        portfolio: links.portfolio
      };
    }
    
    // Always update the timestamp
    updateData.updatedAt = new Date();

    // Check if there's anything to update
    if (Object.keys(updateData).length === 1) { // Only updatedAt
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update"
      });
    }

    // Update the profile
    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run mongoose validations
      }
    );

    // Return success response
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile
    });

  } catch (error) {
    console.error("Error updating profile:", error);

    // Handle invalid ObjectId error
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid profile ID"
      });
    }

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors
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

export const searchProfilesBySkills = async (req, res) => {
  try {
    // get skills from query parameters
    const { skills } = req.query;
    
    //check if skills is provided
    if (!skills) {
      return res.status(400).json({
        success: false,
        message: "Skills parameter is required in query"
      });
    }

    const skillsArray = skills.split(',').map(skill => skill.trim());
    
    // Create case-insensitive regex patterns for each skill
    const skillRegexArray = skillsArray.map(skill => new RegExp(skill, 'i'));
    
    // Find profiles that contain any of the specified skills
    const profiles = await Profile.find({
      skills: {
        $in: skillRegexArray
      }
    }).select('-__v'); // Exclude version field
    
    // Return results
    res.status(200).json({
      success: true,
      message: `Found ${profiles.length} profile(s) with the specified skill(s)`,
      count: profiles.length,
      data: profiles,
      searchedSkills: skillsArray
    });
    
  } catch (error) {  
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }

};
