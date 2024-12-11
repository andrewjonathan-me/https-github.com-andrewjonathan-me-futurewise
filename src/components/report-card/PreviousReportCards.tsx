import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ReportCard {
  id: string;
  mathematics: number;
  physics: number;
  chemistry: number;
  biology: number;
  indonesian: number;
  english: number;
  history: number;
  economics: number;
  recommended_major: string;
  created_at: string;
}

interface PreviousReportCardsProps {
  onBack: () => void;
}

export function PreviousReportCards({ onBack }: PreviousReportCardsProps) {
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportCards = async () => {
      try {
        const { data, error } = await supabase
          .from("report_cards")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setReportCards(data || []);
      } catch (err) {
        console.error("Error fetching report cards:", err);
        setError("Failed to load report cards. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportCards();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={onBack}>Back to Menu</Button>
      </div>
    );
  }

  if (reportCards.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">No previous report card data found.</p>
        <Button onClick={onBack}>Back to Menu</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Previous Report Cards</h2>
        <Button onClick={onBack}>Back to Menu</Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Mathematics</TableHead>
              <TableHead>Physics</TableHead>
              <TableHead>Chemistry</TableHead>
              <TableHead>Biology</TableHead>
              <TableHead>Indonesian</TableHead>
              <TableHead>English</TableHead>
              <TableHead>History</TableHead>
              <TableHead>Economics</TableHead>
              <TableHead>Recommended Major</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportCards.map((card) => (
              <TableRow key={card.id}>
                <TableCell>
                  {format(new Date(card.created_at), "dd MMM yyyy")}
                </TableCell>
                <TableCell>{card.mathematics}</TableCell>
                <TableCell>{card.physics}</TableCell>
                <TableCell>{card.chemistry}</TableCell>
                <TableCell>{card.biology}</TableCell>
                <TableCell>{card.indonesian}</TableCell>
                <TableCell>{card.english}</TableCell>
                <TableCell>{card.history}</TableCell>
                <TableCell>{card.economics}</TableCell>
                <TableCell>{card.recommended_major}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}