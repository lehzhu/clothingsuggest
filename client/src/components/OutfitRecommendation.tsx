import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutfitRecommendation } from "../types/weather";

interface OutfitRecommendationCardProps {
  outfit: OutfitRecommendation;
}

export function OutfitRecommendationCard({ outfit }: OutfitRecommendationCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Outfit Recommendation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Top:</h3>
            <p>{outfit.top}</p>
          </div>
          <div>
            <h3 className="font-semibold">Bottom:</h3>
            <p>{outfit.bottom}</p>
          </div>
          <div>
            <h3 className="font-semibold">Accessories:</h3>
            <ul className="list-disc list-inside">
              {outfit.accessories.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="pt-2">
            <p className="text-gray-600 italic">{outfit.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
