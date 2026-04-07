import { useState } from 'react';
import { Download } from 'lucide-react';
import { generatePDFReport } from '@/lib/pdfReport';
import { ordersAPI, shipmentsAPI, inventoryAPI } from '@/lib/api';

const ReportDownloadButton = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('cf_user') || '{}');
      
      // Fetch all data
      const [ordersRes, shipmentsRes, inventoryRes] = await Promise.all([
        ordersAPI.getAll(),
        shipmentsAPI.getAll(),
        inventoryAPI.getAll(),
      ]);

      // Fetch activities (if endpoint exists)
      let activities = [];
      try {
        const activitiesRes = await fetch('https://chainflowbackend.onrender.com/api/activities', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('cf_token')}`,
          },
        });
        if (activitiesRes.ok) {
          activities = await activitiesRes.json();
        }
      } catch (error) {
        console.log('Activities not available:', error);
      }

      // Generate PDF
      generatePDFReport({
        user: {
          name: user.name || 'User',
          email: user.email || 'N/A',
          role: user.role || 'user',
          createdAt: user.createdAt,
        },
        orders: ordersRes || [],
        shipments: shipmentsRes || [],
        inventory: inventoryRes || [],
        activities: activities || [],
      });

      // Show success message
      alert('Report downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="h-4 w-4" />
      {loading ? 'Generating...' : 'Download Report'}
    </button>
  );
};

export default ReportDownloadButton;
