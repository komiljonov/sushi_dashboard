import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ISigment } from "@/lib/types/sigments.types"

interface PromocodeTableProps {
    sigments?: ISigment[];
    onDelete: (promocode: ISigment) => void;
}

const SigmentsTable = ({ sigments, onDelete }: PromocodeTableProps) => {
    // const sortedsigments = sigments?.sort((a, b)=> b?.count - a?.count )
    if (sigments === undefined) {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nomi</TableHead>
                        <TableHead>Oxirgi nechi kun</TableHead>
                        <TableHead>Foydalanuvchilar diapazoni</TableHead>
                        <TableHead>Soni</TableHead>
                        <TableHead>Amallar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
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
                   <TableHead>Nomi</TableHead>
                        <TableHead>Oxirgi nechi kun</TableHead>
                        <TableHead>Foydalanuvchilar diapazoni</TableHead>
                        <TableHead>Soni</TableHead>
                        <TableHead>Amallar</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sigments?.map((promo) => (
                    <TableRow key={promo.id}>
                        <TableCell>{promo.name}</TableCell>
                        <TableCell>{promo.day}</TableCell>
                        <TableCell>{promo.from_to}</TableCell>
                        <TableCell>{promo?.users}</TableCell>
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

export default SigmentsTable