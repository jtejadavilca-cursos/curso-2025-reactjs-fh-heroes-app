import { useSearchParams } from "react-router";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface Props {
    totalPages: number;
}
export const CustomPagination = ({ totalPages }: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryPage = searchParams.get("page") ?? 1;
    const page = isNaN(+queryPage) ? 1 : +queryPage;

    const handleClickPage = (page: string) => {
        setSearchParams((prev) => {
            prev.set("page", page);
            return prev;
        });
    };

    return (
        <div className="flex items-center justify-center space-x-2">
            <Button variant="outline" onClick={() => handleClickPage(`${page - 1}`)} size="sm" disabled={page <= 1}>
                <ChevronLeft className="h-4 w-4" />
                Anterior
            </Button>

            {Array.from({ length: totalPages }).map((_, index) => {
                return (
                    <Button
                        key={index}
                        onClick={() => handleClickPage(`${index + 1}`)}
                        variant={page === index + 1 ? "default" : "outline"}
                        size="sm"
                    >
                        {index + 1}
                    </Button>
                );
            })}

            {/* <Button variant="ghost" size="sm" disabled>
                <MoreHorizontal className="h-4 w-4" />
            </Button> */}

            <Button
                variant="outline"
                onClick={() => handleClickPage(`${page + 1}`)}
                size="sm"
                disabled={page === totalPages}
            >
                Siguiente
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};
