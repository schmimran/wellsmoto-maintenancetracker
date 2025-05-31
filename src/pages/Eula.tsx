
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Eula = () => {
  return (
    <div className="min-h-screen bg-wells-slateBlue p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Link to="/signup" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">End User License Agreement</h1>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, or using the Wells Moto Maintenance Tracker application ("App"), 
              you agree to be bound by this End User License Agreement ("Agreement"). If you do not agree 
              to these terms, do not use the App.
            </p>
            
            <h2>2. Description of App</h2>
            <p>
              Wells Moto Maintenance Tracker is a mobile and web application designed to help motorcycle 
              owners track maintenance schedules, record service history, manage motorcycle information, 
              and receive maintenance reminders.
            </p>
            
            <h2>3. User Responsibilities</h2>
            <ul>
              <li>You must be at least 13 years of age to use this App</li>
              <li>You are responsible for maintaining the accuracy of your motorcycle and maintenance data</li>
              <li>You must not use the App for any illegal or unauthorized purposes</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            </ul>
            
            <h2>4. Data and Privacy</h2>
            <p>
              We collect and store information you provide about your motorcycles, maintenance records, 
              and account details. This data is used solely to provide the App's functionality. We do not 
              sell your personal information to third parties. For detailed information about our data 
              practices, please refer to our Privacy Policy.
            </p>
            
            <h2>5. Disclaimer of Warranties</h2>
            <p>
              The App is provided "as is" without warranties of any kind. Wells Moto does not guarantee 
              that the App will be error-free, secure, or continuously available. Maintenance recommendations 
              and schedules are general guidelines and should not replace professional mechanical advice.
            </p>
            
            <h2>6. Limitation of Liability</h2>
            <p>
              Wells Moto shall not be liable for any damages arising from your use of the App, including 
              but not limited to motorcycle damage, missed maintenance, or data loss. Users are responsible 
              for following manufacturer recommendations and seeking professional mechanical services when needed.
            </p>
            
            <h2>7. Account Termination</h2>
            <p>
              We reserve the right to terminate or suspend accounts that violate these terms. You may 
              delete your account at any time through the App settings.
            </p>
            
            <h2>8. Updates to Agreement</h2>
            <p>
              We may update this Agreement from time to time. Continued use of the App after changes 
              constitutes acceptance of the updated terms.
            </p>
            
            <h2>9. Contact Information</h2>
            <p>
              For questions about this Agreement, please contact us at:
              <br />
              Email: support@wellsmoto.com
              <br />
              Website: www.wellsmoto.com
            </p>
            
            <h2>10. Governing Law</h2>
            <p>
              This Agreement is governed by the laws of the jurisdiction where Wells Moto is incorporated, 
              without regard to conflict of law principles.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <Link to="/signup">
              <Button className="bg-wells-red hover:bg-wells-red/90 text-white">
                Back to Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eula;
