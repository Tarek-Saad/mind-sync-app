import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Define the Skill schema
const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'language', 'framework', 'library', 'other'],
      default: 'other'
    },
    iconType: {
      type: String,
      enum: ['react-icon', 'custom-svg', 'none'],
      default: 'none'
    },
    iconName: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Reuse the connections object and connectToDatabase function from projects route
const connections: { [key: string]: mongoose.Connection } = {};

async function connectToDatabase(dbUri: string) {
  try {
    if (connections[dbUri]) {
      return connections[dbUri];
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    const connection = await mongoose.createConnection(dbUri);
    connections[dbUri] = connection;
    console.log(`Connected to MongoDB for skills: ${dbUri}`);
    
    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { dbUri } = await request.json();
    
    if (!dbUri) {
      return NextResponse.json({ error: 'Database URI is required' }, { status: 400 });
    }
    
    // Connect to the specific database
    const connection = await connectToDatabase(dbUri);
    
    // Create a model using this specific connection
    const Skill = connection.model('Skill', skillSchema);
    
    // Fetch skills
    const skills = await Skill.find({});
    
    return NextResponse.json(skills);
  } catch (error: any) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}