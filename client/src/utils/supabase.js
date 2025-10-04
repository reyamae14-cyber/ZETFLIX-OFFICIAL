import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://doqqrmcxcalzhrudddki.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvcXFybWN4Y2FsemhydWRkZGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NTg5MzgsImV4cCI6MjA3NDQzNDkzOH0.zlg13xGZazHcZ8zZ-65lApf1GuYYpYFsZk7JRIpSjqg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test Supabase connection and bucket access
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // First test basic connection
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Failed to list buckets:', bucketsError);
      return { success: false, error: `Bucket list error: ${bucketsError.message}` };
    }
    
    console.log('Available buckets:', buckets);
    
    // Check if profile-images bucket exists
    const profileImagesBucket = buckets.find(bucket => bucket.name === 'profile-images');
    if (!profileImagesBucket) {
      console.error('profile-images bucket not found');
      return { success: false, error: 'profile-images bucket does not exist' };
    }
    
    console.log('profile-images bucket found:', profileImagesBucket);
    
    // Test bucket access
    const { data, error } = await supabase.storage
      .from('profile-images')
      .list('', { limit: 1 });
    
    if (error) {
      console.error('Supabase bucket access error:', error);
      return { success: false, error: `Bucket access error: ${error.message}` };
    }
    
    console.log('Supabase connection and bucket access successful');
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Test upload function with a simple blob
export const testUpload = async () => {
  try {
    console.log('Testing upload functionality...');
    
    // Create a simple test blob (1x1 pixel PNG)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 1, 1);
    
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve({ success: false, error: 'Failed to create test blob' });
          return;
        }
        
        console.log('Test blob created:', blob.size, 'bytes');
        
        // Try to upload the test blob
        const testFileName = `test_${Date.now()}.png`;
        const testPath = `test/${testFileName}`;
        
        const { data, error } = await supabase.storage
          .from('profile-images')
          .upload(testPath, blob);
        
        if (error) {
          console.error('Test upload failed:', error);
          resolve({ success: false, error: error.message });
          return;
        }
        
        console.log('Test upload successful:', data);
        
        // Clean up test file
        try {
          await supabase.storage
            .from('profile-images')
            .remove([testPath]);
          console.log('Test file cleaned up');
        } catch (cleanupError) {
          console.warn('Failed to clean up test file:', cleanupError);
        }
        
        resolve({ success: true, data });
      }, 'image/png');
    });
  } catch (error) {
    console.error('Test upload error:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to upload image to Supabase Storage
export const uploadImageToSupabase = async (file, fileNameOrUserId) => {
  try {
    console.log('Starting upload to Supabase...', { fileSize: file.size, fileType: file.type });
    
    let fileName, filePath;
    
    // If second parameter looks like a filename (contains extension), use it directly
    if (typeof fileNameOrUserId === 'string' && fileNameOrUserId.includes('.')) {
      fileName = fileNameOrUserId;
      filePath = `profile-images/${fileName}`;
    } else {
      // Otherwise treat it as userId and generate filename
      const userId = fileNameOrUserId;
      const extension = file.name ? file.name.split('.').pop() : 'png';
      fileName = `${Date.now()}_profile.${extension}`;
      filePath = `profile-images/${userId}/${fileName}`;
    }
    
    console.log('Upload parameters:', { fileName, filePath, userId: fileNameOrUserId });
    
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, {
        metadata: {
          userId: typeof fileNameOrUserId === 'string' && !fileNameOrUserId.includes('.') ? fileNameOrUserId : 'unknown'
        }
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    console.log('Public URL generated:', publicData.publicUrl);

    return {
      success: true,
      url: publicData.publicUrl,
      path: filePath
    };
  } catch (error) {
    // Error handled by the caller
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to delete image from Supabase Storage
export const deleteImageFromSupabase = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('profile-images')
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    // Error handled by the caller
    return {
      success: false,
      error: error.message
    };
  }
};