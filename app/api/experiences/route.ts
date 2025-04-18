import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Define the Experience schema
const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: [String],
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Track connections by URI and portfolioId
const connections: { [key: string]: mongoose.Connection } = {};

// Connect to MongoDB with a specific URI
async function connectToDatabase(dbUri: string, portfolioId: string) {
  try {
    // Create a unique connection key using both URI and portfolioId
    const connectionKey = `${portfolioId}:${dbUri}`;
    
    // If we already have a connection for this key, return it
    if (connections[connectionKey]) {
      console.log(`Reusing existing connection for ${portfolioId} (experiences)`);
      return connections[connectionKey];
    }
    
    // Create a new connection
    console.log(`Creating new connection for ${portfolioId} (experiences)`);
    const connection = await mongoose.createConnection(dbUri);
    connections[connectionKey] = connection;
    
    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB for experiences', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dbUri, portfolioId, action, experienceData, experienceId } = body;
    
    if (!dbUri) {
      return NextResponse.json({ error: 'Database URI is required' }, { status: 400 });
    }
    
    if (!portfolioId) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 });
    }
    
    // Connect to the specific database
    const connection = await connectToDatabase(dbUri, portfolioId);
    
    // Create a model using this specific connection
    const Experience = connection.model('Experience', experienceSchema);
    
    // Handle different actions
    if (action === 'add' && experienceData) {
      // Add a new experience
      console.log(`Adding new experience for portfolio ${portfolioId}:`, experienceData);
      const newExperience = new Experience(experienceData);
      const savedExperience = await newExperience.save();
      return NextResponse.json(savedExperience);
    } else if (action === 'edit' && experienceId && experienceData) {
      // Edit an existing experience
      console.log(`Editing experience ${experienceId} in portfolio ${portfolioId}:`, experienceData);
      const updatedExperience = await Experience.findByIdAndUpdate(
        experienceId, 
        experienceData, 
        { new: true, runValidators: true }
      );
      
      if (!updatedExperience) {
        return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
      }
      
      return NextResponse.json(updatedExperience);
    } else if (action === 'delete' && experienceId) {
      // Delete an experience
      console.log(`Deleting experience ${experienceId} from portfolio ${portfolioId}`);
      const result = await Experience.findByIdAndDelete(experienceId);
      
      if (!result) {
        return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, deletedId: experienceId });
    } else {
      // Default action: fetch experiences
      const experiences = await Experience.find({}).sort({ order: 1 });
      console.log(`Found ${experiences.length} experiences for portfolio ${portfolioId}`);
      return NextResponse.json(experiences);
    }
  } catch (error: any) {
    console.error('Error in experiences API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}