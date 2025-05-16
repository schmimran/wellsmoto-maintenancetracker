
import { useNavigate } from 'react-router-dom';
import { Motorcycle } from '@/types/motorcycle';
import { formatDistance } from '@/utils/distanceUtils';
import { Bike } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  distanceUnit: 'miles' | 'kilometers';
}

const MotorcycleCard = ({ motorcycle, distanceUnit }: MotorcycleCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-muted">
        {motorcycle.image_url ? (
          <img 
            src={motorcycle.thumbnail_url || motorcycle.image_url} 
            alt={motorcycle.nickname}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Bike className="h-20 w-20 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div>
          <h3 className="text-lg font-semibold">{motorcycle.nickname}</h3>
          <p className="text-sm text-muted-foreground">{motorcycle.year} {motorcycle.make} {motorcycle.model}</p>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm">
          <span className="font-medium">Odometer:</span> {formatDistance(motorcycle.odometer_miles, distanceUnit)}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="outline"
          className="w-full"
          onClick={() => navigate(`/garage/motorcycle/${motorcycle.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MotorcycleCard;
