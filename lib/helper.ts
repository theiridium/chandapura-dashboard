import { getSearchResult } from "@/app/actions";

export const getProductCount = async (index: string) => {
    const searchParams: any = {
        q: "*",
        index,
        noExpFilter: true,
    };

    const search = { searchParams, page: 1 };
    const { results } = await getSearchResult(search);
    return results[0].totalHits;
}
export const getProductCount1 = async (props: any) => {
    let searchFilter = props.category && `category.slug = ${props.category}`
    let res = null;
    if (props.searchParams && props.searchParams.q) {
        props.searchParams.filter = searchFilter;
        props.searchParams.noExpFilter = true;
        let search = { searchParams: props.searchParams, page: 1 };
        res = await getSearchResult(search);
        return res;
    }
}