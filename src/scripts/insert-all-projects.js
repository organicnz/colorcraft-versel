// Script to insert multiple projects
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('API Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample projects data
const projects = [
  {
    title: "Vintage Dresser",
    brief_description: "A 1940s mahogany dresser transformed with custom hand-painted finish and new hardware.",
    description: "This beautiful mahogany dresser from the 1940s has been completely restored and transformed. The piece was carefully sanded, primed, and painted with a premium chalk paint in a rich, custom-mixed shade. The original brass hardware was cleaned and polished to bring back its original luster, complementing the new finish perfectly.",
    before_images: ["https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/dresser-before.png"],
    after_images: ["https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/dresser.png"],
    techniques: ["Chalk Paint", "Distressing", "Hardware Restoration"],
    materials: ["Chalk Paint", "Beeswax Finish", "Original Brass Hardware"],
    completion_date: "2025-01-15",
    client_name: "Sarah Johnson",
    client_testimonial: "I'm absolutely thrilled with how my grandmother's dresser turned out! It now fits perfectly with my decor while maintaining its vintage charm.",
    is_featured: true
  },
  {
    title: "Farmhouse Dining Table",
    brief_description: "Reclaimed oak farmhouse table with traditional finish and custom detailing.",
    description: "This stunning farmhouse dining table was crafted from reclaimed oak with meticulous attention to detail. The wood was carefully cleaned, sanded, and finished with multiple coats of a traditional oil-based stain to enhance the natural grain and character. The large table features a hand-distressed top and a protective matte polyurethane finish for durability, making it perfect for family gatherings and everyday use.",
    before_images: ["https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/table-before.png"],
    after_images: ["https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/farmhouse-dining-table.png"],
    techniques: ["Hand Distressing", "Traditional Staining", "Custom Joinery"],
    materials: ["Reclaimed Oak", "Oil-based Stain", "Matte Polyurethane"],
    completion_date: "2024-11-20",
    client_name: "Mark & Emily Davis",
    client_testimonial: "Our new dining table is the centerpiece of our home. The quality of craftsmanship is exceptional, and the finish is absolutely beautiful!",
    is_featured: true
  },
  {
    title: "Modern Bookcase",
    brief_description: "Contemporary walnut and steel bookcase with clean lines and minimalist design.",
    description: "This modern bookcase combines the warmth of solid walnut with the industrial appeal of blackened steel. Each shelf was carefully selected for its grain pattern and finished with a natural oil that enhances the wood's rich color while providing protection. The custom steel frame was fabricated by hand, welded, and finished with a durable powder coat for a sleek, contemporary look that will last for generations.",
    before_images: ["https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/bookcase-before.png"],
    after_images: ["https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/bookcase.png"],
    techniques: ["Natural Oil Finishing", "Metal Fabrication", "Precision Joinery"],
    materials: ["Solid Walnut", "Blackened Steel", "Natural Oil Finish"],
    completion_date: "2024-12-05",
    is_featured: true
  },
  {
    title: "Antique Cabinet",
    brief_description: "Victorian-era cherry wood cabinet restoration with period-appropriate techniques.",
    description: "This rare Victorian cabinet required extensive restoration to bring it back to its original glory. The damaged veneer was carefully repaired, missing pieces were recreated using matching cherry wood, and the entire piece was refinished using traditional shellac techniques appropriate to its era. Special attention was paid to preserving the original patina while ensuring the cabinet would be functional and beautiful for another century.",
    before_images: ["https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/cabinet-before.png"],
    after_images: ["https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/cabinet.png"],
    techniques: ["Veneer Repair", "French Polishing", "Traditional Shellac"],
    materials: ["Cherry Wood", "Shellac", "Hide Glue"],
    completion_date: "2025-02-10",
    client_name: "Robert Anderson",
    client_testimonial: "The restoration work is simply incredible. This cabinet has been in our family for generations, and now it can continue to be passed down with pride.",
    is_featured: false
  },
  {
    title: "Coastal Coffee Table",
    brief_description: "Beach-inspired coffee table with weathered driftwood finish and glass top.",
    description: "This unique coffee table draws inspiration from the coastal landscape. Starting with solid pine, we created a weathered driftwood finish through multiple layers of paint and careful hand distressing. The irregular edges evoke natural driftwood, while the tempered glass top adds functionality and a contemporary touch. The piece is finished with a water-resistant sealer to ensure durability.",
    before_images: ["https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/coffee-table-before.png"],
    after_images: ["https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/coffee-table.png"],
    techniques: ["Layered Painting", "Weathering", "Custom Glass Installation"],
    materials: ["Solid Pine", "Chalk Paint", "Tempered Glass"],
    completion_date: "2024-09-25",
    is_featured: false
  },
  {
    title: "Art Deco Sideboard",
    brief_description: "1930s Art Deco sideboard restoration with custom veneer work and original hardware.",
    description: "This Art Deco sideboard from the 1930s underwent a complete restoration. The damaged veneer was meticulously repaired and replaced where necessary, matching the original exotic wood patterns. The characteristic curved doors were carefully restored, and the original hardware was cleaned and reinstalled. A period-appropriate shellac finish was applied to protect the wood while highlighting its natural beauty.",
    before_images: ["https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/sideboard-before.png"],
    after_images: ["https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/sideboard.png"],
    techniques: ["Veneer Matching", "Shellac Finishing", "Hardware Restoration"],
    materials: ["Exotic Wood Veneer", "Shellac", "Brass Polish"],
    completion_date: "2025-03-15",
    client_name: "Jennifer Williams",
    client_testimonial: "My grandmother's sideboard has been completely transformed! The attention to historical accuracy while making it suitable for modern use is impressive.",
    is_featured: true
  }
];

async function insertProjects() {
  console.log(`Preparing to insert ${projects.length} projects...`);
  
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    console.log(`Inserting project ${i + 1}/${projects.length}: ${project.title}`);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select();

      if (error) {
        console.error(`Error inserting project "${project.title}":`, error);
      } else {
        console.log(`Successfully inserted project "${project.title}" with ID:`, data[0].id);
      }
    } catch (err) {
      console.error(`Unexpected error with project "${project.title}":`, err);
    }
  }
  
  console.log('Finished inserting projects.');
}

insertProjects(); 