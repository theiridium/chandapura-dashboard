import { getSearchResult, getSearchResultFacets, getSearchResultMultiCustom } from "@/app/actions";
import { getPublicApiResponse } from "./apiLibrary";
import { Products } from "@/public/shared/app.config";
import { AreaListingStats, AreaStat, AreaStatsResult, ListingAreaCounts } from "./typings/dto";

export const capitalizeWords = (str: string) =>
    str
        .replace(/-/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());

export const getProductCountPublished = async (index: string) => {
    const searchParams: any[] = [{
        q: "*",
        index,
        expFilter: false,
        publish_status: true
    }];

    const search = { searchParams, page: 1 };
    const { results } = await getSearchResult(search);
    return results[0].totalHits;
}

export const getProductCountPending = async (index: string) => {
    const searchParams: any[] = [{
        q: "*",
        index,
        expFilter: false,
        publish_status: false
    }];

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

    const searchParams: any[] = [{
        q: "*",
        index,
        expFilter: false,
        publish_status: true,
        filter: [
            `created_at_timestamp >= ${start}`,
            `created_at_timestamp < ${end}`
        ],
        hitsPerPage: 5000
    }];

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

export const getlListingData = async (searchIndex: string) => {
    const filters = [
        [],
        ["step_number = 4", "publish_status = true"],
        ["step_number = 4", "publish_status = false"],
        ["step_number < 4", "publish_status = false"],
        ["step_number < 4 AND publish_status = true"],
    ];
    const searchParams = filters.map(filter => ({
        q: "*",
        index: searchIndex,
        expFilter: false,
        publish_status: false,
        filter,
        hitsPerPage: 100
    }));
    const search = { searchParams, page: 1 };
    const { results } = await getSearchResultMultiCustom(search);
    console.log(results)
    return results;
}

export const getPendingApprovalListingCounts = async () => {
    const listingIndices = [Products.advertisement.searchIndex, Products.business.searchIndex, Products.realEstate.searchIndex, Products.classifieds.searchIndex, Products.job.searchIndex];
    const searchParams = listingIndices.map(index => ({
        q: "*",
        index,
        expFilter: false,
        publish_status: false,
        filter: ["step_number = 4"],
        hitsPerPage: 100
    }));
    const search = { searchParams, page: 1 };
    const { results } = await getSearchResult(search);
    return results;
}

export const getPendingApprovalListingList = async (index: string, isDraft = false) => {
    const searchParams = [{
        q: "*",
        index,
        expFilter: false,
        publish_status: false,
        filter: [`step_number ${isDraft ? '<' : '='} 4`],
        hitsPerPage: 100
    }];
    const search = { searchParams, page: 1 };
    const { results } = await getSearchResult(search);
    return results;
}

export const getAreaBasedListingCounts = async (chartType: "table" | "bar") => {
    const listingIndices = [Products.business.searchIndex, Products.realEstate.searchIndex, Products.classifieds.searchIndex, Products.job.searchIndex];
    const baseSearchParams = {
        q: "",
        facetQuery: ["area.name"],
        expFilter: false,
        publish_status: true,
        hitsPerPage: 1
    };
    const [blAreaCount, plAreaCount, clAreaCount, jlAreacount] = await Promise.all(
        listingIndices.map(async index => {
            const search = {
                searchParams: {
                    ...baseSearchParams,
                    index
                },
                page: 1
            };
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
    // console.log(result)
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

    let id = 0;
    for (const area of areaSet) {
        const blCount = data.blAreaCount[area] ?? 0;
        const plCount = data.plAreaCount[area] ?? 0;
        const clCount = data.clAreaCount[area] ?? 0;
        const jlCount = data.jlAreacount[area] ?? 0;

        result.push({
            id: id++,
            name: area,
            blCount,
            plCount,
            clCount,
            jlCount,
            total: blCount + plCount + clCount + jlCount
        });
    }

    return result;
}

export const converToReadableDate = (isoDate: string) => {
    const date = new Date(isoDate);

    const formattedDate = date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
    return formattedDate;
}