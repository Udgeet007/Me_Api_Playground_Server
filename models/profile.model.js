import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        field: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        gpa: { type: String },
      },
    ],
    skills: [{ type: String, required: true }],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        links: {
          github: { type: String },
          live: { type: String },
        },
        technologies: [{ type: String }],
        startDate: { type: String, required: true },
        endDate: { type: String },
      },
    ],
    work: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        description: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String },
        location: { type: String, required: true },
      },
    ],
    links: {
      github: { type: String, required: true },
      linkedin: { type: String, required: true },
      portfolio: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export const Profile = mongoose.model("Profile", ProfileSchema);
