import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface NoteCardProps {
  title: string;
  summary: string;
  tags: string[];
  date: string;
  onClick?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ title, summary, tags, date, onClick }) => {
  return (
    <Card 
      className="h-full hover:shadow-md transition-all cursor-pointer group hover:border-blue-200"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start w-full">
          <CardTitle className="text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
            {title}
          </CardTitle>
          <div className="flex items-center text-xs text-muted-foreground gap-1 whitespace-nowrap ml-2">
            <Calendar className="w-3 h-3" />
            {new Date(date).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {summary || "Processing summary..."}
        </p>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag, i) => (
            <Badge key={i} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-gray-400 self-center">+{tags.length - 3}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};