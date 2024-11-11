import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UrlMonitorStatus } from "../types/weather";

interface UrlMonitoringCardProps {
  status: UrlMonitorStatus;
}

export function UrlMonitoringCard({ status }: UrlMonitoringCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{status.url}</span>
          <Badge variant={status.status === 'up' ? 'default' : 'destructive'}>
            {status.status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Last checked: {new Date(status.lastChecked).toLocaleTimeString()}
          </p>
          <p className="text-sm text-gray-600">
            Response time: {status.responseTime}ms
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
