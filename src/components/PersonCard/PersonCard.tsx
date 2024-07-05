import React from "react";
import { Button, FlexRow, Panel } from "@epam/uui";
import { useUuiContext } from "@epam/uui-core";
import { Text } from "../shared";
import { IPerson } from "../../types";
import { ShortInfo } from "./ShortInfo";
import css from "./PersonCard.module.scss";

export const PersonCard = (props: IPerson) => {
    const { uuiRouter } = useUuiContext();


    const handleRedirectToDetailedInfo = (person: IPerson) => {
        uuiRouter.redirect({
            pathname: `/person/${person.url.split("/").filter(v => v !== "").pop()}`
        });
    };

    return (
        <Panel cx={ css.card } shadow background="surface-main">
            <FlexRow padding="24" vPadding="36">
                <Text font="Prompt" fontSize="24">{ props.name }</Text>
            </FlexRow>
            <ShortInfo { ...props } />
            <FlexRow justifyContent="center" padding="24" vPadding="36">
                <Button caption={ "Detailed view" } onClick={ () => handleRedirectToDetailedInfo(props) } />
            </FlexRow>
        </Panel>
    );
};
