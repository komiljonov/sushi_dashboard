import { fetchFilials, fetchNumbers, fetchProducts, fetchPromocodes, fetchUsers } from "@/lib/fetchers";
import { IFilial, IPhoneNumber, IProduct, IPromocode, IUser } from "@/lib/types"
import { useQuery } from "@tanstack/react-query";




interface IFetchData {
    filials?: IFilial[];
    promocodes?: IPromocode[];
    phone_numbers?: IPhoneNumber[];
    users?: IUser[];
    products?: IProduct[]
}




export function useFetchData(): IFetchData {
    const { data: filials } = useQuery({
        queryKey: ["filials"],
        queryFn: fetchFilials,
    });

    const { data: promocodes } = useQuery({
        queryKey: ["promocodes"],
        queryFn: fetchPromocodes
    });


    const { data: phone_numbers } = useQuery({
        queryKey: ["phone_numbers"],
        queryFn: fetchNumbers
    });


    const { data: users } = useQuery(
        {
            queryKey: ['users'],
            queryFn: fetchUsers,
        }
    );

    const { data: products } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts
    });


    return {
        filials: filials,
        promocodes: promocodes,
        phone_numbers: phone_numbers,
        users: users,
        products: products
    }
}