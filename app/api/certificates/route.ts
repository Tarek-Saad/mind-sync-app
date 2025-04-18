import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Define the Certificate schema
const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    imgPath: {
      type: String,
      required: true,
      trim: true
    },
    orgLogos: {
      type: [String],
      required: true
    },
    liveLink: {
      type: String,
      trim: true,
      default: ''
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
      console.log(`Reusing existing connection for ${portfolioId} (certificates)`);
      return connections[connectionKey];
    }
    
    // Create a new connection
    console.log(`Creating new connection for ${portfolioId} (certificates)`);
    const connection = await mongoose.createConnection(dbUri);
    connections[connectionKey] = connection;
    
    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB for certificates', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dbUri, portfolioId, action, certificateData, certificateId } = body;
    
    if (!dbUri) {
      return NextResponse.json({ error: 'Database URI is required' }, { status: 400 });
    }
    
    if (!portfolioId) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 });
    }
    
    // Connect to the specific database
    const connection = await connectToDatabase(dbUri, portfolioId);
    
    // Create a model using this specific connection
    const Certificate = connection.model('Certificate', certificateSchema);
    
    // Handle different actions
    if (action === 'add' && certificateData) {
      // Add a new certificate
      console.log(`Adding new certificate for portfolio ${portfolioId}:`, certificateData);
      const newCertificate = new Certificate(certificateData);
      const savedCertificate = await newCertificate.save();
      return NextResponse.json(savedCertificate);
    } else if (action === 'edit' && certificateId && certificateData) {
      // Edit an existing certificate
      console.log(`Editing certificate ${certificateId} in portfolio ${portfolioId}:`, certificateData);
      const updatedCertificate = await Certificate.findByIdAndUpdate(
        certificateId, 
        certificateData, 
        { new: true, runValidators: true }
      );
      
      if (!updatedCertificate) {
        return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
      }
      
      return NextResponse.json(updatedCertificate);
    } else if (action === 'delete' && certificateId) {
      // Delete a certificate
      console.log(`Deleting certificate ${certificateId} from portfolio ${portfolioId}`);
      const result = await Certificate.findByIdAndDelete(certificateId);
      
      if (!result) {
        return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, deletedId: certificateId });
    } else {
      // Default action: fetch certificates
      const certificates = await Certificate.find({}).sort({ order: 1 });
      console.log(`Found ${certificates.length} certificates for portfolio ${portfolioId}`);
      return NextResponse.json(certificates);
    }
  } catch (error: any) {
    console.error('Error in certificates API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}