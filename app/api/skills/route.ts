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

// Track connections by URI and portfolioId
const connections: { [key: string]: mongoose.Connection } = {};

// Connect to MongoDB with a specific URI
async function connectToDatabase(dbUri: string, portfolioId: string) {
  try {
    // Create a unique connection key using both URI and portfolioId
    const connectionKey = `${portfolioId}:${dbUri}`;
    
    // If we already have a connection for this key, return it
    if (connections[connectionKey]) {
      console.log(`Reusing existing connection for ${portfolioId} (skills)`);
      return connections[connectionKey];
    }
    
    // Create a new connection
    console.log(`Creating new connection for ${portfolioId} (skills)`);
    const connection = await mongoose.createConnection(dbUri);
    connections[connectionKey] = connection;
    
    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB for skills', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dbUri, portfolioId, action, skillData, skillId } = body;
    
    if (!dbUri) {
      return NextResponse.json({ error: 'Database URI is required' }, { status: 400 });
    }
    
    if (!portfolioId) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 });
    }
    
    // Connect to the specific database
    const connection = await connectToDatabase(dbUri, portfolioId);
    
    // Create a model using this specific connection
    const Skill = connection.model('Skill', skillSchema);
    
    // Handle different actions
    if (action === 'add' && skillData) {
      // Add a new skill
      console.log(`Adding new skill for portfolio ${portfolioId}:`, skillData);
      const newSkill = new Skill(skillData);
      const savedSkill = await newSkill.save();
      return NextResponse.json(savedSkill);
    } else if (action === 'edit' && skillId && skillData) {
      // Edit an existing skill
      console.log(`Editing skill ${skillId} in portfolio ${portfolioId}:`, skillData);
      const updatedSkill = await Skill.findByIdAndUpdate(
        skillId, 
        skillData, 
        { new: true, runValidators: true }
      );
      
      if (!updatedSkill) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }
      
      return NextResponse.json(updatedSkill);
    } else if (action === 'delete' && skillId) {
      // Delete a skill
      console.log(`Deleting skill ${skillId} from portfolio ${portfolioId}`);
      const result = await Skill.findByIdAndDelete(skillId);
      
      if (!result) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, deletedId: skillId });
    } else {
      // Default action: fetch skills
      const skills = await Skill.find({});
      console.log(`Found ${skills.length} skills for portfolio ${portfolioId}`);
      return NextResponse.json(skills);
    }
  } catch (error: any) {
    console.error('Error in skills API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}