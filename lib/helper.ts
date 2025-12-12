import { getSearchResult } from "@/app/actions";
import { getPublicApiResponse } from "./apiLibrary";

export const getProductCountPublished = async (index: string) => {
    const searchParams: any = {
        q: "*",
        index,
        noExpFilter: true,
        publish_status: true
    };

    const search = { searchParams, page: 1 };
    const { results } = await getSearchResult(search);
    return results[0].totalHits;
}

export const getProductCountPending = async (index: string) => {
    const searchParams: any = {
        q: "*",
        index,
        noExpFilter: true,
        publish_status: false
    };

    const search = { searchParams, page: 1 };
    const { results } = await getSearchResult(search);
    return results[0].totalHits;
}

export const getUserDataByCurrentYear = async () => {
    const data = await getPublicApiResponse("users");
    console.log(data)
    const currentYear = new Date().getFullYear();

    // Create an array of 12 months with count = 0
    const monthlyCounts = Array(12).fill(0);

    data.forEach((user: any) => {
        const date = new Date(user.createdAt);
        const year = date.getFullYear();

        // Only count for current year
        if (year === currentYear) {
            const month = date.getMonth(); // 0 = Jan, 11 = Dec
            monthlyCounts[month] += 1;
        }
    });
    return monthlyCounts;
}

export const getUserCount = async () => {
    const data = await getPublicApiResponse("users/count");
    return data;
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