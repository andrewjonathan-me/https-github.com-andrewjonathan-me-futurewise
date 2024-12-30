import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TestResult } from '@/types/database/test';
import { useLanguage } from "@/contexts/LanguageContext";
import { ResultsHeader } from '@/components/results/ResultsHeader';
import { ResultsCard } from '@/components/results/ResultsCard';
import { ResultsActions } from '@/components/results/ResultsActions';
import { universityRecommendations } from '@/data/universityRecommendations';

export default function Results() {
  const [results, setResults] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const transformResults = (data: TestResult): TestResult => {
    const scores = {
      'Teknik': data.teknik,
      'Seni': data.seni,
      'Sains': data.sains,
      'Sosial': data.sosial
    };
    
    const maxCategory = Object.entries(scores).reduce((a, b) => 
      b[1] > a[1] ? b : a
    );
    
    return {
      ...data,
      test_type: maxCategory[0],
      score: maxCategory[1]
    };
  };

  const fetchResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth/login');
        return;
      }

      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching results:', error);
        toast({
          title: "Error",
          description: "Failed to fetch test results",
          variant: "destructive",
        });
        return;
      }

      const transformedData = transformResults(data);
      console.log('Transformed test results:', transformedData);
      setResults(transformedData);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleRetakeTest = () => {
    navigate('/test');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          {t('results.loading')}
        </main>
        <Footer />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <ResultsHeader 
            title={t('results.notFound.title')} 
            subtitle={t('results.notFound.message')} 
          />
          <ResultsActions onRetakeTest={handleRetakeTest} />
        </main>
        <Footer />
      </div>
    );
  }

  const recommendedUniversities = results.test_type ? universityRecommendations[results.test_type as keyof typeof universityRecommendations] : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResultsHeader 
            title={t('results.title')} 
            subtitle={t('results.subtitle')} 
          />
          <ResultsCard 
            testType={results.test_type || ''} 
            score={results.score || 0}
            recommendations={recommendedUniversities}
          />
          <ResultsActions onRetakeTest={handleRetakeTest} />
        </div>
      </main>
      <Footer />
    </div>
  );
}