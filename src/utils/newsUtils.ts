export const assignCategory = (title: string, content?: string) => {
  const searchText = (title + ' ' + (content || '')).toLowerCase();
  console.log('Categorizing article:', { title, content: content?.substring(0, 100) });
  
  // Define keywords for each category with specific keywords
  const categoryKeywords = {
    Beasiswa: [
      'beasiswa', 'scholarship', 'grant', 'funding', 
      'financial aid', 'award', 'bantuan pendidikan', 
      'dana pendidikan', 'biaya kuliah'
    ],
    Penelitian: [
      'ilmuwan', 'penelitian', 'research', 'study', 'innovation', 
      'discovery', 'journal', 'academic', 'research project',
      'riset', 'studi', 'jurnal', 'inovasi', 'temuan', 'science',
      'scientist', 'laboratory', 'lab', 'experiment'
    ],
    Jurusan: [
      'jurusan', 'major', 'field of study', 'department', 
      'curriculum', 'academic program', 'prodi', 'program studi', 
      'fakultas', 'bidang studi', 'mata kuliah'
    ],
    Kampus: [
      'kampus', 'university', 'college', 'campus', 
      'institution', 'student life', 'academic institution',
      'universitas', 'institut', 'sekolah tinggi', 
      'mahasiswa', 'akademik'
    ],
    Karir: [
      'karier', 'karir', 'job', 'career', 'internship', 'employment', 
      'profession', 'recruitment', 'work opportunity', 'technology',
      'kerja', 'profesi', 'pekerjaan', 'lowongan', 'tech', 'startup',
      'magang', 'rekrutmen', 'digital', 'software', 'computing'
    ]
  };

  // Check for specific keywords first
  if (searchText.includes('fuji')) {
    console.log('Article categorized as General due to keyword "fuji"');
    return "General";
  }

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      console.log(`Article categorized as ${category} due to matching keywords`);
      return category;
    }
  }

  // If no specific category matches, return "General"
  console.log('No specific category matches found, categorizing as General');
  return "General";
};

export const filterNewsByCategory = (news: any[], selectedCategory: string) => {
  console.log('Filtering news by category:', selectedCategory);
  console.log('Available news articles:', news?.length);
  
  if (selectedCategory === "all") {
    return news;
  }
  
  const filteredNews = news.filter(article => article.category === selectedCategory);
  console.log(`Found ${filteredNews.length} articles for category ${selectedCategory}`);
  
  return filteredNews;
};

// Add new function to filter out specific articles
export const filterOutSpecificArticles = (articles: any[]) => {
  const excludedTitles = [
    "Adu Silsilah Thariq Halilintar dan Aisar Khaled Pria yang Dekat dengan Fuji, Lebih Mentereng Mana?"
  ];
  
  return articles.filter(article => 
    !excludedTitles.some(title => 
      article.title.toLowerCase().includes(title.toLowerCase())
    )
  );
};
