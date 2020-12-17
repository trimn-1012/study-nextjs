import { getAsString } from "../getAsString";
import Pagination, {
  PaginationRenderItemParams,
} from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { useRouter } from "next/router";
import Link from "next/link";
import { ParsedUrlQuery, stringify } from "querystring";
import { forwardRef } from "react";

export function CarPagination({ totalPages }: { totalPages: number }) {
  const { query } = useRouter();
  return (
    <Pagination
      color="primary"
      page={parseInt(getAsString(query.page) || "1")}
      count={totalPages}
      renderItem={(item) => (
        <PaginationItem
          component={MaterialUiLink}
          query={query}
          item={item}
          {...item}
        />
      )}
    />
  );
}

export interface MaterialUiLinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

const MaterialUiLink = forwardRef<HTMLAnchorElement, MaterialUiLinkProps>(
  ({ item, query, ...props }, ref) => (
    <Link
      href={{
        pathname: "/cars",
        query: { ...query, page: item.page },
      }}
      shallow
    >
      <a {...props}></a>
    </Link>
  )
);
