'use server'

import { getPublicMultiSearchResponse, getPublicSingleSearchResponse } from "@/lib/apiLibrary";

export async function getSearchResult({ searchParams, page = 1 }: { searchParams: any, page: number }) {
    let sort: any = [];
    if (searchParams.q === "*") sort.push("updatedAt:desc");
    let filters = searchParams?.publish_status ? ["publish_status = true"] : ["publish_status = false"];
    if (searchParams?.filter) filters = [...filters, ...searchParams.filter];
    const result = await getPublicMultiSearchResponse({
        indexUid: searchParams.index,
        q: searchParams.q,
        filter: filters,
        noExpFilter: searchParams?.noExpFilter,
        sort: sort,
        page: page,
        hitsPerPage: searchParams?.hitsPerPage
    });
    return result;
}
export async function getSearchResultSingle({ searchParams, page = 1 }: { searchParams: any, page: number }) {
    let sort: any = [];
    if (searchParams.q === "*") sort.push("updatedAt:desc");
    let filters = searchParams?.publish_status ? ["publish_status = true"] : ["publish_status = false"];
    if (searchParams?.filter) filters = [...filters, ...searchParams.filter];
    const result = await getPublicSingleSearchResponse({
        indexUid: searchParams.index,
        q: searchParams.q,
        filter: filters,
        noExpFilter: searchParams?.noExpFilter,
        sort: sort,
        page: page,
        hitsPerPage: searchParams?.hitsPerPage
    });
    // console.log(result)
    return result;
}
export async function getSearchResultFacets({ searchParams, page = 1 }: { searchParams: any, page: number }) {
    let sort: any = [];
    if (searchParams.q === "*") sort.push("updatedAt:desc");
    let filters = searchParams?.publish_status ? ["publish_status = true"] : ["publish_status = false"];
    if (searchParams?.filter) filters = [...filters, ...searchParams.filter];
    const result = await getPublicSingleSearchResponse({
        indexUid: searchParams.index,
        q: searchParams.q,
        filter: filters,
        searchFacets: searchParams?.facetQuery,
        noExpFilter: searchParams?.noExpFilter,
        sort: sort,
        page: page,
        hitsPerPage: searchParams?.hitsPerPage
    });
    // console.log(result)
    return result;
}