import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TestResult } from '@/types/database/test';

export default function Results() {
  const [results, setResults] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const transformResults = (data: TestResult): TestResult => {
    // Find the highest score
    const scores = {
      'Teknik': data.teknik,
      'Seni': data.seni,
      'Sains': data.sains,
      'Sosial': data.sosial
    };
    
    const maxCategory = Object.entries(scores).reduce((a, b) => 
      b[1] > a[1] ? b : a
    );

    // Generate recommendations based on the highest score
    const recommendations = [`Berdasarkan hasil tes, bidang ${maxCategory[0]} adalah kekuatan utama Anda`];
    
    return {
      ...data,
      test_type: maxCategory[0],
      score: maxCategory[1],
      recommendations
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          Loading...
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
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No Results Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">You haven't taken any tests yet.</p>
          <Button onClick={() => navigate('/test')}>Take a Test</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Hasil Tes</h1>
          <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">
            Berdasarkan hasil tes, Anda memiliki kecenderungan yang kuat di bidang
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {results.test_type}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Score:</h3>
                <p className="text-2xl font-bold text-primary">{results.score}%</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recommendations:
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {results.recommendations?.map((rec, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={() => navigate('/test')}>Take Another Test</Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}