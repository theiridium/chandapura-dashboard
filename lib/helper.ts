import { getSearchResult, getSearchResultFacets } from "@/app/actions";
import { getPublicApiResponse } from "./apiLibrary";
import { Products } from "@/public/shared/app.config";
import { AreaListingStats, AreaStat, AreaStatsResult, ListingAreaCounts } from "./typings/dto";

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

export const getAreaBasedListingCounts = async (chartType: "table" | "bar") => {
    const listingIndices = [Products.business.searchIndex, Products.realEstate.searchIndex, Products.classifieds.searchIndex, Products.job.searchIndex];
    const searchParams: any = {
        q: "",
        facetQuery: ["area.name"],
        noExpFilter: true,
        publish_status: true,
        hitsPerPage: 1
    };
    const search = { searchParams, page: 1 };
    const [blAreaCount, plAreaCount, clAreaCount, jlAreacount] = await Promise.all(
        listingIndices.map(async index => {
            search.searchParams.index = index;
            const res = await getSearchResultFacets(search);
            return res.facetDistribution["area.name"];
        })
    );

    const result = {
        blAreaCount,
        plAreaCount,
        clAreaCount,
        jlAreacount
    }
    console.log(result)
    let areaData = null;
    chartType === "bar" ? areaData = calculateOverallAreaStats(result) : areaData = buildAreaListingStats(result);
    return areaData;
}

function calculateOverallAreaStats(
    data: ListingAreaCounts
): AreaStatsResult {
    const merged: Record<string, number> = {};

    // merge counts
    for (const map of Object.values(data)) {
        for (const area of Object.keys(map)) {
            merged[area] = (merged[area] ?? 0) + map[area];
        }
    }

    const total = Object.values(merged)
        .reduce((sum, count) => sum + count, 0);

    const areas: AreaStat[] = Object.keys(merged).map(area => {
        const count = merged[area];
        return {
            name: area,
            count,
            percentage:
                total === 0 ? 0 : Number(((count / total) * 100).toFixed(2))
        };
    });

    return {
        total,
        areas,
        listingAreaCounts: data
    };
}

function buildAreaListingStats(
    data: ListingAreaCounts
): AreaListingStats[] {
    const areaSet = new Set<string>();

    // Collect all unique area names
    for (const map of Object.values(data)) {
        for (const area of Object.keys(map)) {
            areaSet.add(area);
        }
    }

    // Build final list
    const result: AreaListingStats[] = [];

    console.log(data)
    for (const area of areaSet) {
        result.push({
            name: area,
            blCount: data.blAreaCount[area] ?? 0,
            plCount: data.plAreaCount[area] ?? 0,
            clCount: data.clAreaCount[area] ?? 0,
            jlCount: data.jlAreacount[area] ?? 0
        });
    }

    return result;
}
