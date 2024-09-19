import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IPromocode } from "@/lib/types"

interface PromocodeTableProps {
    promocodes: IPromocode[];
    onDelete: (promocode: IPromocode) => void;
}

export const PromocodeTable = ({ promocodes, onDelete }: PromocodeTableProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nomi</TableHead>
                    <TableHead>kod</TableHead>
                    <TableHead>Summa yoki foyiz</TableHead>
                    <TableHead>Chegirma</TableHead>
                    <TableHead>Soni</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {promocodes.map((promo) => (
                    <TableRow key={promo.id}>
                        <TableCell>{promo.name}</TableCell>
                        <TableCell>{promo.code}</TableCell>
                        <TableCell>{promo.measurement}</TableCell>
                        <TableCell>{promo.amount}</TableCell>
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