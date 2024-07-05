import React from "react";
import { FlexRow, Paginator, SearchInput } from "@epam/uui";
import css from "./Footer.module.scss";

interface IFooterProps {
    search?: string;
    setSearch(v: string): void;
    page: number;
    updatePage(v: number): void;
    totalPages: number;
}

export const Footer = (props: IFooterProps) => {
    return (
        <div className={ css.footer }>
            <FlexRow columnGap="24" cx={ "container" }>
                <SearchInput size="42" value={ props.search } onValueChange={ props.setSearch } />
                { props.totalPages > 0 && <Paginator size='30' totalPages={ props.totalPages } value={ props.page } onValueChange={ props.updatePage } /> }
            </FlexRow>
        </div>
    );
};