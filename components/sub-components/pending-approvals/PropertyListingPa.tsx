"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useEffect, useState } from "react";
import { converToReadableDate, getPendingApprovalListingList } from "@/lib/helper";
import { Products } from "@/public/shared/app.config";

export default function PropertyListingPa() {
  const [pendingApprovalData, setPendingApprovalData] = useState<any[]>();
  useEffect(() => {
    async function loadData() {
      const data: any = await getPendingApprovalListingList(Products.realEstate.searchIndex);
      const listingData: any = data[0].hits.map((x: any) => ({
        ...x,
        link: process.env.NEXT_PUBLIC_STRAPI_COLLECTION_URL + "api::property-listing.property-listing/" + x.id
      }));
      setPendingApprovalData(listingData);
    }

    loadData();
  }, []);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      <div className="max-w-full overflow-x-auto">
        {!pendingApprovalData ? (
          <div className="flex justify-center my-8">
            <div className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700">
              Loading...
            </div>
          </div>
        ) : pendingApprovalData.length === 0 ? (
          <div className="flex justify-center my-8">
            <div className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700">
              No Pending Items
            </div>
          </div>
        ) : (
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Area
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Last Updated
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Admin Link
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {pendingApprovalData?.map((data) => (
                <TableRow key={data.id} className="">
                  <TableCell className="w-xs pr-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {data.name}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {data.contact.contact_name}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {data.contact.contact_email_id}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {data.area.name}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {converToReadableDate(data.updatedAt)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <a className="text-sm font-normal transition-colors text-blue-light-500 underline" target="_blank" href={data.link}>Review</a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
