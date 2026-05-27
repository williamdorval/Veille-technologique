import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type PluginStatus = 'available' | 'coming-soon';

interface PluginCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  status: PluginStatus;
  href?: string;
}

export function PluginCard({ icon: Icon, title, description, status, href }: PluginCardProps) {
  const card = (
    <Card
      className={cn(
        'transition-all duration-200',
        status === 'available'
          ? 'hover:shadow-lg cursor-pointer'
          : 'opacity-50 cursor-not-allowed',
      )}
    >
      <CardHeader className="pb-3">
        <Icon className="h-8 w-8 text-construction-accent mb-2" />
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{title}</h3>
          {status === 'available' ? (
            <Badge variant="default">Disponible</Badge>
          ) : (
            <Badge variant="secondary" className="shrink-0">Bientôt</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  if (status === 'available' && href) {
    return (
      <Link href={href} className="block pointer-events-auto">
        {card}
      </Link>
    );
  }

  return <div className="pointer-events-none">{card}</div>;
}
