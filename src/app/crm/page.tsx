import Link from 'next/link';
import { CrmApi } from '@/lib/crm/api';

export const metadata = {
  title: 'CRM Dashboard | Color & Craft',
  description: 'Manage your customers, leads, and projects',
};

export const dynamic = 'force-dynamic'; // Ensure this page is always dynamically rendered

export default async function CrmDashboard() {
  // Add try/catch for error handling
  let stats;
  try {
    stats = await CrmApi.getDashboardStats();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Provide fallback data
    stats = {
      counts: {
        customers: 0,
        leads: 0,
        projects: 0,
        activeProjects: 0
      },
      recentActivity: []
    };
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CRM Dashboard</h1>
        <p className="text-gray-600">Manage your customers, leads, and projects</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Customers"
          value={stats.counts.customers ?? 0}
          link="/crm/customers"
          linkText="View All"
          color="bg-blue-500"
        />
        <StatsCard
          title="Active Leads"
          value={stats.counts.leads ?? 0}
          link="/crm/leads"
          linkText="View All"
          color="bg-green-500"
        />
        <StatsCard
          title="Total Projects"
          value={stats.counts.projects ?? 0}
          link="/crm/projects"
          linkText="View All"
          color="bg-purple-500"
        />
        <StatsCard
          title="Active Projects"
          value={stats.counts.activeProjects ?? 0}
          link="/crm/projects?status=active"
          linkText="View Active"
          color="bg-yellow-500"
        />
      </div>
      
      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickLink 
            title="Add Customer" 
            description="Create a new customer record" 
            link="/crm/customers/new" 
            color="bg-blue-100"
          />
          <QuickLink 
            title="Add Lead" 
            description="Create a new sales lead" 
            link="/crm/leads/new" 
            color="bg-green-100"
          />
          <QuickLink 
            title="Create Project" 
            description="Start a new project" 
            link="/crm/projects/new" 
            color="bg-purple-100"
          />
        </div>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {stats.recentActivity.length > 0 ? (
            <div className="divide-y">
              {stats.recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ 
  title, 
  value, 
  link, 
  linkText, 
  color 
}: { 
  title: string; 
  value: number; 
  link: string; 
  linkText: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className={`${color} h-2`}></div>
      <div className="p-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold mt-1">{value}</p>
        <div className="mt-4">
          <Link 
            href={link}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {linkText} →
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ 
  title, 
  description, 
  link, 
  color 
}: { 
  title: string; 
  description: string; 
  link: string; 
  color: string;
}) {
  return (
    <Link 
      href={link}
      className={`${color} rounded-lg p-4 transition-transform hover:scale-105`}
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </Link>
  );
}

function ActivityItem({ activity }: { activity: any }) {
  // Determine the activity target name (customer or lead)
  const targetName = activity.customers?.name || activity.leads?.name || 'Unknown';
  
  // Format the created_at date
  const date = new Date(activity.created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-start">
        <div className="flex-1">
          <p>
            <span className="font-medium">{activity.type}</span> 
            {' '}with{' '}
            <span className="font-medium">{targetName}</span>
          </p>
          {activity.subject && (
            <p className="text-sm text-gray-700 mt-1">{activity.subject}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
} 