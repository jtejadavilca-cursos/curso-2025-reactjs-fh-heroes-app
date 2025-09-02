import { Badge } from "@/components/ui/badge";

interface Props {
    powers: string[];
    numToShow?: number;
}
export const PowerTags = ({ powers, numToShow = 3 }: Props) => {
    return (
        <div className="space-y-2">
            <h4 className="font-medium text-sm">Powers:</h4>
            <div className="flex flex-wrap gap-1">
                {powers.slice(0, numToShow).map((power) => (
                    <Badge key={power} variant="outline" className="text-xs">
                        {power}
                    </Badge>
                ))}
                {powers.length > numToShow && (
                    <Badge variant="outline" className="text-xs bg-gray-100">
                        +{powers.slice(numToShow).length} more
                    </Badge>
                )}
            </div>
        </div>
    );
};
