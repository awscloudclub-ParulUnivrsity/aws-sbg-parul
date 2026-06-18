-- ============================================================
-- SAMPLE DATA FOR TESTING DYNAMIC FEATURES
-- Optional: Use this to populate your database for testing
-- ============================================================

-- Sample Events
INSERT INTO public.events (title, type, date, time, location, description, status)
VALUES 
  ('AWS Cloud Essentials Workshop', 'Workshop', '2025-06-15', '10:00 AM', 'Parul University, Vadodara', 
   'Introduction to AWS core services. Hands-on labs with EC2, S3, and IAM. Perfect for beginners starting their cloud journey.', 'upcoming'),
  
  ('Serverless Architecture Bootcamp', 'Bootcamp', '2025-07-20', '9:00 AM', 'Parul University, Vadodara',
   'Deep dive into AWS Lambda, API Gateway, and DynamoDB. Build production-ready serverless applications.', 'upcoming'),
  
  ('AWS Community Day 2025', 'Community Event', '2025-04-10', '11:00 AM', 'Parul University, Vadodara',
   'Annual gathering of AWS enthusiasts. Technical talks, networking, and project showcases from student builders.', 'past'),
  
  ('Getting Started with AWS', 'Tech Talk', '2025-03-05', '2:00 PM', 'Parul University, Vadodara',
   'Overview of cloud computing and AWS services. Career opportunities in cloud. Q&A with AWS certified professionals.', 'past');

-- Note: To add team members, use the dashboard interface at /dashboard/team
-- This ensures proper profile linking and approval workflow

-- To verify your events were inserted:
SELECT id, title, type, status, date FROM public.events ORDER BY date DESC;
