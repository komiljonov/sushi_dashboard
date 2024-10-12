import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { IPromocode } from "@/lib/types"

interface PromocodeTableProps {
    promocodes?: IPromocode[];
    onDelete: (promocode: IPromocode) => void;
}

export const PromocodeTable = ({ promocodes, onDelete }: PromocodeTableProps) => {
    if (promocodes === undefined) {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nomi (UZ)</TableHead>
                        <TableHead>Nomi (RU)</TableHead>
                        <TableHead>kod</TableHead>
                        {/* <TableHead>Summa yoki foyiz</TableHead> */}
                        <TableHead>Chegirma</TableHead>
                        <TableHead>Soni</TableHead>
                        <TableHead>Amallar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                            {/* <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell> */}
                            <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                            <TableCell>
                                <Skeleton className="h-10 w-[180px]" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nomi (UZ)</TableHead>
                    <TableHead>Nomi (RU)</TableHead>
                    {/* <TableHead>Summa yoki foyiz</TableHead> */}
                    <TableHead>Chegirma</TableHead>
                    <TableHead>Soni</TableHead>
                    <TableHead>Amallar</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {promocodes.map((promo) => (
                    <TableRow key={promo.id}>
                        <TableCell>{promo.name_uz}</TableCell>
                        <TableCell>{promo.name_ru}</TableCell>
                        <TableCell>{promo.code}</TableCell>
                        {/* <TableCell>{promo.measurement}</TableCell> */}
                        <TableCell>{promo.amount}{promo.measurement == "ABSOLUTE" ? " so'm" : "%"}</TableCell>
                        <TableCell>{promo.count}</TableCell>
                        <TableCell>
                            <Link href={`/promocodes/info?id=${promo.id}`}>
                                <Button variant="outline" className="mr-2">
                                    Kirish
                                </Button>
                            </Link>
                            <Button variant="destructive" onClick={() => onDelete(promo)}>
                                O&apos;chirish
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}