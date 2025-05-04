
import React from "react";
import { WorkExample } from "../data/providers";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WorkExampleCarouselProps {
  workExamples?: WorkExample[];
  className?: string;
}

const WorkExampleCarousel: React.FC<WorkExampleCarouselProps> = ({ 
  workExamples,
  className 
}) => {
  if (!workExamples || workExamples.length === 0) {
    return (
      <div className={cn("text-center py-4 text-gray-500", className)}>
        <p>No work examples available</p>
      </div>
    );
  }

  return (
    <Carousel className={cn("w-full", className)}>
      <CarouselContent>
        {workExamples.map((example) => (
          <CarouselItem key={example.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={example.imageUrl} 
                    alt={example.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm">{example.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{example.description}</p>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center gap-2 mt-2">
        <CarouselPrevious className="static relative transform-none mx-0" />
        <CarouselNext className="static relative transform-none mx-0" />
      </div>
    </Carousel>
  );
};

export default WorkExampleCarousel;
