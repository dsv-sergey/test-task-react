import React, { useState } from "react";
import isEmpty from "lodash.isempty";
import { useUuiContext } from "@epam/uui-core";
import { Header, Footer, FlexBox } from "../../layout";
import { PersonList, Text } from "../../components";
import { usePersonsWithPaging } from "../../hooks";
import css from "./MainPage.module.scss";


export const MainPage = () => {
    const { uuiRouter } = useUuiContext();
    const [page, setPage] = useState(uuiRouter.getCurrentLink().query["page"] || 1);
    const [search, setSearch] = useState<string>();
    const {
        data,
        isError,
        error,
        isLoading,
        isFetching,
        totalPages,
    } = usePersonsWithPaging(page, search);

    const updatePage = (page: number) => {
        uuiRouter.redirect({
            pathname: uuiRouter.getCurrentLink().pathname,
            query: {
                page,
            }
        });
        setPage(page);
    };

    const handleSearch = (search: string) => {
        updatePage(1);
        setSearch(search);
    };

    const isNoData = !isLoading && !isFetching && !isError && isEmpty(data?.results);

    return (
        <div className={ css.wrapper }>
            <Header title={ "Star Wars persons info SPA" } />
            <main className={ css.main }>
                { isError && (<Text cx={ css.alignMessage } font="Prompt" fontSize="24">{ error.message }</Text>) }
                { isNoData && (<Text cx={ css.alignMessage } font="Prompt" fontSize="24">Data not found</Text>) }
                {
                    !isError && !isNoData && (
                        <FlexBox enableLoading={(isLoading || isFetching)}>
                            { !isEmpty(data?.results) && (<PersonList persons={data?.results}/>) }
                        </FlexBox>
                    )
                }
            </main>
            <Footer search={ search } setSearch={ handleSearch } page={ page } updatePage={ updatePage } totalPages={ totalPages }  />
        </div>
    );
};
