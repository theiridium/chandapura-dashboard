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

export const getUserCountOfCurrentYear = async () => {
    const data = await getPublicApiResponse("users");
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

export const getProductCountOfCurrentYear = async (index: string) => {
    const currentYear = new Date().getFullYear();

    const start = Math.floor(new Date(`${currentYear}-01-01T00:00:00.000Z`).getTime() / 1000);
    const end = Math.floor(new Date(`${currentYear + 1}-01-01T00:00:00.000Z`).getTime() / 1000);

    const searchParams: any = {
        q: "*",
        index,
        noExpFilter: true,
        publish_status: true,
        filter: [
            `created_at_timestamp >= ${start}`,
            `created_at_timestamp < ${end}`
        ],
        hitsPerPage: 5000
    };

    const search = { searchParams, page: 1 };
    const { results } = await getSearchResult(search);
    console.log(results)
    const data = results[0].hits;

    // Create an array of 12 months with count = 0
    const monthlyCounts = Array(12).fill(0);

    data.forEach((d: any) => {
        const date = new Date(d.createdAt);
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